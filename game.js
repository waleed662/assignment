var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var lastPressed = false;
var spacePressed = false;
var keyLocked = false;
var isDead = false;
var score = 0;
var bombsCreated =0;
var level = 1;
var timeout,fallInt,dropInt,blastInt,arrowInt,expInt;
function keyup(event) {
	if(keyLocked)
	{
		return;
	}
	var player = document.getElementById('player');
	if (event.keyCode == 37) {
		leftPressed = false;
		lastPressed = 'left';
	}
	if (event.keyCode == 39) {
		rightPressed = false;
		lastPressed = 'right';
	}
	if (event.keyCode == 38) {
		upPressed = false;
		lastPressed = 'up';
	}
	if (event.keyCode == 40) {
		downPressed = false;
		lastPressed = 'down';
	}
	if (event.keyCode == 32) {
		shootArrow();
		spacePressed = false;
		rightPressed = false;
		downPressed = false;
		leftPressed = false;
		upPressed = false;
		lastPressed = 'up fire';
		keyLocked = true;
		// unlock keyboard input after .5 seconds
        setTimeout( function(){ 
			keyLocked = false;
		 },500); 
	}

	player.className = 'character stand ' + lastPressed;
}

function interV()
{
	timeout = setInterval(move, 10);
	arrowInt = setInterval(moveArrows, 10);
	blastInt = setInterval(blastRadius, 10);

	dropInt = setInterval(dropBombs,10);
	fallInt = setInterval(bombFall, 3000);
	expInt = setInterval(removeExplosion, 400);
}

function clearInterv()
{
	clearInterval(timeout);
	clearInterval(arrowInt);
	clearInterval(blastInt);
	clearInterval(dropInt);
	clearInterval(fallInt);
	clearInterval(expInt);
}
function move() {
	if(isDead)
	{
		return;
	}
	var player = getId('player');
	var positionLeft = player.offsetLeft;
	var positionTop = player.offsetTop;
	if (downPressed) {
		var newTop = positionTop+1;

		var element = document.elementFromPoint(player.offsetLeft, newTop+32);
		if (element && element.classList.contains('sky') == false) {
			player.style.top = newTop + 'px';	
		} else {
			// killPlayer();
		}

		if (leftPressed == false) {
			if (rightPressed == false) {
				player.className = 'character walk down';
			}
		}
	}
	if (upPressed) {
		var newTop = positionTop-1;

		var element = document.elementFromPoint(player.offsetLeft, newTop);
		if (element && element.classList.contains('sky') == false) {
			player.style.top = newTop + 'px';	
		} else {
			killPlayer();
		}
		
		if (leftPressed == false) {
			if (rightPressed == false) {
				player.className = 'character walk up';
			}
		}
	}
	if (leftPressed) {
		var newLeft = positionLeft-1;

		var element = document.elementFromPoint(newLeft, player.offsetTop);
		if (element && element.classList.contains('sky') == false) {
			player.style.left = newLeft + 'px';	
		}  else {
			// killPlayer();
		}


		player.className = 'character walk left';
	}
	if (rightPressed) {
		var newLeft = positionLeft+1;
		
		var element = document.elementFromPoint(newLeft+32, player.offsetTop);
		if (element && element.classList.contains('sky') == false) {
			player.style.left = newLeft + 'px';		
		} else {
			// killPlayer();
		}

		player.className = 'character walk right';
	}

}

// updates score
function updateScore()
{
	getId('score').innerHTML = score;
}

function keydown(event) {
	if(keyLocked)
	{
		return;
	}
	if (event.keyCode == 37) {
		leftPressed = true;
		rightPressed = false;
	}
	if (event.keyCode == 39) {
		rightPressed = true;
		leftPressed = false;
	}
	if (event.keyCode == 38) {
		upPressed = true;
	}
	if (event.keyCode == 40) {
		downPressed = true;
	}
	if (event.keyCode == 32) {
		spacePressed = true;
	}
}


function myLoadFunction() {

	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);
	interV();
}

/**
 * Starts the game and hides the start button
 * @param {*} elem holds the currebt object
 */
function start(elem)
{
	score = 0;
	level = 1;
	getId('score').innerHTML = score;
	getId('level').innerHTML = level;
	bombsCreated = 0;
	clearInterv();
	isDead = false;
	hide(elem);
	hide(getId('logged'));
	myLoadFunction();

}

