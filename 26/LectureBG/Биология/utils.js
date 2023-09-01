// помощни функции


// създаване на текстури
var images = [];

images.A = drawing( 64, 128, 'white' );
	fillText( 3, 10, 'A', 'black', 'bold 80px Arial' );
	for( var i=78; i<128; i+=12 )
	{
		arc( 31, i, 2 );
		arc( 33, i, 2 );
		fill( 'black' );
	}

images.C = drawing( 64, 128, 'white' );
	fillText( 3, 10, 'C', 'black', 'bold 80px Arial' );
	for( var i=78; i<128; i+=12 )
	{
		arc( 31, i, 2 );
		arc( 33, i, 2 );
		fill( 'black' );
	}

images.T = drawing( 64, 128, 'white' );
	fillText( 3, 10, 'T', 'black', 'bold 80px Arial' );
	for( var i=78; i<128; i+=12 )
	{
		arc( 31, i, 2 );
		arc( 33, i, 2 );
		fill( 'black' );
	}

images.G = drawing( 64, 128, 'white' );
	fillText( 3, 10, 'G', 'black', 'bold 80px Arial' );
	for( var i=78; i<128; i+=12 )
	{
		arc( 31, i, 2 );
		arc( 33, i, 2 );
		fill( 'black' );
	}


// случаен избор на цветове на нуклеотидите
var startColor = Math.random()*360;

var colors = {
		A: hsl(startColor,100,random(60,80)),
		C: hsl(startColor+60,100,random(60,80)),
		T: hsl(startColor+120,100,random(60,80)),
		G: hsl(startColor+180,100,random(60,80)),
	};


// създаване на нуклеотид с дадена база
function nucleotide( center, letter, no )
{
	var nucleo = group( );
		its.spin = [30];
	
	nucleo.add( prism( 6, [0,-4,0], [6,8], colors[letter] ) );
		its.image = images[letter];
		its.images = [6,1];

	nucleo.add( prism( 6, [0,4,0], [6,1], 'white' ) );
	nucleo.add( prism( 6, [0,-5,0], [6,1], 'black' ) );

	var result = group( );
		result.no = no;
		result.center = center;
		result.add( nucleo );
		result.nucleo = nucleo;
		result.char = letter;
		
	return result;
}


// създаване на аденин
function A( center )
{
	return nucleotide( center, 'A', 0 );
}


// създаване на цитозин
function C( center )
{
	return nucleotide( center, 'C', 1 );
}


// създаване на гуанин
function G( center )
{
	return nucleotide( center, 'G', 2 );
}


// създаване на тимин
function T( center )
{
	return nucleotide( center, 'T', 3 );
}



// два помощни масива за връзка от аминокиселина към кодон
// и от кодон към аминокиселина
acid = [];
codon = [];

function learn( theAcid, theCodons )
{
	for( var i=0; i<theCodons.length; i++ )
	{
		acid[theAcid] = theCodons;
		codon[theCodons[i]] = theAcid;
	}
}

learn( 'Ala', ['GCT', 'GCC', 'GCA', 'GCG'] );
learn( 'Arg', ['CGT', 'CGC', 'CGA', 'CGG', 'AGA', 'AGG'] );
learn( 'Asn', ['AAT', 'AAC'] );
learn( 'Asp', ['GAT', 'GAC'] );
learn( 'Cys', ['TGT', 'TGC'] );
learn( 'Gln', ['CAA', 'CAG'] );
learn( 'Glu', ['GAA', 'GAG'] );
learn( 'Gly', ['GGT', 'GGC', 'GGA', 'GGG'] );
learn( 'His', ['CAT', 'CAC'] );
learn( 'Ile', ['ATT', 'ATC', 'ATA'] );
learn( 'Leu', ['TTA', 'TTG', 'CTT', 'CTC', 'CTA', 'CTG'] );
learn( 'Lys', ['AAA', 'AAG'] );
learn( 'Met', ['ATG'] );
learn( 'Phe', ['TTT', 'TTC'] );
learn( 'Pro', ['CCT', 'CCC', 'CCA', 'CCG'] );
learn( 'Ser', ['TCT', 'TCC', 'TCA', 'TCG', 'AGT', 'AGC'] );
learn( 'Thr', ['ACT', 'ACC', 'ACA', 'ACG'] );
learn( 'Trp', ['TGG'] );
learn( 'Tyr', ['TAT', 'TAC'] );
learn( 'Val', ['GTT', 'GTC', 'GTA', 'GTG'] );



		
// зареждане на два звукови ефекта
hB = 0;
hitBase = [];
for (var i=0; i<6; i++)
	hitBase[i] = new Audio('hit.wav');

hF = 0;
hitFail = [];
for (var i=0; i<6; i++)
	hitFail[i] = new Audio('break.wav');