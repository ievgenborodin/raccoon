/*
body { min-height:540px; }     
body[orient="portrait"] { min-height:540px; }
body[orient="landscape"] { min-height:400px; }
*/


/*	UPDATE	FUNCITON	*/
function update(player, key){
	random = Math.random();
	dateNow = Date.now();
	gameTime.update(dateNow);
	if (timer.active)	timer.countDown(dateNow, restart);
	
	window.enemies = window.enemies.filter(function(enemy){		return enemy.active;	});
	window.enemies.forEach(function(e){	
		if (e.active){
			e.update(canvas, player);
			if(collides(e, player)) {
				player.hit();
			}
		}
	});
	
	window.bullets.forEach(function(bullet) {	bullet.update(game, player, window.enemies);	});

	window.items = window.items.filter(function(item){	return item.active;		});
	window.items.forEach(function(item){
		if (collides(item, player)){
			item.pickup(mBox, player, game);
		}
	});
	
	if(player.alive && gameKey===1){
		if (player.fire) {
			player.shoot();
		}
		else {
			window.bullets = window.bullets.filter(function (bullet) {		 
				bullet.parts = bullet.parts.filter(function(p){
					return p.active;
				});
				return bullet.parts.length!==0;
			});		
		}
		if (touchScreen){	
			countmove(player);
		}
		else {
			if(key.isDown(key.spaceb))  {
				player.shoot();
			}
			if(key.isDown(key.ctrl))  {
				player.weaponId = (player.weaponId > 4) ? 1 : player.weaponId + 1; 
				switch (player.weaponId){
					case 1:
						player.weapon = 'Ak47';
						break;
					case 2:
						player.weapon = 'Plazma';
						break;
					case 3:
						player.weapon = 'Springun';
						break;
					case 4:
						player.weapon = 'Laser';
						break;
					default:
						player.weaponId = 1;
						player.weapon = 'Ak47';
				}	
			}		
			if (key.isDown(key.up))  {
				turnChange(player, 0, 0, -2);
				countmove(player);
			}
			if (key.isDown(key.left))  {
				turnChange(player, 270, -2, 0);
				countmove(player);
			}
			if (key.isDown(key.down))  {
				turnChange(player, 180, 0, 2);
				countmove(player);
			}
			if (key.isDown(key.right)) {
				turnChange(player, 90, 2, 0);
				countmove(player);
			}
			if (key.isDown(key.up) && key.isDown(key.left)) 
				player.angle = 315;
			if (key.isDown(key.left)&& key.isDown(key.down)) 
				player.angle = 225;
			if (key.isDown(key.down)&& key.isDown(key.right)) 
				player.angle = 135;
			if (key.isDown(key.right)&& key.isDown(key.up)) 
				player.angle = 45;
		}
	} else if (!player.alive && gameKey === 1){
		mBox.send(canvas, "You're dead!", "black", 3, 40);
		mBoxExtra.send(canvas, "  score: " + game.points, "black", 3, 30);
		timer.set(2, restart);
		gameKey = 2;
	}
	if (player.x + player.width > maxX) player.x = maxX - player.width;	if (player.x<0) player.x = 0; 
	if (player.y + player.height > maxY) player.y = maxY - player.height;	if (player.y<0) player.y = 0;
	
	if (random < game.epopulation && game.bugs - window.enemies.length > 0){
		random = Math.random();
		enemyInd = (enemyInd > 7) ? 0 : enemyInd + 1;
		window.enemies.push(Object.create(Enemy).constructor(Math.floor(random * 8), enemyInd));
		if (random < 0.4){
			ind = (ind>6) ? 0 : ind;
			window.items.push(Object.create(Item).constructor(ind, game));
			++ind;
		}
	}
};	

/*	DRAW FUNCTION	*/
function draw(canvas, player, game, gameTime){
	context.clearRect(0, 0, canvas.width, canvas.height);
	window.bullets.forEach(function(bullet) {	bullet.draw(context);	});
	player.draw(canvas);
	window.items.forEach(function(item) {	item.draw(context);		});
	window.enemies.forEach(function(e){		e.draw(context);	});
	gameFace.draw(canvas, gameTime, player, game);
	if (mBox.active)		mBox.draw(canvas, game);
	if (mBoxExtra.active)		mBoxExtra.draw(canvas, game);
};

