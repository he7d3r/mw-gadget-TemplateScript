/*************
*** Regex menu framework
*** by [[m:user:Pathoschild]] <http://meta.wikimedia.org/wiki/User:Pathoschild/Scripts/Regex_menu_framework>
***	- adds a sidebar menu of user-defined scripts.
*************/
importScriptURI('http://meta.wikimedia.org/w/index.php?title=User:Pathoschild/Scripts/Regex_menu_framework.js&action=raw&ctype=text/javascript');
 
/* menu links */
// In the function below, add more lines like "regexTool('link text','function_name()')" to add
// links to the sidebar menu. The function name is the function defined in rfmscripts() below.
function rmflinks() {
	regexTool('Custom regex','custom()'); // a default tool which performs regex input in a dynamic form
	regexTool('Padronização','padronizar()'); // a default tool which performs regex input in a dynamic form
}
 
/* scripts */
// Below, define the functions linked to from rmflinks() above. These functions can use any JavaScript,
// but there is a set of simplified tools documented at
// http://meta.wikimedia.org/wiki/User:Pathoschild/Script:Regex_menu_framework .

function padronizar() {
	/*******************
	*** miscellaneous cleanup
	*******************/
	/*   templates */
	regex(/{{\s*(?:msg:|template:)?([^}]+)}}/ig,'{{$1}}');
 
	/* syntax */
	// headers
	regex(/\n*^(=+)\s*(.*?)\s*\1\s*/mig,'\n\n$1$2$1\n'); // whitespace
	regex(/=\n+=/ig,'=\n='); // fix consecutive headers
 
	// categories
	regex(/\[\[\s*category\s*:\s*([^\|\]]+)(?:\s*(\|)([^\]]*))?\s*\]\]/ig,'[[category:$1$2$3]]');
 
	//links
	regex(/\[\[\s*([^\|\]]+?)\s*(?:(\|)\s*([^\]]+?)\s*)?\]\]/ig,'[[$1$2$3]]'); // redundant starting and ending whitespace
	regex(/\[\[([^\|\]]+?)\s*\|\s*\1\]\]/ig,'[[$1]]'); // redundant link text
	regex(/\[\[([^\|\]]+?)_/ig,'[[$1 ',5); // underscores

	reason('Padronização, atualizações e limpeza da sintaxe usando [[meta:User:Pathoschild/Scripts/Regex menu framework|regex]]');
 
	regex(/^([*#:]+)\s*/mig,'$1 ');	doaction('diff');
}