/**
 * TemplateScript
 * Adds a menu of configurable templates and scripts to the sidebar
 *
 * @author: [[m:user:Pathoschild]] ([[m:User:Pathoschild/Scripts/TemplateScript]])
 * @update-token: [[File:pathoschild/templatescript.js]]
 * @author: Helder (https://github.com/he7d3r)
 * @license: CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0/> (this configuration file)
 */
( function ( mw, $ ) {
	'use strict';

	var dictionaries = 'Wikisource:Modernização/Dicionário/pt-PT|Wikisource:Modernização/Dicionário/pt-BR',
		// Maiúsculas e minúsculas usadas em português
		LETRA = 'A-Za-zÁÀÂÃÇÉÊÍÓÒÔÕÚáàâãçéêíóòôõú',
		oldText = null,
		textChanged = false,
		list = [];

	function clickDiff() {
		var $button;
		if ( !textChanged ) {
			return;
		}
		$button = $( '#wpDiffLive' );
		if ( !$button.length ) {
			$button = $( '#wpDiff' );
		}
		$button.click();
	}

	function regex( editor, regexList, summary, pos ) {
		var $textBox = $( '#wpTextbox1' ),
			i, l, rule;
		// By default, apply the regexes to the whole text
		if ( !$textBox.textSelection( 'getSelection' )) {
			$textBox.textSelection( 'setSelection', { start: 0, end: $textBox.val().length } );
		}
		for ( i = 0, l = regexList.length; i < l; i++ ) {
			rule = regexList[ i ];
			editor.replaceSelection( function( selectedText ) {
				return selectedText.replace( rule.find, rule.replace );
			} );
		}
		if ( editor.get() !== oldText ) {
			textChanged = true
			if ( summary ) {
				switch ( pos ) {
					case 'before':
						editor.forField( '#wpSummary' ).prepend( summary );
						break;

					case 'replace':
						editor.setEditSummary( summary );
						break;

					default:
						editor.appendEditSummary( summary );
						break;
				}
			}
		}
	}

	// Adaptação de um script de Paul Galloway (http://www.synergyx.com)
	function dedupeList( items ) {
		var	i, l,
			count = 0,
			newlist = [],
			hash = {};
		if ( !Array.isArray( items ) ) {
			return;
		}
		for ( i = 0, l = items.length; i < l; i++ )	{
			if ( hash[ items[ i ].toLowerCase() ] !== 1 ) {
				newlist = newlist.concat( items[ i ] );
				hash[ items[ i ].toLowerCase() ] = 1;
			} else {
				count++;
			}
		}
		if ( count > 0 ) {
			alert( 'Foram removidas ' + count + ' linhas duplicadas' );
		} else {
			alert( 'Não havia linhas duplicadas' );
		}
		return newlist;
	}

	function fixObsoleteTemplatesOnPtwiki( editor ) {
		var reText = {
			// [[w:Especial:Páginas afluentes/Predefinição:Ver também]]
			seeAlso: 'V(?:eja|er|ide|Consultar)[_ ](?:tamb[ée]m|mais|ainda)|(?:Tópico|Artigo|Página|Assunto)s[_ ](?:relacionad|divers)[oa]s|(?:Li(?:gaçõe|nk)|Referência)s[_ ]Intern[ao]s',
			// [[w:Especial:Páginas afluentes/Predefinição:Bibliografia]]
			biblio: 'Bibliografia',
			// [[w:Especial:Páginas afluentes/Predefinição:Ligações externas]]
			extLinks: '(?:Apontadores|Atalhos?|Elos?|Enlaces?|Lin(?:k|que)s?|Vínculos?)(?: externos?)?|(?:Ligaç(?:ão|ões)|Páginas?|Referências?)(?: externas?)|(?:Ligaç(?:ão|ões)|Links|Recursos)(?: para o exterior| exterior(?:es)?(?: [àa] Wikip[ée]dia)?)?|S(?:ites|[íi]tios)|LE|Links? relacionados?|Páginas? da Internet|Weblinks?'
		};
		oldText = editor.get();
		list = [ {
			find: new RegExp( '\\n==\\s*\\{\\{\\s*(?:' + reText.seeAlso + ')\\s*\\}\\}\\s*==', 'gi' ),
			replace: '\n== Ver também =='
		}, {
			find: new RegExp( '\\n==\\s*\\{\\{\\s*' + reText.biblio + '\\s*\\}\\}\\s*==', 'gi' ),
			replace: '\n== Bibliografia =='
		}, {
			find: new RegExp( '\\n==\\s*\\{\\{\\s*(?:' + reText.extLinks + ')\\s*\\}\\}\\s*==', 'gi' ),
			replace: '\n== Ligações externas =='
		} ];

		regex( editor, list, '-[[Special:PermaLink/29330043|predef\'s obsoletas]]' );
		oldText = editor.get();
		list = [ {
			find: new RegExp( '\\n==(\\s?)\\s*(?:' + reText.seeAlso + ')(\\s?)\\s*==', 'gi' ),
			replace: '\n==$1Ver também$2=='
		}, {
			find: new RegExp( '\\n==(\\s?)\\s*' + reText.biblio + '(\\s?)\\s*==', 'gi' ),
			replace: '\n==$1Bibliografia$2=='
		}, {
			find: new RegExp( '\\n==(\\s?)\\s*(?:' + reText.extLinks + ')(\\s?)\\s*==', 'gi' ),
			replace: '\n==$1Ligações externas$2=='
		} ];

		regex( editor, list, '+[[WP:LE#Seções padrão|padronização das seções]]' );
		oldText = editor.get();
		list = [ {
			find: /<!--+ *(?:Inserir categorias e interwikis apenas na página de DOC desta predefinição|(?:Please )?Add (this template's )?categories (?:and interwikis )?to the \/doc (?:sub)?page, (?:not here(?:!|, thanks)|thanks)) *--+>/gi,
			replace: '<!-- Inserir categorias apenas na documentação desta predefinição -->'
		}, {
			find: /<!--+ *(?:POR FAVOR, ADICIONE CATEGORIAS (?:E INTERW[IÍ]KIS )?NO FINAL DESTA PÁGINA|EDIT TEMPLATE DOCUMENTATION BELOW THIS LINE|PLEASE ADD CATEGORIES AND INTERWIKIS AT THE BOTTOM OF THIS PAGE) *--+>/gi,
			replace: '<!-- Categorias no final desta página e links para outros idiomas no Wikidata -->'
		}, {
			find: /<!--+ *(?:CATEGORIAS (?:E INTERW[ÍI]KIS )?AQUI, OBRIGADO|CATEGORIES AND INTERWIKIS HERE, THANKS|ADICIONE CATEGORIAS ABAIXO DESTA LINHA|ADD CATEGORIES BELOW THIS LINE|Categorias e interwikis da predefinição) *--+>/gi,
			replace: '<!-- Categorias aqui e links para outros idiomas no Wikidata -->'
		}, {
			find: /<!--+ *(?:ADD INTERWIKIS BELOW THIS LINE) *--+>\n/gi,
			replace: ''
		} ];
		regex( editor, list, 'indique os outros idiomas no Wikidata' );
	}

	// See also https://gerrit.wikimedia.org/r/gitweb?p=mediawiki/core.git;a=blob;f=includes/Sanitizer.php;hb=bc9d9f1f9c796ee01234f484724cc064b9008eba#l615
	function fixObsoleteHTML( editor ) {
		var	colorNames = '(?:AliceBlue|AntiqueWhite|Aqua(?:marine)?|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue(?:Violet)?|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|Dark(?:Blue|Cyan|GoldenRod|Gray|Green|Grey|Khaki|Magenta|OliveGreen|orange|Orchid|Red|Salmon|SeaGreen|Slate(?:Blue|Gray|Grey)|Turquoise|Violet)|DeepPink|DeepSkyBlue|DimGray|DimGrey|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold(?:enRod)?|Gray|Green(?:Yellow)?|Grey|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender(?:Blush)?|LawnGreen|LemonChiffon|Light(?:Blue|Coral|Cyan|GoldenRodYellow|Gray|Green|Grey|Pink|Salmon|SeaGreen|SkyBlue|SlateGray|SlateGrey|SteelBlue|Yellow)|Lime(?:Green)?|Linen|Magenta|Maroon|Medium(?:AquaMarine|Blue|Orchid|Purple|SeaGreen|SlateBlue|SpringGreen|Turquoise|VioletRed)|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive(?:Drab)?|Orange(?:Red)?|Orchid|Pale(?:GoldenRod|Green|Turquoise|VioletRed)|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|Slate(?:Blue|Gray|Grey)|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Turquoise|Violet|Wheat|White(?:Smoke)?|Yellow(?:Green)?)',
			colorCodes = '(?:[a-f0-9]{6}|[a-f0-9]{3})',
			color = '(?:' + colorNames + '|\\#?' + colorCodes + ')',
			link = '(\\s*\\[\\[)([^\\]]+)(\\]\\]\\s*)',
			pipedLink = '(\\s*\\[\\[[^\\|]+\\|)([^\\]]+)(\\]\\]\\s*)';
		oldText = editor.get();
		list = [ {
			// <font color="red">[[page]]</font>
			// [[page|<span style="color: red;">page</span>]]
			find: new RegExp(
				'<font\\s+color\\s*=\\s*(["\']?)(' + color + ')\\1\\s*>' +
					link + '<\\/font>',
				'gi'
			),
			replace: '$3$4|<span style="color: $2;">$4</span>$5'
		}, {
			// <font color="red">[[page|text]]</font>
			// [[page|<span style="color: red;">text</span>]]
			find: new RegExp(
				'<font\\s+color\\s*=\\s*(["\']?)(' + color + ')\\1\\s*>' +
					pipedLink + '<\\/font>',
				'gi'
			),
			replace: '$3<span style="color: $2;">$4</span>$5'
		}, {
			// <font color="red">text [[page|text]] text</font>
			// <span style="color: red;">text [[page|text]] text</span>
			find: new RegExp(
				'<font\\s+color\\s*=\\s*(["\']?)(' + color +
					')\\1\\s*>(.+?)<\\/font>',
				'gi'
			),
			replace: '<span style="color: $2;">$3</span>'
		}, {
			// <font color="red" face="Verdana">text</font>
			// <span style="color: red; font-family: Verdana;">text</span>
			find: new RegExp(
				'<font\\s+color\\s*=\\s*(["\']?)(' + color +
					')\\1\\s*face\\s*=\\s*(["\']?)([^"\'>]+?)\\3\\s*>(.+?)<\\/font>',
				'gi'
			),
			replace: '<span style="color: $2; font-family: $4;">$5</span>'
		}, {
			// <font color="red" face="Verdana">[[page]]</font>
			// [[page|<span style="color: red; font-family: Verdana;">page</span>]]
			find: new RegExp(
				'<font\\s+color\\s*=\\s*(["\']?)(' + color +
					')\\1\\s*face\\s*=\\s*(["\']?)([^"\'>]+?)\\3\\s*>' +
					link + '<\\/font>',
				'gi'
			),
			replace: '$5$6|<span style="color: $2; font-family: $4;">$6</span>$7'
		}, {
			// <font color="red" face="Verdana">[[page|text]]</font>
			// [[page|<span style="color: red; font-family: Verdana;">text</span>]]
			find: new RegExp(
				'<font\\s+color\\s*=\\s*(["\']?)(' + color +
					')\\1\\s*face\\s*=\\s*(["\']?)([^"\'>]+?)\\3\\s*>' +
					pipedLink + '<\\/font>',
				'gi'
			),
			replace: '$5$6|<span style="color: $2; font-family: $4;">$6</span>$7'
		}, {
			// <font face="Verdana" color="red">text</font>
			// <span style="color: red;font-family: Verdana;">text</span>
			find: new RegExp(
				'<font\\s+face\\s*=\\s*(["\']?)([^"\'>]+?)\\1\\s*color\\s*=\\s*(["\']?)(' +
					color +
					')\\3\\s*>(.+?)<\\/font>',
				'gi'
			),
			replace: '<span style="font-family: $2; color: $4;">$5</span>'
		}, {
			// <font face="Verdana" color="red">[[page]]</font>
			// [[page|<span style="font-family: Verdana; color: red;">page</span>]]
			find: new RegExp(
				'<font\\s+face\\s*=\\s*(["\']?)([^"\'>]+?)\\1\\s*color\\s*=\\s*(["\']?)(' +
					color +
					')\\3\\s*>(.+?)<\\/font>',
				'gi'
			),
			replace: '$5$6|<span style="font-family: $2; color: $4;">$6</span>$7'
		}, {
			// <font face="Verdana" color="red">[[page|text]]</font>
			// [[page|<span style="font-family: Verdana; color: red;">text</span>]]
			find: new RegExp(
				'<font\\s+face\\s*=\\s*(["\']?)([^"\'>]+?)\\1\\s*color\\s*=\\s*(["\']?)(' +
					color +
					')\\3\\s*>' +
					pipedLink + '<\\/font>',
				'gi'
			),
			replace: '$5$6|<span style="font-family: $2; color: $4;">$6</span>$7'
		}, {
			// <font face="Verdana">text</font>
			// <span style="font-family: Verdana;">text</span>
			find: /<font\s+face\s*=\s*["']?([^"'>]+?)["']?\s*>(.+?)<\/font>/gi,
			replace: '<span style="font-family: $1;">$2</span>'
		}, {
			// <font face="Verdana" color="red" size="6">text</font>
			// <span style="font-family: Verdana; color: red; font-size: 100%;">text</span>
			find: /<font\s+face\s*=\s*["']?([^"'>]+?)["']?\s*color\s*=\s*["']?([^"']+?)["']?\s*size\s*=\s*["']?([^"']+?)["']?\s*>(.+?)<\/font>/g,
			replace: '<span style="font-family: $1; color: $2; font-size: 100%;">$4</span>'
		}, {
			// <font face="Verdana" size="6" color="red">text</font>
			// <span style="font-family: Verdana; font-size: 100%; color: red;">text</span>
			find: /<font\s+face\s*=\s*["']?([^"'>]+?)["']?\s*size\s*=\s*["']?([^"']+?)["']?\s*color\s*=\s*["']?([^"']+?)["']?\s*>(.+?)<\/font>/g,
			replace: '<span style="font-family: $1; font-size: 100%; color: $3;">$4</span>'
		}, {
			// <font color="red" face="Verdana" size="6">text</font>
			// <span style="color: red; font-family: Verdana; font-size: 100%;">text</span>
			find: /<font\s+color\s*=\s*["']?([^"']+?)["']?\s*face\s*=\s*["']?([^"'>]+?)["']?\s*size\s*=\s*["']?([^"']+?)["']?\s*>(.+?)<\/font>/g,
			replace: '<span style="color: $1; font-family: $2; font-size: 100%;">$4</span>'
		}, {
			// <font color="red" size="6" face="Verdana">text</font>
			// <span style="color: red; font-size: 100%; font-family: Verdana;">text</span>
			find: /<font\s+color\s*=\s*["']?([^"']+?)["']?\s*size\s*=\s*["']?([^"']+?)["']?\s*face\s*=\s*["']?([^"'>]+?)["']?\s*>(.+?)<\/font>/g,
			replace: '<span style="color: $1; font-size: 100%; font-family: $3;">$4</span>'
		}, {
			// <font size="6" face="Verdana" color="red">text</font>
			// <span style="font-size: 100%; font-family: Verdana; color: red;">text</span>
			find: /<font\s+size\s*=\s*["']?([^"']+?)["']?\s*face\s*=\s*["']?([^"'>]+?)["']?\s*color\s*=\s*["']?([^"']+?)["']?\s*>(.+?)<\/font>/g,
			replace: '<span style="font-size: 100%; font-family: $2; color: $3;">$4</span>'
		}, {
			// <font size="6" color="red" face="Verdana">text</font>
			// <span style="font-size: 100%; color: red; font-family: Verdana;">text</span>
			find: /<font\s+size\s*=\s*["']?([^"']+?)["']?\s*color\s*=\s*["']?([^"']+?)["']?\s*face\s*=\s*["']?([^"'>]+?)["']?\s*>(.+?)<\/font>/g,
			replace: '<span style="font-size: 100%; color: $2; font-family: $3;">$4</span>'
		}, {
			// <source lang=...>...</source>
			// <syntaxhighlight lang=...>...</syntaxhighlight>
			find: /<source\s+(lang.+?>.+?)<\/source>/g,
			replace: '<syntaxhighlight $1</syntaxhighlight>'
		}, {
			// <tt>...</tt>
			// <code>...</code>
			find: /<tt>(.+?)<\/tt>/g,
			replace: '<code>$1</code>'
		}, {
			// <center>...</center>
			// <div style="text-align: center;">...</div>
			find: /<center>([\s\S]*?)<\/center>/g,
			replace: '<div style="text-align: center;">$1</div>'
		}, {
			// <big>...</big>
			// <div style="font-size: larger;">...</div>
			find: /<big>(.+?)<\/big>/g,
			replace: '<div style="font-size: larger;">$1</div>'
		}, {
			find: /\n\|-([^|]*)bgcolor\s*=\s*["']?#([0-9a-f]{6}|[0-9a-f]{3})["']?\s*$/gmi,
			replace: '\n|-$1style="background: #$2;"'
		}, {
			// | width="10px" |
			find: /\n([|!][^|]*)width\s*=\s*["']?([^"'|]+)["']?\s*([^|]*)/g,
			replace: '\n$1style="width: $2;" $3'
		}, {
			find: /(^|\n)\{\|\s*align\s*=\s*["']?center["']?\s*\n/g,
			replace: '$1{| style="margin: 0 auto;"\n'
		}, {
			find: /(^|\n)\{\|\s*cellspacing\s*=\s*["']?0["']?\s*cellpadding\s*=\s*["']?0["']?\s*\n/g,
			replace: '$1{| style="border-spacing: 0; border-collapse: collapse;"\n'
		}, {
			find: /(^|\n)\{\|\s*cellpadding\s*=\s*["']?([1-9]\d*)["']?\s*\n/g,
			replace: '$1{| style="border-spacing: $2px; border-collapse: separate;"\n'
		}, {
			// | align="left" |
			// | align="center" |
			// | align="right" |
			find: /\n([|!][^|]*)align\s*=\s*["']?\s*(center|left|right)[\t ]*["']?[\t ]*([^|]*)/g,
			replace: '\n$1style="text-align: $2;" $3'
		}, {
			// | valign="top" |
			find: /\n([|!][^|]*)valign\s*=\s*["']?\s*(top|middle|bottom|baseline)[\t ]*["']?[\t ]*([^|]*)/g,
			replace: '\n$1style="vertical-align: $2;" $3'
		}, {
			// |- style="abc;" def style="xyz;"
			find: /\n([|!][^|\n]*)style\s*=\s*["']([^|"'\n]+);["']([^|\n]*)style\s*=\s*["']([^|"'\n]+);["']/g,
			replace: '\n$1style="$2;$4;"$3'
		} ];
		regex( editor, list, '-código HTML obsoleto' );
		if ( oldText !== editor.get() ) {
			oldText = editor.get();
			regex( editor, {
				// Simplify color hex codes
				find: /#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/g,
				replace: '#$1$2$3'
			}, '+simplificação' );
		}
	}

	function fixHTTPLinks( editor ) {
		var secureLink = '[https:$1]',
			// TODO: Converter links do servidor antigo (https://secure.wikimedia.org/wikipedia/pt)
			// Ver também: [[Special:SiteMatrix]], [[m:User:Nemo bis/HTTPS]]
			reOldLink = /\[http:(\/\/(?:(?:commons|meta|outreach|species|strategy|wikimania\d{4}|[a-z]{2,3})\.wikimedia|(?:wiki\.)?toolserver|www\.mediawiki|wikimediafoundation|wikisource).+?|\/\/(?:(?:[a-z]{2,3}|bat-smg|be-x-old|cbk-zam|fiu-vro|map-bms|minnan|nds-nl|roa-rup|roa-tara|simple|zh-(?:cfr|classical|min-nan|yue))\.(?:wiki(?:pedia|books|news|quote|source|versity)|wiktionary)).+?)\]/g;
		oldText = editor.get();
		list = [ {
			find: reOldLink,
			replace: secureLink
		}, {
			find: /https:\/\/secure\.wikimedia\.org\/(wiki(?:pedia|books|news|quote|source|versity)|wiktionary)\/([a-z]{2,3}|meta)/g,
			replace: 'https://$2.$1.org'
		} ];
		regex( editor, list, '[[wmfblog:2015/06/12/securing-wikimedia-sites-with-https|https]]' );
	}

	function fixSignature( editor ) {
		var reOldSign = window.reOldSign;
		oldText = editor.get();
		mw.loader.using( 'user.options', function () {
			regex( editor, [ {
				find: reOldSign,
				replace: mw.user.options.get( 'nickname' )
			} ], 'Fixing links (my user account was renamed)' );
			clickDiff();
		} );
	}

	function convertRefs( editor ) {
		oldText = editor.get();
		list = [ {
			find: /Mais informações sobre o livro\nTítulo\t([^\n]+)\nAutor\t([^\n]+)\s([^\n\s]+)\nEditora\t([^\n,]+)(?:,\s(\d+))?\nISBN\t([^\n,]+)(?:,\s\d+)?\nNum. págs.\t(\d+)[^\n]+/img,
			replace: '* {' + '{Referência a livro |NomeAutor=$2 |SobrenomeAutor=$3 |Título=$1 |Subtítulo= |Edição= |Local de publicação= |Editora=$4 |Ano=$5 |Páginas=$7 |Volumes= |Volume= |ID=ISBN $6 |URL= }}'
		} ];
		regex( editor, list, 'Referência do Google Books -> [[Predefinição:Referência a livro]]' );
	}

	function formatHeadings( editor ) {
		var cookbookList = [];
		oldText = editor.get();

		// Formatação do livro de receitas
		if ( mw.config.get( 'wgBookName' ) === 'Livro_de_receitas' ) {
			cookbookList = [ {
				find: /\==\s*[^\n]+\s+[\-–]\s+(\d+)\s*==/ig,
				replace: '== Receita $1 =='
			}, {
				find: /\==='''Ingredientes e Preparo:'''===/ig,
				replace: '=== Ingredientes ==='
			}, {
				find: /\n:?\s*'''(?:Modo\s+de\s+)?(?:Preparo|fazer):?\s*'''\s*\n/ig,
				replace: '\n=== Preparo ===\n'
			}, {
				find: /\n:?\s*'''\s*([^\n:']+)\s*:?\s*'''\s*\n/ig,
				replace: '\n=== $1 ===\n'
			}, {
				find: / --\n/ig,
				replace: ';\n'
			}, {
				find: /pó\s+Royal/ig,
				replace: 'fermento em pó'
			}, {
				find: /Nescau|Toddy/ig,
				replace: 'achocolatado em pó'
			}, {
				find: /([^\(])Maisena/ig,
				replace: '$1amido de milho'
			} ];
		}
		list = [ {
			// +quebra de linha antes de =, -espaços entre = e o título da seção
			find: /\n*^(=+)\s*(.*?)\s*\1\s*/mig,
			replace: '\n\n$1 $2 $1\n'
		}, {
			// -quebras de linha entre cabeçalhos consecutivos
			find: /\=\n+=/ig,
			replace: '=\n='
		} ];

		regex( editor, cookbookList.concat( list ), 'format. cabeçalhos' );
	}

	function formatTemplates( editor ) {
		oldText = editor.get();

		regex( editor, [ {
			find: /\{\{\s*(?:msg:|template:)?([^}]+)\}\}/ig,
			replace: '{' + '{$1}}'
		} ], 'format. predefs' );
	}

	function formatCategories( editor ) {
		oldText = editor.get();
		list = [ {
			find: /\[\[\s*Categor(?:y|ia)\s*:\s*([^\|\]]+)(?:\s*(\|)([^\]]*))?\s*\]\]/ig,
			replace: '[[Categoria:$1$2$3]]'
		}, {
			find: /\[\[Categoria:([^\|\]]+)\|[a-zA-Z0-9]\]\]/ig,
			replace: '[[Categoria:$1|{{SUBPAGENAME}}]]'
		}, {
			find: /\[\[Categoria:([^\|\]]+)\|([\* !])\]\]/ig,
			replace: '[[Categoria:$1|$2{{SUBPAGENAME}}]]'
		} ];
		regex( editor, list, 'format. categorias' );
	}

	function fixLists( editor ) {
		oldText = editor.get();

		regex( editor, [ {
			find: /\s*\n;([^\n]+)\n([^:])/g,
			replace: '\n;$1\n:$2'
		} ], '-uso [[' +
			( mw.config.get( 'wgDBname' ) === 'ptwiki' ? '' : 'w:' ) +
			'Special:PermaLink/31511942|semanticamente incorreto]] de lista de definições (;:)' );

		regex( editor, [ {
			// Deixa no máximo 1 espaço entre *, # ou : e o texto da lista
			find: /^(:+[*#]+[*#:]*|:+(?![\{:])|[*#][*#:]*)\s+/gm,
			replace: '$1 '
		} ], 'format. listas' );

		regex( editor, [ {
			find: /(\| *(?:lista?\d+|acima|ab(?:ove|aixo)|below) *= *)(?:\{\{ *[Nn]owrap begin *\}\} *)?| *(?:(\|list\d+ *= *)(?:\{\{ *[Nn]owrap begin *\}\} *)?|\{\{ *(?:[·•][Ww](?:rap)?|[·,•*]|[Dd]ot|[Pp]onto|[Bb]ullet) *\}\}|(?:(?: )?[·•]|&(?:bull|#8226|#x2022|middot);)) */g,
			replace: '$1\n* '
		} ], 'uso da [[Special:PermaLink/43666549|sintaxe correta pra listas]]' );
	}

	function abs2rel( editor ) {
		if ( mw.config.get( 'wgPageName' ) === mw.config.get( 'wgBookName' ) ) {
			// Troca underscores por espaços
			var nome = mw.config.get( 'wgBookName' ).replace( /_/g, ' ' );

			regex( editor, [ {
				// [[Livro/Cap|Cap]] -> [[/Cap/]]
				find: new RegExp(
					'\\[\\[\\s*' + nome +
					'\\/([^\\|\\]]+?)\\s*\\|\\s*\\1\\s*\\]\\]',
					'ig'
				),
				replace: '[[/$1/]]'
			} ] );
		}
	}

	function formatLinks( editor ) {
		oldText = editor.get();

		list = [ {
			// -espaços redundantes
			find: /\[\[\s*([^\|\]]+?)\s*(?:(\|)\s*([^\]]+?)\s*)?\]\]/ig,
			replace: '[[$1$2$3]]'
		}, {
			// Texto exibido redundante:
			// * [[Texto|Texto]]  -> [[Texto]]
			// * [[/Texto|Texto]] -> [[/Texto/]]
			find: /\[\[([^\|\]]+?)\s*\|\s*\1\]\]/g,
			replace: '[[$1]]'
		}, {
			find: /\[\[\s*\/\s*([^\|\]]+?)\s*\|\s*\1\s*\]\]/g,
			replace: '[[/$1/]]'
		}, {
			// troca de underscores por espaços nas ligações
			find: /\[\[([^\|\]]+?)_/ig,
			replace: '[[$1 '
			// , repeat: 5 // FIXME: Re-implement this!
		}, {
			// tradução das ligações internas para o domínio "Wikilivros" ou "Wikipédia"
			find: /\[\[(?:Wikibooks|Project)( Discussão)?:/ig,
			replace: '[[Wikilivros$1:'
		}, {
			find: /\[\[(?:Wikibooks|Project) Talk:/ig,
			replace: '[[Wikilivros Discussão:'
		}, {
			find: /\[(?:https?)?:\/\/pt.wikibooks.org\/w\/index.php\?title=Wikibooks/ig,
			replace: '[//pt.wikibooks.org/w/index.php?title=Wikilivros'
		}, {
			find: /\[\[(?:Wikipedia|Project)( Discussão)?:/ig,
			replace: '[[Wikipédia$1:'
		}, {
			find: /\[\[(?:Wikipedia|Project) Talk:/ig,
			replace: '[[Wikipédia Discussão:'
		}, {
			find: /\[(?:https?)?:\/\/pt.wikipedia.org\/w\/index.php\?title=Wikipedia/ig,
			replace: '[//pt.wikipedia.org/w/index.php?title=Wikipédia'
		} ];
		regex( editor, list, 'formatação dos links' );
		oldText = editor.get();
		regex( editor, [ {
			find: /\[bugzilla:\s*(\d+)\s*(\]\]|\|)/ig,
			replace: function ( match, p1, p2, offset, totalStr ) {
				return '[phab:T' + ( parseInt( p1, 10 ) + 2000 ) + p2;
			}
		} ], 'Bugzilla → Phabricator' );
	}

	function fixMath( editor ) {
		var	reHack, reason;
		oldText = editor.get();
		reHack = /\s*(?:\\[,!\s\;]\s*)+\s*<(\/)math>|<math>\s*(?:\\[,!\s\;]\s*)+\s*/g;
		reason = {
			pt: '-hack obsoleto desde o [[mw:MediaWiki 1.19]] (ver também [[phab:rSVN104498]] e [[phab:T33406#344368]])',
			en: '-obsolete hack since [[mw:MediaWiki 1.19]] (see also [[phab:rSVN104498]] and [[phab:T33406#344368]])'
		};
		regex( editor, [ {
			find: reHack,
			replace: '<$1math>'
		} ], reason[ mw.config.get( 'wgContentLanguage' ) ] || reason.en );

		// coloca a pontuação que vem depois de fórmulas dentro das tags <math>
		list = [ {
			find: /<\/math> *([\.,;:\?]|!(?!!)) */ig,
			replace: '$1</math> '
		}, {
			find: /\\sin/mig,
			replace: '\\mathrm{sen}\\,'
		}, {
			find: /\n:+\s*<math>/mig,
			replace: '\n<math display="block">'
		} ];
		regex( editor, list, 'format. <math> e pontuação' );
	}

	function ucFirst( p ) {
		return p.charAt( 0 ).toUpperCase() + p.substr( 1 );
	}

	function fixOCR( editor ) {
		var	oldText = editor.get(),
			totalAnchorsBefore = oldText.split( '{{âncora' ).length,
			tabela;
		if ( mw.config.get( 'wgNamespaceNumber' ) === 106 ) {
			$.getJSON(
				mw.util.wikiScript( 'api' ), {
					format: 'json',
					action: 'query',
					prop: 'revisions',
					rvprop: 'content',
					rvlimit: 1,
					indexpageids: true,
					titles: dictionaries
				},
				// FIXME: add callback to run the rest of fixOCR only after this is finished
				function removeOCRModernization( res ) {
					var	pages = res.query.pages,
						pagenames = dictionaries.split( '|' ),
						sortable = [],
						wsolddict = [],
						i, j, str, match2, lines;
					/*jshint unused:false */
					$.each( pages, function ( id, page ) {
						if ( !page.pageid ) {
							alert( 'Erro na função removeOCRModernization usada na correção de OCR!' );
							return true;
						}
						sortable.push( [
							page.revisions[ 0 ][ '*' ], // Wiki code of dictionary page
							pagenames.indexOf( page.title ) // Order of page
							// , page.title // Title of page
						] );
					} );
					/*jshint unused:true */
					sortable.sort( function ( a, b ) {
						return a[ 1 ] - b[ 1 ];
					} ); // Sort dictionaries in the given order
					for ( i = 0; i < sortable.length; i++ ) {
						str = sortable[ i ][ 0 ];
						lines = str.split( '\n' );
						for ( j = 0; j < lines.length; j++ ) {
							// Current syntax: * old word : new word // Some comment
							match2 = /^\*\s*(\S[^:]*?)\s*:\s*([\S].*?)\s*(?:\/\/.*?)?$/.exec( lines[ j ] );
							if ( match2 ) {
								wsolddict[ match2[ 2 ] ] = match2[ 1 ]; // "atual" => "antiga"
								continue;
							}
						}
					}
					// LanguageConverter.conv_text_from_dic() está em [[oldwikisource:User:He7d3r/Tools/LanguageConverter.js]]
					editor.set(
						/*jshint camelcase: false */
						// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
						LanguageConverter.conv_text_from_dic(
							editor.get(),
							wsolddict,
							false,
							null,
							false
						)
						// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
						/*jshint camelcase: true */
					);
				}
			);
		}

		list = [];
		// Expressões inexistentes (typos do OCR) ou com atualização ortográfica indevida
		// Estas expressões NÃO SÃO convertidas se estiverem contidas em outras
		tabela = {
			'aããição': 'addição',
			arithmetiea: 'arithmetica',
			aeceito: 'acceito',
			'cólumna': 'columna',
			'deeompõe': 'decompõe',
			'eífeito': 'effeito',

			'minuenão': 'minuendo',
			'mbtrahenão': 'subtrahendo',
			mulliplicam: 'multiplicam',
			'orãe(m|ns)?': 'orde$1',
			'pôde': 'póde',
			'proãucto(s?)': 'producto$1',
			soramar: 'sommar',
			somraando: 'sommando',
			subtraliir: 'subtrahir'
		};

		// Aplica cada uma das regras da tabela
		/*jshint unused:false */
		$.each( tabela, function ( id, palavra ) {
			list.push( {
				find: new RegExp( '\\b' + palavra + '\\b', 'g' ),
				replace: palavra
				// , 5 // FIXME
			}, {
				// Converte também a palavra correspondente com a primeira letra maiúscula
				find: new RegExp( '\\b' + ucFirst( palavra ) + '\\b', 'g' ),
				replace: ucFirst( palavra )
				// , 5 // FIXME
			} );
		} );
		/*jshint unused:true */

		// Expressões inexistentes (typos do OCR) ou com atualização ortográfica indevida
		// Estas expressões NÃO SÃO convertidas se estiverem contidas em outras
		// OSB:	1) Estas expressões precisam de tratamento especial pois o \b se confunde com letras acentuadas e cedilha
		// 2) São usados dois grupos extras nestas regras: um para o 1º caractere anterior e outro para o 1º posterior à palavra;
		tabela = {
			'ã([eo])': '$1d$2$3',
			// A letra "d" em itálico parece um "ã" (por causa da serifa no topo do "d")
			'ão(u)?s': '$1do$2s$3',
			'ê': '$1é$2'
		};

		$.each( tabela, function ( find, rep ) {
			list.push( {
				find: new RegExp( '([^' + LETRA + '])' + find + '([^' + LETRA + '])', 'g' ),
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
			qne: 'que'
		};

		$.each( tabela, function ( find, rep ) {
			list.push( {
				find: new RegExp( find, 'g' ),
				replace: rep
				// 5 // FIXME
			}, {
				// Converte também a palavra correspondente com a primeira letra maiúscula
				find: new RegExp( '\\b' + ucFirst( find ), 'g' ),
				replace: ucFirst( rep )
				// 5 // FIXME
			} );
		} );

		// Sequências de caracteres, contendo dígitos e operadores, iniciada e terminada por números possívelmente são fórmulas
		list.push( {
			find: /(\d+[xX+-\/=<>][xX+-\/=0-9<>]+\d+)/g,
			replace: '♪$1♫'
		}, {
			// Espaçamento entre os operadores de algumas fórmulas
			find: /♪([^♪]*[^ ♪])([xX+-\/=<>])([^ ♫][^♫]*)♫/g,
			replace: '♪$1 $2 $3♫'
			// 10 // FIXME
		}, {
			// Sinal de vezes em LaTeX
			find: /♪([^♪]*\d+)\s*[xX]\s*(\d+[^♫]*)♫/g,
			replace: '♪$1 \\times $2♫'
			// 10 // FIXME
		}, {
			// Remoção de tags duplicadas no processo
			find: /(?:♪|<math>)+/g,
			replace: '<math>'
		}, {
			find: /(?:♫|<\/math>)+/g,
			replace: '</math>'
		} );
		regex( editor, list,
				'Correção de OCR' + ( totalAnchorsBefore < editor.get().split( '{{âncora' ).length ?
				'; Adição de {{âncora}}' :
				''
			)
		);
		clickDiff();
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
	/*
	function convertMath( editor ) {
		var	text = editor.get(),
			regex = 0, subst = 1, func = 2,
			command, i, dir, summary;
		command = [// (dir == 0) -> latex2wiki; (dir == 1) -> wiki2latex
			[// fórmulas dentro dos parágrafos
				[/\$\s*([^$]*?)\s*\$/img, '<math>$1</math>', null],
				[/<\/?math>/ig, '$', null]
			],
			[// fórmulas em parágrafos isolados
				[/\s*\$\$\s*([^$]*?)\s*\$\$\s{0,}/img, '\n\n: <math>$1</math>\n\n', null],
				[null, null, null]
			],
			[// notas de rodapé
				[/\\footnote\{(.*?)\}/g, '<ref>$1</ref>', null],
				[/<ref.*?>(.*?)<\/ref.*?>/ig, '\\footnote{$1}', null]
			]
			];
		for (i=0; i<command.length; i++) {
			if (!command[i][dir][regex]) { continue; }
			if (command[i][dir][regex].test(text)) {
				if (command[i][dir][func]) {command[i][dir][func]();}
				text = text.replace(command[i][dir][regex], command[i][dir][subst]);
			}
		}
		editor.set( text );
		if (0 === dir) {
			summary = 'Convertendo de LaTeX para Wiki, [usando [[m:TemplateScript|regex]]]';
		} else {
			summary = 'Criando versão latex [usando [[m:TemplateScript|regex]]] (não era para salvar: REVERTA ESTA EDIÇÃO!)';
		}
		$( '#wpSummary:first' ).val( summary );
	}
	*/

	function latex2wiki( editor ) {
		var top = '',
			bottom = [
				'\n== Notas ==',
				'<references group="nota "/>',
				'\n== Referências ==',
				'<references/>',
				'{' + '{AutoCat}' + '}'
			].join( '\n' );

		list = [ {
			find: /\$\s*([^$]*?)\s*\$/img,
			replace: '<math>$1</math>'
		}, {
			find: /\s*\$\$\s*([^$]*?)\s*\$\$\s*/img,
			replace: '\n\n{' + '{Fórmula|<math>$1</math>}' + '}\n\n'
		}, {
			find: /<\/math>([\.,;:!\?]) */mig,
			replace: '$1</math> '
		}, {
			find: /\\footnote\{([^}]+?)%?\\label\{[^}]+?\}\s*\}/g,
			replace: '<ref name="$2">$1</ref>'
		}, {
			find: /\\footnote\{(.*?)\}/g,
			replace: '<ref>$1</ref>'
		}, {
			find: /\n*\\chapter\{([^}\n]+)\}\n*/gm,
			replace: '\n\n= $1 =\n\n'
		}, {
			find: /\n*\\section\{([^}\n]+)\}\n*/gm,
			replace: '\n\n== $1 ==\n\n'
		}, {
			find: /\n*\\subsection\{([^}\n]+)\}\n*/gm,
			replace: '\n\n=== $1 ===\n\n'
		}, {
			find: /\n*\\subsubsection\{([^}\n]+)\}\n*/gm,
			replace: '\n\n==== $1 ====\n\n'
		}, {
			find: /\n*\\begin\{defi\}%?(?:\\label\{defi:[^}]+?\})?\s*/gm,
			replace: '\n{' + '{Definição\n|'
		}, {
			find: /\n*\\begin\{teo\}%?(?:\\label\{teo:[^}]+?\})?\s*/gm,
			replace: '\n{' + '{Teorema\n|'
		}, {
			find: /\n*\\begin\{proof\}%?(?:\\label\{proof:[^}]+?\})?\s*/gm,
			replace: '\n{' + '{Demonstração\n|'
		}, {
			find: /\n*\\begin\{lema\}%?(?:\\label\{lema:[^}]+?\})?\s*/gm,
			replace: '\n{' + '{Lema\n|'
		}, {
			find: /\n*\\begin\{prop\}%?(?:\\label\{prop:[^}]+?\})?\s*/gm,
			replace: '\n{' + '{Proposição\n|'
		}, {
			find: /\n*\\begin\{cor\}%?(?:\\label\{cor:[^}]+?\})?\s*/gm,
			replace: '\n{' + '{Corolário\n|'
		}, {
			find: /\n*\\begin\{ex\}%?(?:\\label\{ex:[^}]+?\})?\s*/gm,
			replace: '\n{' + '{Exemplo\n|'
		}, {
			find: /\n*\\begin\{exer\}%?(?:\\label\{exer:[^}]+?\})?\s*/gm,
			replace: '\n{' + '{Exercício\n|'
		}, {
			find: /\n*\\begin\{obs\}%?(?:\\label\{obs:[^}]+?\})?\s*/gm,
			replace: '\n{' + '{Observação\n|'
		}, {
			find: /\n*\\end\{(?:defi|teo|proof|lema|prop|cor|ex|exer|obs)\}\s*/gm,
			replace: '\n}}\n\n'
		}, {
			find: /\n?\\end\{(?:enumerate|itemize)\}\n?/gm,
			replace: '\n'
		}, {
			find: /^\s*\\item\s+/gm,
			replace: '* '
		} ];

		regex( editor, list );
		editor.set( top + editor.get() + bottom );
		editor.setEditSummary( 'Convertendo de LaTeX para Wiki' );
	}

	function wiki2latex( editor ) {
		var preambulo, reWikiLink,
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
		].join( '\n' );
		if ( editor.get().match( /<!--(.|\s)*?-->/ ) ) {
			preambulo += '\\usepackage{verbatim}' +
				' %permite usar \\begin{comment}...\\end{comment} para comentar varias linhas\n';
			list.push( {
				find: /<!--(.|\s)*?-->/g,
				replace: '\\begin{comment}\n$1\n\\end{comment}'
			} );
		}

		preambulo += '\\usepackage[a4paper=true,pagebackref=true]{hyperref}\n\n' +
			'\\hypersetup{\n' +
			'		pdftitle = {' + mw.config.get( 'wgBookName' ) + '},\n' +
			'		pdfauthor = {Colaboradores do Wikilivros},\n' +
			'		pdfcreator = {' + mw.user.getName() + '},\n' +
			'		pdfsubject = {},\n' +
			'		pdfkeywords = {wiki, livro, wikilivro, Wikilivros},\n' +
			'		colorlinks = true,\n' +
			'		linkcolor = blue,\n' +
			'		anchorcolor = red,\n' +
			'		citecolor = blue,\n' +
			'		filecolor = red,\n' +
			'		urlcolor = blue\n' +
			'}\n\n' +
			'\\newtheorem{teo}{Teorema}[chapter]\n' +
			'\\newtheorem{lema}[teo]{Lema}\n' +
			'\\newtheorem{prop}[teo]{Proposi\\c{c}{\\~a}o}\n' +
			'\\newtheorem{cor}[teo]{Corol{\\\'a}rio}\n\n' +
			'\\theoremstyle{definition}\n' +
			'\\newtheorem{defi}[teo]{Defini\\c{c}{\\~a}o}\n' +
			'\\newtheorem{ex}[teo]{Exemplo}\n' +
			'\\newtheorem{exer}[teo]{Exerc{\\\'i}cio}\n\n' +
			'\\theoremstyle{remark}\n' +
			'\\newtheorem{obs}[teo]{Observa\\c{c}{\\~a}o}\n' +
			'\\newtheorem*{conv}{Conven\\c{c}{\\~a}o}\n\n' +
			'\\newtheorem*{res}{Resolu\\c{c}{\\~a}o}' +
			'\\newtheorem*{tarefa}{Tarefa}' +
			'\\makeindex\n\n';

		/*
		var w = 'pt.wikipedia';
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
		}, {
			find: /<\/?noinclude>/ig,
			replace: ''
		}, {
			find: /^(=+)\s*(?:Notas|Referências)\s*\1$/mig,
			replace: ''
		}, {
			find: /^\s*<references(?:\s*group\s*=\s*"[^"]*")?\/>\s*$/mig,
			replace: ''
		}, {
			// coloca a pontuação que vem depois de fórmulas fora das tags <math>
			// Ver [[w:en:Wikipedia:Manual of Style/Mathematics#Punctuation after formulae]]
			find: /([\.,;:!\?])<\/math> */mig,
			replace: '</math>$1 '
		}, {
			find: /<\/?math>/ig,
			replace: '$'
		}, {
			// notas de rodapé
			find: /<ref.*?(?:name\s*=\s*"([^"]+)").*?>(.*?)<\/ref.*?>/ig,
			replace: '\\footnote{$2\\label{nota:$1}}'
		}, {
			find: /<ref.*?>(.*?)<\/ref.*?>/ig,
			replace: '\\footnote{$1%\\label{nota:}\n}'
		}, {
			// cabeçalhos
			find: /^====([^\n]+)====\s*$/mg,
			replace: '\n\n\\subsubsection{$1}\n\n'
		}, {
			find: /^===([^\n]+)===\s*$/mg,
			replace: '\n\n\\subsection{$1}\n\n'
		}, {
			find: /^==([^\n]+)==\s*$/mg,
			replace: '\n\n\\section{$1}\n\n'
		}, {
			find: /^=([^\n]+)=\s*$/mg,
			replace: '\n\n\n\\chapter{$1}\\label{cap:$1}\n\n\n'
		}, {
			// predefinições matemáticas
			find: /\{\{\s*(?:Definição)\|([^}]+)\}\}/ig,
			replace: '\\begin{defi}%\\label{defi:}\n$1\n\\end{defi}'
		}, {
			find: /\{\{\s*(?:Teorema)\|([^}]+)\}\}/ig,
			replace: '\\begin{teo}%\\label{teo:}\n$1\n\\end{teo}'
		}, {
			find: /\{\{\s*(?:Demonstração)\|([^}]+)\}\}/ig,
			replace: '\\begin{proof}\n$1\n\\end{proof}'
		}, {
			find: /\{\{\s*(?:Lema)\|([^}]+)\}\}/ig,
			replace: '\\begin{lema}%\\label{lema:}\n$1\n\\end{lema}'
		}, {
			find: /\{\{\s*(?:Proposição)\|([^}]+)\}\}/ig,
			replace: '\\begin{prop}%\\label{prop:}\n$1\n\\end{prop}'
		}, {
			find: /\{\{\s*(?:Corolário)\|([^}]+)\}\}/ig,
			replace: '\\begin{cor}%\\label{cor:}\n$1\n\\end{cor}'
		}, {
			find: /\{\{\s*(?:Exemplo)\|([^}]+)\}\}/ig,
			replace: '\\begin{ex}%\\label{ex:}\n$1\n\\end{ex}'
		}, {
			find: /\{\{\s*(?:Exercício)\|([^}]+)\}\}/ig,
			replace: '\\begin{exer}%\\label{exer:}\n$1\n\\end{exer}'
		}, {
			find: /\{\{\s*(?:Observação)\|([^}]+)\}\}/ig,
			replace: '\\begin{obs}%\\label{obs:}\n$1\n\\end{obs}'
		}, {
			find: /\{\{Fórmula\|([\d.]+)\|([^\n]+)\}\}\n/igm,
			replace: '\\begin{equation}\\label{eq:$1}\n$2\n\\end{equation}\n'
		}, {
			find: /\{\{Fórmula\|([^\n]+)\}\}\n/igm,
			replace: '\\begin{equation}\\label{eq:???}\n$1\n\\end{equation}\n'
		}, {
			// links internos e externos
			find: /\{\{\s*(?:Âncoras?)\|([^}]+)\}\}/ig,
			replace: '\\label{$1}'
		} );
		regex( editor, list );

		reWikiLink = /\[\[\s*([a-zA-Z:]+)\s*:\s*([^\|\]]+?)\s*?\|\s*([^\]]*?)\s*\]\]/i;
		WikiLink = reWikiLink.exec( editor.get() );
		while ( WikiLink ) {// [[proj:idioma:alvo|texto]]
			WikiLink[ 2 ] = encodeURI( WikiLink[ 2 ] ).replace( /(%|#)/g, '\\$1' );
			editor.set(
				editor.get().replace( reWikiLink, '\\href{' + url + '$1:' + WikiLink[ 2 ] + '}{$3}' )
			);
			WikiLink = reWikiLink.exec( editor.get() );
		}
		reWikiLink = /\{\{\s*(w|wikt)\s*\|\s*([^\|}]+?)\s*?\|\s*([^}]*?)\s*\}\}/i;
		WikiLink = reWikiLink.exec( editor.get() );
		while ( WikiLink ) {// {{proj|alvo|texto}}
			WikiLink[ 2 ] = encodeURI( WikiLink[ 2 ] ).replace( /(%|#)/g, '\\$1' );
			editor.set(
				editor.get().replace( reWikiLink, '\\href{' + url + '$1:' + WikiLink[ 2 ] + '}{$3}' )
			);
			WikiLink = reWikiLink.exec( editor.get() );
		}
		reWikiLink = /\{\{\s*(w|wikt)\s*\|\s*([^\|}]+?)\s*\}\}/i;
		WikiLink = reWikiLink.exec( editor.get() );
		while ( WikiLink ) {// {{proj|alvo}}
			WikiLink[ 2 ] = encodeURI( WikiLink[ 2 ] ).replace( /(%|#)/g, '\\$1' );
			editor.set(
				editor.get().replace( reWikiLink, '\\href{' + url + '$1:' + WikiLink[ 2 ] + '}{$2}' )
			);
			WikiLink = reWikiLink.exec( editor.get() );
		}

		list = [ {
			find: /\[\[(?:\.\.\/[^#]+)?#Definição ([^\]]+)\|([^\]]+)\]\]/ig,
			replace: '\\hyperref[defi:$1]{$2}'
		}, {
			find: /\[\[(?:\.\.\/[^#]+)?#Proposição ([^\]]+)\|([^\]]+)\]\]/ig,
			replace: '\\hyperref[prop:$1]{$2}'
		}, {
			find: /\[\[(?:\.\.\/[^#]+)?#Lema ([^\]]+)\|([^\]]+)\]\]/ig,
			replace: '\\hyperref[lema:$1]{$2}'
		}, {
			find: /\[\[(?:\.\.\/[^#]+)?#Teorema ([^\]]+)\|([^\]]+)\]\]/ig,
			replace: '\\hyperref[teo:$1]{$2}'
		}, {
			find: /\[\[(?:\.\.\/[^#]+)?#Corolário ([^\]]+)\|([^\]]+)\]\]/ig,
			replace: '\\hyperref[cor:$1]{$2}'
		}, {
			find: /\[\[(?:\.\.\/[^#]+)?#Exemplo ([^\]]+)\|([^\]]+)\]\]/ig,
			replace: '\\hyperref[ex:$1]{$2}'
		}, {
			find: /\[\[(?:\.\.\/[^#]+)?#Exercício ([^\]]+)\|([^\]]+)\]\]/ig,
			replace: '\\hyperref[exer:$1]{$2}'
		}, {
			find: /\[\[(?:\.\.\/[^#]+)?#(?:Obs\.|Observação)? ([^\]]+)\|([^\]]+)\]\]/ig,
			replace: '\\hyperref[obs:$1]{$2}'
		}, {
			find: /:\n+#\s*/ig,
			replace: ':\n\\begin{enumerate}\n\\item '
		}, {
			find: /\n(?:\*|#)\s*/ig,
			replace: '\n\\item '
		},
	/*
		{
			find: //ig,
			replace: '\\begin{enumerate}\n'
		}, {
			find: //ig,
			replace: '\\begin{itemize}\n'
		}, {
			find: /\* /ig,
			replace: '\\item '
		}, {
			find: /# /ig,
			replace: '\\item '
		}, {
			find: //ig,
			replace: '\\end{enumerate}\n'
		}, {
			find: //ig,
			replace: '\\end{itemize}\n'
		},
	*/
		{
			find: /\n*(\\(?:sub){0,2}section[^\n]+)\n*/ig,
			replace: '\n\n$1\n'
		}, {
			find: /\n*(\\chapter[^\n]+)\n*/ig,
			replace: '\n\n\n$1\n\n'
		}, {
			// Aspas
			find: /"([^"]+)"/ig,
			replace: '``$1\'\''
		} ];

		regex( editor, list );

		editor.set(
			preambulo + [
			'\\begin{document}\n',
			'\\frontmatter\n',
			'\\tableofcontents\n',
			'\\mainmatter %Depois de índice e prefácio\n',
			'\\chapter{' + mw.config.get( 'wgTitle' ) + '}\\label{cap:' +
				mw.config.get( 'wgTitle' ).toLowerCase() + '}\n\n',
			editor.get(),
			'\n\\backmatter\n',
			'\\bibliographystyle{amsalpha} %amsalpha, amsplain, plain, alpha, abbrvnat',
			'\\bibliography{biblio}\\label{cap:biblio}',
			'\\addcontentsline{toc}{chapter}{Referências Bibliográficas}\n',
			'\\end{document}'
			].join( '\n' )
		);
		editor.setEditSummary( 'Versão em LaTeX [produzida com' +
			' [[m:TemplateScript|expressões regulares]]]' +
			'(não era para salvar: REVERTA ESTA EDIÇÃO!)' );
	}

	function generalFixes( editor ) {
		var c = editor;
		switch ( mw.config.get( 'wgDBname' ) ) {
			case 'ptwiki':
				fixObsoleteHTML( c );
				fixMath( c );
				fixHTTPLinks( c );
				fixLists( c );
				fixObsoleteTemplatesOnPtwiki( c );
				formatLinks( c );
				break;
			case 'ptwikisource':
				break;
			case 'ptwikibooks':
				fixObsoleteHTML( c );
				formatHeadings( c );
				formatTemplates( c );
				formatCategories( c );
				fixLists( c );
				abs2rel( c );
				formatLinks( c );
				fixMath( c );
				formatHeadings( c );
				break;
			default:
				fixObsoleteHTML( c );
		}
		clickDiff();
	}

	function loadMyRegexTools() {
		pathoschild.TemplateScript.add( [ {
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
		} ] );

		switch ( mw.config.get( 'wgDBname' ) ) {
			case 'ptwiki':
				pathoschild.TemplateScript.add( [ {
					name: 'Usar "Ver também,..."',
					script: fixObsoleteTemplatesOnPtwiki
				}, {
					name: 'Corrigir fórmulas',
					script: fixMath
				}, {
					name: 'Corrigir listas',
					script: fixLists
				} ] );
				break;
			case 'ptwikisource':
				pathoschild.TemplateScript.add( {
					name: 'Corrigir OCR',
					script: fixOCR
				} );
				break;
			case 'ptwikibooks':
				pathoschild.TemplateScript.add( [ {
					name: 'Corrigi fórmulas',
					script: fixMath
				}, {
					name: 'Remover linhas duplicadas',
					script: function ( editor ) {
						var items = editor.get()
							.replace( /\r|\n+/gi, '\n' )
							.split( '\n' );
						editor.set(
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
				} ] );
				break;
			default:
			// Pass
		}
	}
	if ( $.inArray( mw.config.get( 'wgAction' ), [ 'edit', 'submit' ] ) !== -1 ) {
		/**
		 * TemplateScript adds configurable templates and scripts to the sidebar, and adds an example regex editor.
		 * @see https://meta.wikimedia.org/wiki/TemplateScript
		 * @update-token [[File:pathoschild/templatescript.js]]
		 */
		$.when(
			mw.loader.using( [ 'jquery.textSelection' ] ),
			$.ajax(
				'//tools-static.wmflabs.org/meta/scripts/pathoschild.templatescript.js',
				{
					dataType: 'script',
					cache: true,
					timeout: 30000
				}
			)
		).then( loadMyRegexTools );
	}

}( mediaWiki, jQuery ) );
