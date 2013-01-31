
$(function(){
  var editor = ace.edit('editor');


  console.log(window.location)
  var doc = window.location.pathname;
  doc = doc.replace(/\//g,"#");

  console.log("Editing session", doc);

  if (doc == "" || doc == "#") window.location = "/"

  sharejs.open(doc, 'text', function(error, doc) {
    doc.attach_ace(editor);
  });

  editor.setTheme('ace/theme/monokai');
  editor.setHighlightActiveLine(false);
  editor.setShowPrintMargin(false); // got rid of vertical line
  editor.getSession().setMode('ace/mode/'+ $("#syntaxSelect").val());

  $('#addFriend').click(function() {
    var email = prompt('Add your friend!');
    $.post('/email', {email: email, name: 'your friend', doc: sessionHash}, function(data) {
      console.log('added friend');
    }); 
  });


  $("#syntaxSelect").change(function() {
    console.log($(this).val())
    editor.getSession().setMode('ace/mode/'+ $(this).val());
  });
});