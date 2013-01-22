var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.getSession().setMode('ace/mode/javascript');
editor.setHighlightActiveLine(false);
editor.setShowPrintMargin(false); // got rid of vertical line
var Range = ace.require('ace/range').Range;

var falseChange = false;
var isNew       = true;

window.cursors = {};
window.files   = [];
window.users   = [];
window.userID;

window.activeFile;
window.activeFilePath;

var sessionHash    = window.location.pathname;
var cut            = sessionHash.lastIndexOf('/') + 1;
window.sessionHash = sessionHash.substr(cut, sessionHash.length);

// ---------------------------------------------------------- //
// Continually flush changes to DropBox
// ---------------------------------------------------------- //

$(function(){
  $('#addFriend').click(function() {
    var email = prompt('Add your friend!');
    $.post('/email', {email: email, name: 'your friend', hash: sessionHash}, function(data) {
      console.log('added friend');
    }); 
  });
});

// ---------------------------------------------------------- //
// Auto-save
// ---------------------------------------------------------- //

setInterval(function(){
  $('#filepath').fadeOut('fast');
  setTimeout(function(){
    $('#filepath').fadeIn('fast');
  }, 300);
  now.dropboxSaveFile(window.activeFile, editor.getSession().getValue());
}, 8000); // Auto-save every 8 seconds

// ---------------------------------------------------------- //
// Button Handlers
// ---------------------------------------------------------- //

$('#pencil').click(newFileHandler);

$('#hdd').click(function(){
  $('#disconnect_notifier').text('Saved.');
  $('#disconnect_notifier').fadeIn('fast');
  $('#disconnect_notifier').delay(1500).fadeOut('slow');
  now.dropboxSaveFile(window.activeFile, editor.getSession().getValue());
});

$('#trash').click(function(){
  now.dropboxDeleteFile(window.activeFilePath);
});

$('#hash').keypress(function(btn) {
  if(btn.keyCode == 13) {
    newFileHandler();
  }
});

function newFileHandler() {
  if($('#hash').val()) {
    editor.getSession().setValue('');
    window.activeFile = $('#hash').val();
    if($('#hash').val()[0] != '/') {
      $('#filepath').text('/'+$('#hash').val());
    } else {
      $('#filepath').text($('#hash').val());
    }
    now.dropboxSaveFile(window.activeFile, editor.getSession().getValue());
    now.dropboxOpenFile(window.activeFile); 
    //falseChange = true; // ***
  }
}

// ---------------------------------------------------------- //
// NowJS Connectors
// ---------------------------------------------------------- //

now.updateUserList = function( clientList ){
  console.log('new client joined');

  // Do other stuff when a new client joins
  window.users = clientList;
  console.log(window.users);

  //window.userID = this.core.clientId;
  //console.log('you', userID) //***

}

now.removeZombieCursor = function( id ) {
  for (var item in window.cursors) {
    if(item) {
      editor.session.removeGutterDecoration(window.cursors[item], 'highlight');
      delete window.cursors[item];
    }
  }
};

// Syncs this browser window with incoming syncs
now.updateCursor = function( cursorLoc, hash ){
  if( isNew ) {
    now.newUser(sessionHash);
    isNew = false;
  } 

  if (hash != sessionHash) return;

  editor.session.addGutterDecoration(cursorLoc.row, 'highlight');
  editor.session.removeGutterDecoration(cursors[cursorLoc.id], 'highlight');
  window.cursors[cursorLoc.id] = cursorLoc.row;
}

// Syncs this browser's text with the incoming changes to the text
now.updateText = function( data, hash ){

  if( isNew ) {
    now.newUser(sessionHash);
    isNew = false;
  } 

  if (hash != sessionHash) return;

  console.log(data)
  falseChange = true;
  //console.log(now.core.clientId, data.action);
  //console.log(data);
  if(data.action == 'removeLines' || data.action == 'removeText') {
    var r = data.range;
    var range = new Range(r.start.row, r.start.column, r.end.row, r.end.column);
    editor.session.remove(range);
  } else if (data.action == 'insertText') {
     // single word
      editor.session.insert(data.range.start, data.text);
  } else if (data.action == 'insertLines' ) {
      var all = data.lines.join('\n');
      editor.session.insert(data.range.start, data.text);
  } else {
    if(data.doc != undefined) {
      console.log(data.doc);

//        editor.getSession().setValue(data.doc);
      //falseChange = true; //***
    }
  }
}

