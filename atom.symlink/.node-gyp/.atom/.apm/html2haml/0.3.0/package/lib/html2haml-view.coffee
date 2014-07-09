{View} = require 'atom'

module.exports =
class Html2hamlView extends View
  @content: ->
    @div class: 'html2haml overlay from-top', =>
      @div "The Html2haml package is Alive! It's ALIVE!", class: "message"

  initialize: (serializeState) ->

  convert: ->
    editor = atom.workspace.activePaneItem
    selection = editor.getSelection()

    html = selection.getText()
    post_data = JSON.stringify({'page': {'html': html}})
    # post_data = unescape(encodeURIComponent(post_data))


    http = require("http")
    #The url we want is `www.nodejitsu.com:1337/`
    options =
      host: "html2haml.heroku.com"
      path: "/api.json"
      #This is what changes the request to a POST request
      method: "POST"
      headers:
        "Content-Type": 'text/html;charset=utf-8'
        "Content-Length": post_data.length

    callback = (response) ->
      str = ""
      response.on "data", (chunk) ->
        str += chunk
        return

      response.on "end", ->
        console.log str
        result = JSON.parse(str)
        editor.insertText(result.page.haml)
        return

      return

    request = http.request(options, callback)

    request.end()
    request.write(post_data, encoding = 'utf8')

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()

  # toggle: ->
  #   console.log "Html2hamlView was toggled!"
  #
  #   if @hasParent()
  #     @detach()
  #   else
  #     atom.workspaceView.append(this)
