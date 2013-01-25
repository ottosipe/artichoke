var editor = ace.edit('editor');

editor.setTheme('ace/theme/monokai');
editor.getSession().setMode('ace/mode/javascript');
editor.setHighlightActiveLine(false);
editor.setShowPrintMargin(false); // got rid of vertical line

var hash = window.location.hash;

console.log("Editing session", hash);
sharejs.open(hash, 'text', function(error, doc) {
	doc.attach_ace(editor);
});


$(function(){
  $('#addFriend').click(function() {
    var email = prompt('Add your friend!');
    $.post('/email', {email: email, name: 'your friend', hash: sessionHash}, function(data) {
      console.log('added friend');
    }); 
  });
});