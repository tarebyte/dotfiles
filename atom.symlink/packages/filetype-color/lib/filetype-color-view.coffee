{View} = require 'atom'

module.exports =
class FiletypeColorView extends View
  @content: ->
    @div class: 'filetype-color overlay from-top', =>
      @div "The FiletypeColor package is Alive! It's ALIVE!", class: "message"

  initialize: (serializeState) ->

    atom.workspaceView.command "filetype-color:toggle", => @toggle()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()

  toggle: ->
    console.log "FiletypeColorView was toggled!"
    if @hasParent()
      @detach()
    else
      atom.workspaceView.append(this)
      @runme()

    runme: ->
      alert('YO')
