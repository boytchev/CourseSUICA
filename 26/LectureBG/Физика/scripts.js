var M = 6; // 1 м = 6 пиксела
var v = 28*M; // скорост на изстрел 28 м/с
var g = 9.81*M; // гравитационно ускорение 9.81 м/с2
var shooting = false; // дали в момента тече изстрел


// фиксирана гледна точка

orthographic( 0, 10000 );
lookAt( [0,0,100], [0,0,0], [0,1,0] );


// небе

background( 'Azure' );


// текстура за тревата

grass = drawing( 64, 256, 'ForestGreen' );
for (var i=0; i<1000; i++)
{
	var x = random(0, 64 ),
		y = random(0, 256 );
	moveTo( x, y-1 );
	lineTo( x, y+1 );
	stroke( hsl(random(30,150),50,45), 1 );
}


// земя с трева

cylinder( [-350,-160,0], [50,700], 'White' ).style({
	spinH: 90,
	spinV: 90,
	image: grass,
	images: [6, 2],
});
		

// статична част на топа - колело и основна рама

cannonBase = group();
	cannonBase.center = [240, -112, 0];
	cannonBase.add( circle([0,0,1],10,hsl(0,0,35)) );
	for( var i=0; i<10; i++ )
		cannonBase.add( circle( [0,0,1], 40+i, hsl(0,0,10+5*i) ).style({wireframe:true}) );
	for( var i=0; i<5; i++ )
		cannonBase.add( square( [0,0,1], [40,3], hsl(0,0,35) ).style({spinS:i/5*180}) );
	cannonBase.add( square( [15,-10,0], [40,8], 'black' ).style({spinS:-35}) );
	cannonBase.add( square( [40,-21,0], [20,5], 'black' ) );


// подвижна част на топа 

cannon = group();
	cannon.z = -10;
	cannon.size = 0.8;
	cannon.add( circle([0,-10,0],20,'black') );
	cannon.add( square([0,-20,0],5,'black') );
	cannon.add( square([9,0,0],5,'black') );
	cannon.add( cone([0,-10,0],[20,70],'black').style({spinS:4}) );
	cannon.add( cone([0,-10,0],[20,70],'black').style({spinS:-4}) );
	cannon.add( cone([0,60,0],[16,30],'black').style({spinS:180}) );
cannonBase.add( cannon );


// предварително сметнати sin и cos
var sin = [],
	cos = [];
for( var i=90; i<=180; i+=5)
{
	sin[i] = Math.sin( radians(i) );
	cos[i] = Math.cos( radians(i) );
}

// ъгломер от дъга и няколко радиални отсечки
var angler = group();
	angler.z = -30;
	
for( var i=90; i<180; i+=5)
{
	angler.add(
		line( [17.5*M*cos[i],17.5*M*sin[i],1], [17.5*M*cos[i+5],17.5*M*sin[i+5],1], 'DodgerBlue' )
	);
}
for( var i=95; i<180; i+=10)
	angler.add(
		line( [17*M*cos[i],17*M*sin[i],0], [18*M*cos[i],18*M*sin[i],0], 0x80c0f0 )
	);
for( var i=100; i<=180; i+=10)
	angler.add(
		line( [17*M*cos[i],17*M*sin[i],0], [19*M*cos[i],19*M*sin[i],0], 'DodgerBlue' )
	);
for( var i=90; i<180; i+=90)
	angler.add(
		line( [8*M*cos[i],8*M*sin[i],0], [1000*M*cos[i],1000*M*sin[i],0], 'DodgerBlue' )
	);

cannonBase.add( angler );


// хоризонтална линия
hRuler = group();
hRuler.center = cannonBase.center;
hRuler.add( line([0,0,0],[-M*100,0,0],'DodgerBlue') );
for( var i=0; i<90; i+=1)
{
	if( i%10 == 0 )
		hRuler.add(
			line( [-M*i,-7,0], [-M*i,7,0], 'DodgerBlue' )
		)
	else if( i%5 == 0 )
		hRuler.add(
			line( [-M*i,-2,0], [-M*i,4,0], 'DodgerBlue' )
		);
	else 
		hRuler.add(
			line( [-M*i,-2,-1], [-M*i,2,-1], 0x80c0f0 )
		);
}

vRuler = hRuler.clone.style({spinS:-90});


// гюле

ball = circle( [0,0,0], 12, 'Black' );
ball.visible = false;


// траектория - набор от отсечки

T = 100;
trajectory = [];
for( var i=0; i<T; i++ )
	trajectory.push( line([0,0,0],[0,0,0],'gray').style({visible:false}) );


// индикатори за време

