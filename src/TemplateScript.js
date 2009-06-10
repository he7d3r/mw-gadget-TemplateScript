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
	regexTool('• Formatação geral','format_geral()');
	regexTool('• Wiki → Latex','wiki2latex()');

	regexTool('Formatar cabeçalhos','format_cab()');
	regexTool('Formatar predefinições','format_predef()');
	regexTool('Formatar categorias','format_cat()');
	regexTool('Formatar listas','format_list()');
	regexTool('Formatar links','format_links()');
	regexTool('Formatar tags <math>','format_math()');
	regexTool('Regex no sumário','usando_regex()');

	regexTool('• Outro REGEX','custom()'); // Uma ferramenta padrão que executa regex em um formulário dinâmico
}
 
/* scripts */
// Abaixo, defina as funções referenciadas a partir de rmflinks(), logo acima. Estas funções podem usar qualquer JavaScript,
// mas há um conjunto de ferramentas simplificadas documentadas em
// http://meta.wikimedia.org/wiki/User:Pathoschild/Script:Regex_menu_framework.
function format_geral() {
	format_cab();
	format_predef();
	format_cat();
	format_list();
	format_links();
	format_math();
	format_cab();
	doaction('diff');
}

function wiki2latex() {
	regex(/{{AutoCat}}/ig,'');
	regex(/{{AutoNav}}/ig,'');
	regex(/([\.,;:!\?])<\/math> */mig,'</math>$1 '); // coloca a pontuação que vem depois de fórmulas fora das tags <math>
	regex(/<math>/ig,'$');
	regex(/<\/math>/ig,'$');
	regex(/\n====/ig,'\\subsubsubsection{');
	regex(/====\n/ig,'}');
	regex(/\n===/ig,'\\subsubsection{');
	regex(/===\n/ig,'}');
	regex(/\n==/ig,'\\subsection{');
	regex(/==\n/ig,'}');

	setreason('criando versão latex [usando [[meta:User:Pathoschild/Scripts/Regex menu framework|regex]]]', 'append');
}


function format_cab() {
	var antigo = editbox.value;

	var padrao = /\n*^(=+)\s*(.*?)\s*\1\s*/mig;
	regex(padrao,'\n\n$1 $2 $1\n'); // +quebra de linha antes de =, -espaços entre = e o título da seção

	padrao = /=\n+=/ig;
	regex(padrao,'=\n='); // -quebras de linha entre cabeçalhos consecutivos

	if (editbox.value != antigo) {
		setreason('format. cabeçalhos', 'append');
	}
}

function format_predef() {
	var antigo = editbox.value;
	var padrao = /{{\s*(?:msg:|template:)?([^}]+)}}/ig;
	regex(padrao,'{{$1}}');

	if (editbox.value != antigo) {
		setreason('format. predefs', 'append');
	}
}

function format_cat() {
	var antigo = editbox.value;
	var padrao = /\[\[\s*(?:category|categoria)\s*:\s*([^\|\]]+)(?:\s*(\|)([^\]]*))?\s*\]\]/ig;
	regex(padrao,'[[Categoria:$1$2$3]]');

	if (editbox.value != antigo) {
		setreason('format. categorias', 'append');
	}
}

function format_list() {
	var antigo = editbox.value;
	var padrao = /^([*#:]+)\s*/mig;
	regex(padrao,'$1 '); //apenas 1 espaço entre *, # ou : e o texto da lista

	if (editbox.value != antigo) {
		setreason('format. listas', 'append');
	}
}

function format_links() {
	var antigo = editbox.value;
	var padrao = /\[\[\s*([^\|\]]+?)\s*(?:(\|)\s*([^\]]+?)\s*)?\]\]/ig;
	regex(padrao,'[[$1$2$3]]'); // -espaços redundantes

	padrao = /\[\[([^\|\]]+?)\s*\|\s*\1\]\]/ig;
	regex(padrao,'[[$1]]'); // [[Texto|Texto]] → [[Texto]]

	padrao = /\[\[\s*\/\s*([^\|\]]+?)\s*\|\s*\1\s*\]\]/ig;
	regex(padrao,'[[/$1/]]'); // [[/Texto|Texto]] → [[/Texto/]]

	if (wgPageName == wgBookName){
		var nome = wgBookName.replace(/_/g,' '); //remove underscores
		var padrao = '\\[\\[\\s*' + nome + '\\/([^\\|\\]]+?)\\s*\\|\\s*\\1\\s*\\]\\]';
		var reg = new RegExp(padrao,'ig');
		editbox.value = editbox.value.replace(reg,'[[/$1/]]'); // [[Livro/Cap|Cap]] → [[/Cap/]]
	}
	padrao = /\[\[([^\|\]]+?)_/ig;
	regex(padrao,'[[$1 ',5); // troca de underscores por espaços nas ligações

	if (editbox.value != antigo) {
		setreason('simplificando links', 'append');
	}
}

function format_math() {
	var antigo = editbox.value;
	var padrao = /<\/math>\s*([\.,;:!\?]) */mig;
	regex(padrao,'$1</math> '); // coloca a pontuação que vem depois de fórmulas dentro das tags <math>

	if (editbox.value != antigo) {
		setreason('format. <math> e pontuação', 'append');
	}
}

function usando_regex() {
	setreason('[usando [[meta:User:Pathoschild/Scripts/Regex menu framework|regex]]]', 'append');
}