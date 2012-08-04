/**
 * TemplateScript
 * Adds a menu of configurable templates and scripts to the sidebar
 * @author: [[m:user:Pathoschild]] ([[meta:User:Pathoschild/Scripts/TemplateScript]])
 * @author: [[User:Helder.wiki]] (this configuration file)
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/TemplateScript.js]] ([[File:User:Helder.wiki/Tools/TemplateScript.js]])
 */
/*global jQuery, mediaWiki, LanguageConverter, pathoschild */
/*jslint browser: true, white: true, devel: true, regexp: true, continue: true, plusplus: true, todo: true */
( function ( mw, $ ) {
'use strict';

var	bookName = mw.config.get( 'wgPageName' ).replace(/_/g,' '),
	// Maiúsculas e minúsculas usadas em português
	LETRA = 'A-Za-zÁÀÂÃÇÉÊÍÓÒÔÕÚáàâãçéêíóòôõú',
	dictionaries = 'Wikisource:Modernização/Dicionário/pt-PT|Wikisource:Modernização/Dicionário/pt-BR',
	oldText = null,
	list = [];

function regex(context, regexList, summary, pos ) {
	var	text = context.$target.val(),
		i, l, rule;
	for( i = 0, l = regexList.length; i < l; i++ ) {
		rule = regexList[i];
		text = text.replace( rule.find, rule.replace );
	}
	if (text !== oldText) {
		pos = pos || 'after';
		context.$target.val( text );
		if( summary ) {
			if( pos === 'after' && context.$editSummary.val().replace(/\/\*.+?\*\//, '').match(/[^\s]/) ) {
				summary = ', ' + summary;
			}
			pathoschild.TemplateScript.InsertLiteral( context.$editSummary, summary, pos );
		}
	}
}

// Adaptação de um script de Paul Galloway (http://www.synergyx.com)
function dedupeList( items ){
	var	i, l,
		count = 0,
		newlist = [],
		hash = {};
	if( !$.isArray( items ) ) {
		return;
	}
	for ( i = 0, l = items.length; i<l; i++ )	{
		if ( hash[items[ i ].toLowerCase()] !== 1 ) {
			newlist = newlist.concat( items[ i ] );
			hash[ items[ i ].toLowerCase() ] = 1;
		} else {
			count++;
		}
	}
	if( count > 0 ) {
		alert( 'Foram removidas ' + count + ' linhas duplicadas' );
	} else {
		alert( 'Não havia linhas duplicadas' );
	}
	return newlist;
}

function editRegexes( /* context */ ){
	window.open( '//pt.wikibooks.org/wiki/User:Helder.wiki/Tools/TemplateScript.js?action=edit' );
}

function fixObsoleteTemplatesOnPtwiki( context ){
	var reText = {
		// [[w:Especial:Páginas afluentes/Predefinição:Ver também]]
		seeAlso: 'V(?:eja|er|ide)[_ ](?:tamb[ée]m|mais)|(?:Tópico|Artigo|Página|Assunto)s[_ ]relacionad[oa]s|Li(?:gaçõe|nk)s[_ ]Intern[ao]s',
		// [[w:Especial:Páginas afluentes/Predefinição:Bibliografia]]
		biblio: 'Bibliografia',
		// [[w:Especial:Páginas afluentes/Predefinição:Ligações externas]]
		extLinks: '(?:Apontadores|Atalhos?|Elos?|Enlaces?|Lin(?:k|que)s?|Vínculos?)(?: externos?)?|(?:Ligaç(?:ão|ões)|Páginas?|Referências?)(?: externas?)?|(?:Ligaç(?:ão|ões)|Links)(?: para o exterior| exterior(?:es)?(?: [àa] Wikip[ée]dia)?)?|S(?:ites|[íi]tios)|LE|Links? relacionados?|Páginas? da Internet|Weblinks?'
	};
	oldText = context.$target.val();
	list = [{
		find: new RegExp( '\\n==\\s*\\{\\{\\s*(?:' + reText.seeAlso + ')\\s*\\}\\}\\s*==', 'gi' ),
		replace: '\n== Ver também =='
	},{
		find: new RegExp( '\\n==\\s*\\{\\{\\s*' + reText.biblio + '\\s*\\}\\}\\s*==', 'gi' ),
		replace: '\n== Bibliografia =='
	},{
		find: new RegExp( '\\n==\\s*\\{\\{\\s*(?:' + reText.extLinks + ')\\s*\\}\\}\\s*==', 'gi' ),
		replace: '\n== Ligações externas =='
	}];

	regex( context, list, '-[[Special:PermaLink/29330043|predef\'s obsoletas]]' );
	oldText = context.$target.val();
	list = [{
		find: new RegExp( '\\n==\\s*(?:' + reText.seeAlso + ')\\s*==', 'gi' ),
		replace: '\n== Ver também =='
	},{
		find: new RegExp( '\\n==\\s*' + reText.biblio + '\\s*==', 'gi' ),
		replace: '\n== Bibliografia =='
	},{
		find: new RegExp( '\\n==\\s*(?:' + reText.extLinks + ')\\s*==', 'gi' ),
		replace: '\n== Ligações externas =='
	}];

	regex( context, list, '+[[WP:LE#Seções padrão|padronização das seções]]' );
}

// See also https://gerrit.wikimedia.org/r/gitweb?p=mediawiki/core.git;a=blob;f=includes/Sanitizer.php;hb=bc9d9f1f9c796ee01234f484724cc064b9008eba#l615
function fixObsoleteHTML( context ){
	var	colorNames = '(?:AliceBlue|AntiqueWhite|Aqua(?:marine)?|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue(?:Violet)?|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|Dark(?:Blue|Cyan|GoldenRod|Gray|Green|Grey|Khaki|Magenta|OliveGreen|orange|Orchid|Red|Salmon|SeaGreen|Slate(?:Blue|Gray|Grey)|Turquoise|Violet)|DeepPink|DeepSkyBlue|DimGray|DimGrey|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold(?:enRod)?|Gray|Green(?:Yellow)?|Grey|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender(?:Blush)?|LawnGreen|LemonChiffon|Light(?:Blue|Coral|Cyan|GoldenRodYellow|Gray|Green|Grey|Pink|Salmon|SeaGreen|SkyBlue|SlateGray|SlateGrey|SteelBlue|Yellow)|Lime(?:Green)?|Linen|Magenta|Maroon|Medium(?:AquaMarine|Blue|Orchid|Purple|SeaGreen|SlateBlue|SpringGreen|Turquoise|VioletRed)|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive(?:Drab)?|Orange(?:Red)?|Orchid|Pale(?:GoldenRod|Green|Turquoise|VioletRed)|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|Slate(?:Blue|Gray|Grey)|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Turquoise|Violet|Wheat|White(?:Smoke)?|Yellow(?:Green)?)',
		colorCodes = '(?:[a-f0-9]{6}|[a-f0-9]{3})';
	oldText = context.$target.val();
	list = [{
		// <font color="red">[[página]]</font>
		// [[página|<span style="color:red;">página</span>]]
		find: new RegExp(
			'<font\\s+color\\s*=\\s*(["\']?)(' +
				colorNames +
				')\\1\\s*>(\\s*\\[\\[)([^\\|\\]]+)(\\]\\]\\s*)<\\/font>',
			'gi'
		),
		replace: '$3$4|<span style="color:$2;">$4</span>$5'
	},{
		// <font color="#123456">[[página]]</font>
		// [[página|<span style="color:#123456;">página</span>]]
		find: new RegExp(
			'<font\\s+color\\s*=\\s*(["\']?)\\#?(' +
				colorCodes +
				')\\1\\s*>(\\s*\\[\\[)([^\\|\\]]+)(\\]\\]\\s*)<\\/font>',
			'gi'
		),
		replace: '$3$4|<span style="color:#$2;">$4</span>$5'
	},{
		// <font color="red">[[página|texto]]</font>
		find: new RegExp(
			'<font\\s+color\\s*=\\s*(["\']?)(' +
				colorNames +
				')\\1\\s*>(\\s*\\[\\[[^\\|\\]]+\\|)([^\\]]+)(\\]\\]\\s*)<\\/font>',
			'gi'
		),
		replace: '$3<span style="color:$2;">$4</span>$5'
	},{
		// <font color="#123456">[[página|texto]]</font>
		find: new RegExp(
			'<font\\s+color\\s*=\\s*(["\']?)\\#?(' +
				colorCodes +
				')\\1\\s*>(\\s*\\[\\[[^\\|\\]]+\\|)([^\\]]+)(\\]\\]\\s*)<\\/font>',
			'gi'
		),
		replace: '$3<span style="color:#$2;">$4</span>$5'
	},{
		// <font color="red">texto [[página|texto]] texto</font>
		find: new RegExp(
			'<font\\s+color\\s*=\\s*(["\']?)(' +
				colorNames +
				')\\1\\s*>(.+?)<\\/font>',
			'gi'
		),
		replace: '<span style="color:$2;">$3</span>'
	},{
		// <font color="#123456">texto [[página|texto]] texto</font>
		find: new RegExp(
			'<font\\s+color\\s*=\\s*(["\']?)\\#?(' +
				colorCodes +
				')\\1\\s*>(.+?)<\\/font>',
			'gi'
		),
		replace: '<span style="color:#$2;">$3</span>'
	}];
	regex( context, list, '-código HTML obsoleto' );
	if( oldText !== context.$target.val() ){
		regex( context, {
			// Simplify color hex codes
			find: /#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/g,
			replace: '#$1$2$3'
		}, '+simplificação' );
	}
}

function fixHTTPLinks( context ){
	var	relativeLink = '[$1]',
		// TODO: Converter links do servidor antigo (https://secure.wikimedia.org/wikipedia/pt)
		// Ver também: [[Special:SiteMatrix]], [[meta:User:Nemo bis/HTTPS]]
		reOldLink = /\[https?:(\/\/(?:(?:commons|meta|outreach|species|strategy|wikimania\d{4}|[a-z]{2,3})\.wikimedia|(?:wiki\.)?toolserver|www\.mediawiki|wikimediafoundation|wikisource).+?|\/\/(?:(?:[a-z]{2,3}|bat-smg|be-x-old|cbk-zam|fiu-vro|map-bms|minnan|nds-nl|roa-rup|roa-tara|simple|zh-(?:cfr|classical|min-nan|yue))\.(?:wiki(?:pedia|books|news|quote|source|versity)|wiktionary)).+?)\]/g;
	oldText = context.$target.val();
	list = [{
		find: reOldLink,
		replace: relativeLink
	},{
		find: /https:\/\/secure\.wikimedia\.org\/(wiki(?:pedia|books|news|quote|source|versity)|wiktionary)\/([a-z]{2,3}|meta)/g,
		replace: '//$2.$1.org'
	}];
	regex( context, list, '[[wmfblog:2011/10/03/native-https-support-enabled-for-all-wikimedia-foundation-wikis|http é inseguro]]' );
}

function fixSignature( context ){
	var	proj = ( mw.config.get( 'wgServer' ).indexOf('wikibooks') > -1) ? '' : 'b:',
		lang = ( 'pt' === mw.config.get( 'wgContentLanguage' ) ) ? '' : 'pt:',
		reOldSign, newSign;
	oldText = context.$target.val();
	if ( !proj && lang ) {
		proj = ':';
	}
	reOldSign = window.reOldSign;
	newSign = '[[' + proj + lang + 'User:Helder.wiki|Helder]]';
	regex( context, [{
		find: reOldSign,
		replace: newSign
	}], 'Fixing links (my user account was renamed)' );

	// FIXME: Only do a diff if the text was changed
	// Maybe use bit operators: MINOR & DIFF & SAVE & ...
	$('#wpDiff').click();
}

function createAutoNav( context ){
	var	list = context.$target.val().split('\n'),
		previous = [],
		next = [],
		i;

	previous[0] = list[0];
	next[list.length-1] = list[list.length-1];

	for (i=1;i<list.length-1;i++){
		previous[i] = list[i] + '=[[' + list[i-1] + ']]';
		next[i] = list[i] + '=[[' + list[i+1] + ']]';
	}

	context.$target.val([
		list.join('\n'),
		previous.join('\n'),
		next.join('\n')
	].join( '\n\n' ) );
}

// As funções parseLine e createList foram baseadas nas funções loadCollection e parseCollectionLine da extensão collection
// http://svn.wikimedia.org/viewvc/mediawiki/trunk/extensions/Collection/Collection.body.php?view=markup
function parseLine( line ){
	var reLinkCap = new RegExp( '.*\\[\\[\\s*(?:/([^\\|\\]]+?)/?|' +
		$.escapeRE( bookName ) +
		'/([^\\|\\]]+?))\\s*(?:(?:#[^\\|\\]]+?)?\\|\\s*[^\\]]+?\\s*)?\\]\\].*', 'gi' );
	if( reLinkCap.test( line ) ){
		line = line.replace( reLinkCap, '$1$2' ).replace(/^\s+|\s+$/g, '');
	} else {
		line = '';
	}
	return( line );
}

function createList( context ){
	var	lines = context.$target.val().split(/[\r\n]+/),
		list = [],
		i, cap;
	lines = lines.slice( 1, lines.length - 1 );
	for ( i = 0; i < lines.length; i++) {
		cap = parseLine( lines[ i ] );
		if ( cap !== '' ) { list.push( cap ); }
	}
	return list;
}

function createTemplate( context ){
	var	list = dedupeList( createList( context ) ),
		predef = '<includeonly>{'+'{{{{|safesubst:}}}Lista de capítulos/{{{1|}}}</includeonly>\n |'
			+ list.join( '\n |' )
			+ '\n<includeonly>}}</includeonly><noinclude>\n'
			+ '{'+'{Documentação|Predefinição:Lista de capítulos/doc}}\n'
			+ '<!-- ADICIONE CATEGORIAS E INTERWIKIS NA SUBPÁGINA /doc -->\n'
			+ '</noinclude>';
	context.$target.val( predef );
}

// Baseado em [[w:en:WP:WikiProject User scripts/Guide/Ajax#Edit a page and other common actions]]
function editPage(pagina, texto) {
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
		}
	)
	.done(function() {
		alert('A página "' + pagina.replace(/_/g, ' ') + '" foi editada e será exibida a seguir.');
		location.href = mw.util.wikiGetlink( pagina );
	})
	.fail(function() {
		alert( 'Não foi possível editar a página. =(' );
	});
}// editPage

function createCollectionPage( context ){
	var	list = dedupeList( createList( context ) ), i,
		col = '{'+'{Livro gravado\n |título={'
			+'{subst:SUBPAGENAME}}\n |subtítulo=\n |imagem da capa=\n'
			+' |cor da capa=\n}}\n\n== ' + bookName + ' ==\n';
	for ( i = 0; i < list.length; i++) {
		col += ':[[' + bookName + '/' + list[ i ] + '|'
			+ list[ i ].replace( /^.+\//g, '' ) + ']]\n';
	}
	context.$target.val( col );
}

function createPrintVersion( context ){
	var	list = dedupeList( createList( context ) ), i,
		imp = '{'+'{Versão para impressão|{{BASEPAGENAME}}|{{BASEPAGENAME}}/Imprimir}}\n';
	for ( i = 0; i < list.length; i++) {
		imp += '=' + list[ i ].replace( /^.+\//g, '' )
			+ '=\n{' + '{:{' + '{NOMEDOLIVRO}}/' + list[ i ] + '}}\n';
	}
	imp += '\n{' + '{AutoCat}}';
	context.$target.val( imp );
}

function saveChaptersList( context ){
	var	pagina = 'Predefinição:Lista_de_capítulos/' + mw.config.get( 'wgPageName' ),
		texto = context.$target.val(), r;
		r = confirm('Antes de criar a lista de capítulos é preciso conferir' +
			' se a lista gerada pelo script está correta.\n\nDeseja' +
			' que a lista seja criada com o texto atual?');
	if (r===true) {
		editPage(pagina, texto);
	}
}

function convertRefs( context ){
	oldText = context.$target.val();
	list = [{
		find: /Mais informações sobre o livro\nTítulo\t([^\n]+)\nAutor\t([^\n]+)\s([^\n\s]+)\nEditora\t([^\n,]+)(?:,\s(\d+))?\nISBN\t([^\n,]+)(?:,\s\d+)?\nNum. págs.\t(\d+)[^\n]+/img,
		replace: '* {'+'{Referência a livro |NomeAutor=$2 |SobrenomeAutor=$3 |Título=$1 |Subtítulo= |Edição= |Local de publicação= |Editora=$4 |Ano=$5 |Páginas=$7 |Volumes= |Volume= |ID=ISBN $6 |URL= }}'
	}];
	regex( context, list, 'Referência do Google Books -> [[Predefinição:Referência a livro]]' );
}

function formatHeadings( context ){
	var cookbookList = [];
	oldText = context.$target.val();

	// Formatação do livro de receitas
	if ( 'Livro_de_receitas' === mw.config.get( 'wgBookName' ) ){
		cookbookList = [{
			find: /\==\s*[^\n]+\s+[\-–]\s+(\d+)\s*==/ig,
			replace: '== Receita $1 =='
		},{
			find: /\==='''Ingredientes e Preparo:'''===/ig,
			replace: '=== Ingredientes ==='
		},{
			find: /\n:?\s*'''(?:Modo\s+de\s+)?(?:Preparo|fazer):?\s*'''\s*\n/ig,
			replace: '\n=== Preparo ===\n'
		},{
			find: /\n:?\s*'''\s*([^\n:']+)\s*:?\s*'''\s*\n/ig,
			replace: '\n=== $1 ===\n'
		},{
			find: / --\n/ig,
			replace: ';\n'
		},{
			find: /pó\s+Royal/ig,
			replace: 'fermento em pó'
		},{
			find: /Nescau|Toddy/ig,
			replace: 'achocolatado em pó'
		},{
			find: /([^\(])Maisena/ig,
			replace: '$1amido de milho'
		}];
	}
	list = [{
		// +quebra de linha antes de =, -espaços entre = e o título da seção
		find: /\n*^(=+)\s*(.*?)\s*\1\s*/mig,
		replace: '\n\n$1 $2 $1\n'
	},{
		// -quebras de linha entre cabeçalhos consecutivos
		find: /\=\n+=/ig,
		replace: '=\n='
	}];

	regex( context, cookbookList.concat(list), 'format. cabeçalhos' );
}

function formatTemplates( context ){
	oldText = context.$target.val();

	regex( context, [{
		find: /\{\{\s*(?:msg:|template:)?([^}]+)\}\}/ig,
		replace: '{' + '{$1}}'
	}], 'format. predefs' );
}

function formatCategories( context ){
	oldText = context.$target.val();
	list = [{
		find: /\[\[\s*Categor(?:y|ia)\s*:\s*([^\|\]]+)(?:\s*(\|)([^\]]*))?\s*\]\]/ig,
		replace: '[[Categoria:$1$2$3]]'
	},{
		find: /\[\[Categoria:([^\|\]]+)\|[a-zA-Z0-9]\]\]/ig,
		replace: '[[Categoria:$1|{{SUBPAGENAME}}]]'
	},{
		find: /\[\[Categoria:([^\|\]]+)\|([\* !])\]\]/ig,
		replace: '[[Categoria:$1|$2{{SUBPAGENAME}}]]'
	}];
	regex( context, list, 'format. categorias' );
}