TT = 20;
timers = [];
for( var i=0; i<TT; i++ )
	timers[i] = point( [1000,0,0], 5+3*(i%2), 'DimGray');


// иницииране на нов изстрел

newShot();


// трасиране на изстрел - движение на гюлето

function doBallistic( time )
{
	if( ball.time == null )
	{
		ball.time = time;
		trajectory[0].from = [cannonBase.x,cannonBase.y,-20];
	}
	
	// изчисляване позицията на гюлето
	var t = time-ball.time; // изминало време
	var x = cannonBase.x - v*t*Math.cos(radians(90-cannon.spinS));
	var y = cannonBase.y + v*t*Math.sin(radians(90-cannon.spinS)) - g*t*t/2;

	// преместване на гюлето на правилното място
	ball.center = [x,y,0];
	
	// показване на новия фрагмент от траекторията
	var n = Math.round(5*t);
	trajectory[n].visible = true;
	trajectory[n].to = [x,y,-20];
	trajectory[n+1].from = [x,y,-20];

	n = Math.round(2*t-0.5);
	timers[n].center = [x,y,-10];
	
	// при удар в земята спираме цилъла с анимация
	if (y<-135)
		p.ontime = null;
}	


// изчисляване на решенията на задача 1

function calcProblem1()
{
	// помощна функция за дължината на полет
	function W(angle)
	{
		return (v/6)*(v/6)/(g/6)*Math.sin(radians(2*angle));
	}
	
	// помощна функция за височината на полет
	function H(angle)
	{
		return (v/6)*(v/6)*Math.sin(radians(angle))*Math.sin(radians(angle))/2/(g/6);
	}
	
	// решение на подусловие (а)
	document.getElementById('1.30.W').innerHTML = W(30).toFixed(2)+' м';
	document.getElementById('1.30.H').innerHTML = H(30).toFixed(2)+' м';			
	
	// решение на подусловие (б)
	document.getElementById('1.60.W').innerHTML = W(60).toFixed(2)+' м';
	document.getElementById('1.60.H').innerHTML = H(60).toFixed(2)+' м';			
	
	// решение на подусловие (в)
	document.getElementById('1.90.W').innerHTML = W(90).toFixed(2)+' м';
	document.getElementById('1.90.H').innerHTML = H(90).toFixed(2)+' м';			
}

// насочване на оръдието в дадена посока

function pointerMove( event )
{
	var [x, y, z] = findPosition( event );

	// нагласяване на вертикалната линия според позицията на мишката
	x = Math.max(x,-270);
	x = Math.min(x,240);
	vRuler.x = x;
	
	// намиране на ъгъла на стрелба и ограничаването му в интервала [0°,90°]
	var angle = degrees( Math.atan2( y-cannonBase.y, x-cannonBase.x ) );
	if( angle>180 || angle<0 ) angle = 180;
	if( angle<90 ) angle = 90;
	
	// завъртане на оръдието и ъгломера в посока на мишката
	if( !shooting )
	{
		cannon.spinS = angle - 90;
		angler.spinS = angle - 90;
	}
}


// произвеждане на изстрел при кликане с мишката

function pointerDown( event )
{
	// ако в момента се стреля, да не се започва нов изстрел
	if( shooting ) return;
	
	shooting = true; // в момента започва да се стреля
	
	// слагане на гюлето в началната позиция,  засичане на началното 
	// време, показване на гюлето и активиране на цикъл с анимация
	ball.center = cannonBase.center;
	ball.time = null;
	ball.visible = true;
	p.ontime = doBallistic;
}


// показване и скриване на секция

function toggleSection( that, id )
{
	var e = document.getElementById( id );
	if( e.style.display != 'block' )
		e.style.display = 'block'
	else
		e.style.display = 'none';
		
	if( id[0] == 's' )
	{
		if( e.style.display == 'block' )
			that.innerHTML = 'Скрий решението'
		else
			that.innerHTML = 'Покажи решението';
	}
}


// показване и скриване на ъгломера и двете мерителни линии

function toggleGrid()
{
	angler.visible = !angler.visible;
	hRuler.visible = angler.visible;
	vRuler.visible = angler.visible;
	for (var i=0; i<TT; i++)
		timers[i].visible = angler.visible;
}


// активиране на процедура по нов изстрел

function newShot()
{
	shooting = false; // в момента не се стреля
	
	// скриваме гюлето някъде извън екрана,
	// а траекторията я правим невидима
	ball.center = [1000,0,0];
	for (var i=0; i<T; i++)
		trajectory[i].visible = false;
	for (var i=0; i<TT; i++)
		timers[i].center = [1000,0,0];
}


