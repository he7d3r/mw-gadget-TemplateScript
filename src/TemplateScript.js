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
	*** Limpezas gerais na sintaxe wiki
	*******************/
	/* Predefinições */
	regex(/{{\s*(?:msg:|template:)?([^}]+)}}/ig,'{{$1}}');
 
	// Cabeçalhos
	regex(/\n*^(=+)\s*(.*?)\s*\1\s*/mig,'\n\n$1$2$1\n'); // +quebra de linha antes de =, -espaços entre = e o título da seção
	regex(/=\n+=/ig,'=\n='); // -quebras de linha entre cabeçalhos consecutivos
 
	// Categorias
	regex(/\[\[\s*(?:category|categoria)\s*:\s*([^\|\]]+)(?:\s*(\|)([^\]]*))?\s*\]\]/ig,'[[Categoria:$1$2$3]]');
 
	// Ligações
	regex(/\[\[\s*([^\|\]]+?)\s*(?:(\|)\s*([^\]]+?)\s*)?\]\]/ig,'[[$1$2$3]]'); // -espaços redundantes
	regex(/\[\[([^\|\]]+?)\s*\|\s*\1\]\]/ig,'[[$1]]');   //  [[Texto|Texto]] → [[Texto]]
	regex(/\[\[\s*\/\s*([^\|\]]+?)\s*\|\s*\1\s*\]\]/ig,'[[/$1/]]'); // [[/Texto|Texto]] → [[/Texto/]]

	regex(/\[\[([^\|\]]+?)_/ig,'[[$1 ',5); // troca de underscores por espaços nas ligações

	// Listas
	regex(/^([*#:]+)\s*/mig,'$1 '); //apenas 1 espaço entre *, # ou : e o texto da lista

	setreason('Padronização, atualizações e limpeza da sintaxe usando [[meta:User:Pathoschild/Scripts/Regex menu framework|regex]] (em fase de testes)', 'append');

	doaction('diff');
}