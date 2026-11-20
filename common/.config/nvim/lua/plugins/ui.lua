return {
  {
    "nvim-lualine/lualine.nvim",
    opts = function(_, opts)
      opts.options.component_separators = { left = "", right = "" }
      opts.options.section_separators = { left = "", right = "" }

      opts.sections.lualine_a = {
        {
          "mode",
          fmt = function(str)
            return str:sub(1, 1)
          end,
        },
      }

      opts.sections.lualine_b = {
        { "branch", icon = "" },
      }

      -- Only diagnostics: the path and symbols live in the winbar (dropbar.nvim below).
      local icons = LazyVim.config.icons.diagnostics
      opts.sections.lualine_c = {
        {
          "diagnostics",
          symbols = { error = icons.Error, warn = icons.Warn, info = icons.Info, hint = icons.Hint },
        },
      }

      opts.sections.lualine_y = { "progress" }
      opts.sections.lualine_z = { "location" }
    end,
  },

  -- Zed-style breadcrumbs in the winbar: `app/models/user.rb › User › update_password`.
  {
    "Bekaboo/dropbar.nvim",
    event = "LazyFile",
    opts = function()
      -- Zed shows no icons: blank every kind icon, but keep the `›` separator.
      local blank = vim.tbl_map(function()
        return ""
      end, require("dropbar.configs").opts.icons.kinds.symbols)
      local sources = require("dropbar.sources")
      local utils = require("dropbar.utils")
      -- Show the path as one `app/models/user.rb` segment like Zed, not `app › models › user.rb`.
      -- The joined segment keeps the file segment's click menu.
      local joined_path = {
        get_symbols = function(buf, win, cursor)
          local syms = sources.path.get_symbols(buf, win, cursor)
          if #syms == 0 then
            return syms
          end
          local parts = vim.tbl_map(function(sym)
            return sym.name
          end, syms)
          return { syms[#syms]:merge({ name = table.concat(parts, "/"), name_hl = "WinBar" }) }
        end,
      }
      -- Zed-style symbols from queries/<lang>/outline.scm (copied from Zed). Each item shows
      -- its @context and @name words, each word in its own syntax color, like Zed:
      -- `validates` blue, `:password` red.
      local bar = require("dropbar.bar")
      local function syntax_hl(buf, node)
        local row, col = node:start()
        local caps = vim.treesitter.get_captures_at_pos(buf, row, col)
        for i = #caps, 1, -1 do
          for _, group in ipairs({ "@" .. caps[i].capture .. "." .. caps[i].lang, "@" .. caps[i].capture }) do
            local hl = vim.api.nvim_get_hl(0, { name = group, link = false })
            if hl.fg then
              -- Copy of the syntax group with WinBar's bottom line (see underline_bar below).
              local name = "WinBarSyntax" .. group:gsub("%W", "_")
              if vim.tbl_isempty(vim.api.nvim_get_hl(0, { name = name })) then
                local winbar = vim.api.nvim_get_hl(0, { name = "WinBar", link = false })
                vim.api.nvim_set_hl(0, name, { fg = hl.fg, underline = winbar.underline, sp = winbar.sp })
              end
              return name
            end
          end
        end
        return "WinBar"
      end
      local function byte_range(node)
        return select(3, node:start()), select(3, node:end_())
      end
      local outline = {
        -- ponytail: runs the query over the whole buffer on each update. Limit the range if
        -- huge files feel slow.
        get_symbols = function(buf, win, cursor)
          local ok, parser = pcall(vim.treesitter.get_parser, buf)
          if not ok or not parser then
            return {}
          end
          local query = vim.treesitter.query.get(parser:lang(), "outline")
          if not query then
            return {}
          end
          local tree = (parser:parse() or {})[1]
          if not tree then
            return {}
          end
          -- Collect one entry per @item node, with its @name and @context nodes.
          local items, seen = {}, {}
          for _, match in query:iter_matches(tree:root(), buf, 0, -1) do
            local item, parts = nil, {}
            for id, nodes in pairs(match) do
              local cap = query.captures[id]
              for _, node in ipairs(nodes) do
                if cap == "item" and (not item or node:byte_length() > item:byte_length()) then
                  item = node
                elseif cap == "name" or cap == "context" then
                  parts[#parts + 1] = { node = node, is_name = cap == "name" }
                end
              end
            end
            if item and #parts > 0 and not seen[item:id()] then
              seen[item:id()] = true
              items[#items + 1] = { node = item, parts = parts, children = {} }
            end
          end
          -- Nest the items: sort by start (outer first), then each item's parent is the
          -- nearest earlier item that contains it.
          table.sort(items, function(a, b)
            local as, bs = byte_range(a.node), byte_range(b.node)
            return as < bs or (as == bs and a.node:byte_length() > b.node:byte_length())
          end)
          local top, stack = { children = {} }, {}
          for _, it in ipairs(items) do
            local _, e = byte_range(it.node)
            while #stack > 0 and select(2, byte_range(stack[#stack].node)) < e do
              table.remove(stack)
            end
            it.parent = stack[#stack] or top
            table.insert(it.parent.children, it)
            it.idx = #it.parent.children
            stack[#stack + 1] = it
          end
          -- Build symbols lazily: menus ask for siblings and children only when opened. Build a
          -- new symbol each time, like dropbar's sources: a menu entry copies its symbol's render
          -- cache, so reusing the bar's symbol would show the bar's text in the menu.
          local function symbol(it)
            table.sort(it.parts, function(a, b)
              return byte_range(a.node) < byte_range(b.node)
            end)
            -- One { text, highlight } segment per word, with a space where the words have a gap.
            local text, segments, prev_end, name_hl = "", {}, nil, nil
            for _, p in ipairs(it.parts) do
              local s, e = byte_range(p.node)
              if prev_end and s > prev_end then
                text = text .. " "
                segments[#segments + 1] = { " ", "WinBar" }
              end
              local word = vim.treesitter.get_node_text(p.node, buf):match("^[^\n]*")
              local hl = syntax_hl(buf, p.node)
              name_hl = name_hl or (p.is_name and hl)
              text = text .. word
              segments[#segments + 1] = { word, hl }
              prev_end = e
            end
            local sr, sc, er, ec = it.node:range()
            return bar.dropbar_symbol_t:new(setmetatable({
              buf = buf,
              win = win,
              name = text,
              name_hl = name_hl or "WinBar", -- used in the dropdown menus
              range = { start = { line = sr, character = sc }, ["end"] = { line = er, character = ec } },
              -- Replaces dropbar_symbol_t:cat() to draw each segment in its own color. If dropbar
              -- truncated the name to fit the window, use its default one-color drawing.
              cat = function(self, plain)
                if plain or self.name ~= text then
                  return bar.dropbar_symbol_t.cat(self, plain)
                end
                local out = table.concat(vim.tbl_map(function(seg)
                  return utils.bar.hl((seg[1]:gsub("%%", "%%%%")), seg[2])
                end, segments))
                if self.on_click and self.bar_idx then
                  local fn = ("v:lua.dropbar.callbacks.buf%s.win%s.fn%s"):format(
                    self.bar.buf,
                    self.bar.win,
                    self.callback_idx
                  )
                  out = utils.bar.make_clickable(out, fn)
                end
                return out
              end,
            }, {
              __index = function(self, k)
                if k == "children" then
                  self.children = vim.tbl_map(symbol, it.children)
                  return self.children
                elseif k == "siblings" then
                  self.siblings = vim.tbl_map(symbol, it.parent.children)
                  return self.siblings
                elseif k == "sibling_idx" then
                  return it.idx
                end
              end,
            }))
          end
          -- Walk down from the top to the innermost item under the cursor.
          local result, level = {}, top
          while level do
            local next_level = nil
            for _, child in ipairs(level.children) do
              if vim.treesitter.is_in_node_range(child.node, cursor[1] - 1, cursor[2]) then
                next_level = child
                result[#result + 1] = symbol(child)
                break
              end
            end
            level = next_level
          end
          return result
        end,
      }
      return {
        icons = {
          kinds = { symbols = blank, dir_icon = "", file_icon = "" },
          ui = { bar = { separator = " › " } },
        },
        bar = {
          -- dropbar's default sources, with the joined path.
          sources = function(buf)
            if vim.bo[buf].ft == "markdown" then
              return { joined_path, sources.markdown }
            end
            if vim.bo[buf].buftype == "terminal" then
              return { sources.terminal }
            end
            -- Languages with an outline query (see queries/) get Zed's breadcrumbs.
            local lang = vim.treesitter.language.get_lang(vim.bo[buf].ft)
            local ok, query = pcall(vim.treesitter.query.get, lang or "", "outline")
            if ok and query then
              return { joined_path, outline }
            end
            return { joined_path, utils.source.fallback({ sources.lsp, sources.treesitter }) }
          end,
        },
      }
    end,
    config = function(_, opts)
      require("dropbar").setup(opts)

      -- Draw WinBar's thin bottom line under every bar segment. Statusline-style `%#Group#`
      -- items do not inherit WinBar's underline, so each DropBar group needs it. Skip the
      -- dropdown menu groups, which are not part of the bar.
      local function underline_bar()
        local winbar = vim.api.nvim_get_hl(0, { name = "WinBar", link = false })
        for _, name in ipairs(vim.fn.getcompletion("DropBar", "highlight")) do
          if not name:match("^DropBarMenu") and not name:match("^DropBarPreview") and not name:match("^DropBarFzf") then
            local hl = vim.api.nvim_get_hl(0, { name = name, link = false })
            vim.api.nvim_set_hl(0, name, vim.tbl_extend("force", hl, { underline = winbar.underline, sp = winbar.sp }))
          end
        end
      end
      underline_bar()
      vim.api.nvim_create_autocmd("ColorScheme", { callback = underline_bar })
    end,
  },

  {
    "folke/snacks.nvim",
    opts = {
      dashboard = {
        preset = {
          header = [[
    .        .
    ';;,.       ::'
    ,:::;,,       :ccc,
  ,::c::,,,,.     :cccc,
  ,cccc:;;;;;.    cllll,
  ,cccc;.;;;;;,   cllll;
  :cccc; .;;;;;;. coooo;
  ;llll;   ,:::::'loooo;
  ;llll:    ':::::loooo:
  :oooo:     .::::llodd:
  .;ooo:       ;cclooo:.
  .;oc        'coo;.
  .'         .,.
]],
        },
      },
      explorer = { replace_netrw = false },
      notifier = { style = "minimal" },
      scroll = { enabled = false },
      statuscolumn = {
        left = { "mark", "fold" },
        right = { "sign", "git" },
      },
      picker = {
        -- Zed-style palette: one padded box, untitled prompt, a rule under it, no preview.
        layout = {
          hidden = { "preview" },
          layout = {
            backdrop = false,
            row = 1,
            width = 0.4,
            min_width = 80,
            height = 0.4,
            border = "solid",
            box = "vertical",
            { win = "input", height = 1, border = "bottom" },
            { win = "list", border = "none" },
            { win = "preview", title = "{preview}", border = true },
          },
        },
        formatters = { file = { filename_first = true } },
        ui_select = true,
        sources = {
          files = { hidden = true, exclude = { "vendor" } },
          explorer = { hidden = true, exclude = { "vendor" } },
          grep = { exclude = { "vendor" } },
        },
        win = {
          input = {
            keys = {
              ["<Esc>"] = { "close", mode = { "n", "i" } },
            },
          },
        },
      },
    },
  },

  {
    "lewis6991/hover.nvim",
    opts = {
      providers = {
        "hover.providers.diagnostic",
        "hover.providers.lsp",
        "hover.providers.dap",
      },
    },
  },
}