/*	INITIALIZATION	*/
function initialize(){
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	plazma = true; springun = false; laser = false; 
	game = Object.create(Game).constructor(1, 50);
	background = canvas.style.backgroundImage = game.background();
	player = Object.create(Player).constructor(canvas, game, 32, 32, "img/raccoon.png");
	gameTime = Object.create(Timer).constructor();
	gameTime.set(Date.now());
	timer = Object.create(Timer).constructor();
	gameFace = Object.create(Interface).constructor("Arial");
	mBox = Object.create(Message).constructor();
	mBoxExtra = Object.create(Message).constructor(1);
	gameKey = 1;
	handleControls();
}

/*	RESTART GAME	*/
function restart(){
	window.items = [];
	window.bullets = [];
	window.enemies = [];
				
	plazma=false; laser=false; ak47=false; minigun=false;
	game.reset('game', 1, 0.03, 50);
	canvas.style.backgroundImage = game.background();	
	
	player.alive = true;
	player.health = 100;
	player.weapon = 'Ak47';
	player.weaponId = 1;
	player.x = (canvas.width - (game.landscape * canvas.width * 0.2) - player.width)/2;
	player.y = (canvas.height - player.height)/2;
	gameKey = 1;
	mBox.send(canvas, "Level " + game.level, "black", 2, 40);
	gameTime.set(Date.now());
};

/*	NEXT LEVEL	*/
function nextLevel(){
	window.items = [];
	window.bullets = [];
	window.enemies = [];
				
	game.reset('game', ++game.level, 0.02 * game.level * 2, 50 * game.level, game.points);
	canvas.style.backgroundImage = game.background();
	
	player.alive = true;
	player.health = 100;
	player.x = (canvas.width - (game.landscape * canvas.width * 0.2) - player.width)/2;
	player.y = (canvas.height - player.height)/2;
	gameKey = 1;
	mBox.send(canvas, "Level " + game.level, "black", 2, 40);
	gameTime.set(Date.now());
};

/*	COLLIDES	*/
function collides(a, b) {
	return a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y;
}

/*	WINDOW TO CANVAS	*/
function windowToCanvas(canvas, x, y) {
	var bbox = canvas.getBoundingClientRect();
	return { x: x - bbox.left * (canvas.width / bbox.width),
			y: y - bbox.top * (canvas.height / bbox.height)
	};
};

/*	ROTATE IMAGE	*/
function rotateImage(context, image, x, y, ang){
	context.save();
	context.translate(x + image.width/2, y + image.height/2);
	context.rotate(ang * Math.PI/180);
	context.drawImage(image, -(image.width/2),-(image.height/2));
	context.restore();
};

/*///////////////////////// Rotate rect ////////////////////*/
function rotateRect(context, x, y, width, height, ang){
	context.save();
	context.translate(x + width*0.5, y+ height*0.5);
	context.rotate(ang * Math.PI/180);
	context.fillRect(x - width*0.5, y - height*0.5, -width, height);
	context.restore();
};


/*	TOUCH OR MOUSE	*/
function touchOrMouse(e) {
	x = e.pageX;
	y = e.pageY;
	x1=x2;	x2=x3;	x3=x;
	y1=y2;	y2=y3;	y3=y;
	if(x1>0 && x2>0 && x3>0 && y1>0 && y2>0 && y3>0) 
		touchScreen = false; 
};

/*	COUNT MOVES	*/
function countmove(player){
	player.x += player.velocityX;
	player.y += player.velocityY;
};

function turnChange(player, angle, velX, velY){
	player.angle = angle;
	player.velocityX = velX;
	player.velocityY = velY;
}

/*	SCREEN STATE	*/
function screenState(game, player){
	width = window.innerWidth-6;
	height = window.innerHeight-6;
	game.landscape = width-height>0 ? true : false;
	if (game.landscape){
		q = width/height;
		scrY = (width > 1300) ? height * 0.7 : height;
		scrX = scrY*q;
		maxX = scrX * 0.8;
	}	
	else {
		q = height/width;
		scrX = maxX = width;
		scrY = scrX*q;
	}
	canvas.width = scrX;
	canvas.height = maxY = scrY;
	if (player!==undefined){
		player.x = (canvas.width - (game.landscape * canvas.width * 0.2) - player.width)/2;
		player.y = (canvas.height - player.height)/2;
		player.angle = 315;
	}
}