now.overwriteEditor = function(filedata) {
  editor.getSession().setValue(filedata);
}

// ---------------------------------------------------------- //
// Popup Notifiers for connection actions
// ---------------------------------------------------------- //

now.core.on('connect', function() {
  console.log('you\'re connected');
});

now.core.on('disconnect', function(){
  console.log('Client disconnected.');
  $('#disconnect_notifier').text('Disconnected from the Server...').fadeIn('slow');
});

now.core.on('reconnect', function (){
  console.log('Client reconnected.');
  $('#disconnect_notifier').fadeOut('slow', function() {
    $(this).text('Artichoke reconnected :)').fadeIn('slow').delay(2400).fadeOut('slow');;
  })
});

now.core.on('reconnect_failed', function (){
  console.log('Client has exhausted reconnects.');
  $('#disconnect_notifier').fadeOut('slow');
  $('#disconnect_notifier').text('Artichoke cannot reconnect :(');
  $('#disconnect_notifier').fadeIn('slow');
});


// ---------------------------------------------------------- //
// ---------------------------------------------------------- //

var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.getSession().setMode('ace/mode/javascript');
editor.setHighlightActiveLine(false);

editor.getSession().selection.on('changeCursor', function(e) {
  // send socket update here ***
  var cursorLoc = editor.selection.getCursor();
  cursorLoc.id = now.core.clientId;
  now.pushCursor(cursorLoc, sessionHash);

});

editor.getSession().on('change', function(delta) {
  var data = delta.data;
  if(falseChange === true) {
    falseChange = false;
  } else {
      if(data.action != 'insertLines') {
        now.pushText(data, sessionHash);
      }
      else {
        falseChange == true;
        data.action = 'wholeDoc';
        data.text = editor.getSession().getValue();
        now.pushText(data, sessionHash)
      }
  }
});

// ---------------------------------------------------------- //
// Keyboard Interceptors
// ---------------------------------------------------------- //

editor.commands.addCommand({
  name: 'save',
  bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
  exec: function(editor) {
      $('#disconnect_notifier').text('Saved.');
      $('#disconnect_notifier').fadeIn('slow');
      $('#disconnect_notifier').delay(1500).fadeOut('slow');
      now.dropboxSaveFile(window.activeFile, editor.getSession().getValue());

      /*now.sendDoc( editor.getSession().getValue(), sessionHash , function(textData, hash, id) {
        if(id != userID && sessionHash == hash) {
          console.log(id, hash, textData.doc);
          editor.getSession().setValue(textData.doc);
        }
      });
     falseChange = true; */ //***

  },
  readOnly: false // not for readOnly mode
});

editor.commands.addCommand({
  name: 'reload',
  bindKey: {win: 'Ctrl-R',  mac: 'Command-R'},
  exec: function(editor) {
      console.log('Not allowed to reload!')
  },
  readOnly: false // not for readOnly mode
});

editor.commands.addCommand({
  name: 'newFile',
  bindKey: {win: 'Ctrl-X',  mac: 'Command-X'},
  exec: function(editor) {
      $('#hash').focus();
  },
  readOnly: false // not for readOnly mode
});

editor.commands.addCommand({
  name: 'shift',
  bindKey: {win: 'Shift-Enter',  mac: 'Shift-Enter'},
  exec: function(editor) {
      // EASTER EGG!!!!
      console.log('Node up!!');
  },
  readOnly: false // not for readOnly mode
});

editor.commands.addCommand({
  name: 'disablePaste',
  bindKey: {win: 'Ctrl-V',  mac: 'Command-V'},
  exec: function(editor) {
    //MT
  },
  readOnly: false // not for readOnly mode
});