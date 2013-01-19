$(function(){ 
	
  window.users = [];

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
    console.log(cursorLoc);
  }

  // Syncs this browser's text with the incoming changes to the text
  now.updateText = function( textData ){
    console.log(textData);
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

	editor.getSession().selection.on('changeSelection', function(e) {
		console.log(editor.session.getTextRange(editor.getSelectionRange()))
		// send socekt update here ***
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

