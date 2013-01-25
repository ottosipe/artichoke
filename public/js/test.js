var editor = ace.edit('editor');

editor.setTheme('ace/theme/monokai');
editor.getSession().setMode('ace/mode/javascript');
editor.setHighlightActiveLine(false);
editor.setShowPrintMargin(false); // got rid of vertical line

var sessionHash    = window.location.pathname;
var cut            = sessionHash.lastIndexOf('/') + 1;
window.sessionHash = sessionHash.substr(cut, sessionHash.length);

console.log("Editing session", sessionHash);
sharejs.open(sessionHash, 'text', function(error, doc) {
	doc.attach_ace(editor);
});
