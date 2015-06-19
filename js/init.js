
var canvas, context, game, player, gameFace, background,iCx = 0,iCy = 0, maxX=0, maxY=0,
	/*game*/ gameKey, enemyInd = 0,
	/*screen*/ width, height, q, scrX, scrY,
	/*touch-or-mouse*/ x1=0, y1=0, x2=0, y2=0, x3=0, y3=0, touchScreen = true,
	/*random*/ random, 
	/*messages*/ mBox, mBoxExtra, 
	/*time*/ timer, dateNow, gameTime,
	/*touch events*/ touched = false, loc, x0, y0, l, le, lr, loc2, diffX, diffY, touching,
	/*keyboard events*/ key,
	/*item*/ a=0, b=0, ind =0 ,
	/*weapons*/ plazma, springun, laser;
	/*item*/ window.items = [];
	/*bullets*/ window.bullets = [];
	/*enemy*/ window.enemies = [];
	
	document.getElementById('raccoon').onclick = function(e) {
		document.getElementById('window').innerHTML = '<canvas id="canvas"></canvas>';
		raccoon();
		e.preventDefault();
	}	
	
	function raccoon(){
		initialize();
		screenState(game);
		/*player start position*/
		player.x = (canvas.width - (game.landscape * canvas.width * 0.2) - player.width)/2;
		player.y = (canvas.height - player.height)/2;
		mBox.send(canvas, "Level " + game.level, "black", 2, 40);
		
		/*		GAME LOOP	*/
		function animate(time){
			/*screen state check*/
			if (window.innerWidth-6 !== width)
				screenState(game, player);
			
			switch(game.status) {
				case 'game':
					update(player, key);
					draw(canvas, player, game, gameTime);
					break;
				case 'restart':
					restart();
					break;
				case 'nextlevel':
					nextLevel();
					break;
			}
			
			/*white border*/
			context.strokeStyle = "white";
			context.strokeRect(3,3,canvas.width-4,canvas.height-4);
			window.requestNextAnimationFrame(animate);
		};	
		window.requestNextAnimationFrame(animate);
	};