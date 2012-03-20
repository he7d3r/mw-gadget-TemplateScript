/**
 * Regex menu framework
 * Adds a sidebar menu of user-defined scripts
 * @author: [[m:user:Pathoschild]] ([[meta:User:Pathoschild/Scripts/Regex menu framework]])
 * @author: [[User:Helder.wiki]] (this configuration file)
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/Regex menu framework.js]] ([[File:User:Helder.wiki/Tools/Regex menu framework.js]])
 */
/*global jQuery, mediaWiki, regexTool, editbox, regex, setreason, doaction, setoptions, regsearch, lc */
/*jslint browser: true, white: true, devel: true, regexp: true, continue: true, plusplus: true */
( function ( $, mw /* , undefined */ ) {
'use strict';

mw.loader.load( '//meta.wikimedia.org/w/index.php?title=User:Pathoschild/Scripts/Regex_menu_framework.js&action=raw&ctype=text/javascript&smaxage=21600&maxage=86400' );

var	nomeLivro = mw.config.get( 'wgPageName' ).replace(/_/g,' '),
	//Maiúsculas e minúsculas usadas em português
	LETRA = 'A-Za-zÁÀÂÃÇÉÊÍÓÒÔÕÚáàâãçéêíóòôõú',
	dictionaries = 'Wikisource:Modernização/Dicionário/pt-PT|Wikisource:Modernização/Dicionário/pt-BR';

/* menu links */
// In the function below, add more lines like "regexTool('link text','function_name()')" to add
// links to the sidebar menu. The function name is the function defined in rfmscripts() below.
window.rmflinks = function () {
	$('#p-regex').addClass( 'expanded' ).removeClass( 'collapsed' ).find( 'div.body' ).show();
	regexTool('REGEX','custom()'); // Uma ferramenta padrão que executa regex em um formulário dinâmico
	regexTool('Editar Regexes','editRegexes()');
	regexTool('Corrige assinatura','corrige_assinatura()');
	regexTool('Remover "\\,\\!" das fórmulas','removeMathHack()');
	regexTool('Corrige links HTTP','fixHTTPLinks()');
	regexTool('Corrige def\'s (;:)','fixDefList()');
	switch( mw.config.get( 'wgDBname' ) ) {
	case 'ptwiki':
		regexTool('Usar "Ver também,..."','fixObsoleteTemplates()');
		break;
	case 'ptwikisource':
		regexTool('Corrigir OCR', 'corrigir_ocr()');
		break;
	case 'ptwikibooks':
		regexTool('Formatação geral','format_geral()');
		regexTool('Wiki -> LaTeX','wiki2latex()');
		regexTool('LaTeX -> Wiki','latex2wiki()');
		regexTool('Remover linhas duplicadas','dedupe_list(editbox.value)');
		regexTool('Formatar cabeçalhos','format_cab()');
		regexTool('Formatar predefinições','format_predef()');
		regexTool('Formatar categorias','format_cat()');
		regexTool('Formatar listas','format_list()');
		regexTool('Usar links relativos','abs2rel()');
		regexTool('Formatar links','format_links()');
		regexTool('Formatar tags <math>','format_math()');
		regexTool('Gerar lista de capítulos','geraPredef()');
		regexTool('Gerar coleção','geraCol()');
		regexTool('Gerar versão para impressão','geraImpr()');
		regexTool('Gravar lista de capítulos (CUIDADO!)','grava_lista_cap()');
		regexTool('TEST: Criar AutoNav','cria_autonav()');
		regexTool('TEST: Refs do Google Books','converte_refs()');
		break;
	default:
		
	}
	if( 'pt' === mw.config.get( 'wgContentLanguage' ) ) {
		regexTool('Corrige [[Ficheiro','fixImageLinks()');
	}
	regexTool('Regex no sumário','usando_regex()');

};
window.editRegexes = function () {
	window.open( '//pt.wikibooks.org/wiki/User:Helder.wiki/Tools/Regex_menu_framework.js?action=edit' );
};
window.fixObsoleteTemplates = function (){
	var oldText = editbox.value;

	//[[w:Especial:Páginas afluentes/Predefinição:Ver também]]
	regex( /\n==\s*\{\{(?:V(?:eja|er|ide)[_ ](?:tamb[ée]m|mais)|(?:Tópico|Artigo|Página|Assunto)s[_ ]relacionad[oa]s|Li(?:gaçõe|nk)s[_ ]Intern[ao]s)\}\}\s*==/gi, '\n== Ver também ==' );

	//[[w:Especial:Páginas afluentes/Predefinição:Bibliografia]]
	regex( /\n==\s*\{\{Bibliografia\}\}\s*==/gi, '\n== Bibliografia ==' );

	//[[w:Especial:Páginas afluentes/Predefinição:Ligações externas]]
	regex( /\n==\s*\{\{(?:(?:Apontadores|Atalhos?|Elos?|Enlaces?|Lin(?:k|que)s?|Vínculos?)(?: externos?)?|(?:Ligaç(?:ão|ões)|Páginas?|Referências?)(?: externas?)?|(?:Ligaç(?:ão|ões)|Links||)(?: para o exterior| exterior(?:es)?(?: [àa] Wikip[ée]dia)?)?|S(?:ites|[íi]tios)|LE|Links? relacionados?|Páginas? da Internet|Weblinks?)\}\}\s*==/gi, '\n== Ligações externas ==' );

	if (editbox.value !== oldText) {
		setreason( '-[[Project:Esplanada/propostas/Parar de usar Ver também e Ligações externas (16dez2011)|predef\'s obsoletas]]', 'appendonce');
		doaction('diff');
	}
};

window.removeMathHack = function (){
	var	reHack, reason,
		oldText = editbox.value;
	reHack = /\s*(?:\\,\\!|\\!\\,|\\,)\s*<(\/)math>|<math>\s*(?:\\,\\!|\\!\\,|\\,)\s*/g;
	reason = {
		'pt': 'hack obsoleto: [[mw:MediaWiki 1.19|as fórmulas já aparecem em PNG]] e [[rev:104498|não há mais como exibi-las em HTML nem MathML]] (futuramente [[bugzilla:31406|teremos MathJax]])',
		'en': 'obsolete hack: [[mw:MediaWiki 1.19|formulae are rendered as PNG by default]] and [[rev:104498|HTML or MathML options were removed]] (in the future [[bugzilla:31406|there will be MathJax]])'
	};
	regex( reHack, '<$1math>' );
	if (editbox.value !== oldText) {
		setreason( reason[mw.config.get('wgContentLanguage')] || reason.en, 'appendonce');
		doaction('diff');
	}
};

window.fixDefList = function (){
	var oldText = editbox.value;

	regex( /\s*\n;([^\n]+)\n([^:])/g, '\n;$1\n:$2' );
	if (editbox.value !== oldText) {
		setreason( '+semântica na lista de definições (;:)', 'appendonce');
		doaction('diff');
	}
};

window.fixImageLinks = function (){
	var	oldText = editbox.value,
		reOtherNames = /\[\[\s*(?:[Ii]mage|[Aa]rquivo|[Ff]i(?:cheiro|le))\s*:\s*([^|\]]+\.(?:[Pp][Nn][Gg]|[Jj][Pp][Ee]?[Gg]|[Ss][Vv][Gg]|[Gg][Ii][Ff]|[Tt][Ii][Ff]{1,2}))\s*(\||\]\])/g;
	regex( reOtherNames, '[[Imagem:$1$2' );
	if (editbox.value !== oldText) {
		setreason(
			'Uso de "[Imagem:" ([[' +
				(mw.config.get( 'wgDBname' ) === 'ptwiki'? '' : 'w:') +
			'Project:Esplanada/propostas/Incentivar o uso de "Imagem" em vez de "Arquivo" ou "Ficheiro" (12mar2011)|detalhes]])',
			'appendonce'
		);
	}
};

window.fixHTTPLinks = function (){
	var	oldText = editbox.value,
		// TODO: Converter links do servidor antigo (https://secure.wikimedia.org/wikipedia/pt)
		// Ver também: [[Special:SiteMatrix]], [[meta:User:Nemo bis/HTTPS]]
		reOldLink = /\[https?:(\/\/(?:(?:commons|meta|outreach|species|strategy|wikimania\d{4}|[a-z]{2,3})\.wikimedia|(?:wiki\.)?toolserver|www\.mediawiki|wikimediafoundation|wikisource).+?|\/\/(?:(?:[a-z]{2,3}|bat-smg|be-x-old|cbk-zam|fiu-vro|map-bms|minnan|nds-nl|roa-rup|roa-tara|simple|zh-(?:cfr|classical|min-nan|yue))\.(?:wiki(?:pedia|books|news|quote|source|versity)|wiktionary)).+?)\]/g,
		relativeLink = '[$1]';
	regex( reOldLink, relativeLink );
	regex( /https:\/\/secure\.wikimedia\.org\/(wiki(?:pedia|books|news|quote|source|versity)|wiktionary)\/([a-z]{2,3}|meta)/g, '//$2.$1.org' );
	if (editbox.value !== oldText) {
		setreason('[[wmfblog:2011/10/03/native-https-support-enabled-for-all-wikimedia-foundation-wikis|Links relativos ao protocolo]], pois todas as wikis podem ser acessadas via https', 'appendonce');
		setoptions( 'true' /* = minor */ );
		doaction('diff');
	}
};

window.corrige_assinatura = function (){
	var	proj = ( mw.config.get( 'wgServer' ).indexOf('wikibooks') > -1) ? '' : 'b:',
		lang = ( 'pt' === mw.config.get( 'wgContentLanguage' ) ) ? '' : 'pt:',
		oldText = editbox.value, reOldSign, newSign;

	if ( !proj && lang ) { proj = ':'; }
	reOldSign = window.reOldSign;
	newSign = '[[' + proj + lang + 'User:Helder.wiki|Helder]]';
	regex( reOldSign, newSign );
	if (editbox.value !== oldText) {
		setreason('Fixing links (my user account was renamed)', 'appendonce');
		setoptions( 'true' /* = minor */ );
		doaction('diff');
	}
};

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

window.math_conversion = function (){
	var	text = editbox.value,
		regex = 0, subst = 1, func = 2,
		command, i, dir;
	command = [//(dir == 0) -> latex2wiki; (dir == 1) -> wiki2latex
		[//fórmulas dentro dos parágrafos
			[/\$\s*([^$]*?)\s*\$/img, '<math>$1</math>', null],
			[/<\/?math>/ig, '$', null]
		],
		[//fórmulas em parágrafos isolados
			[/\s*\$\$\s*([^$]*?)\s*\$\$\s*/img, '\n\n: <math>$1</math>\n\n', null],
			[null, null, null]
		],
		[//notas de rodapé
			[/\\footnote\{(.*?)\}/g, '<ref>$1</ref>', null],
			[/<ref.*?>(.*?)<\/ref.*?>/ig, '\\footnote{$1}', null]
		]
		];
	for (i=0; i<command.length; i++){
		if (!command[i][dir][regex]) { continue; }
		if (command[i][dir][regex].test(text)){
			if (command[i][dir][func]) {command[i][dir][func]();}
			text = text.replace(command[i][dir][regex], command[i][dir][subst]);
		}
	}
	editbox.value = text;
	if (0 === dir) {
		setreason('Convertendo de LaTeX para Wiki, [usando [[m:User:Pathoschild/Scripts/Regex menu framework|regex]]]', 'appendonce');
	} else {
		setreason('Criando versão latex [usando [[m:User:Pathoschild/Scripts/Regex menu framework|regex]]] (não era para salvar: REVERTA ESTA EDIÇÃO!)', 'appendonce');
	}
};

window.latex2wiki = function (){
	var	top = '{' + '{AutoNav}' + '}\n',
		bottom =	'\n== Notas ==\n' +
			'<references group="nota "/>\n' +
			'\n== Referências ==\n' +
			'<references/>\n' +
			'{' + '{AutoCat}' + '}';

	regex(/\$\s*([^$]*?)\s*\$/img, '<math>$1</math>');
	regex(/\s*\$\$\s*([^$]*?)\s*\$\$\s*/img, '\n\n{' + '{Fórmula|<math>$1</math>}' + '}\n\n');
	regex(/<\/math>([\.,;:!\?]) */mig, '$1</math> ');

	regex(/\\footnote\{([^}]+?)%?\\label\{[^}]+?\}\s*\}/g, '<ref name="$2">$1</ref>');
	regex(/\\footnote\{(.*?)\}/g, '<ref>$1</ref>');

	regex(/\n*\\chapter\{([^}\n]+)\}\n*/gm, '\n\n= $1 =\n\n');
	regex(/\n*\\section\{([^}\n]+)\}\n*/gm, '\n\n== $1 ==\n\n');
	regex(/\n*\\subsection\{([^}\n]+)\}\n*/gm, '\n\n=== $1 ===\n\n');
	regex(/\n*\\subsubsection\{([^}\n]+)\}\n*/gm, '\n\n==== $1 ====\n\n');

	regex(/\n*\\begin\{defi\}%?(?:\\label\{defi:[^}]+?\})?\s*/gm, '\n{'+'{Definição\n|');
	regex(/\n*\\begin\{teo\}%?(?:\\label\{teo:[^}]+?\})?\s*/gm, '\n{'+'{Teorema\n|');
	regex(/\n*\\begin\{proof\}%?(?:\\label\{proof:[^}]+?\})?\s*/gm, '\n{'+'{Demonstração\n|');
	regex(/\n*\\begin\{lema\}%?(?:\\label\{lema:[^}]+?\})?\s*/gm, '\n{'+'{Lema\n|');
	regex(/\n*\\begin\{prop\}%?(?:\\label\{prop:[^}]+?\})?\s*/gm, '\n{'+'{Proposição\n|');
	regex(/\n*\\begin\{cor\}%?(?:\\label\{cor:[^}]+?\})?\s*/gm, '\n{'+'{Corolário\n|');
	regex(/\n*\\begin\{ex\}%?(?:\\label\{ex:[^}]+?\})?\s*/gm, '\n{'+'{Exemplo\n|');
	regex(/\n*\\begin\{exer\}%?(?:\\label\{exer:[^}]+?\})?\s*/gm, '\n{'+'{Exercício\n|');
	regex(/\n*\\begin\{obs\}%?(?:\\label\{obs:[^}]+?\})?\s*/gm, '\n{'+'{Observação\n|');
	regex(/\n*\\end\{(?:defi|teo|proof|lema|prop|cor|ex|exer|obs)\}\s*/gm, '\n}}\n\n');

	regex(/\n?\\end\{(?:enumerate|itemize)\}\n?/gm, '\n');


	regex(/^\s*\\item\s+/gm, '* ');

	editbox.value =	top + editbox.value + bottom;

	setreason('Convertendo de LaTeX para Wiki, [usando [[m:User:Pathoschild/Scripts/Regex menu framework|regex]]]', 'appendonce');
};

