Html2hamlView = require './html2haml-view'

module.exports =
  html2hamlView: null

  activate: (state) ->
    @html2hamlView = new Html2hamlView(state.html2hamlViewState)
    atom.workspaceView.command "html2haml:convert", => @convert()

  deactivate: ->
    @html2hamlView.destroy()

  serialize: ->
    html2hamlViewState: @html2hamlView.serialize()

  convert: ->
    editor = atom.workspace.activePaneItem
    selection = editor.getSelection()

    html = selection.getText()
    post_data = JSON.stringify({'page': {'html': html}})


    http = require("http")
    options =
      host: "html2haml.heroku.com"
      path: "/api.json"
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
        result = JSON.parse(str)
        editor.insertText(result.page.haml)
        return
      return

    request = http.request(options, callback)

    request.end()
    request.write(post_data, encoding = 'utf8')
