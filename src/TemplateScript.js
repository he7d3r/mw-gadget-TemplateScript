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
	regexTool('• LaTeX -> Wiki','math_conversion(0)');

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

/** Latex2wiki **
 * Este script é uma adaptação para JavaScript:
 * (1) Do código de Marc PoulhiÃ¨s <marc.poulhies@epfl.ch>, que era baseado na
 * ideia original de Maxime Biais <maxime@biais.org>;
 * (2) Do código escrito por [[w:en:User:Jmath666]] com a ajuda de
 * [[User:Oleg Alexandrov]]
 * 
 * Scripts originais:
 * http://code.google.com/p/latex2wiki/source/browse/trunk/latex2wiki.py
 * http://www-math.cudenver.edu/~jmandel/latex2wiki/latex2wiki.pl
 * [[w:en:User:Jmath666/latex2wiki.pl]]
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

function math_conversion(dir) {

	var text = editbox.value;
	var regex = 0, subst = 1, func = 2;
	var command = [//(dir == 0) -> latex2wiki; (dir == 1) -> wiki2latex
		[//marcação de fórmulas
			[/(\$\$?)\s*([^$]*?)\s*\1/img, '<math>$2</math>', null],
			[/<\/?math>/ig, '$', null]
		],
		[//notas de rodapé
			[/\\footnote{(.*?)}/g, '<ref>$1</ref>', null],
			[/<ref.*?>(.*?)<\/ref.*?>/ig, '\\footnote{$1}', null]
		]
		];
	for (i=0; i<command.length; i++){
		if (!command[i][dir][regex]) continue;
		if (command[i][dir][regex].test(text)){
			if (command[i][dir][func]) command[i][dir][func]();
			text = text.replace(command[i][dir][regex], command[i][dir][subst]);
		}
	}
	editbox.value = text;
	if (0 == dir)
		setreason('Convertendo de LaTeX para Wiki, [usando [[meta:User:Pathoschild/Scripts/Regex menu framework|regex]]]', 'append')
	else
		setreason('Criando versão latex [usando [[meta:User:Pathoschild/Scripts/Regex menu framework|regex]]] (não era para salvar: REVERTA ESTA EDIÇÃO!)', 'append');
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
	regex(/(?:\n*(?:=+)\s*Notas\s*(?:=+)\n*)?\n*<references\/>\n*/ig,'');

	regex(/\n*^(====)\s*(.*?)\s*\1\s*/mig,'\n\n\\subsubsubsection{$2}\n\n'); //cabeçalhos
	regex(/\n*^(===)\s*(.*?)\s*\1\s*/mig,'\n\n\\subsubsection{$2}\n\n');
	regex(/\n*^(==)\s*(.*?)\s*\1\s*/mig,'\n\n\\subsection{$2}\n\n');

	regex(/{{\s*(?:Âncoras?)\|([^}]+)}}/ig,'\\label{$1}');
	regex(/\[\[\s*(?:w)\s*:\s*([^\|\]]+?)\s*?\|\s*([^\]]*?)\s*\]\]/ig,'\\href{' + url1 + w + url2 + '$1}{$2}');
	regex(/{{\s*(?:w)\s*\|\s*([^\|}]+?)\s*?\|\s*([^}]*?)\s*}}/ig,'\\href{' + url1 + w + url2 + '$1}{$2}');
	regex(/{{\s*(?:w)\s*\|\s*([^\|}]+?)\s*}}/ig,'\\href{' + url1 + w + url2 + '$1}{$1}');

	regex(/{{\s*(?:Definição)\|([^}]+)}}/ig,'\\begin{def}\n$1\n\\end{def}'); //predefinições matemáticas
	regex(/{{\s*(?:Teorema)\|([^}]+)}}/ig,'\\begin{teo}\n$1\n\\end{teo}');
	regex(/{{\s*(?:Demonstração)\|([^}]+)}}/ig,'\\begin{proof}\n$1\n\\end{proof}');
	regex(/{{\s*(?:Lema)\|([^}]+)}}/ig,'\\begin{lema}\n$1\n\\end{lema}');
	regex(/{{\s*(?:Proposição)\|([^}]+)}}/ig,'\\begin{prop}\n$1\n\\end{prop}');
	regex(/{{\s*(?:Corolário)\|([^}]+)}}/ig,'\\begin{cor}\n$1\n\\end{cor}');
	regex(/{{\s*(?:Exemplo)\|([^}]+)}}/ig,'\\begin{ex}\n$1\n\\end{ex}');
	regex(/{{\s*(?:Exercício)\|([^}]+)}}/ig,'\\begin{exer}\n$1\n\\end{exer}');
	regex(/{{\s*(?:Observação)\|([^}]+)}}/ig,'\\begin{obs}\n$1\n\\end{obs}');

	regex(/:\n+#\s*/ig,':\n\\begin{enumerate}\n\\item ');
	regex(/\n#\s*/ig,'\n\\item ');

//	regex(//ig,'\\begin{enumerate}\n');
//	regex(//ig,'\\begin{itemize}\n');
//	regex(/* /ig,'\\item ');
//	regex(/# /ig,'\\item ');
//	regex(//ig,'\\end{enumerate}\n');
//	regex(//ig,'\\end{itemize}\n');

	editbox.value =	preambulo +
			'\\begin{document}\n\n' +
			'\\section{' + wgTitle + '}\n\n' +
			editbox.value +
			'\n\n\\end{document}';

	setreason('criando versão latex [usando [[meta:User:Pathoschild/Scripts/Regex menu framework|regex]]] (não era para salvar: REVERTA ESTA EDIÇÃO!)', 'append');
}

function cria_autonav() {
	var lista = editbox.value.split('\n');
	var anterior = new Array();
	var posterior = new Array();

	anterior[0] = lista[0];
	posterior[lista.length-1] = lista[lista.length-1];

	for (i=1;i<lista.length-1;i++){
		anterior[i]	= lista[i] + '=[[' + lista[i-1] + ']]';
		posterior[i] = lista[i] + '=[[' + lista[i+1] + ']]';
	}

	editbox.value = lista.join('\n') + '\n\n' + anterior.join('\n') + '\n\n' + posterior.join('\n');
}

function format_cab() {
	var antigo = editbox.value;

	// +quebra de linha antes de =, -espaços entre = e o título da seção
	regex(/\n*^(=+)\s*(.*?)\s*\1\s*/mig, '\n\n$1 $2 $1\n');

	// -quebras de linha entre cabeçalhos consecutivos
	regex(/=\n+=/ig, '=\n=');

	if (editbox.value != antigo)
		setreason('format. cabeçalhos', 'append');
}

function format_predef() {
	var antigo = editbox.value;
	
	regex(/{{\s*(?:msg:|template:)?([^}]+)}}/ig, '{{$1}}');

	if (editbox.value != antigo)
		setreason('format. predefs', 'append');
}