window.wiki2latex = function (){
	var	preambulo, reWikiLink,
		WikiLink = '',
		url = mw.config.get( 'wgServer' ) + '/wiki/Special:Search/';
	preambulo =	'\\documentclass[12pt,a4paper,titlepage]{book}\n' +
			'\\usepackage[brazil]{babel}\n' +
			'\\usepackage[utf8]{inputenc}%[latin1] no Windows\n' +
			'\\usepackage[T1]{fontenc}\n' +
			'\\usepackage{amsthm, amssymb, amsmath}\n' +
			'\\usepackage{footmisc}\n';

	if (regsearch(/<!--(.|\s)*?-->/)){
		preambulo +=	'\\usepackage{verbatim}' +
				' %permite usar \\begin{comment}...\\end{comment} para comentar varias linhas\n';
		regex(/<!--(.|\s)*?-->/g,'\\begin{comment}\n$1\n\\end{comment}');
	}

	preambulo +=	"\\usepackage[a4paper=true,pagebackref=true]{hyperref}\n\n" +
			"\\hypersetup{\n" +
			"		pdftitle = {" + mw.config.get( 'wgBookName' ) + "},\n" +
			"		pdfauthor = {Colaboradores do Wikilivros},\n" +
			"		pdfcreator = {" + mw.user.name() + "},\n" +
			"		pdfsubject = {},\n" +
			"		pdfkeywords = {wiki, livro, wikilivro, Wikilivros},\n" +
			"		colorlinks = true,\n" +
			"		linkcolor = blue,\n" +
			"		anchorcolor = red,\n" +
			"		citecolor = blue,\n" +
			"		filecolor = red,\n" +
			"		urlcolor = blue\n" +
			"}\n\n" +
			"\\newtheorem{teo}{Teorema}[chapter]\n" +
			"\\newtheorem{lema}[teo]{Lema}\n" +
			"\\newtheorem{prop}[teo]{Proposi\\c{c}{\\~a}o}\n" +
			"\\newtheorem{cor}[teo]{Corol{\\'a}rio}\n\n" +
			"\\theoremstyle{definition}\n" +
			"\\newtheorem{defi}[teo]{Defini\\c{c}{\\~a}o}\n" +
			"\\newtheorem{ex}[teo]{Exemplo}\n" +
			"\\newtheorem{exer}[teo]{Exerc{\\'i}cio}\n\n" +
			"\\theoremstyle{remark}\n" +
			"\\newtheorem{obs}[teo]{Observa\\c{c}{\\~a}o}\n" +
			"\\newtheorem*{conv}{Conven\\c{c}{\\~a}o}\n\n" +
			"\\newtheorem*{res}{Resolu\\c{c}{\\~a}o}" +
			"\\newtheorem*{tarefa}{Tarefa}" +
			"\\makeindex\n\n";

/*	var w = 'pt.wikipedia';
	var wikiprojeto = {
	'b':		'pt.wikibooks',
	'n':		'pt.wikinews',
	'q':		'pt.wikiquote',
	's':		'pt.wikisource',
	'v':		'pt.wikiversity',
	'm':		'meta.wikimedia',
	'meta':		'meta.wikimedia',
	'commons':	'commons.wikimedia',
	'wmf':		'wikimediafoundation',
	'species':	'wikispecies.wikimedia'
	}
*/
	regex(/\{\{Auto(Cat|Nav)\}\}/ig,''); //Comandos wiki que são descartados
	regex(/<\/?noinclude>/ig,'');
	regex(/^(=+)\s*(?:Notas|Referências)\s*\1$/mig,'');
	regex(/^\s*<references(?:\s*group\s*=\s*"[^"]*")?\/>\s*$/mig,'');

	regex(/([\.,;:!\?])<\/math> */mig,'</math>$1 '); // coloca a pontuação que vem depois de fórmulas fora das tags <math>
	regex(/<\/?math>/ig,'$');

	regex(/<ref.*?(?:name\s*=\s*"([^"]+)").*?>(.*?)<\/ref.*?>/ig,'\\footnote{$2\\label{nota:$1}}'); //notas de rodapé
	regex(/<ref.*?>(.*?)<\/ref.*?>/ig,'\\footnote{$1%\\label{nota:}\n}');

	//cabeçalhos
	regex(/^====([^\n]+)====\s*$/mg,'\n\n\\subsubsection{$1}\n\n');
	regex(/^===([^\n]+)===\s*$/mg,'\n\n\\subsection{$1}\n\n');
	regex(/^==([^\n]+)==\s*$/mg,'\n\n\\section{$1}\n\n');
	regex(/^=([^\n]+)=\s*$/mg,'\n\n\n\\chapter{$1}\\label{cap:$1}\n\n\n');


	regex(/\{\{\s*(?:Definição)\|([^}]+)\}\}/ig,'\\begin{defi}%\\label{defi:}\n$1\n\\end{defi}'); //predefinições matemáticas
	regex(/\{\{\s*(?:Teorema)\|([^}]+)\}\}/ig,'\\begin{teo}%\\label{teo:}\n$1\n\\end{teo}');
	regex(/\{\{\s*(?:Demonstração)\|([^}]+)\}\}/ig,'\\begin{proof}\n$1\n\\end{proof}');
	regex(/\{\{\s*(?:Lema)\|([^}]+)\}\}/ig,'\\begin{lema}%\\label{lema:}\n$1\n\\end{lema}');
	regex(/\{\{\s*(?:Proposição)\|([^}]+)\}\}/ig,'\\begin{prop}%\\label{prop:}\n$1\n\\end{prop}');
	regex(/\{\{\s*(?:Corolário)\|([^}]+)\}\}/ig,'\\begin{cor}%\\label{cor:}\n$1\n\\end{cor}');
	regex(/\{\{\s*(?:Exemplo)\|([^}]+)\}\}/ig,'\\begin{ex}%\\label{ex:}\n$1\n\\end{ex}');
	regex(/\{\{\s*(?:Exercício)\|([^}]+)\}\}/ig,'\\begin{exer}%\\label{exer:}\n$1\n\\end{exer}');
	regex(/\{\{\s*(?:Observação)\|([^}]+)\}\}/ig,'\\begin{obs}%\\label{obs:}\n$1\n\\end{obs}');
	regex(/\{\{Fórmula\|([\d.]+)\|([^\n]+)\}\}\n/igm,'\\begin{equation}\\label{eq:$1}\n$2\n\\end{equation}\n');
	regex(/\{\{Fórmula\|([^\n]+)\}\}\n/igm,'\\begin{equation}\\label{eq:???}\n$1\n\\end{equation}\n');

	regex(/\{\{\s*(?:Âncoras?)\|([^}]+)\}\}/ig,'\\label{$1}'); //links internos e externos

	reWikiLink = /\[\[\s*([a-zA-Z:]+)\s*:\s*([^\|\]]+?)\s*?\|\s*([^\]]*?)\s*\]\]/i;
	WikiLink = reWikiLink.exec(editbox.value);
	while( WikiLink ){//[[proj:idioma:alvo|texto]]
		WikiLink[2] = encodeURI(WikiLink[2]).replace(/(%|#)/g,'\\$1');
		editbox.value=editbox.value.replace(reWikiLink, '\\href{' + url + '$1:' + WikiLink[2] + '}{$3}');
		WikiLink = reWikiLink.exec(editbox.value);
	}
	reWikiLink = /\{\{\s*(w|wikt)\s*\|\s*([^\|}]+?)\s*?\|\s*([^}]*?)\s*\}\}/i;
	WikiLink = reWikiLink.exec(editbox.value);
	while( WikiLink ){//{{proj|alvo|texto}}
		WikiLink[2] = encodeURI(WikiLink[2]).replace(/(%|#)/g,'\\$1');
		editbox.value=editbox.value.replace(reWikiLink, '\\href{' + url + '$1:' + WikiLink[2] + '}{$3}');
		WikiLink = reWikiLink.exec(editbox.value);
	}
	reWikiLink = /\{\{\s*(w|wikt)\s*\|\s*([^\|}]+?)\s*\}\}/i;
	WikiLink = reWikiLink.exec(editbox.value);
	while( WikiLink ){//{{proj|alvo}}
		WikiLink[2] = encodeURI(WikiLink[2]).replace(/(%|#)/g,'\\$1');
		editbox.value=editbox.value.replace(reWikiLink, '\\href{' + url + '$1:' + WikiLink[2] + '}{$2}');
		WikiLink = reWikiLink.exec(editbox.value);
	}
	regex(/\[\[(?:\.\.\/[^#]+)?#Definição ([^\]]+)\|([^\]]+)\]\]/ig,'\\hyperref[defi:$1]{$2}');
	regex(/\[\[(?:\.\.\/[^#]+)?#Proposição ([^\]]+)\|([^\]]+)\]\]/ig,'\\hyperref[prop:$1]{$2}');
	regex(/\[\[(?:\.\.\/[^#]+)?#Lema ([^\]]+)\|([^\]]+)\]\]/ig,'\\hyperref[lema:$1]{$2}');
	regex(/\[\[(?:\.\.\/[^#]+)?#Teorema ([^\]]+)\|([^\]]+)\]\]/ig,'\\hyperref[teo:$1]{$2}');
	regex(/\[\[(?:\.\.\/[^#]+)?#Corolário ([^\]]+)\|([^\]]+)\]\]/ig,'\\hyperref[cor:$1]{$2}');
	regex(/\[\[(?:\.\.\/[^#]+)?#Exemplo ([^\]]+)\|([^\]]+)\]\]/ig,'\\hyperref[ex:$1]{$2}');
	regex(/\[\[(?:\.\.\/[^#]+)?#Exercício ([^\]]+)\|([^\]]+)\]\]/ig,'\\hyperref[exer:$1]{$2}');
	regex(/\[\[(?:\.\.\/[^#]+)?#(?:Obs\.|Observação)? ([^\]]+)\|([^\]]+)\]\]/ig,'\\hyperref[obs:$1]{$2}');

	regex(/:\n+#\s*/ig,':\n\\begin{enumerate}\n\\item ');
	regex(/\n(?:\*|#)\s*/ig,'\n\\item ');

//	regex(//ig,'\\begin{enumerate}\n');
//	regex(//ig,'\\begin{itemize}\n');
//	regex(/\* /ig,'\\item ');
//	regex(/# /ig,'\\item ');
//	regex(//ig,'\\end{enumerate}\n');
//	regex(//ig,'\\end{itemize}\n');
	regex(/\n*(\\(?:sub){0,2}section[^\n]+)\n*/ig,'\n\n$1\n');
	regex(/\n*(\\chapter[^\n]+)\n*/ig,'\n\n\n$1\n\n');
	regex(/"([^"]+)"/ig,"``$1''");//Aspas

	editbox.value =	preambulo +
		'\\begin{document}\n\n' +
		'\\frontmatter\n\n' +
		'\\tableofcontents\n\n' +
		'\\mainmatter %Depois de índice e prefácio\n\n' +
		'\\chapter{' + mw.config.get( 'wgTitle' ) + '}\\label{cap:'
			+ mw.config.get( 'wgTitle' ).toLowerCase() + '}\n\n\n' +
		editbox.value +
		'\n\n\\backmatter\n\n' +
		'\\bibliographystyle{amsalpha} %amsalpha, amsplain, plain, alpha, abbrvnat\n' +
		'\\bibliography{biblio}\\label{cap:biblio}\n' +
		'\\addcontentsline{toc}{chapter}{Referências Bibliográficas}\n\n' +
		'\\end{document}';

	setreason('Versão em LaTeX [produzida com'
		+' [[m:User:Pathoschild/Scripts/Regex menu framework|expressões regulares]]]'
		+'(não era para salvar: REVERTA ESTA EDIÇÃO!)', 'appendonce');
};

//Adaptação de um script de Paul Galloway (http://www.synergyx.com)
window.dedupe_list = function (lista){
	var	listvalues, mainlist, i, l,
		count = 0,
		newlist = [],
		hash = {};
	if( typeof lista === 'string' ) {
		mainlist = editbox.value;
		mainlist = mainlist.replace( /\r|\n+/gi, '\n' );
		listvalues = mainlist.split( '\n' );
	} else if( $.isArray(lista) ) {
		listvalues = lista;
	}
	for ( i = 0, l = listvalues.length; i<l; i++ )	{
		if ( hash[listvalues[ i ].toLowerCase()] !== 1 )	{
			newlist = newlist.concat( listvalues[ i ] );
			hash[ listvalues[ i ].toLowerCase() ] = 1;
		} else {
			count++;
		}
	}
	if( count > 0 ) {
		alert( 'Foram removidas ' + count + ' linhas duplicadas' );
	} else {
		alert( 'Não havia linhas duplicadas' );
	}
	if( typeof lista === 'string' ) {
		return newlist.join( '\r\n' );
	}
	if( $.isArray(lista) ) {
		return newlist;
	}
};

window.cria_autonav = function (){
	var	lista = editbox.value.split('\n'),
		anterior = [],
		posterior = [], i;

	anterior[0] = lista[0];
	posterior[lista.length-1] = lista[lista.length-1];

	for (i=1;i<lista.length-1;i++){
		anterior[i]	= lista[i] + '=[[' + lista[i-1] + ']]';
		posterior[i] = lista[i] + '=[[' + lista[i+1] + ']]';
	}

	editbox.value = lista.join('\n') + '\n\n' + anterior.join('\n') + '\n\n' + posterior.join('\n');
};

//As funções interpretaLinha e geraLista foram baseadas nas funções loadCollection e parseCollectionLine da extensão collection
//http://svn.wikimedia.org/viewvc/mediawiki/trunk/extensions/Collection/Collection.body.php?view=markup
function interpretaLinha ( linha ){
	var reLinkCap  = new RegExp( '.*\\[\\[\\s*(?:/([^\\|\\]]+?)/?|' + $.escapeRE( nomeLivro ) + '/([^\\|\\]]+?))\\s*(?:(?:#[^\\|\\]]+?)?\\|\\s*[^\\]]+?\\s*)?\\]\\].*', 'gi' );
	linha = ( reLinkCap.test( linha ) ) ? linha.replace( reLinkCap, '$1$2' ).replace(/^\s+|\s+$/g,"") : '';
	return( linha );
}

function geraLista (){
	var	linhas = $('#wpTextbox1').val().split(/[\r\n]+/),
		lista = [], i, cap;
	linhas = linhas.slice( 1, linhas.length - 1 );
	for ( i = 0; i < linhas.length; i++) {
		cap = interpretaLinha( linhas[ i ] );
		if ( cap !== '' ) { lista.push( cap ); }
	}
	return lista;
}

window.geraPredef = function (){
	var	lista = window.dedupe_list( geraLista() ),
		predef = '<includeonly>{'+'{{{{|safesubst:}}}Lista de capítulos/{{{1|}}}</includeonly>\n |'
			+ lista.join( '\n |' )
			+ '\n<includeonly>}}</includeonly><noinclude>\n'
			+ '{'+'{Documentação|Predefinição:Lista de capítulos/doc}}\n'
			+ '<!-- ADICIONE CATEGORIAS E INTERWIKIS NA SUBPÁGINA /doc -->\n'
			+ '</noinclude>';
	editbox.value = predef;
};

//Baseado em [[w:en:Wikipedia:WikiProject_User_scripts/Guide/Ajax#Edit_a_page_and_other_common_actions]]

function editar(pagina, texto) {
	// Edit page (must be done through POST)
	$.post(
		mw.util.wikiScript( 'api' ), {
			action: 'edit',
			bot: '1',
			title: pagina,
			text: texto,
			summary: 'Criação da lista com base no [[' + mw.config.get( 'wgBookName' ) +
				'|índice do livro]] (usando regex)',
			token: mw.user.tokens.get( 'editToken' )
		},
		function() {
			alert('A página "' + pagina.replace(/_/g, ' ') + '" foi editada e será exibida a seguir.');
			location.href = mw.util.wikiGetlink( pagina );
		}
	).error(function() {
		alert( 'Não foi possível editar a página. =(' );
	});
}//editar

window.geraCol = function (){
	var	lista = window.dedupe_list( geraLista() ), i,
		col = '{'+'{Livro gravado\n |título={'
			+'{subst:SUBPAGENAME}}\n |subtítulo=\n |imagem da capa=\n'
			+' |cor da capa=\n}}\n\n== ' + nomeLivro + ' ==\n';
	for ( i = 0; i < lista.length; i++) {
		col += ':[[' + nomeLivro + '/' + lista[ i ] + '|'
			+ lista[ i ].replace( /^.+\//g, '' ) + ']]\n';
	}
	editbox.value = col;
};

window.geraImpr = function (){
	var	lista = window.dedupe_list( geraLista() ), i,
		imp = '{'+'{Versão para impressão|{{BASEPAGENAME}}|{{BASEPAGENAME}}/Imprimir}}\n';
	for ( i = 0; i < lista.length; i++) {
		imp += '=' + lista[ i ].replace( /^.+\//g, '' )
			+ '=\n{'+'{:{{NOMEDOLIVRO}}/' + lista[ i ] + '}}\n';
	}
	imp += '\n{' + '{AutoCat}' + '}';
	editbox.value = imp;
};

window.grava_lista_cap = function (){
	var	pagina = 'Predefinição:Lista_de_capítulos/' + mw.config.get( 'wgPageName' ),
		texto = editbox.value, r;
		r = confirm('Antes de criar a lista de capítulos é preciso conferir' +
			' se a lista gerada pelo script está correta.\n\nDeseja' +
			' que a lista seja criada com o texto atual?');
	if (r===true) {
		editar(pagina, texto);
	}
};

window.converte_refs = function (){
	var oldText = editbox.value;

	regex(/Mais informações sobre o livro\nTítulo\t([^\n]+)\nAutor\t([^\n]+)\s([^\n\s]+)\nEditora\t([^\n,]+)(?:,\s(\d+))?\nISBN\t([^\n,]+)(?:,\s\d+)?\nNum. págs.\t(\d+)[^\n]+/img, '* {'+'{Referência a livro |NomeAutor=$2 |SobrenomeAutor=$3 |Título=$1 |Subtítulo= |Edição= |Local de publicação= |Editora=$4 |Ano=$5 |Páginas=$7 |Volumes= |Volume= |ID=ISBN $6 |URL= }}');

	if (editbox.value !== oldText) {
		setreason('Referência do Google Books -> [[Predefinição:Referência a livro]]', 'appendonce');
	}
};

window.format_cab = function (){
	var oldText = editbox.value;

	// Formatação do livro de receitas
	if ( 'Livro_de_receitas' === mw.config.get( 'wgBookName' ) ){
		regex(/\==\s*[^\n]+\s+[\-–]\s+(\d+)\s*==/ig, '== Receita $1 ==');
		regex(/\==='''Ingredientes e Preparo:'''===/ig, '=== Ingredientes ===');
		regex(/\n:?\s*'''(?:Modo\s+de\s+)?(?:Preparo|fazer):?\s*'''\s*\n/ig, '\n=== Preparo ===\n');
		regex(/\n:?\s*'''\s*([^\n:']+)\s*:?\s*'''\s*\n/ig, '\n=== $1 ===\n');
		regex(/ --\n/ig, ';\n');
		regex(/pó\s+Royal/ig, 'fermento em pó');
		regex(/Nescau|Toddy/ig, 'achocolatado em pó');
		regex(/([^\(])Maisena/ig, '$1amido de milho');
	}

	// +quebra de linha antes de =, -espaços entre = e o título da seção
	regex(/\n*^(=+)\s*(.*?)\s*\1\s*/mig, '\n\n$1 $2 $1\n');

	// -quebras de linha entre cabeçalhos consecutivos
	regex(/\=\n+=/ig, '=\n=');

	if (editbox.value !== oldText) {
		setreason('format. cabeçalhos', 'appendonce');
	}
};

window.format_predef = function (){
	var oldText = editbox.value;

	regex(/\{\{\s*(?:msg:|template:)?([^}]+)\}\}/ig, '{{$1}}');

	if (editbox.value !== oldText) {
		setreason('format. predefs', 'appendonce');
	}
};

window.format_cat = function (){
	var oldText = editbox.value;

	regex(/\[\[\s*Categor(?:y|ia)\s*:\s*([^\|\]]+)(?:\s*(\|)([^\]]*))?\s*\]\]/ig, '[[Categoria:$1$2$3]]');
	regex(/\[\[Categoria:([^\|\]]+)\|[a-zA-Z0-9]\]\]/ig, '[[Categoria:$1|{{SUBPAGENAME}}]]');
	regex(/\[\[Categoria:([^\|\]]+)\|([\* !])\]\]/ig, '[[Categoria:$1|$2{{SUBPAGENAME}}]]');

	if (editbox.value !== oldText) {
		setreason('format. categorias', 'appendonce');
	}
};

window.format_list = function (){
	var oldText = editbox.value;

	//Deixa apenas 1 espaço entre *, # ou : e o texto da lista
	regex(/^([*#:]+)\s*/mig, '$1 ');

	if (editbox.value !== oldText) {
		setreason('format. listas', 'appendonce');
	}
};

window.abs2rel = function (){
	if (mw.config.get( 'wgPageName' ) === mw.config.get( 'wgBookName' ) ){
		//troca underscores por espaços
		var nome = mw.config.get( 'wgBookName' ).replace(/_/g,' ');

		// [[Livro/Cap|Cap]] -> [[/Cap/]]
		regex(new RegExp('\\[\\[\\s*' + nome + '\\/([^\\|\\]]+?)\\s*\\|\\s*\\1\\s*\\]\\]','ig'), '[[/$1/]]');
	}
};

window.format_links = function (){
	var	oldText = editbox.value;

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

	if (editbox.value !== oldText) {
		setreason('formatação dos links', 'appendonce');
	}
};

window.format_math = function (){
	var oldText = editbox.value;

	// coloca a pontuação que vem depois de fórmulas dentro das tags <math>
	regex(/<\/math> *([\.,;:!\?]) */ig, '$1</math> ');
	regex(/\\sin/mig, '\\mathrm{sen}\\,');

	if (editbox.value !== oldText) {
		setreason('format. <math> e pontuação', 'appendonce');
	}
};

window.usando_regex = function (){
    if ( mw.config.get( 'wgContentLanguage' ).substr( 0, 2 ) === 'pt' ) {
        setreason('[usando [[m:User:Pathoschild/Scripts/Regex menu framework|regex]]]', 'appendonce');
    } else {
        setreason('[using [[m:User:Pathoschild/Scripts/Regex menu framework|regex]]]', 'appendonce');
    }
};

/* scripts */
// Abaixo, defina as funções referenciadas a partir de rmflinks(), logo acima. Estas funções podem usar qualquer JavaScript,
// mas há um conjunto de ferramentas simplificadas documentadas em
// http://meta.wikimedia.org/wiki/User:Pathoschild/Script:Regex_menu_framework.
window.format_geral = function (){
	window.format_cab();
	window.format_predef();
	window.format_cat();
	window.format_list();
	window.abs2rel();
	window.format_links();
	window.format_math();
	window.usando_regex();
	window.format_cab();doaction('diff');
};

window.remove_modernizacao_ocr_callback = function (res){
	var	pages = res.query.pages,
		pagenames = dictionaries.split('|'),
		sortable = [],
		wsolddict = [],
		i, j, str, match2, lines;
	/*jslint unparam: true*/
	$.each( pages, function(id, page){
		if (!page.pageid) {
			alert('Erro na função remove_modernizacao_ocr_callback usada na correção de OCR!');
			return true;
		}
		sortable.push([
			page.revisions[0]['*'], //Wiki code of dictionary page
			pagenames.indexOf(page.title) //Order of page
			//, page.title //Title of page
		]);
	});
	/*jslint unparam: false*/
	sortable.sort(function (a, b) {
		return a[1] - b[1];
	}); // Sort dictionaries in the given order
	for (i = 0; i < sortable.length; i++) {
		str = sortable[i][0];
		lines = str.split('\n');
		for (j=0; j< lines.length; j++) {
			// Current syntax: * old word : new word //Some comment
			match2 = /^\*\s*(\S[^:]*?)\s*:\s*([\S].*?)\s*(?:\/\/.*?)?$/.exec(lines[j]);
			if (match2) {
				wsolddict[match2[2]] = match2[1]; //"atual" => "antiga"
				continue;
			}
		}
	}
	// lc.conv_text_from_dic() está em [[User:Helder.wiki/Scripts/LanguageConverter.js]]
	editbox.value = lc.conv_text_from_dic(editbox.value, wsolddict, false, null, false);
};

function primeira_maiuscula(p) {
	return p.charAt(0).toUpperCase() + p.substr(1);
}

window.corrigir_ocr = function (){
	var	old = editbox.value,
		tabela, re, url, editreason;
	if (mw.config.get('wgNamespaceNumber') === 106 ) {
		//lang e dictionary_page estão no script de modernização do Wikisource
		url = mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/api.php?action=query&format=json&prop=revisions&titles=' + dictionaries + '&rvprop=content&callback=remove_modernizacao_ocr_callback';
		mw.loader.load(url);
	}

	//Expressões inexistentes (typos do OCR) ou com atualização ortográfica indevida
	//Estas expressões NÃO SÃO convertidas se estiverem contidas em outras
	tabela = {
		'aããição': 'addição',
		'arithmetiea': 'arithmetica',
		'aeceito': 'acceito',
		'cólumna': 'columna',
		'deeompõe': 'decompõe',
		'eífeito': 'effeito',

		'minuenão': 'minuendo',
		'mbtrahenão': 'subtrahendo',
		'mulliplicam': 'multiplicam',
		'orãe(m|ns)?': 'orde$1',
		'pôde': 'póde',
		'proãucto(s?)': 'producto$1',
		'soramar': 'sommar',
		'somraando': 'sommando',
		'subtraliir': 'subtrahir'
	};

	//Aplica cada uma das regras da tabela
	/*jslint unparam: true*/
	$.each( tabela, function(id, palavra){
		var regex1 = new RegExp('\\b' + palavra + '\\b', 'g');
		regex(regex1, palavra, 5);
		//Converte também a palavra correspondente com a primeira letra maiúscula
		regex1 = new RegExp('\\b' + primeira_maiuscula(palavra) + '\\b', 'g');
		regex(regex1, primeira_maiuscula(palavra), 5);
	});
	/*jslint unparam: false*/

	//Expressões inexistentes (typos do OCR) ou com atualização ortográfica indevida
	//Estas expressões NÃO SÃO convertidas se estiverem contidas em outras
	//OSB:	1) Estas expressões precisam de tratamento especial pois o \b se confunde com letras acentuadas e cedilha
	//	2) São usados dois grupos extras nestas regras: um para o 1º caractere anterior e outro para o 1º posterior à palavra;
	tabela = {
		'ã([eo])': '$1d$2$3',
		//A letra "d" em itálico parece um "ã" (por causa da serifa no topo do "d")
		'ão(u)?s': '$1do$2s$3',
		'ê': '$1é$2'
	};

	$.each( tabela, function(find, rep){
		re = new RegExp('([^' + LETRA + '])' + find + '([^' + LETRA + '])', 'g');
		regex(re, rep, 5);
	});


	//Estas expressões SÃO convertidas mesmo se estiverem contidas em outras
	//Se for preciso impedir a conversão nestes casos, basta mover a regra para a primeira tabela (acima)
	tabela = {
		' +([.,;:!?]) +': '$1 ',
		//Remoção do espaçamento antes de pontuação
		'([a-zA-Z])-\\n([a-zA-Z])': '$1$2',
		//Remoção de hifens em quebras de linha
		' *— *': ' — ',
		//Ajuste no espaçamento em torno de um traço —
		'\\n(\\d+)\\. ([^\\n]+)': '\n{{âncora|Item $1}}$1. $2',
		//Inclusão de âncoras no início de cada item
		'-,': ';',
		'(\\d+)(?:\\?|o|"\\.) ([Cc]asos?|[Ee]xemplos?|[Pp]rincipios?)': '$1º $2',
		'[Ii]o ([Cc]asos?|[Ee]xemplos?|[Pp]rincipios?)': '1º $1',
		'(\\d+)\\.[\\t ]': '$1. ',
		//Correção da numeração manual
		'ãa': 'da',
		'qne': 'que'
	};

	$.each( tabela, function(find, rep){
		re = new RegExp(find, 'g');
		regex(re, rep, 5);
		//Converte também a palavra correspondente com a primeira letra maiúscula
		re = new RegExp('\\b' + primeira_maiuscula(find), 'g');
		regex(re, primeira_maiuscula(rep), 5);
	});

	//Sequências de caracteres, contendo dígitos e operadores, iniciada e terminada por números possívelmente são fórmulas
	regex(/(\d+[xX+-\/=<>][xX+-\/=0-9<>]+\d+)/g, '♪$1♫');

	//Espaçamento entre os operadores de algumas fórmulas
	regex(/♪([^♪]*[^ ♪])([xX+-\/=<>])([^ ♫][^♫]*)♫/g, '♪$1 $2 $3♫', 10);

	//Sinal de vezes em LaTeX
	regex(/♪([^♪]*\d+)\s*[xX]\s*(\d+[^♫]*)♫/g, '♪$1 \\times $2♫', 10);

	//Remoção de tags duplicadas no processo
	regex(/(?:♪|<math>)+/g, '<math>');
	regex(/(?:♫|<\/math>)+/g, '</math>');

	if (editbox.value !== old) {
		editreason = document.getElementById('wpSummary');
		setreason('Correção de OCR', 'appendonce');
		if (regsearch(/\{\{âncora/)) {
			setreason('Adição de {{âncora}}', 'appendonce');
		}
		doaction('diff');
	}
};

}( jQuery, mediaWiki ) );