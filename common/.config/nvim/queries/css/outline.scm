; Copied from https://github.com/zed-industries/zed/blob/main/crates/grammars/src/css/outline.scm (GPL-3.0).
; Used by the breadcrumb source in lua/plugins/ui.lua.

(stylesheet
  (import_statement
    "@import" @context
    (string_value) @name) @item)

(rule_set
  (selectors
    .
    (_) @name
    ("," @name
      (_) @name)*)) @item

(media_statement
  "@media" @context
  (_) @name
  (block)) @item
