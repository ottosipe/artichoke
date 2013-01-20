$(function(){ 
  
  var falseChange = false;
  var isNew = true;

  window.users = [];
  window.cursors = {};
  window.files = [];
  window.activeFile; // update this when in a new File

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.setHighlightActiveLine(false);
  editor.setShowPrintMargin(false); // got rid of vertical line

  var Range = ace.require('ace/range').Range;

  var sessionHash = window.location.pathname;
  var cut = sessionHash.lastIndexOf("/") + 1;
  sessionHash = sessionHash.substr(cut, sessionHash.length);


  // ---------------------------------------------------------- //
  // Button Handlers
  // ---------------------------------------------------------- //

  $('.icon-pencil').click(function(){
    console.log('cllcikkkyyypencil');
    console.log($('#hash').val());
    if($('#hash').val()) {
      console.log(window.activeFile);
      now.dropboxSaveFile(window.activeFile, editor.getSession().getValue());
      window.activeFile = $('#hash').val();
      now.dropboxOpenFile(window.activeFile);
      $('#filepath').text(window.activeFile);
      editor.getSession().setValue('');
    }
  });

  $('.icon-hdd').click(function(){
    console.log('cllcikkkyyyhdd');
  });

  $('.icon-trash').click(function(){
    console.log('cllcikkkyyytrash');
  });

  // ---------------------------------------------------------- //
  // ---------------------------------------------------------- //

  now.updateUserList = function( clientList ){
    console.log('new client joined');

    // Do other stuff when a new client joins
    window.users = clientList;
    console.log(window.users);
  }

  now.removeZombieCursor = function( id ) {
    for (var item in window.cursors) {
      if(item) {
        editor.session.removeGutterDecoration(window.cursors[item], "highlight")
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

    editor.session.addGutterDecoration(cursorLoc.row, "highlight")
    editor.session.removeGutterDecoration(cursors[cursorLoc.id], "highlight")
    window.cursors[cursorLoc.id] = cursorLoc.row;
  }

  // Syncs this browser's text with the incoming changes to the text
  now.updateText = function( data, hash ){

    if( isNew ) {
      now.newUser(sessionHash);
      isNew = false;
    } 

    if (hash != sessionHash) return;

    falseChange = true;
    //console.log(now.core.clientId, data.action);
    //console.log(data);
    if(data.action == "removeLines" || data.action == "removeText") {
      //console.log(data.range);
      var r = data.range;

      var range = new Range(r.start.row, r.start.column, r.end.row, r.end.column);
      editor.session.remove(range);
    } else if (data.action == "insertText") {
       // single word
        editor.session.insert(data.range.start, data.text);
      
    } else if (data.action == "insertLines" ) {
        //console.log(data.lines.length, data.range);
        var all = data.lines.join("\n");

        editor.session.insert(data.range.start, data.text);
    } else {
      console.log(data.action)
    }
  }

  // ---------------------------------------------------------- //
  // Popup Notifiers for connection actions
  // ---------------------------------------------------------- //

  now.core.on('connect', function() {

    console.log(now.core.clientId);

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

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.setHighlightActiveLine(false);

  editor.getSession().selection.on('changeCursor', function(e) {
    // send socket update here ***
    var cursorLoc = editor.selection.getCursor();
    cursorLoc.id = now.core.clientId;
    now.pushCursor(cursorLoc, sessionHash);
  });

  editor.getSession().on("change", function(delta) {
    //console.log(delta.data)
    var data = delta.data;
    if(falseChange === true) {
      falseChange = false;
    } else {
        if(data.action != "insertLines") {
          now.pushText(data, sessionHash);
        }
        else {
          falseChange == true;
          data.action = "wholeDoc";
          data.text = editor.getSession().getValue();
          now.pushText(data, sessionHash)
        }
    }
  });

  editor.commands.addCommand({
    name: 'save',
    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
    exec: function(editor) {
        now.dropboxSaveFile(window.activeFile, editor.getSession().getValue(), function() {
          $('#disconnect_notifier').text('Saved.');
          $('#disconnect_notifier').fadeIn('slow');
          $('#disconnect_notifier').delay(1500).fadeOut('slow');
        });
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
    name: 'shift',
    bindKey: {win: 'Shift-Shift',  mac: 'Shift-Shift'},
    exec: function(editor) {
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

  now.overwriteEditor = function(filedata) {
    console.log('CALLLBACKKKK');
    console.log(filedata);
    editor.getSession().setValue(filedata);
  }

});
