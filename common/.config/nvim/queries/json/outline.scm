; Copied from https://github.com/zed-industries/zed/blob/main/crates/grammars/src/json/outline.scm (GPL-3.0).
; Used by the breadcrumb source in lua/plugins/ui.lua.

(pair
  key: (string
    (string_content) @name)) @item
