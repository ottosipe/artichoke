var editor = ace.edit('editor');

editor.setTheme('ace/theme/monokai');
editor.getSession().setMode('ace/mode/javascript');
editor.setHighlightActiveLine(false);
editor.setShowPrintMargin(false); // got rid of vertical line

sharejs.open('hello', 'text', function(error, doc) {
	doc.attach_ace(editor);
});
