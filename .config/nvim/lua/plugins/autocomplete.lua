return {
  {
    "hrsh7th/nvim-cmp",
    dependencies = {
      {
        "petertriho/cmp-git",
        dependencies = {
          "nvim-lua/plenary.nvim",
        },
      },
      {
        {
          "zbirenbaum/copilot-cmp",
          dependencies = {
            "zbirenbaum/copilot.lua",
            cmd = "Copilot",
            build = ":Copilot auth",
            opts = {
              suggestion = { enabled = false },
              panel = { enabled = false },
              filetypes = {
                markdown = true,
                help = true,
              },
            },
          },
          opts = {},
          config = function(_, opts)
            local copilot_cmp = require("copilot_cmp")
            copilot_cmp.setup(opts)
            -- attach cmp source whenever copilot attaches
            -- fixes lazy-loading issues with the copilot cmp source
            require("lazyvim.util").on_attach(function(client)
              if client.name == "copilot" then
                copilot_cmp._on_insert_enter({})
              end
            end)
          end,
        },
      },
    },
    ---@param opts cmp.ConfigSchema
    opts = function(_, opts)
      -- https://github.com/LunarVim/Neovim-from-scratch/blob/2683495c3df5ee7d3682897e0d47b0facb3cedc9/lua/user/cmp.lua#L13-L16
      local check_backspace = function()
        local col = vim.fn.col(".") - 1
        return col == 0 or vim.fn.getline("."):sub(col, col):match("%s")
      end

      -- https://github.com/zbirenbaum/copilot-cmp#tab-completion-configuration-highly-recommended
      local has_words_before = function()
        if vim.api.nvim_buf_get_option(0, "buftype") == "prompt" then
          return false
        end
        local line, col = unpack(vim.api.nvim_win_get_cursor(0))
        return col ~= 0 and vim.api.nvim_buf_get_text(0, line - 1, 0, line - 1, col, {})[1]:match("^%s*$") == nil
      end

      local luasnip = require("luasnip")
      local cmp = require("cmp")

      -- https://github.com/hrsh7th/nvim-cmp/wiki/Advanced-techniques#nvim-autopairs
      local cmp_autopairs = require("nvim-autopairs.completion.cmp")
      cmp.event:on("confirm_done", cmp_autopairs.on_confirm_done())

      opts.formatting = vim.tbl_extend("force", {}, {
        fields = { "kind", "abbr" },
        format = function(_, item)
          -- https://github.com/hrsh7th/nvim-cmp/wiki/Menu-Appearance#how-to-add-visual-studio-code-codicons-to-the-menu
          local icons = require("lazyvim.config").icons.kinds
          local icon = icons[item.kind] .. " " or "? "

          -- Override the icon for Copilot
          if item.kind == "Copilot" then
            icon = " "
          end

          item.kind = icon

          -- https://github.com/onsails/lspkind.nvim/blob/57610d5ab560c073c465d6faf0c19f200cb67e6e/lua/lspkind/init.lua#L203-L207
          local label = item.abbr
          local truncated_label = vim.fn.strcharpart(label, 0, 100)

          if truncated_label ~= label then
            item.abbr = truncated_label .. "..."
          end

          return item
        end,
      })

      opts.mapping = vim.tbl_extend("force", opts.mapping, {
        ["<Tab>"] = cmp.mapping(function(fallback)
          if cmp.visible() and has_words_before() then
            cmp.select_next_item({ behavior = cmp.SelectBehavior.Select })
          elseif cmp.visible() then
            cmp.select_next_item()
          elseif luasnip.expandable() then
            luasnip.expand()
          elseif luasnip.expand_or_jumpable() then
            luasnip.expand_or_jump()
          elseif check_backspace() then
            fallback()
          else
            fallback()
          end
        end, { "i", "s" }),
        ["<S-Tab>"] = cmp.mapping(function(fallback)
          if cmp.visible() then
            cmp.select_prev_item()
          elseif luasnip.jumpable(-1) then
            luasnip.jump(-1)
          else
            fallback()
          end
        end, { "i", "s" }),
      })

      table.insert(opts.sources, 1, { name = "copilot", group_index = 2 })
      opts.sorting = opts.sorting or require("cmp.config.default")().sorting
      table.insert(opts.sorting.comparators, 1, require("copilot_cmp.comparators").prioritize)

      -- Add cmp-git as a source
      table.insert(opts.sources, { name = "cmp_git" })

      opts.view = vim.tbl_deep_extend("force", {}, {
        entries = {
          name = "custom",
          selection_order = "near_cursor",
        },
      })

      opts.window = vim.tbl_deep_extend("force", {}, {
        completion = {
          border = { "╭", "─", "╮", "│", "╯", "─", "╰", "│" },
          winhighlight = "Normal:Normal,FloatBorder:NormalFloat,CursorLine:PmenuSel,Search:None",
        },
        documentation = {
          border = { "╭", "─", "╮", "│", "╯", "─", "╰", "│" },
        },
      })
    end,
  },
}
