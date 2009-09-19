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
	regexTool('• Wiki -> LaTeX','wiki2latex()');
	regexTool('• LaTeX -> Wiki (TESTE!)','latex2wiki()');

	regexTool('Criar AutoNav','cria_autonav()');
	regexTool('Formatar cabeçalhos','format_cab()');
	regexTool('Formatar predefinições','format_predef()');
	regexTool('Formatar categorias','format_cat()');
	regexTool('Formatar listas','format_list()');
	regexTool('Usar links relativos','abs2rel()');
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
	abs2rel();
	format_links();
	format_math();
	usando_regex();
	format_cab();doaction('diff');
}

function latex2wiki() {
	//http://code.google.com/p/latex2wiki/source/browse/trunk/latex2wiki.py
	var text = editbox.value;
	tr_list2 = [
		[/\$\$?([^$]*?)\$?\$/im, "<math>\1</math>", null],
		[/\\footnote{(.*?)}/, "<ref>\1</ref>", null]
	];
	for (regra in tr_list2){
alert(regra);
alert(regra[0]);
alert(regra[1]);
alert(regra[2]);
		var p = re.compile(reg);
		if (p.test(text)){
			if (fun) fun();
		}
		text = text.replace(p, sub);
	}
	editbox.value = text;
}

function wiki2latex() {
	var preambulo =	'\\documentclass[12pt,a4paper,titlepage]{book}\n' +
			'\\usepackage[latin1]{inputenc}\n' +
			'\\usepackage[brazil]{babel}\n' +
			'\\usepackage{amsthm, amssymb, amsmath}\n' +
			'\\usepackage[a4paper=true,pagebackref=true]{hyperref}\n';

	if (regsearch(/<!--(.|\s)*?-->/)){
		preambulo += '\\usepackage{verbatim}\n';
		regex(/<!--(.|\s)*?-->/g,'\\begin{comment}\n$1\n\\end{comment}');
	}

	preambulo +=	'\n\\newtheorem{teo}{Teorema}[chapter]\n' +
			'\\newtheorem{lema}[teo]{Lema}\n' +
			'\\newtheorem{prop}[teo]{Proposição}\n' +
			'\\newtheorem{cor}[teo]{Corolário}\n\n' +
			'\\hypersetup{\n' +
			'		colorlinks = true,\n' +
			'		linkcolor = blue,\n' +
			'		anchorcolor = red,\n' +
			'		citecolor = blue,\n' +
			'		filecolor = red,\n' +
			'		urlcolor = red\n' +
			'}\n' +
			'\\theoremstyle{definition}\n' +
			'\\newtheorem{defi}[teo]{Definição}\n' +
			'\\newtheorem{ex}[teo]{Exemplo}\n' +
			'\\newtheorem{exer}[teo]{Exercício}\n\n' +
			'\\theoremstyle{remark}\n' +
			'\\newtheorem{obs}[teo]{Observação}\n\n';

	var url1	 = 'http://';
	var url2	 = '.org/wiki/Special:Search/';
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
	regex(/<\/?noinclude>/ig,'');

	regex(/([\.,;:!\?])<\/math> */mig,'</math>$1 '); // coloca a pontuação que vem depois de fórmulas fora das tags <math>
	regex(/<\/?math>/ig,'$');

	regex(/<ref.*?>(.*?)<\/ref.*?>/ig,'\\footnote{$1}'); //notas de rodapé
	regex(/(?:\n*(?:=+)\s*Notas\s*(?:=+)\n*)?\n*<references\/>\n*