function fixLists( context ){
	oldText = context.$target.val();

	regex( context, [{
		find: /\s*\n;([^\n]+)\n([^:])/g,
		replace: '\n;$1\n:$2'
	}], '+[[' +
		(mw.config.get( 'wgDBname' ) === 'ptwiki'? '' : 'w:') +
		'Special:PermaLink/31511942|semântica]] na lista de definições (;:)' );

	regex( context, [{
		// Deixa apenas 1 espaço entre *, # ou : e o texto da lista
		find: /^(:+[*#]+[*#:]*|:+(?![\{:])|[*#][*#:]*)\s*/gm,
		replace: '$1 '
	}], 'format. listas' );
}

function abs2rel( context ){
	if (mw.config.get( 'wgPageName' ) === mw.config.get( 'wgBookName' ) ){
		// Troca underscores por espaços
		var nome = mw.config.get( 'wgBookName' ).replace(/_/g,' ');

		regex( context, [{
			// [[Livro/Cap|Cap]] -> [[/Cap/]]
			find: new RegExp(
				'\\[\\[\\s*' + nome +
				'\\/([^\\|\\]]+?)\\s*\\|\\s*\\1\\s*\\]\\]',
				'ig'
			),
			replace: '[[/$1/]]'
		}] );
	}
}

function formatLinks( context ){
	oldText = context.$target.val();

	list = [{
		// -espaços redundantes
		find: /\[\[\s*([^\|\]]+?)\s*(?:(\|)\s*([^\]]+?)\s*)?\]\]/ig,
		replace: '[[$1$2$3]]'
	},{
		// Texto exibido redundante:
		// * [[Texto|Texto]]  -> [[Texto]]
		// * [[/Texto|Texto]] -> [[/Texto/]]
		find: /\[\[([^\|\]]+?)\s*\|\s*\1\]\]/g,
		replace: '[[$1]]'
	},{
		find: /\[\[\s*\/\s*([^\|\]]+?)\s*\|\s*\1\s*\]\]/g,
		replace: '[[/$1/]]'
	},{
		// troca de underscores por espaços nas ligações
		find: /\[\[([^\|\]]+?)_/ig,
		replace: '[[$1 '
		// , repeat: 5 // FIXME: Re-implement this!
	},{
		// tradução das ligações internas para o domínio "Wikilivros" ou "Wikipédia"
		find: /\[\[(?:Wikibooks|Project)( Discussão)?:/ig,
		replace: '[[Wikilivros$1:'
	},{
		find: /\[\[(?:Wikibooks|Project) Talk:/ig,
		replace: '[[Wikilivros Discussão:'
	},{
		find: /\[(?:https?)?:\/\/pt.wikibooks.org\/w\/index.php\?title=Wikibooks/ig,
		replace: '[//pt.wikibooks.org/w/index.php?title=Wikilivros'
	},{
		find: /\[\[(?:Wikipedia|Project)( Discussão)?:/ig,
		replace: '[[Wikipédia$1:'
	},{
		find: /\[\[(?:Wikipedia|Project) Talk:/ig,
		replace: '[[Wikipédia Discussão:'
	},{
		find: /\[(?:https?)?:\/\/pt.wikipedia.org\/w\/index.php\?title=Wikipedia/ig,
		replace: '[//pt.wikipedia.org/w/index.php?title=Wikipédia'
	}];
	regex( context, list, 'formatação dos links' );
}

function fixImageLinks( context ){
	var reOtherNames = /\[\[\s*(?:[Ii]mage|[Aa]rquivo|[Ff]i(?:cheiro|le))\s*:\s*([^|\]]+\.(?:[Pp][Nn][Gg]|[Jj][Pp][Ee]?[Gg]|[Ss][Vv][Gg]|[Gg][Ii][Ff]|[Tt][Ii][Ff]{1,2}))\s*(\||\]\])/g;
	oldText = context.$target.val();
	regex(
		context, [{
			find: reOtherNames,
			replace: '[[Imagem:$1$2'
		}],
		'Uso de "[Imagem:" ([[' +
			(mw.config.get( 'wgDBname' ) === 'ptwiki'? '' : 'w:') +
			'Special:PermaLink/27949155|detalhes]])'
	);
}

function fixMath( context ){
	var	reHack, reason;
	oldText = context.$target.val();
	reHack = /\s*(?:\\[,!\s]\s*)+\s*<(\/)math>|<math>\s*(?:\\[,!\s]\s*)+\s*/g;
	reason = {
		'pt': '-hack obsoleto desde o [[mw:MediaWiki 1.19]] (ver também [[rev:104498]] e [[bugzilla:31406#c24]])',
		'en': '-obsolete hack since [[mw:MediaWiki 1.19]] (see also [[rev:104498]] and [[bugzilla:31406#c24]])'
	};
	regex( context, [{
		find: reHack,
		replace: '<$1math>'
	}], reason[mw.config.get('wgContentLanguage')] || reason.en );

	// coloca a pontuação que vem depois de fórmulas dentro das tags <math>
	list = [{
		find: /<\/math> *([\.,;:!\?]) */ig,
		replace: '$1</math> '
	},{
		find: /\\sin/mig,
		replace: '\\mathrm{sen}\\,'
	}];
	regex( context, list, 'format. <math> e pontuação' );
}

function usingRegex( context ){
	var summary;
	if ( mw.config.get( 'wgContentLanguage' ).substr( 0, 2 ) === 'pt' ) {
		summary = '[usando [[m:User:Pathoschild/Scripts/TemplateScript|regex]]]';
	} else {
		summary = '[using [[m:User:Pathoschild/Scripts/TemplateScript|regex]]]';
	}
	pathoschild.TemplateScript.InsertLiteral( context.$editSummary, summary, 'after' );
}

function ucFirst(p) {
	return p.charAt(0).toUpperCase() + p.substr(1);
}

function fixOCR( context ){
	var	oldText = context.$target.val(),
		totalAnchorsBefore = oldText.split( '{{âncora' ).length,
		tabela;
	if (mw.config.get('wgNamespaceNumber') === 106 ) {
		$.getJSON(
			mw.util.wikiScript('api'),{
				format: 'json',
				action: 'query',
				prop: 'revisions',
				rvprop: 'content',
				rvlimit: 1,
				indexpageids: true,
				titles: dictionaries
			},
			// FIXME: add callback to run the rest of fixOCR only after this is finished
			function removeOCRModernization(res){
				var	pages = res.query.pages,
					pagenames = dictionaries.split('|'),
					sortable = [],
					wsolddict = [],
					i, j, str, match2, lines;
				/*jslint unparam: true*/
				$.each( pages, function(id, page){
					if (!page.pageid) {
						alert('Erro na função removeOCRModernization usada na correção de OCR!');
						return true;
					}
					sortable.push([
						page.revisions[0]['*'], // Wiki code of dictionary page
						pagenames.indexOf(page.title) // Order of page
						// , page.title // Title of page
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
						// Current syntax: * old word : new word // Some comment
						match2 = /^\*\s*(\S[^:]*?)\s*:\s*([\S].*?)\s*(?:\/\/.*?)?$/.exec(lines[j]);
						if (match2) {
							wsolddict[match2[2]] = match2[1]; // "atual" => "antiga"
							continue;
						}
					}
				}
				// LanguageConverter.conv_text_from_dic() está em [[oldwikisource:User:Helder.wiki/Scripts/LanguageConverter.js]]
				context.$target.val(
					LanguageConverter.conv_text_from_dic(
						context.$target.val(),
						wsolddict,
						false,
						null,
						false
					)
				);
			}
		);
	}

	list = [];
	// Expressões inexistentes (typos do OCR) ou com atualização ortográfica indevida
	// Estas expressões NÃO SÃO convertidas se estiverem contidas em outras
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

	// Aplica cada uma das regras da tabela
	/*jslint unparam: true*/
	$.each( tabela, function(id, palavra){
		list.push({
			find: new RegExp('\\b' + palavra + '\\b', 'g'),
			replace: palavra
			// , 5 // FIXME
		},{
			// Converte também a palavra correspondente com a primeira letra maiúscula
			find: new RegExp('\\b' + ucFirst(palavra) + '\\b', 'g'),
			replace: ucFirst(palavra)
			// , 5 // FIXME
		});
	});
	/*jslint unparam: false*/

	// Expressões inexistentes (typos do OCR) ou com atualização ortográfica indevida
	// Estas expressões NÃO SÃO convertidas se estiverem contidas em outras
	// OSB:	1) Estas expressões precisam de tratamento especial pois o \b se confunde com letras acentuadas e cedilha
	//	2) São usados dois grupos extras nestas regras: um para o 1º caractere anterior e outro para o 1º posterior à palavra;
	tabela = {
		'ã([eo])': '$1d$2$3',
		// A letra "d" em itálico parece um "ã" (por causa da serifa no topo do "d")
		'ão(u)?s': '$1do$2s$3',
		'ê': '$1é$2'
	};

	$.each( tabela, function(find, rep){
		list.push( {
			find: new RegExp('([^' + LETRA + '])' + find + '([^' + LETRA + '])', 'g'),
			replace: rep
			// 5 // FIXME
		} );
	} );

	// Estas expressões SÃO convertidas mesmo se estiverem contidas em outras
	// Se for preciso impedir a conversão nestes casos, basta mover a regra para a primeira tabela (acima)
	tabela = {
		' +([.,;:!?]) +': '$1 ',
		// Remoção do espaçamento antes de pontuação
		'([a-zA-Z])-\\n([a-zA-Z])': '$1$2',
		// Remoção de hifens em quebras de linha
		' *— *': ' — ',
		// Ajuste no espaçamento em torno de um traço —
		'\\n(\\d+)\\. ([^\\n]+)': '\n{' + '{âncora|Item $1}}$1. $2',
		// Inclusão de âncoras no início de cada item
		'-,': ';',
		'(\\d+)(?:\\?|o|"\\.) ([Cc]asos?|[Ee]xemplos?|[Pp]rincipios?)': '$1º $2',
		'[Ii]o ([Cc]asos?|[Ee]xemplos?|[Pp]rincipios?)': '1º $1',
		'(\\d+)\\.[\\t ]': '$1. ',
		// Correção da numeração manual
		'ãa': 'da',
		'qne': 'que'
	};

	$.each( tabela, function(find, rep){
		list.push({
			find: new RegExp(find, 'g'),
			replace: rep
			// 5 // FIXME
		},{
			// Converte também a palavra correspondente com a primeira letra maiúscula
			find: new RegExp('\\b' + ucFirst(find), 'g'),
			replace: ucFirst(rep)
			// 5 // FIXME
		});
	});

	// Sequências de caracteres, contendo dígitos e operadores, iniciada e terminada por números possívelmente são fórmulas
	list.push({
		find: /(\d+[xX+-\/=<>][xX+-\/=0-9<>]+\d+)/g,
		replace: '♪$1♫'
	},{
		// Espaçamento entre os operadores de algumas fórmulas
		find: /♪([^♪]*[^ ♪])([xX+-\/=<>])([^ ♫][^♫]*)♫/g,
		replace: '♪$1 $2 $3♫'
		// 10 // FIXME
	},{
		// Sinal de vezes em LaTeX
		find: /♪([^♪]*\d+)\s*[xX]\s*(\d+[^♫]*)♫/g,
		replace: '♪$1 \\times $2♫'
		// 10 // FIXME
	},{
		// Remoção de tags duplicadas no processo
		find: /(?:♪|<math>)+/g,
		replace: '<math>'
	},{
		find: /(?:♫|<\/math>)+/g,
		replace: '</math>'
	});
	regex( context, list,
	       'Correção de OCR' + ( totalAnchorsBefore < context.$target.val().split( '{{âncora' ).length
			? '; Adição de {{âncora}}'
			: ''
		)
	);
	// FIXME: Only do a diff if the text was changed
	// Maybe use bit operators: MINOR & DIFF & SAVE & ...
	$('#wpDiff').click();
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

function convertMath( context ){
	var	text = context.$target.val(),
		regex = 0, subst = 1, func = 2,
		command, i, dir, summary;
	command = [// (dir == 0) -> latex2wiki; (dir == 1) -> wiki2latex
		[// fórmulas dentro dos parágrafos
			[/\$\s*([^$]*?)\s*\$/img, '<math>$1</math>', null],
			[/<\/?math>/ig, '$', null]
		],
		[// fórmulas em parágrafos isolados
			[/\s*\$\$\s*([^$]*?)\s*\$\$\s*/img, '\n\n: <math>$1</math>\n\n', null],
			[null, null, null]
		],
		[// notas de rodapé
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
	context.$target.val( text );
	if (0 === dir) {
		summary = 'Convertendo de LaTeX para Wiki, [usando [[m:User:Pathoschild/Scripts/TemplateScript|regex]]]';
	} else {
		summary = 'Criando versão latex [usando [[m:User:Pathoschild/Scripts/TemplateScript|regex]]] (não era para salvar: REVERTA ESTA EDIÇÃO!)';
	}
	pathoschild.TemplateScript.InsertLiteral( context.$editSummary, summary, 'replace' );
}

function latex2wiki( context ){
	var	top = '',
		bottom = [
			'\n== Notas ==',
			'<references group="nota "/>',
			'\n== Referências ==',
			'<references/>',
			'{' + '{AutoCat}' + '}'
		].join('\n');

	list = [{
		find: /\$\s*([^$]*?)\s*\$/img,
		replace: '<math>$1</math>'
	},{
		find: /\s*\$\$\s*([^$]*?)\s*\$\$\s*/img,
		replace: '\n\n{' + '{Fórmula|<math>$1</math>}' + '}\n\n'
	},{
		find: /<\/math>([\.,;:!\?]) */mig,
		replace: '$1</math> '
	},{
		find: /\\footnote\{([^}]+?)%?\\label\{[^}]+?\}\s*\}/g,
		replace: '<ref name="$2">$1</ref>'
	},{
		find: /\\footnote\{(.*?)\}/g,
		replace: '<ref>$1</ref>'
	},{
		find: /\n*\\chapter\{([^}\n]+)\}\n*/gm,
		replace: '\n\n= $1 =\n\n'
	},{
		find: /\n*\\section\{([^}\n]+)\}\n*/gm,
		replace: '\n\n== $1 ==\n\n'
	},{
		find: /\n*\\subsection\{([^}\n]+)\}\n*/gm,
		replace: '\n\n=== $1 ===\n\n'
	},{
		find: /\n*\\subsubsection\{([^}\n]+)\}\n*/gm,
		replace: '\n\n==== $1 ====\n\n'
	},{
		find: /\n*\\begin\{defi\}%?(?:\\label\{defi:[^}]+?\})?\s*/gm,
		replace: '\n{'+'{Definição\n|'
	},{
		find: /\n*\\begin\{teo\}%?(?:\\label\{teo:[^}]+?\})?\s*/gm,
		replace: '\n{'+'{Teorema\n|'
	},{
		find: /\n*\\begin\{proof\}%?(?:\\label\{proof:[^}]+?\})?\s*/gm,
		replace: '\n{'+'{Demonstração\n|'
	},{
		find: /\n*\\begin\{lema\}%?(?:\\label\{lema:[^}]+?\})?\s*/gm,
		replace: '\n{'+'{Lema\n|'
	},{
		find: /\n*\\begin\{prop\}%?(?:\\label\{prop:[^}]+?\})?\s*/gm,
		replace: '\n{'+'{Proposição\n|'
	},{
		find: /\n*\\begin\{cor\}%?(?:\\label\{cor:[^}]+?\})?\s*/gm,
		replace: '\n{'+'{Corolário\n|'
	},{
		find: /\n*\\begin\{ex\}%?(?:\\label\{ex:[^}]+?\})?\s*/gm,
		replace: '\n{'+'{Exemplo\n|'
	},{
		find: /\n*\\begin\{exer\}%?(?:\\label\{exer:[^}]+?\})?\s*/gm,
		replace: '\n{'+'{Exercício\n|'
	},{
		find: /\n*\\begin\{obs\}%?(?:\\label\{obs:[^}]+?\})?\s*/gm,
		replace: '\n{'+'{Observação\n|'
	},{
		find: /\n*\\end\{(?:defi|teo|proof|lema|prop|cor|ex|exer|obs)\}\s*/gm,
		replace: '\n}}\n\n'
	},{
		find: /\n?\\end\{(?:enumerate|itemize)\}\n?/gm,
		replace: '\n'
	},{
		find: /^\s*\\item\s+/gm,
		replace: '* '
	}];

	regex( context, list );
	context.$target.val( top + context.$target.val() + bottom );
	pathoschild.TemplateScript.InsertLiteral(
		context.$editSummary,
		'Convertendo de LaTeX para Wiki, [usando [[m:User:Pathoschild/Scripts/TemplateScript|regex]]]',
		'replace'
	);
}

