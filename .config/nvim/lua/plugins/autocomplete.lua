return {
  {
    "hrsh7th/nvim-cmp",
    dependencies = {
      "petertriho/cmp-git",
      dependencies = {
        "nvim-lua/plenary.nvim",
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
          elseif vim.snippet.active({ direction = 1 }) then
            vim.schedule(function()
              vim.snippet.jump(1)
            end)
          elseif check_backspace() then
            fallback()
          else
            fallback()
          end
        end, { "i", "s" }),
        ["<S-Tab>"] = cmp.mapping(function(fallback)
          if cmp.visible() then
            cmp.select_prev_item()
          elseif vim.snippet.active({ direction = -1 }) then
            vim.schedule(function()
              vim.snippet.jump(-1)
            end)
          else
            fallback()
          end
        end, { "i", "s" }),
      })

      -- Add cmp-git as a source
      table.insert(opts.sources, { name = "git" })

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