// the falling bombs
function bombFall()
{
	if(isDead)
	{
		return;
	}

	// creates a bomb element at a random position above
	var player = getId('player');
	var positionLeft = player.offsetLeft;
	var positionTop = player.offsetTop;
	var bomb = document.createElement('DIV');
	// document width
	var docWidth = getId('sky').offsetWidth - 50;

	// position to show bomb
	var pos = Math.floor(Math.random() * parseInt(docWidth));
	bomb.className="bomb";
	bomb.style.left = pos+'px';
	document.body.appendChild(bomb);
	bombsCreated += 1;
}

// drop bombs
function dropBombs()
{
	if(isDead)
	{
		return;
	}
	var bombs = document.getElementsByClassName('bomb');
	
	for(i = 0; i < bombs.length; i++)
	{
		var pos = Math.floor(Math.random() * 5);
		var positionTop = bombs.item(i).offsetTop;
		var positionLeft = bombs.item(i).offsetLeft;
		var top = rand(level);
		if(bombsCreated > level * 15)
		{
			clearInterval(fallInt);
			var newInt = 3000 - (level * 500);
			var newFallInt = (newInt > 200) ? newInt : 200;
			fallInt = setInterval(bombFall, newFallInt);
			level +=1;
			getId('level').innerHTML = level;
		}
		var top = level;
		var newTop = positionTop+top;
		var sky = getId('sky');
		var posLeft = [1,-1];
		var newPosLef = posLeft[Math.floor(Math.random() * posLeft.length)];
		var newLeft = positionLeft+newPosLef;

		// make the bombs fall at different heights;
		var diff= [20,50,80,100,120,150, 180, 200, 220, 250, 280, 300]
		var diffHeight = diff[rand(diff.length)];

		if(newTop >= sky.offsetHeight + diffHeight)
		{
			clearInterval(expInt);
			bombs.item(i).id = 'exp-'+i;
			bombs.item(i).className="explosion";	
			// remove current explosion
			

			score += 1;
			getId('score').innerHTML = score;
			expInt = setInterval(removeExplosion,400);
			return;
		}
		bombs.item(i).style.top = newTop +'px';
		
		// bombs.item(i).style.left = newLeft +'px';
	}
}

// blast radius
function blastRadius()
{
	if(isDead)
	{
		return;
	}
	var blast = document.getElementsByClassName('explosion');
	var player = getId('player');
	for(i=0;i<blast.length; i++)
	{
		if(hit(blast.item(i),player))
		{
			killPlayer();
			// blast.item(i).parentNode.removeChild(blast.item(i));
			score = (score > 0) ? score -1 : 0;
			getId('score').innerHTML = score;
		}
		
	}
	
}

// remove all explosions 
function removeExplosion()
{
	var explosionList = document.getElementsByClassName('explosion');
	while(explosionList[0])
	{
		explosionList[0].parentNode.removeChild(explosionList[0]);
	}
}
// shoot arrow
function shootArrow()
{
	if(isDead)
	{
		return;
	}
	// creates an arrow element at from player's position
	var player = getId('player');
	var positionLeft = player.offsetLeft;
	var positionTop = player.offsetTop;
	var arrow = document.createElement('DIV');
	
	arrow.className="arrow up";
	arrow.style.left = positionLeft+'px';
	arrow.style.top = positionTop+'px';
	document.body.appendChild(arrow);
}

function moveArrows()
{
	if(isDead)
	{
		return;
	}
	var arrows = document.getElementsByClassName('arrow');

	for(i = 0; i < arrows.length; i++)
	{
		
		var positionTop = arrows.item(i).offsetTop;
		var positionLeft = arrows.item(i).offsetLeft;
		var newTop = positionTop-1;
		var player = getId('player');
		var playerTop = player.offsetTop;
		var playerLeft = player.offsetLeft;
		var bombs = document.getElementsByClassName('bomb');
		for(var x = 0; x < bombs.length; x++)
		{
			if(hit(arrows.item(i),bombs.item(x)))
			{
				bombs.item(x).id = 'exp-'+x;
			bombs.item(x).className="explosion";	
			// remove current explosion
			clearInterval(expInt);
			expInt = setInterval(removeExplosion,400);

			score += 1;
			getId('score').innerHTML = score;
			arrows.item(i).parentNode.removeChild(arrows.item(i));
			// setTimeout(function() { remCur.parentNode.removeChild(remCur); },50);
			
			return;
			}
		}
		
		
		arrows.item(i).style.top = newTop +'px';
	}
}