/*	HANDLE CONTROLS		*/
function handleControls(){
	if (!touchScreen){
		key = {
			_pressed: {},
			left: 37, 
			up: 38, 
			right: 39, 
			down: 40, 
			spaceb: 32,
			ctrl: 17,
			isDown: function(keyCode) {
				return this._pressed[keyCode];
			},
			onKeydown: function(event) {
				this._pressed[event.keyCode] = true;
			},
			onKeyup: function(event){
				delete this._pressed[event.keyCode];
			}
		}
		window.addEventListener('keyup', function(event) { key.onKeyup(event); event.preventDefault();}, false);
		window.addEventListener('keydown', function(event) { key.onKeydown(event); event.preventDefault();}, false);
	}
	else{
		/* START TOUCH */
		window.ontouchstart = function(e) {   
			touching = e.touches.length;

			e.preventDefault(e);
			if (touching === 2) {	
				for (l=0; l<touching; l++)	{
					loc = windowToCanvas(canvas, e.touches[l].pageX, e.touches[l].pageY);
					if (loc.x < canvas.width * 0.8) {
						touched = true;
						x0 = loc.x; 
						y0 = loc.y;
						le = l;
					} else if (loc.x>canvas.width*0.8 && loc.x<canvas.width && loc.y>canvas.height*0.7 && loc.y<canvas.height) {
						player.fire = true;
						lr = l;	
				}
				}	
			} else if (touching===1) {
				loc = windowToCanvas(canvas,e.touches[0].pageX,e.touches[0].pageY);
				if (loc.x<canvas.width*0.8 ) {
					touched = true;
					x0 = loc.x; 
					y0 = loc.y;
					le = 0;
					player.fire = false;
				} else if (loc.x>canvas.width*0.8 && loc.x<canvas.width && loc.y>canvas.height*0.7 && loc.y<canvas.height) {
					player.fire = true;
					lr = l;
					touched = false;
					player.velocityX = 0;
					player.velocityY = 0;
					iCx=0;
					iCy=0;
				}
			} 
		};

		/* MOVE TOUCH */
		window.ontouchmove = function(e){    
			e.preventDefault(e);
			if (touched) {
					loc2 = windowToCanvas(canvas,e.touches[le].pageX,e.touches[le].pageY);
					diffX = loc2.x - x0;
					diffY = loc2.y - y0;
					player.angle = ((Math.atan2(diffY, diffX) / Math.PI) * 180) + 90;
					player.velocityX = 2 * Math.cos(Math.PI / 180 * (player.angle - 90));
					player.velocityY = 2 * Math.sin(Math.PI / 180 * (player.angle - 90));
					if (diffX!=0 || diffY!=0) {
						if(Math.abs(diffY)<=r1-r3*2) {
							iCy = 0.7 * player.velocityY * Math.abs(diffY); 
						} else { 
							iCy = 0.7 * player.velocityY*(r1-r3*2);
						}
						if(Math.abs(diffX)<=r1-r3*2) {
							iCx = 0.7 * player.velocityX*Math.abs(diffX); 
						} else { 
							iCx = 0.7 * player.velocityX*(r1-r3*2);
						}
					}
			}
		};

		/* END TOUCH */
		window.ontouchend = function(e){   
			touching = e.touches.length;
			e.preventDefault(e);
			if (touching===1) {
				loc = windowToCanvas(canvas,e.touches[0].pageX,e.touches[0].pageY);
				if (loc.x<canvas.width*0.8 ) {
					touched = true;
					x0 = loc.x; 
					y0 = loc.y;
					le = 0;
					player.fire = false;
				} else if (loc.x>canvas.width*0.8 && loc.x<canvas.width && loc.y>canvas.height*0.7 && loc.y<canvas.height) {
					player.fire = true;
					lr = l;
					touched = false;
					player.velocityX = 0;
					player.velocityY = 0;
					iCx = 0;
					iCy = 0;
				}
			} else if (touching ===0) {
				touched = false;
				player.velocityX = 0;
				player.velocityY = 0;
				player.fire = false;
				iCx = 0;
				iCy = 0;
			}
		} 
	}
}