FiletypeColorView = require './filetype-color-view'

module.exports =
  filetypeColorView: null

  activate: (state) ->
    @filetypeColorView = new FiletypeColorView(state.filetypeColorViewState)

  deactivate: ->
    @filetypeColorView.destroy()

  serialize: ->
    filetypeColorViewState: @filetypeColorView.serialize()