// check if object is hitting another
function hit(elemOne, elemTwo)
{
	var posOneTop = elemOne.offsetTop,
	posOneLeft = elemOne.offsetLeft,
	posOneHeight = elemOne.offsetHeight,
	posOneWidth = elemOne.offsetWidth ;

	var posTwoTop = elemTwo.offsetTop,
	posTwoLeft = elemTwo.offsetLeft,
	posTwoHeight = elemTwo.offsetHeight,
	posTwoWidth = elemTwo.offsetWidth ;
	var leftTop = posTwoLeft > posOneLeft && posTwoLeft < posOneLeft+posOneWidth && posTwoTop > posOneTop && posTwoTop < posOneTop+posOneHeight,
	rightTop = posTwoLeft+posTwoWidth > posOneLeft && posTwoLeft+posTwoWidth < posOneLeft+posOneWidth && posTwoTop > posOneTop && posTwoTop < posOneTop+posOneHeight,
	leftBottom = posTwoLeft > posOneLeft && posTwoLeft < posOneLeft+posOneWidth && posTwoTop+posTwoHeight > posOneTop && posTwoTop+posTwoHeight < posOneTop+posOneHeight,
	rightBottom = posTwoLeft+posTwoWidth > posOneLeft && posTwoLeft+posTwoWidth < posOneLeft+posOneWidth && posTwoTop+posTwoHeight > posOneTop && posTwoTop+posTwoHeight < posOneTop+posOneHeight;
    return leftTop || rightTop || leftBottom || rightBottom;
}


// kill user
function killPlayer()
{
	var player = getId('player');
	player.className="character hit left";
	isDead = true;
	keyLocked = true;

	// remove a life if user still has lives
	var health = getId('health');
	var lives = document.getElementsByClassName('live');
	if(lives.length > 1){
		lives.item(0).remove();
	// resumeButton = getId('resume');
	// resumeButton.style.visibility="visible";
	// resumeButton.addEventListener
	setTimeout(function(){
		keyLocked = false;
		leftPressed = false;
		rightPressed = false;
		upPressed = false;
		downPressed = false;
		spacePressed = false;
		//  this.style.visibility = 'hidden';
		 isDead = false;
		},1000);
	} else
	{
		logPlayer();
		var overButton = getId('over');
		show(overButton);
		
		var startButton = getId('resume');
		
		startButton.addEventListener('click',function(){
		keyLocked = false;
		leftPressed = false;
		rightPressed = false;
		upPressed = false;
		downPressed = false;
		spacePressed = false;
		// restore lives
		health.innerHTML = '<li class="live"></li><li class="live"></li><li class="live"></li>';

		// clear all bombs
		var bombList = document.getElementsByClassName('bomb');
		while(bombList[0])
		{
			bombList[0].parentNode.removeChild(bombList[0]);
		}
		// clear all explosions
		
		var explosionList = document.getElementsByClassName('explosion');
		while(explosionList[0])
		{
			explosionList[0].parentNode.removeChild(explosionList[0]);
		}

		// clear all arrows
		
		var arrowList = document.getElementsByClassName('arrow');
		while(arrowList[0])
		{
			arrowList[0].parentNode.removeChild(arrowList[0]);
		}
		
		start(this);

	});
	}
}

// saves user data
function logPlayer()
{
	var resButton = getId('resume');
	var sideBar = getId('guest');
	var overButton = getId('over');
	var startButton = getId('resume');
	if(!localStorage.playerName)
	{
		show(sideBar);
		var btn = getId('btn');
		btn.addEventListener('click',function(){
			if(regPlayer())
			{
				hide(sideBar);
				hide(overButton);
				show(startButton);
			}

		});
	}
	else
	{
		if(localStorage.highScore < score)
		{
			localStorage.highScore = score - 1;
		}
		getId('username').innerHTML = localStorage.playerName;
		getId('highest').innerHTML = localStorage.highScore;
		show(getId('logged'));
		
		setTimeout(function(){
			hide(overButton);
			show(startButton);
		},3000);
	}

}

// log user out
function logOut()
{
	if(confirm('Are you sure you want to log out? \n All progress will be cleared!')){
	var logged = getId('logged');
	localStorage.removeItem('playerName');
	localStorage.removeItem('highScore');
	hide(logged);
	}
}

// make an item invisible
function hide(elem)
{
	elem.style.visibility= 'hidden';
}

// make an item visible
function show(elem)
{
	elem.style.visibility= 'visible';
}

function regPlayer()
{
	var user = getId('name').value;
	if(user == '')
	{
		alert('Please Fill In Your Name');
		return false;
	}
	localStorage.playerName = user;
	localStorage.highScore = score;
	return true;
}


// generates a random int, the number specified being the max
function rand(number)
{
	var rand = Math.floor(Math.random() * number);
	return rand;
}

/**
 * easily get document id
 * @param {*} id holds the document id
 */
function getId(id)
{
	return document.getElementById(id);
}
// document.addEventListener('DOMContentLoaded', myLoadFunction);