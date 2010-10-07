/*************
*** Regex menu framework
*** by [[m:user:Pathoschild]]: [[meta:User:Pathoschild/Scripts/Regex menu framework]]
***	- adds a sidebar menu of user-defined scripts.
*************/
importScriptURI('http://meta.wikimedia.org/w/index.php?title=User:Pathoschild/Scripts/Regex_menu_framework.js&action=raw&ctype=text/javascript');

/* menu links */
// In the function below, add more lines like "regexTool('link text','function_name()')" to add
// links to the sidebar menu. The function name is the function defined in rfmscripts() below.
function rmflinks() {
	regexTool('• REGEX','custom()'); // Uma ferramenta padrão que executa regex em um formulário dinâmico
	regexTool('• Editar Regexes','function opennew(url) { window.open(url); }; opennew(wgServer + wgScript + "?title=User:" + wgUserName + "/" + skin + ".js&action=edit");');

	if ('http://pt.wikibooks.org' == wgServer) {
		regexTool('• Formatação geral','format_geral()');
		regexTool('• Wiki -> LaTeX','wiki2latex()');
		regexTool('• LaTeX -> Wiki','latex2wiki()');
		regexTool('• Remover linhas duplicadas','dedupe_list()');
		regexTool('Formatar cabeçalhos','format_cab()');
		regexTool('Formatar predefinições','format_predef()');
		regexTool('Formatar categorias','format_cat()');
		regexTool('Formatar listas','format_list()');
		regexTool('Usar links relativos','abs2rel()');
		regexTool('Formatar links','format_links()');
		regexTool('Formatar tags <math>','format_math()');
		regexTool('Regex no sumário','usando_regex()');
		regexTool('Gerar lista de capítulos','gera_lista_cap()');
		regexTool('Gravar lista de capítulos (CUIDADO!)','grava_lista_cap()');
		regexTool('TEST: Criar AutoNav','cria_autonav()');
		regexTool('TEST: Refs do Google Books','converte_refs()');
	}
	//Formatando links do Regex Framework
	var r = document.getElementById('p-regex')
	if (r){
		r.className += ' portal'
		var d = r.getElementsByTagName('div')
		if (d[0]) d[0].className += ' pBody body'
	}
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
		[//fórmulas dentro dos parágrafos
			[/\$\s*([^$]*?)\s*\$/img, '<math>$1</math>', null],
			[/<\/?math>/ig, '$', null]
		],
		[//fórmulas em parágrafos isolados
			[/\s*\$\$\s*([^$]*?)\s*\$\$\s*/img, '\n\n: <math>$1</math>\n\n', null],
			[null, null, null]
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
		setreason('Convertendo de LaTeX para Wiki, [usando [[meta:User:Pathoschild/Scripts/Regex menu framework|regex]]]', 'appendonce')
	else
		setreason('Criando versão latex [usando [[meta:User:Pathoschild/Scripts/Regex menu framework|regex]]] (não era para salvar: REVERTA ESTA EDIÇÃO!)', 'appendonce');
}

function latex2wiki() {
	var cabeçalho = '{{AutoNav}}\n'
	var rodapé = 	'\n== Notas ==\n' +
			'<references group="nota "/>\n' +
			'\n== Referências ==\n' +
			'<references/>\n' +
			'{{AutoCat}}'

	regex(/\$\s*([^$]*?)\s*\$/img, '<math>$1</math>')
	regex(/\s*\$\$\s*([^$]*?)\s*\$\$\s*/img, '\n\n{{Fórmula|<math>$1</math>}}\n\n')
	regex(/<\/math>([\.,;:!\?]) */mig, '$1</math> ')

	regex(/\\footnote{([^}]+?)%?\\label{[^}]+?}\s*}/g, '<ref name="$2">$1</ref>')
	regex(/\\footnote{(.*?)}/g, '<ref>$1</ref>')

	regex(/\n*\\chapter{([^}\n]+)}\n*/gm, '\n\n= $1 =\n\n')
	regex(/\n*\\section{([^}\n]+)}\n*/gm, '\n\n== $1 ==\n\n')
	regex(/\n*\\subsection{([^}\n]+)}\n*/gm, '\n\n=== $1 ===\n\n')
	regex(/\n*\\subsubsection{([^}\n]+)}\n*/gm, '\n\n==== $1 ====\n\n')

	regex(/\n*\\begin{defi}%?(?:\\label{defi:[^}]+?})?\s*/gm, '\n{{Definição\n|')
	regex(/\n*\\begin{teo}%?(?:\\label{teo:[^}]+?})?\s*/gm, '\n{{Teorema\n|')
	regex(/\n*\\begin{proof}%?(?:\\label{proof:[^}]+?})?\s*/gm, '\n{{Demonstração\n|')
	regex(/\n*\\begin{lema}%?(?:\\label{lema:[^}]+?})?\s*/gm, '\n{{Lema\n|')
	regex(/\n*\\begin{prop}%?(?:\\label{prop:[^}]+?})?\s*/gm, '\n{{Proposição\n|')
	regex(/\n*\\begin{cor}%?(?:\\label{cor:[^}]+?})?\s*/gm, '\n{{Corolário\n|')
	regex(/\n*\\begin{ex}%?(?:\\label{ex:[^}]+?})?\s*/gm, '\n{{Exemplo\n|')
	regex(/\n*\\begin{exer}%?(?:\\label{exer:[^}]+?})?\s*/gm, '\n{{Exercício\n|')
	regex(/\n*\\begin{obs}%?(?:\\label{obs:[^}]+?})?\s*/gm, '\n{{Observação\n|')
	regex(/\n*\\end{(?:defi|teo|proof|lema|prop|cor|ex|exer|obs)}\s*/gm, '\n}}\n\n')

	regex(/\n?\\end{(?:enumerate|itemize)}\n?/gm, '\n')


	regex(/^\s*\\item\s+/gm, '* ')

	editbox.value =	cabeçalho + editbox.value + rodapé

	setreason('Convertendo de LaTeX para Wiki, [usando [[meta:User:Pathoschild/Scripts/Regex menu framework|regex]]]', 'appendonce')
}


