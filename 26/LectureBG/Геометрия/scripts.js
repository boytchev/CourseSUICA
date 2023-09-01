// =========================================================
//
// ИНИЦИАЛИЗАЦИЯ
//
// =========================================================

SCALE = 20;			// размер на полуклетка от мрежата (в пиксели)
autoInt = false;	// автоматично подравняване на върховете

orthographic( -1000, 1000 );
background( 'LavenderBlush' );
lookAt( [0,0,300] );
		


// =========================================================
//
// СЪЗДАВАНЕ НА ГРАФИЧНИТЕ ОБЕКТИ
//
// =========================================================

// три върха като сфери
A = sphere( [-200,-100,0], [25,25,8], 'Violet' );
B = sphere( [ 200,  30,0], [25,25,8], 'Violet' );
C = sphere( [ -30, 160,0], [25,25,8], 'Violet' );

// три страни като цилиндри
AB = cylinder( [],[5,5,5], 'Indigo' );
BC = cylinder( [],[5,5,5], 'Indigo' );
CA = cylinder( [],[5,5,5], 'Indigo' );

// три квадрата с контури
ABsq = group(
		square ( [0.5,0.5,-1], [1,1], 'MistyRose' ),
		square ( [0.5,0.5,0], [1,1], 'Orchid' ).style({wireframe:true})
	);
BCsq = ABsq.clone;
CAsq = ABsq.clone;

// три линии
ABln = line( ); its.color = 'Orchid';
BCln = ABln.clone;
CAln = ABln.clone;

// мрежата като групов обект
grid = group( );
its.z = -1;
for( var i=-300.5; i<=300; i+=2*SCALE )
	grid.add( line([i,-200,-1],[i,200,-1],'lightgray') );
for (var i=-200.5; i<=200; i+=2*SCALE)
	grid.add( line([-300,i,-1],[300,i,-1],'lightgray') );

// имена на върховете
Alb = point( [], 20, 'White' );
	its.image = drawing( 32 );
	fillText( 0, 0, 'A', 'White', 'bold 30px Arial' );
Blb = point( [], 20, 'White' );
	its.image = drawing( 32 );
	fillText( 0, 0, 'B', 'White', 'bold 30px Arial' );
Clb = point( [], 20, 'White' );
	its.image = drawing( 32 );
	fillText( 0, 0, 'C', 'White', 'bold 30px Arial' );
			
// невидима точка за позициониране на мерките
invisible = point( ).style({visible: false});



// =========================================================
//
// ИНТЕРАКТИВНОСТ
//
// =========================================================

var obj = null,		// връх, който се влачи
	objPos = [];	// начална позиция на върха

function onPointerDown( event )
{
	obj = findObject( event, [A,B,C] );
	if( obj ) objPos = obj.center;
}

function onPointerUp( event )
{
	obj = null;
}

function onPointerMove( event )
{
	if( obj )
	{
		obj.center = findPosition( event );
		if( event.buttons == 2 ) obj.center = lerp( obj.center, objPos, 0.9 );
		update( );
	}
}



// =========================================================
//
// ПРЕВКЛЮЧВАНЕ НА ОПЦИИТЕ
//
// =========================================================

// превключване на мерките на ъглите, дължините и лицата
var showValues = false;
function toggleValues()
{
	showValues = !showValues;
	updateLables( );
}

// показване или скриване на мерките
function updateLables()
{
	var visible = showValues ? 'block' : 'none';
	
	element('label-a').style.display = visible;
	element('label-b').style.display = visible;
	element('label-c').style.display = visible;
	
	element('label-ab').style.display = visible;
	element('label-bc').style.display = visible;
	element('label-ca').style.display = visible;
	
	visible = showValues && showSquares ? 'block' : 'none';
	
	element('label-ab2').style.display = visible;
	element('label-bc2').style.display = visible;
	element('label-ca2').style.display = visible;
}

// превключване на линиите-продължения на страните на триъгълника
function toggleLines()
{
	ABln.visible = !ABln.visible;
	BCln.visible = !BCln.visible;
	CAln.visible = !CAln.visible;
}

// превключване на квадратите
var showSquares = true;
function toggleSquares()
{
	showSquares = !showSquares;
	ABsq.visible = !ABsq.visible;
	BCsq.visible = !BCsq.visible;
	CAsq.visible = !CAsq.visible;
	
	updateLables();
}

// превключване на мрежата от линии
function toggleGrid()
{
	grid.visible = !grid.visible;
}

// превключване на режима на автоматично подравняване
function toggleAutoInt()
{
	autoInt = !autoInt;
	update( );
}



// =========================================================
//
// КАСКАДНОСТ
//
// =========================================================

// функция за разстояние между 2 двумрни точки
function distance( a, b )
{
	return Math.sqrt( (a.x-b.x)**2 + (a.y-b.y)**2 );
}

