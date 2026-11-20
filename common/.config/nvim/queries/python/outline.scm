; Copied from https://github.com/zed-industries/zed/blob/main/crates/grammars/src/python/outline.scm (GPL-3.0).
; Used by the breadcrumb source in lua/plugins/ui.lua.

(decorator) @annotation

(class_definition
  "class" @context
  name: (identifier) @name) @item

(function_definition
  "async"? @context
  "def" @context
  name: (_) @name) @item