function wiki2latex() {
	var preambulo =	'\\documentclass[12pt,a4paper,titlepage]{book}\n' +
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
			"		pdftitle = {" + wgBookName + "},\n" +
			"		pdfauthor = {Colaboradores do Wikilivros},\n" +
			"		pdfcreator = {" + wgUserName + "},\n" +
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
			"\\newtheorem{obs}[teo]{Observa\\c{c}{\\~a}o}\n"
			"\\newtheorem*{conv}{Conven\\c{c}{\\~a}o}\n\n" +
			"\\newtheorem*{res}{Resolu\\c{c}{\\~a}o}" +
			"\\newtheorem*{tarefa}{Tarefa}" +
			"\\makeindex\n\n";

	var url	 = wgServer + '/wiki/Special:Search/';
	var url1 = 'http://';
	var url2 = '.org/wiki/Special:Search/';
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
	regex(/{{Auto(Cat|Nav)}}/ig,''); //Comandos wiki que são descartados
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


	regex(/{{\s*(?:Definição)\|([^}]+)}}/ig,'\\begin{defi}%\\label{defi:}\n$1\n\\end{defi}'); //predefinições matemáticas
	regex(/{{\s*(?:Teorema)\|([^}]+)}}/ig,'\\begin{teo}%\\label{teo:}\n$1\n\\end{teo}');
	regex(/{{\s*(?:Demonstração)\|([^}]+)}}/ig,'\\begin{proof}\n$1\n\\end{proof}');
	regex(/{{\s*(?:Lema)\|([^}]+)}}/ig,'\\begin{lema}%\\label{lema:}\n$1\n\\end{lema}');
	regex(/{{\s*(?:Proposição)\|([^}]+)}}/ig,'\\begin{prop}%\\label{prop:}\n$1\n\\end{prop}');
	regex(/{{\s*(?:Corolário)\|([^}]+)}}/ig,'\\begin{cor}%\\label{cor:}\n$1\n\\end{cor}');
	regex(/{{\s*(?:Exemplo)\|([^}]+)}}/ig,'\\begin{ex}%\\label{ex:}\n$1\n\\end{ex}');
	regex(/{{\s*(?:Exercício)\|([^}]+)}}/ig,'\\begin{exer}%\\label{exer:}\n$1\n\\end{exer}');
	regex(/{{\s*(?:Observação)\|([^}]+)}}/ig,'\\begin{obs}%\\label{obs:}\n$1\n\\end{obs}');
	regex(/\{\{Fórmula\|([\d.]+)\|([^\n]+)\}\}\n/igm,'\\begin{equation}\\label{eq:$1}\n$2\n\\end{equation}\n');
	regex(/\{\{Fórmula\|([^\n]+)\}\}\n/igm,'\\begin{equation}\\label{eq:???}\n$1\n\\end{equation}\n');

	regex(/{{\s*(?:Âncoras?)\|([^}]+)}}/ig,'\\label{$1}'); //links internos e externos	
	var WikiLink = ''
	var reWikiLink = /\[\[\s*([a-zA-Z:]+)\s*:\s*([^\|\]]+?)\s*?\|\s*([^\]]*?)\s*\]\]/i
	while(WikiLink = reWikiLink.exec(editbox.value)){//[[proj:idioma:alvo|texto]]
		WikiLink[2] = encodeURI(WikiLink[2]).replace(/(%|#)/g,'\\$1')
		editbox.value=editbox.value.replace(reWikiLink, '\\href{' + url + '$1:' + WikiLink[2] + '}{$3}')
	}
	var reWikiLink = /{{\s*(w|wikt)\s*\|\s*([^\|}]+?)\s*?\|\s*([^}]*?)\s*}}/i
	while(WikiLink = reWikiLink.exec(editbox.value)){//{{proj|alvo|texto}}
		WikiLink[2] = encodeURI(WikiLink[2]).replace(/(%|#)/g,'\\$1')
		editbox.value=editbox.value.replace(reWikiLink, '\\href{' + url + '$1:' + WikiLink[2] + '}{$3}')
	}
	var reWikiLink = /{{\s*(w|wikt)\s*\|\s*([^\|}]+?)\s*}}/i
	while(WikiLink = reWikiLink.exec(editbox.value)){//{{proj|alvo}}
		WikiLink[2] = encodeURI(WikiLink[2]).replace(/(%|#)/g,'\\$1')
		editbox.value=editbox.value.replace(reWikiLink, '\\href{' + url + '$1:' + WikiLink[2] + '}{$2}')
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
	regex(/\n*(\\(?:sub){0,2}section[^\n]+)\n*/ig,'\n\n\$1\n');
	regex(/\n*(\\chapter[^\n]+)\n*/ig,'\n\n\n\$1\n\n');
	regex(/"([^"]+)"/ig,"``$1''");//Aspas

	editbox.value =	preambulo +
			'\\begin{document}\n\n' +
			'\\frontmatter\n\n' +
			'\\tableofcontents\n\n' +
			'\\mainmatter %Depois de índice e prefácio\n\n' +
			'\\chapter{' + wgTitle + '}\\label{cap:' + wgTitle.toLowerCase() + '}\n\n\n' +
			editbox.value +
			'\n\n\\backmatter\n\n' +
			'\\bibliographystyle{amsalpha} %amsalpha, amsplain, plain, alpha, abbrvnat\n' +
			'\\bibliography{biblio}\\label{cap:biblio}\n' +
			'\\addcontentsline{toc}{chapter}{Referências Bibliográficas}\n\n' +
			'\\end{document}';

	setreason('criando versão latex [usando [[meta:User:Pathoschild/Scripts/Regex menu framework|regex]]] (não era para salvar: REVERTA ESTA EDIÇÃO!)', 'appendonce');
}

//Script created by Paul Galloway (http://www.synergyx.com)
function dedupe_list()
{
	var count = 0;
	var mainlist = editbox.value;
	mainlist = mainlist.replace(/\r/gi, "\n");
	mainlist = mainlist.replace(/\n+/gi, "\n");
	
	var listvalues = new Array();
	var newlist = new Array();
	
	listvalues = mainlist.split("\n");
	
	var hash = new Object();
	
	for (var i=0; i<listvalues.length; i++)
	{
		if (hash[listvalues[i].toLowerCase()] != 1)
		{
			newlist = newlist.concat(listvalues[i]);
			hash[listvalues[i].toLowerCase()] = 1
		}
		else { count++; }
	}
	editbox.value = newlist.join("\r\n");
	if(count>0) alert('Foram removidas ' + count + ' linhas duplicadas');
	else alert('Não havia linhas duplicadas');
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

function gera_lista_cap() {
	var pag = wgPageName.replace(/_/g,' ')
	regex(/(?:\n|^)[^[]*\n/g, '\n') //Remove linhas sem links
	var reLinkCap  = new RegExp('[^\\n\\][]*\\[\\[\\s*(?:/([^\\|\\]]+?)/?|' + pag + '/([^\\|\\]]+?))\\s*(?:(?:#[^\\|\\]]+?)?\\|\\s*[^\\]]+?\\s*)?\\]\\][^\\n[]*','gi')
	regex(reLinkCap, '\n$1$2\n') //Troca os links para capítulos por seus nomes (sem [[...]])
	regex(/[^\n\]]*\[\[[^\]]+?\]\][^\n[]*/g, '') //Apaga as imagens e os demais links/interwikilinks
	regex(/[^\n\]]*\[[^\]]+?\][^\n[]*/g, '') //Apaga os links externos
	regex(/\n+/g, '\n') //Remove linhas extras criadas ao usar reLinkCap
	regex(/\n+/g, '\n |') //Adiciona barras usadas na [[predefinição:lista de capítulos]]
	regex(/\n \|$/g, '') //Remove linha sem capítulo criada desnecessariamente no processo
	editbox.value = '<includeonly>{{Lista de capítulos/{{{1|}}}</includeonly>' + editbox.value + '\n<includeonly>}}</includeonly><noinclude>\n'
			+ '{{Documentação|Predefinição:Lista de capítulos/doc}}\n'
			+ '<!-- ADICIONE CATEGORIAS E INTERWIKIS NA SUBPÁGINA /doc -->\n'
			+ '</noinclude>'
	dedupe_list()
}

function grava_lista_cap() {
	var pagina = 'Predefinição:Lista_de_capítulos/' + wgPageName;
	var texto = editbox.value;
	var r=confirm("Antes de criar a lista de capítulos é preciso conferir se a lista gerada pelo script está correta.\n\nDeseja que a lista seja criada com o texto atual?");
	if (r==true) editar(pagina, texto);
}

//Baseado em [[w:en:Wikipedia:WikiProject_User_scripts/Guide/Ajax#Edit_a_page_and_other_common_actions]]
/************
* MediaWiki ajax.js
************/
function editar(pagina, texto) {
	// fetch token
	var api = sajax_init_object();
	api.open('GET', wgServer + wgScriptPath + '/api.php?format=json&action=query&prop=info&indexpageids=1&intoken=edit&titles=Whatever', true);
	api.onreadystatechange = extract_token;
	api.send(null);

	function extract_token() {
		if(api.readyState==4) {
			if(api.status==200) {
				var response = eval('(' + api.responseText + ')');
				var token = response['query']['pages'][response['query']['pageids'][0]]['edittoken'];
				edit_page(token);
			}
			else {
				alert('Houve um erro ao solicitar um token.');
			}
		}
	}
 
	// edit page (must be done through POST)
	function edit_page(_token) {
		var parameters = 'action=edit&bot=1&title=' + encodeURIComponent(pagina) + '&text=' + texto + '&token=' + encodeURIComponent(_token) + '&summary=' + encodeURIComponent('Criando índice com base no índice do livro (usando regex)');
		api.open('POST', wgServer + wgScriptPath + '/api.php', true); // just reuse the same query object
		api.onreadystatechange = alert_result;
		api.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		api.setRequestHeader('Connection', 'keep-alive');
		api.setRequestHeader('Content-length', parameters.length);
		api.send(parameters);
 
		// process response
		function alert_result() {
			if(api.readyState==4) {
				if(api.status==200) {
					alert('A página "' + pagina.replace(/_/g, ' ') + '" foi editada e será exibida a seguir.');
					location.href = wgArticlePath.replace('$1', pagina)
				}
				else {
					alert('Houve um erro.');
				}
			}
		}
	}
}//editar

function converte_refs() {
	var antigo = editbox.value;

	regex(/Mais informações sobre o livro\nTítulo\t([^\n]+)\nAutor\t([^\n]+)\s([^\n\s]+)\nEditora\t([^\n,]+)(?:,\s(\d+))?\nISBN\t([^\n,]+)(?:,\s\d+)?\nNum. págs.\t(\d+)[^\n]+/img, '* {{Referência a livro |NomeAutor=$2 |SobrenomeAutor=$3 |Título=$1 |Subtítulo= |Edição= |Local de publicação= |Editora=$4 |Ano=$5 |Páginas=$7 |Volumes= |Volume= |ID=ISBN $6 |URL= }}');

	if (editbox.value != antigo)
		setreason('Referência do Google Books -> [[Predefinição:Referência a livro]]', 'appendonce');
}

function format_cab() {
	var antigo = editbox.value;

	// Formatação do livro de receitas
	if ( "Livro_de_receitas" == wgBookName ){
		regex(/==\s*[^\n]+\s+[-–]\s+(\d+)\s*==/ig, '== Receita $1 ==');
		regex(/==='''Ingredientes e Preparo:'''===/ig, '=== Ingredientes ===');
		regex(/\n:?\s*'''(?:Modo\s+de\s+)?(?:Preparo|fazer):?\s*'''\s*\n/ig, '\n=== Preparo ===\n');
		regex(/\n:?\s*'''\s*([^\n:']+)\s*:?\s*'''\s*\n/ig, '\n=== $1 ===\n');
		regex(/ --\n/ig, ';\n');
		regex(/pó\s+Royal/ig, 'fermento em pó');
		regex(/Nescau|Toddy/ig, 'achocolatado em pó');
		regex(/Maisena/ig, 'amido de milho');
	}

	// +quebra de linha antes de =, -espaços entre = e o título da seção
	regex(/\n*^(=+)\s*(.*?)\s*\1\s*/mig, '\n\n$1 $2 $1\n');

	// -quebras de linha entre cabeçalhos consecutivos
	regex(/=\n+=/ig, '=\n=');

	if (editbox.value != antigo)
		setreason('format. cabeçalhos', 'appendonce');
}

function format_predef() {
	var antigo = editbox.value;
	
	regex(/{{\s*(?:msg:|template:)?([^}]+)}}/ig, '{{$1}}');

	if (editbox.value != antigo)
		setreason('format. predefs', 'appendonce');
}

function format_cat() {
	var antigo = editbox.value;
	
	regex(/\[\[\s*Categor(?:y|ia)\s*:\s*([^\|\]]+)(?:\s*(\|)([^\]]*))?\s*\]\]/ig, '[[Categoria:$1$2$3]]');
	regex(/\[\[Categoria:([^\|\]]+)\|[a-zA-Z0-9]\]\]/ig, '[[Categoria:$1|{{SUBPAGENAME}}]]');
	regex(/\[\[Categoria:([^\|\]]+)\|([\* !])\]\]/ig, '[[Categoria:$1|$2{{SUBPAGENAME}}]]');

	if (editbox.value != antigo)
		setreason('format. categorias', 'appendonce');
}

function format_list() {
	var antigo = editbox.value;
	
	//Deixa apenas 1 espaço entre *, # ou : e o texto da lista
	regex(/^([*#:]+)\s*/mig, '$1 ');

	if (editbox.value != antigo)
		setreason('format. listas', 'appendonce');
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
		setreason('formatação dos links', 'appendonce');
}

function format_math() {
	var antigo = editbox.value;
	
	// coloca a pontuação que vem depois de fórmulas dentro das tags <math>
	regex(/<\/math> *([\.,;:!\?]) */ig, '$1</math> ');
	regex(/\\sin/mig, '\\mathrm{sen}\\,');


	if (editbox.value != antigo)
		setreason('format. <math> e pontuação', 'appendonce');
}

function usando_regex() {
	setreason('[usando [[meta:User:Pathoschild/Scripts/Regex menu framework|regex]]]', 'appendonce');
}