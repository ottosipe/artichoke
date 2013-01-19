$(function(){ 
	

  window.users = [];

  now.updateUserList = function( clientList ){
    console.log('new client joined');

    // Do other stuff when a new client joins
    window.users = clientList;
    console.log(window.users);
  }

  now.core.on('disconnect', function(){
    console.log('Client disconnected.');
  });


  var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");

    editor.getSession().selection.on('changeCursor', function(e) {
		console.log(editor.selection.getCursor())
		// send socekt update here ***
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

