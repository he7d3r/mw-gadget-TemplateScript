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
	regexTool('Formatar cabeçalhos','format_cab()');
	regexTool('Formatar predefinições','format_predef()');
	regexTool('Formatar categorias','format_cat()');
	regexTool('Formatar listas','format_list()');
	regexTool('Formatar links','format_links()');
	regexTool('Formatar tags <math>','format_math()');
	regexTool('Regex no sumário','usando_regex()');

	regexTool('« Testar regex »','custom()'); // Uma ferramenta padrão que executa regex em um formulário dinâmico
}
 
/* scripts */
// Abaixo, defina as funções referenciadas a partir de rmflinks(), logo acima. Estas funções podem usar qualquer JavaScript,
// mas há um conjunto de ferramentas simplificadas documentadas em
// http://meta.wikimedia.org/wiki/User:Pathoschild/Script:Regex_menu_framework.

function format_math() {
	var alterou = false;
	var padrao = /<\/math>\s*([\.,;:!\?]) /mig;
	if (regsearch(padrao)) {
		regex(padrao,'$1</math> '); // coloca a pontuação que vem depois de fórmulas dentro das tags <math>
		alterou = true;
	}

	if (alterou) {
		setreason('format. <math> e pontuação', 'append');
		doaction('diff');
	}
}

function format_cab() {
	var alterou = false;
	var padrao = /\n*^(=+)\s*(.*?)\s*\1\s*/mig;
	if (regsearch(padrao)) {
		regex(padrao,'\n\n$1 $2 $1\n'); // +quebra de linha antes de =, -espaços entre = e o título da seção
		alterou = true;
	}
	padrao = /=\n+=/ig;
	if (regsearch(padrao)) {
		regex(padrao,'=\n='); // -quebras de linha entre cabeçalhos consecutivos
		alterou = true;
	}

	if (alterou) {
		setreason('format. cabeçalhos', 'append');
		doaction('diff');
	}
}

function format_predef() {
	var alterou = false;
	var padrao = /{{\s*(?:msg:|template:)?([^}]+)}}/ig;
	if (regsearch(padrao)) {
		regex(padrao,'{{$1}}');
		alterou = true;
	}
	if (alterou) {
		setreason('format. predefs', 'append');
		doaction('diff');
	}
}

function format_cat() {
	var alterou = false;
	var padrao = /\[\[\s*(?:category|categoria)\s*:\s*([^\|\]]+)(?:\s*(\|)([^\]]*))?\s*\]\]/ig;
	if (regsearch(padrao)) {
		regex(padrao,'[[Categoria:$1$2$3]]');
		alterou = true;
	}
	if (alterou) {
		setreason('format. categorias', 'append');
		doaction('diff');
	}
}

function format_list() {
	var padrao = /^([*#:]+)\s*/mig;
	if (regsearch(padrao)) {
		regex(padrao,'$1 '); //apenas 1 espaço entre *, # ou : e o texto da lista
		alterou = true;
	}
	if (alterou) {
		setreason('format. listas', 'append');
		doaction('diff');
	}
}

function format_links() {
	var alterou = false;
	var padrao = /\[\[\s*([^\|\]]+?)\s*(?:(\|)\s*([^\]]+?)\s*)?\]\]/ig;
	if (regsearch(padrao)) {
		regex(padrao,'[[$1$2$3]]'); // -espaços redundantes
		alterou = true;
	}
	padrao = /\[\[([^\|\]]+?)\s*\|\s*\1\]\]/ig;
	if (regsearch(padrao)) {
		regex(padrao,'[[$1]]'); // [[Texto|Texto]] → [[Texto]]
		alterou = true;
	}
	padrao = /\[\[\s*\/\s*([^\|\]]+?)\s*\|\s*\1\s*\]\]/ig;
	if (regsearch(padrao)) {
		regex(padrao,'[[/$1/]]'); // [[/Texto|Texto]] → [[/Texto/]]
		alterou = true;
	}

	if (wgPageName == wgBookName){
		var nome = wgBookName.replace(/_/g,' '); //remove underscores
		var padrao = '\\[\\[\\s*' + nome + '\\/([^\\|\\]]+?)\\s*\\|\\s*\\1\\s*\\]\\]';
		var reg = new RegExp(padrao,'ig');
		if (regsearch(reg)) {
			editbox.value = editbox.value.replace(reg,'[[/$1/]]'); // [[Livro/Cap|Cap]] → [[/Cap/]]
			alterou = true;
		}
	}
	padrao = /\[\[([^\|\]]+?)_/ig;
	if (regsearch(padrao)) {
		regex(padrao,'[[$1 ',5); // troca de underscores por espaços nas ligações
		alterou = true;
	}

	if (alterou) {
		setreason('simplificando links', 'append');
		doaction('diff');
	}
}

function usando_regex() {
	setreason('[usando [[meta:User:Pathoschild/Scripts/Regex menu framework|regex]]]', 'append');
}