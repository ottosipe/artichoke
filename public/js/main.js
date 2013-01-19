$(function(){ 
  window.users = [];
  window.cursors = {};

  window.editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.setHighlightActiveLine(false);


  now.updateUserList = function( clientList ){
    console.log('new client joined');

    // Do other stuff when a new client joins
    window.users = clientList;
    console.log(window.users);
  }

  // Syncs this browser window with incoming syncs
  now.updateCursor = function( cursorLoc ){
    console.log('test')
    console.log(cursorLoc);
    editor.session.addGutterDecoration(cursorLoc.row, "red")

      //  editor.session.addGutterDecoration(cursorLoc.row, "red")
    //editor.session.removeGutterDecoration(cursors[cursorLoc.id].row, "red")
//    window.cursors[cursorLoc.id] = cursorLoc.row;
  }

  now.core.on('disconnect', function(){
    console.log('Client disconnected.');
  });

  editor.getSession().selection.on('changeCursor', function(e) {
		  // send socket update here ***
      var cursorLoc = editor.selection.getCursor();
      cursorLoc.id = now.core.clientId;
      now.pushCursor(cursorLoc);
	});

  editor.commands.addCommand({
    name: 'save',
    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
    exec: function(editor) {
        console.log('Send update to server to save here ***')
    },
    readOnly: false // not for readOnly mode
  });


});