function format_cat() {
	var antigo = editbox.value;
	
	regex(/\[\[\s*(?:category|categoria)\s*:\s*([^\|\]]+)(?:\s*(\|)([^\]]*))?\s*\]\]/ig, '[[Categoria:$1$2$3]]');

	if (editbox.value != antigo)
		setreason('format. categorias', 'append');
}

function format_list() {
	var antigo = editbox.value;
	
	//Deixa apenas 1 espaço entre *, # ou : e o texto da lista
	regex(/^([*#:]+)\s*/mig, '$1 ');

	if (editbox.value != antigo)
		setreason('format. listas', 'append');
}

function abs2rel() {
if (wgPageName == wgBookName){
	//troca underscores por espaços
	var nome = wgBookName.replace(/_/g,' ');
		
	// [[Livro/Cap|Cap]] -> [[/Cap/]]
		regex(RegExp('\\[\\[\\s*' + nome + '\\/([^\\|\\]]+?)\\s*\\|\\s*\\1\\s*\\]\\]','ig'), '[[/$1/]]');
	}
}

function format_links() {
	var antigo = editbox.value;
	var padrao;

	// -espaços redundantes
	regex(/\[\[\s*([^\|\]]+?)\s*(?:(\|)\s*([^\]]+?)\s*)?\]\]/ig, '[[$1$2$3]]');

	// texto exibido redundante:
	//* [[Texto|Texto]]	-> [[Texto]]
	//* [[/Texto|Texto]] -> [[/Texto/]]
	regex(/\[\[([^\|\]]+?)\s*\|\s*\1\]\]/ig, '[[$1]]');
	regex(/\[\[\s*\/\s*([^\|\]]+?)\s*\|\s*\1\s*\]\]/ig,'[[/$1/]]');
	
	// troca de underscores por espaços nas ligações
	regex(/\[\[([^\|\]]+?)_/ig, '[[$1 ', 5);

	//tradução das ligações internas para o domínio "Wikilivros"
	regex(/\[\[(?:Wikibooks|Project)( Discussão)?:/ig, '[[Wikilivros$1:');
	regex(/\[\[(?:Wikibooks|Project) Talk:/ig, '[[Wikilivros Discussão:');
	regex(/\[http:\/\/pt.wikibooks.org\/w\/index.php\?title=Wikibooks/ig, '[http://pt.wikibooks.org/w/index.php?title=Wikilivros');

	//tradução das ligações para imagens
	regex(/\[\[Image( Discussão)?:/ig, '[[Imagem$1:');
	regex(/\[\[Image Talk:/ig, '[[Imagem Discussão:');

	//tradução das ligações para arquivos
	regex(/\[\[File( Discussão)?:/ig,'[[Arquivo$1:');
	regex(/\[\[File Talk:/ig, '[[Arquivo Discussão:');

	if (editbox.value != antigo)
		setreason('formatação dos links', 'append');
}

function format_math() {
	var antigo = editbox.value;
	
	// coloca a pontuação que vem depois de fórmulas dentro das tags <math>
	regex(/<\/math>\s*([\.,;:!\?]) */mig, '$1</math> ');

	if (editbox.value != antigo)
		setreason('format. <math> e pontuação', 'append');
}

function usando_regex() {
	setreason('[usando [[meta:User:Pathoschild/Scripts/Regex menu framework|regex]]]', 'append');
}