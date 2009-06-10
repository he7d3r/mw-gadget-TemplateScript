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
	var url1   = 'http://';
	var url2   = '.org/wiki/Special:Search/';
	var w = 'pt.wikipedia';
//	var wikt = 'pt.wiktionary';
//	var n = 'pt.wikinews';
//	var b = 'pt.wikibooks';
//	var q = 'pt.wikiquote';
//	var s = 'pt.wikisource';
//	var species = 'wikispecies.wikimedia';
//	var v = 'pt.wikiversity';
//	var wmf = 'wikimediafoundation';
//	var commons = 'commons.wikimedia';
//	var m = 'meta.wikimedia';

	regex(/\n*{{Auto(Cat|Nav)}}\n*/ig,'');
	regex(/([\.,;:!\?])<\/math> */mig,'</math>$1 '); // coloca a pontuação que vem depois de fórmulas fora das tags <math>
	regex(/<\/?math>/ig,'$');
	regex(/\n*^(====)\s*(.*?)\s*\1\s*/mig,'\n\n\\subsubsubsection{$2}\n\n');
	regex(/\n*^(===)\s*(.*?)\s*\1\s*/mig,'\n\n\\subsubsection{$2}\n\n');
	regex(/\n*^(==)\s*(.*?)\s*\1\s*/mig,'\n\n\\subsection{$2}\n\n');

	regex(/{{\s*(?:Âncoras?)\|([^}]+)}}/ig,'\\label{$1}');
	regex(/\[\[\s*(?:w)\s*:\s*([^\|\]]+?)\s*?\|\s*([^\]]*?)\s*\]\]/ig,'\\href{' + url1 + w + url2 + '$1}{$2}');
	regex(/{{\s*(?:w)\s*\|\s*([^\|}]+?)\s*?\|\s*([^}]*?)\s*}}/ig,'\\href{' + url1 + w + url2 + '$1}{$2}');

	regex(/{{\s*(?:Definição)\|([^}]+)}}/ig,'\\begin{def}\n$1\n\\end{def}');
	regex(/{{\s*(?:Teorema)\|([^}]+)}}/ig,'\\begin{teo}\n$1\n\\end{teo}');
	regex(/{{\s*(?:Demonstração)\|([^}]+)}}/ig,'\\begin{proof}\n$1\n\\end{proof}');
	regex(/{{\s*(?:Lema)\|([^}]+)}}/ig,'\\begin{lema}\n$1\n\\end{lema}');
	regex(/{{\s*(?:Proposição)\|([^}]+)}}/ig,'\\begin{prop}\n$1\n\\end{prop}');
	regex(/{{\s*(?:Corolário)\|([^}]+)}}/ig,'\\begin{cor}\n$1\n\\end{cor}');
	regex(/{{\s*(?:Exemplo)\|([^}]+)}}/ig,'\\begin{ex}\n$1\n\\end{ex}');
	regex(/{{\s*(?:Exercício)\|([^}]+)}}/ig,'\\begin{exer}\n$1\n\\end{exer}');
	regex(/{{\s*(?:Observação)\|([^}]+)}}/ig,'\\begin{obs}\n$1\n\\end{obs}');

	editbox.value =	  '\\newtheorem{teo}{Teorema}[chapter]\n'
			+ '\\newtheorem{lema}[teo]{Lema}\n'
			+ '\\newtheorem{prop}[teo]{Proposição}\n'
			+ '\\newtheorem{cor}[teo]{Corolário}\n\n'

			+ '\\theoremstyle{definition}\n'
			+ '\\newtheorem{defi}[teo]{Definição}\n'
			+ '\\newtheorem{ex}[teo]{Exemplo}\n'
			+ '\\newtheorem{exer}[teo]{Exercício}\n\n'

			+ '\\theoremstyle{remark}\n'
			+ '\\newtheorem{obs}[teo]{Observação}\n\n'
			+ '\\begin{document}\n\n'
			+ editbox.value;
			+ '\\end{document}'

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