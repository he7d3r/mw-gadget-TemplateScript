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
}
 
/* scripts */
// Below, define the functions linked to from rmflinks() above. These functions can use any JavaScript,
// but there is a set of simplified tools documented at
// http://meta.wikimedia.org/wiki/User:Pathoschild/Script:Regex_menu_framework .