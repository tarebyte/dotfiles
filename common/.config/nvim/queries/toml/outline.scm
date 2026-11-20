; Copied from https://github.com/zed-extensions/toml/blob/main/languages/toml/outline.scm (Apache-2.0).
; Used by the breadcrumb source in lua/plugins/ui.lua.

(table
  "["
  (_) @name
  "]") @item

(table_array_element
  "[["
  (_) @name
  "]]") @item

(pair
  (_) @name
  "=") @item