// актуализира обектите и мерките (това е каскадността)
function update( )
{
	// автоматично подравняване на върховете
	if (autoInt)
	{
		A.x = SCALE * Math.round(A.x/SCALE);
		A.y = SCALE * Math.round(A.y/SCALE);
		B.x = SCALE * Math.round(B.x/SCALE);
		B.y = SCALE * Math.round(B.y/SCALE);
		C.x = SCALE * Math.round(C.x/SCALE);
		C.y = SCALE * Math.round(C.y/SCALE);
	}

	// атуализиране на страните
	AB.height = distance( A, B );
	AB.center = A.center;
	AB.lookAt( B );
	
	BC.height = distance( B, C );
	BC.center = B.center;
	BC.lookAt( C );
	
	CA.height = distance( C, A );
	CA.center = C.center;
	CA.lookAt( A );

	// атуализиране на квадратите - при рисуването им те
	// трябва да са от външната страна на триъгълника, но
	// коя страна е външна зависи от това дали точките ABC
	// са по часовниковата стрелка или обратно на нея, а
	// това зависи от знака на ориентираното лице на ABC
	var sign = ((A.x-B.x)*(A.y+B.y)+(B.x-C.x)*(B.y+C.y)+(C.x-A.x)*(C.y+A.y) )>0?1:-1;
	var swap = sign>0?-90:0;

	ABsq.size = AB.height;
	ABsq.center = A.center;
	ABsq.spinS = swap + degrees( Math.atan2( B.y-A.y, B.x-A.x ) );
	
	BCsq.size = BC.height;
	BCsq.center = B.center;
	BCsq.spinS = swap + degrees( Math.atan2( C.y-B.y, C.x-B.x ) );
	
	CAsq.size = CA.height;
	CAsq.center = C.center;
	CAsq.spinS = swap + degrees( Math.atan2( A.y-C.y, A.x-C.x ) );

	// актуализиране на линиите
	ABln.from = lerp( A, B, 1E5 );
	ABln.to = lerp( A, B, -1E5 );

	BCln.from = lerp( B, C, 1E5 );
	BCln.to = lerp( B, C, -1E5 );
	
	CAln.from = lerp( C, A, 1E5 );
	CAln.to = lerp( C, A, -1E5 );
	
	// актуализиране на имената на върховете
	Alb.center = [A.x+3, A.y+3, A.z+10];
	Blb.center = [B.x+3, B.y+3, B.z+10];
	Clb.center = [C.x+3, C.y+3, C.z+10];
	
	// актуализация на дължините на страните
	ab = AB.height / (2*SCALE);
	bc = BC.height / (2*SCALE);
	ca = CA.height / (2*SCALE);
		
	invisible.center = lerp( A, B, 0.5 );
	p = invisible.screenPosition( );
	element('label-ab').style.left = (p[0]-24)+'px';
	element('label-ab').style.top = (p[1])+'px';
	element('label-ab').innerHTML = ab.toFixed(2);

	invisible.center = lerp( B, C, 0.5 );
	p = invisible.screenPosition( );
	element('label-bc').style.left = (p[0]-24)+'px';
	element('label-bc').style.top = (p[1])+'px';
	element('label-bc').innerHTML = bc.toFixed(2);

	invisible.center = lerp( C, A, 0.5 );
	p = invisible.screenPosition( );
	element('label-ca').style.left = (p[0]-24)+'px';
	element('label-ca').style.top = (p[1])+'px';
	element('label-ca').innerHTML = ca.toFixed(2);

	// актуализация на лицата на квадратите
	ab2 = ab*ab;
	bc2 = bc*bc;
	ca2 = ca*ca;
		
	invisible.center = lerp( A, B, 0.5 );
	invisible.x += sign * (B.y-A.y)/2;
	invisible.y -= sign * (B.x-A.x)/2;
	p = invisible.screenPosition( );
	element('label-ab2').style.left = (p[0]-24)+'px';
	element('label-ab2').style.top = (p[1])+'px';
	element('label-ab2').innerHTML = 'S='+ab2.toFixed(1);
	if( ab2>=bc2 && ab2>=ca2) element('label-ab2').innerHTML += '<br><small>( '+(bc2+ca2).toFixed(1)+' )</small>';
	
	invisible.center = lerp( B, C, 0.5 );
	invisible.x += sign * (C.y-B.y)/2;
	invisible.y -= sign * (C.x-B.x)/2;
	p = invisible.screenPosition( );
	element('label-bc2').style.left = (p[0]-24)+'px';
	element('label-bc2').style.top = (p[1])+'px';
	element('label-bc2').innerHTML = 'S='+bc2.toFixed(1);
	if( bc2>=ab2 && bc2>=ca2) element('label-bc2').innerHTML += '<br><small>( '+(ca2+ab2).toFixed(1)+' )</small>';

	invisible.center = lerp( C, A, 0.5 );
	invisible.x += sign * (A.y-C.y)/2;
	invisible.y -= sign * (A.x-C.x)/2;
	p = invisible.screenPosition( );
	element('label-ca2').style.left = (p[0]-24)+'px';
	element('label-ca2').style.top = (p[1])+'px';
	element('label-ca2').innerHTML = 'S='+ca2.toFixed(1);
	if( ca2>=bc2 && ca2>=ab2) element('label-ca2').innerHTML += '<br><small>( '+(ab2+bc2).toFixed(1)+' )</small>';

	// актуализация на ъглите
	p = A.screenPosition( );
	element('label-a').style.left = (p[0]-32)+'px';
	element('label-a').style.top = (p[1]-28)+'px';
	element('label-a').innerHTML = degrees(Math.acos((ca2+ab2-bc2)/(2*ca*ab))).toFixed(1)+'°';
		
	p = B.screenPosition( );
	element('label-b').style.left = (p[0]-32)+'px';
	element('label-b').style.top = (p[1]-28)+'px';
	element('label-b').innerHTML = degrees(Math.acos((ab2+bc2-ca2)/(2*ab*bc))).toFixed(1)+'°';
		
	p = C.screenPosition( );
	element('label-c').style.left = (p[0]-32)+'px';
	element('label-c').style.top = (p[1]-28)+'px';
	element('label-c').innerHTML = degrees(Math.acos((bc2+ca2-ab2)/(2*bc*ca))).toFixed(1)+'°';
}

// първоначално актуализиране на триъгълника
update( );

