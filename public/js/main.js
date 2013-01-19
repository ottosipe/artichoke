$(function(){ 

  window.users = [];
  window.cursors = {};

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.setHighlightActiveLine(false);


  // ---------------------------------------------------------- //
  // ---------------------------------------------------------- //

  now.updateUserList = function( clientList ){
    console.log('new client joined');

    // Do other stuff when a new client joins
    window.users = clientList;
    console.log(window.users);
  }

  // Syncs this browser window with incoming syncs
  now.updateCursor = function( cursorLoc ){
    
    editor.session.addGutterDecoration(cursorLoc.row, "red")
    editor.session.removeGutterDecoration(cursors[cursorLoc.id], "red")
    window.cursors[cursorLoc.id] = cursorLoc.row;
  }

  // Syncs this browser's text with the incoming changes to the text
  now.updateText = function( textData ){
    console.log(now.core.clientId, textData.data.action);
    var data = textData.data;
    if(data.action == "removeLines") {
      console.log(data.range)
      var r = data.range;
      console.log(r)
      var range = new Range(r.start.row, r.start.column, r.end.row, r.end.column);
      editor.session.remove(range)
    } else if (data.action == "insertText") {
      if(data.lines != undefined) {
        console.log(data.lines, data.range)
      } else {
        console.log(data.text, data.range)
        editor.session.insert(data.range, data.text)
      }
    }
  }

  // ---------------------------------------------------------- //
  // ---------------------------------------------------------- //

  now.core.on('disconnect', function(){
    console.log('Client disconnected.');
    // Small popup notifier
  });


  // ---------------------------------------------------------- //
  // ---------------------------------------------------------- //

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.setHighlightActiveLine(false);

  editor.getSession().selection.on('changeCursor', function(e) {
    // send socket update here ***
    var cursorLoc = editor.selection.getCursor();
    cursorLoc.id = now.core.clientId;
    now.pushCursor(cursorLoc);
  });

  editor.getSession().on("change", function(delta) {
    now.pushText(delta);
  })

  editor.commands.addCommand({
    name: 'save',
    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
    exec: function(editor) {
        console.log('Send update to server to save here ***')
    },
    readOnly: false // not for readOnly mode
  });


});