function wiki2latex( context ){
	var	preambulo, reWikiLink,
		WikiLink = '',
		url = mw.config.get( 'wgServer' ) + '/wiki/Special:Search/';
	list = [];
	preambulo = [
		'\\documentclass[12pt,a4paper,titlepage]{book}' +
		'\\usepackage[brazil]{babel}' +
		'\\usepackage[utf8]{inputenc}%[latin1] no Windows' +
		'\\usepackage[T1]{fontenc}' +
		'\\usepackage{amsthm, amssymb, amsmath}' +
		'\\usepackage{footmisc}\n'
	].join('\n');
	if ( context.$target.val().match(/<!--(.|\s)*?-->/) ){
		preambulo += '\\usepackage{verbatim}' +
			' %permite usar \\begin{comment}...\\end{comment} para comentar varias linhas\n';
		list.push( {
			find: /<!--(.|\s)*?-->/g,
			replace: '\\begin{comment}\n$1\n\\end{comment}'
		});
	}

	preambulo += "\\usepackage[a4paper=true,pagebackref=true]{hyperref}\n\n" +
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
	list.push( {
		// Comandos wiki que são descartados
		find: /\{\{Auto(Cat|Nav)\}\}/ig,
		replace: ''
	},{
		find: /<\/?noinclude>/ig,
		replace: ''
	},{
		find: /^(=+)\s*(?:Notas|Referências)\s*\1$/mig,
		replace: ''
	},{
		find: /^\s*<references(?:\s*group\s*=\s*"[^"]*")?\/>\s*$/mig,
		replace: ''
	},{
		// coloca a pontuação que vem depois de fórmulas fora das tags <math>
		// Ver [[w:en:Wikipedia:Manual of Style/Mathematics#Punctuation after formulae]]
		find: /([\.,;:!\?])<\/math> */mig,
		replace: '</math>$1 '
	},{
		find: /<\/?math>/ig,
		replace: '$'
	},{
		// notas de rodapé
		find: /<ref.*?(?:name\s*=\s*"([^"]+)").*?>(.*?)<\/ref.*?>/ig,
		replace: '\\footnote{$2\\label{nota:$1}}'
	},{
		find: /<ref.*?>(.*?)<\/ref.*?>/ig,
		replace: '\\footnote{$1%\\label{nota:}\n}'
	},{
		// cabeçalhos
		find: /^====([^\n]+)====\s*$/mg,
		replace: '\n\n\\subsubsection{$1}\n\n'
	},{
		find: /^===([^\n]+)===\s*$/mg,
		replace: '\n\n\\subsection{$1}\n\n'
	},{
		find: /^==([^\n]+)==\s*$/mg,
		replace: '\n\n\\section{$1}\n\n'
	},{
		find: /^=([^\n]+)=\s*$/mg,
		replace: '\n\n\n\\chapter{$1}\\label{cap:$1}\n\n\n'
	},{
		// predefinições matemáticas
		find: /\{\{\s*(?:Definição)\|([^}]+)\}\}/ig,
		replace: '\\begin{defi}%\\label{defi:}\n$1\n\\end{defi}'
	},{
		find: /\{\{\s*(?:Teorema)\|([^}]+)\}\}/ig,
		replace: '\\begin{teo}%\\label{teo:}\n$1\n\\end{teo}'
	},{
		find: /\{\{\s*(?:Demonstração)\|([^}]+)\}\}/ig,
		replace: '\\begin{proof}\n$1\n\\end{proof}'
	},{
		find: /\{\{\s*(?:Lema)\|([^}]+)\}\}/ig,
		replace: '\\begin{lema}%\\label{lema:}\n$1\n\\end{lema}'
	},{
		find: /\{\{\s*(?:Proposição)\|([^}]+)\}\}/ig,
		replace: '\\begin{prop}%\\label{prop:}\n$1\n\\end{prop}'
	},{
		find: /\{\{\s*(?:Corolário)\|([^}]+)\}\}/ig,
		replace: '\\begin{cor}%\\label{cor:}\n$1\n\\end{cor}'
	},{
		find: /\{\{\s*(?:Exemplo)\|([^}]+)\}\}/ig,
		replace: '\\begin{ex}%\\label{ex:}\n$1\n\\end{ex}'
	},{
		find: /\{\{\s*(?:Exercício)\|([^}]+)\}\}/ig,
		replace: '\\begin{exer}%\\label{exer:}\n$1\n\\end{exer}'
	},{
		find: /\{\{\s*(?:Observação)\|([^}]+)\}\}/ig,
		replace: '\\begin{obs}%\\label{obs:}\n$1\n\\end{obs}'
	},{
		find: /\{\{Fórmula\|([\d.]+)\|([^\n]+)\}\}\n/igm,
		replace: '\\begin{equation}\\label{eq:$1}\n$2\n\\end{equation}\n'
	},{
		find: /\{\{Fórmula\|([^\n]+)\}\}\n/igm,
		replace: '\\begin{equation}\\label{eq:???}\n$1\n\\end{equation}\n'
	},{
		// links internos e externos
		find: /\{\{\s*(?:Âncoras?)\|([^}]+)\}\}/ig,
		replace: '\\label{$1}'
	});
	regex( context, list );

	reWikiLink = /\[\[\s*([a-zA-Z:]+)\s*:\s*([^\|\]]+?)\s*?\|\s*([^\]]*?)\s*\]\]/i;
	WikiLink = reWikiLink.exec( context.$target.val() );
	while( WikiLink ){// [[proj:idioma:alvo|texto]]
		WikiLink[2] = encodeURI(WikiLink[2]).replace(/(%|#)/g,'\\$1');
		context.$target.val(
			context.$target.val().replace(reWikiLink, '\\href{' + url + '$1:' + WikiLink[2] + '}{$3}')
		);
		WikiLink = reWikiLink.exec( context.$target.val() );
	}
	reWikiLink = /\{\{\s*(w|wikt)\s*\|\s*([^\|}]+?)\s*?\|\s*([^}]*?)\s*\}\}/i;
	WikiLink = reWikiLink.exec( context.$target.val() );
	while( WikiLink ){// {{proj|alvo|texto}}
		WikiLink[2] = encodeURI(WikiLink[2]).replace(/(%|#)/g,'\\$1');
		context.$target.val(
			context.$target.val().replace(reWikiLink, '\\href{' + url + '$1:' + WikiLink[2] + '}{$3}')
		);
		WikiLink = reWikiLink.exec( context.$target.val() );
	}
	reWikiLink = /\{\{\s*(w|wikt)\s*\|\s*([^\|}]+?)\s*\}\}/i;
	WikiLink = reWikiLink.exec( context.$target.val() );
	while( WikiLink ){// {{proj|alvo}}
		WikiLink[2] = encodeURI(WikiLink[2]).replace(/(%|#)/g,'\\$1');
		context.$target.val(
			context.$target.val().replace(reWikiLink, '\\href{' + url + '$1:' + WikiLink[2] + '}{$2}')
		);
		WikiLink = reWikiLink.exec( context.$target.val() );
	}

	list = [{
		find: /\[\[(?:\.\.\/[^#]+)?#Definição ([^\]]+)\|([^\]]+)\]\]/ig,
		replace: '\\hyperref[defi:$1]{$2}'
	},{
		find: /\[\[(?:\.\.\/[^#]+)?#Proposição ([^\]]+)\|([^\]]+)\]\]/ig,
		replace: '\\hyperref[prop:$1]{$2}'
	},{
		find: /\[\[(?:\.\.\/[^#]+)?#Lema ([^\]]+)\|([^\]]+)\]\]/ig,
		replace: '\\hyperref[lema:$1]{$2}'
	},{
		find: /\[\[(?:\.\.\/[^#]+)?#Teorema ([^\]]+)\|([^\]]+)\]\]/ig,
		replace: '\\hyperref[teo:$1]{$2}'
	},{
		find: /\[\[(?:\.\.\/[^#]+)?#Corolário ([^\]]+)\|([^\]]+)\]\]/ig,
		replace: '\\hyperref[cor:$1]{$2}'
	},{
		find: /\[\[(?:\.\.\/[^#]+)?#Exemplo ([^\]]+)\|([^\]]+)\]\]/ig,
		replace: '\\hyperref[ex:$1]{$2}'
	},{
		find: /\[\[(?:\.\.\/[^#]+)?#Exercício ([^\]]+)\|([^\]]+)\]\]/ig,
		replace: '\\hyperref[exer:$1]{$2}'
	},{
		find: /\[\[(?:\.\.\/[^#]+)?#(?:Obs\.|Observação)? ([^\]]+)\|([^\]]+)\]\]/ig,
		replace: '\\hyperref[obs:$1]{$2}'
	},{
		find: /:\n+#\s*/ig,
		replace: ':\n\\begin{enumerate}\n\\item '
	},{
		find: /\n(?:\*|#)\s*/ig,
		replace: '\n\\item '
	},
/*
	{
		find: //ig,
		replace: '\\begin{enumerate}\n'
	},{
		find: //ig,
		replace: '\\begin{itemize}\n'
	},{
		find: /\* /ig,
		replace: '\\item '
	},{
		find: /# /ig,
		replace: '\\item '
	},{
		find: //ig,
		replace: '\\end{enumerate}\n'
	},{
		find: //ig,
		replace: '\\end{itemize}\n'
	},
*/
	{
		find: /\n*(\\(?:sub){0,2}section[^\n]+)\n*/ig,
		replace: '\n\n$1\n'
	},{
		find: /\n*(\\chapter[^\n]+)\n*/ig,
		replace: '\n\n\n$1\n\n'
	},{
		// Aspas
		find: /"([^"]+)"/ig,
		replace: "``$1''"
	}];

	regex( context, list );

	context.$target.val(
		preambulo + [
		'\\begin{document}\n',
		'\\frontmatter\n',
		'\\tableofcontents\n',
		'\\mainmatter %Depois de índice e prefácio\n',
		'\\chapter{' + mw.config.get( 'wgTitle' ) + '}\\label{cap:'
			+ mw.config.get( 'wgTitle' ).toLowerCase() + '}\n\n',
		context.$target.val(),
		'\n\\backmatter\n',
		'\\bibliographystyle{amsalpha} %amsalpha, amsplain, plain, alpha, abbrvnat',
		'\\bibliography{biblio}\\label{cap:biblio}',
		'\\addcontentsline{toc}{chapter}{Referências Bibliográficas}\n',
		'\\end{document}'
		].join('\n')
	);
	pathoschild.TemplateScript.InsertLiteral(
		context.$editSummary,
		'Versão em LaTeX [produzida com'
			+' [[m:User:Pathoschild/Scripts/TemplateScript|expressões regulares]]]'
			+'(não era para salvar: REVERTA ESTA EDIÇÃO!)',
		'replace'
	);
}

function generalFixes( context ){
	var c = context;
	switch( mw.config.get( 'wgDBname' ) ) {
	case 'ptwiki':
		fixObsoleteHTML(c);
		fixMath(c);
		fixHTTPLinks(c);
		fixLists(c);
		fixObsoleteTemplatesOnPtwiki(c);
		formatLinks(c);
		fixImageLinks(c);
		break;
	case 'ptwikisource':
		break;
	case 'ptwikibooks':
		fixObsoleteHTML(c);
		formatHeadings(c);
		formatTemplates(c);
		formatCategories(c);
		fixLists(c);
		abs2rel(c);
		formatLinks(c);
		fixImageLinks(c);
		fixMath(c);
		usingRegex(c);
		formatHeadings(c);
		break;
	default:

	}
	// FIXME: Only do a diff if the text was changed
	// Maybe use bit operators: MINOR & DIFF & SAVE & ...
	$('#wpDiff').click();
}

function loadMyRegexTools(){
	pathoschild.TemplateScript.AddWith({
		forActions: 'edit'
	},[{
		name: '[Editar]',
		script: editRegexes
	}, {
		name: 'Formatação geral',
		script: generalFixes
	}, {
		name: 'Corrige assinatura',
		script: fixSignature,
		isMinorEdit: true
	}, {
		name: 'Corrige links HTTP',
		script: fixHTTPLinks,
		isMinorEdit: true
	}]);

	switch( mw.config.get( 'wgDBname' ) ) {
	case 'ptwiki':
		pathoschild.TemplateScript.AddWith({
			forActions: 'edit'
		},[{
			name: 'Usar "Ver também,..."',
			script: fixObsoleteTemplatesOnPtwiki
		}, {
			name: 'Corrigir fórmulas',
			script: fixMath
		}, {
			name: 'Corrigir listas',
			script: fixLists
		}]);
		break;
	case 'ptwikisource':
		pathoschild.TemplateScript.Add({
			name: 'Corrigir OCR',
			script: fixOCR,
			forActions: 'edit'
		});
		break;
	case 'ptwikibooks':
		pathoschild.TemplateScript.AddWith({
			forActions: 'edit'
		},[{
			name: 'Corrigi fórmulas',
			script: fixMath
		}, {
			name: 'Remover linhas duplicadas',
			script: function( context ){
				var items = context.$target.val()
					.replace( /\r|\n+/gi, '\n' )
					.split( '\n' );
				context.$target.val(
					dedupeList( items ).join( '\r\n' )
				);
			}
		}, {
			name: 'Formatar cabeçalhos',
			script: formatHeadings
		}, {
			name: 'Formatar predefinições',
			script: formatTemplates
		}, {
			name: 'Formatar categorias',
			script: formatCategories
		}, {
			name: 'Corrigir listas',
			script: fixLists
		}, {
			name: 'Usar links relativos',
			script: abs2rel
		}, {
			name: 'Formatar links',
			script: formatLinks
		}, {
			name: 'TEST: Refs do Google Books',
			script: convertRefs
		}, {
			name: 'TEST: Wiki -> LaTeX',
			script: wiki2latex
		}, {
			name: 'TEST: LaTeX -> Wiki',
			script: latex2wiki
		}]);

		pathoschild.TemplateScript.AddWith({
			forActions: 'edit',
			category: 'Gerenciador de livros'
		},[{
			name: 'Gerar lista de capítulos',
			script: createTemplate
		}, {
			name: 'Gerar coleção',
			script: createCollectionPage
		}, {
			name: 'Gerar versão para impressão',
			script: createPrintVersion
		}, {
			name: 'Gravar lista de capítulos (CUIDADO!)',
			script: saveChaptersList
		}, {
			name: 'TEST: Criar AutoNav',
			script: createAutoNav
		}]);
		break;
	default:
		if( 'pt' === mw.config.get( 'wgContentLanguage' ) ) {
			pathoschild.TemplateScript.Add({
				name: 'Corrige [[Ficheiro',
				script: fixImageLinks
			});
		}
		pathoschild.TemplateScript.Add({
			name: 'Regex no sumário',
			script: usingRegex
		});
	}
}

$.getScript( '//meta.wikimedia.org/w/index.php?title=User:Pathoschild/Scripts/TemplateScript/dev.js&action=raw&ctype=text/javascript&smaxage=21600&maxage=86400', loadMyRegexTools );

}( mediaWiki, jQuery ) );