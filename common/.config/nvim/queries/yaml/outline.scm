; Copied from https://github.com/zed-industries/zed/blob/main/crates/grammars/src/yaml/outline.scm (GPL-3.0).
; Used by the breadcrumb source in lua/plugins/ui.lua.

(block_mapping_pair
  key: (flow_node
    (plain_scalar
      (string_scalar) @name))
  value: (flow_node
    (plain_scalar
      (string_scalar) @context))?) @item
