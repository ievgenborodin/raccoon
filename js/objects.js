var Message = {
		constructor: function(shift){
			this.message = '';
			this.color = 'black';
			this.size = 'big';
			this.active = false;
			this.shift = shift || 0;
			return this;
		},
		send: function(canvas, message, color, duraction, size){
			var context = canvas.getContext('2d');
			this.stopTime = Date.now() + (duraction * 1000);
			this.message = message;
			this.x = maxX * 0.5 - (context.measureText(this.message).width) * 0.5;
			this.y = maxY * 0.5;
			this.color = color;
			this.size = size;
			this.active = true;
		},
		draw:function(canvas, game){
			var context = canvas.getContext('2d'),
				x,y;
			if (Date.now() < this.stopTime) {
				context.fillStyle = this.color;
				context.font = this.size+'px Arial';
				context.fillText(this.message, this.x, this.y + this.size * this.shift);
			}
			else {
				this.active = false;
				this.message = '';
			}
		}
	},
	
	Game = {
		constructor: function(level, bugs){
			this.status = 'game';
			this.level = level;
			this.points = 0;
			this.epopulation = 0.03;
			this.bugs = bugs;
			this.map = this.level;
			return this;
		},
		reset: function(status, level, epop, bugs, points){
			this.status = 'game';
			this.level = level;
			this.points = points || 0;
			this.epopulation = epop;
			this.bugs = bugs;	
		},
		background: function(){
			this.map = (this.level < 5) ? this.level : 5; 
			return 'url(img/back'+this.map+'.jpg)';
		}
	},
	
	Player = {
		constructor: function(canvas, game, width, height, src){
			this.width = width;
			this.height = height;
			this.x = 0;
			this.y = 0;
			this.speed = 2;
			this.velocityX = 0;
			this.velocityY = 0;
			this.angle = 0;
			this.weapon = "Ak47";
			this.health = 100;
			this.weaponId = 1;
			this.img = new Image();
			this.img.src = src;
			this.isAlive = true;
			this.fire = false;
			this.alive = true;
			return this;
		},
		draw: function(canvas){
			var context = canvas.getContext('2d');
			rotateImage(context, this.img, this.x + this.velocityX, this.y + this.velocityY, this.angle);
		},
		midPoint: function(){
			return {
				x: this.x + this.width/2 + 2,
				y: this.y + this.height/2
			}
		},
		hit: function(){
			if (this.health > 0)
				this.health--;
			else
				this.alive = false;
		},
		shoot: function(){
			window.bullets.push(Object.create(Bullet).constructor(this));
		}
	},
		
	Interface = {
		constructor: function(font){
			this.ff = 'px ' + font;
			this.startX = 0;
			this.rightBorder = 0;
			return this;
		},
		draw: function(canvas, timer, player, game){
			var x, y, text, r,
				context = canvas.getContext('2d'),
				fontSize = canvas.width<600 ? 16 : canvas.width<800 ? 18 : 21;
			context.font = fontSize + this.ff;
			context.fillStyle = 'rgba(255,255,255,0.7)';
			if (game.landscape){
				this.rightBorder = 0.2 * canvas.width;
				this.startX = 0.8 * canvas.width + 3;
				context.fillRect(this.startX, 0, canvas.width-this.startX, canvas.height);
				context.fillStyle = 'black';
				/*time*/text = timer.m + ':' + timer.s;
				context.fillText(text, /*x*/this.startX + (canvas.width - this.startX -context.measureText(text).width)/2, /*y*/fontSize);
				/*level*/text = 'Level: ' + game.level;
				context.fillText(text, /*x*/this.startX, /*y*/fontSize*4);
				/*bugs*/text = 'Bugs: ' + game.bugs;
				context.fillText(text, /*x*/this.startX, /*y*/fontSize*5);
				/*weapon*/text = 'Weapon: ' + player.weapon;
				context.fillText(text, /*x*/this.startX, /*y*/fontSize*6);
				/*health*/context.fillRect(/*x0*/this.startX, /*y0*/fontSize*2, /*x*/canvas.width - this.startX, /*y*/fontSize);
				context.fillStyle = 'red';
				context.fillRect(/*x0*/this.startX + 1, /*y0*/fontSize*2 + 1,(canvas.width-this.startX-1) * player.health * 0.01,/*y*/fontSize-1);
				
				if (!touchScreen){
					context.fillStyle = 'black';
					y = canvas.height/2;
					/*info*/context.fillText('Controls', /*x*/this.startX, /*y*/y);
					context.fillText(/*text*/" "+decodeURI('%E2%86%90')+decodeURI('%E2%86%91')+decodeURI('%E2%86%92')+decodeURI('%E2%86%93')+' : move', /*x*/this.startX, y+fontSize);
					y += (fontSize*2);
					context.fillText('Space: fire', this.startX+10, y);
					context.fillText('Ctrl: switch', this.startX+10, y+fontSize);
					context.fillText('       weapon', this.startX+10, y+fontSize*2);
				}
			}
			else {
				this.rightBorder = 0;
				this.startX = 3;
				context.fillRect(0, 0, canvas.width, fontSize*1.5);
				context.fillStyle = 'black';
				/*time*/text = timer.m + ':' + timer.s;
				context.fillText(text, /*x*/canvas.width*0.4, /*y*/fontSize);
				/*level*/text = 'Level:' + game.level;
				context.fillText(text, /*x*/this.startX, /*y*/fontSize);
				/*bugs*/text = 'Bugs:' + game.bugs;
				context.fillText(text, /*x*/canvas.width*0.2, /*y*/fontSize);
				/*weapon*/text = player.weapon;
				context.fillText(text, /*x*/canvas.width*0.55, /*y*/fontSize);
				/*health*/x =canvas.width*0.7- 1; y= canvas.width*0.3;
				context.fillRect(/*x0*/x, /*y0*/1, /*x*/y, /*y*/fontSize*1.5);
				context.fillStyle = 'red';
				context.fillRect(/*x0*/x + 1, /*y0*/1, (y-2) * player.health * 0.01,/*y*/fontSize*1.5-1);
			}
			if (touchScreen){
				r1 = (game.landscape)? canvas.width*0.08 : canvas.height*0.08;
				r2 = r1/3;
				r3 = r1/4;
				context.fillStyle = 'rgba(255,255,255,0.5)';	
				context.beginPath();
				context.arc(r1+r3,canvas.height-r1-r3,r1,0,Math.PI*2,true);
				context.fill();
				context.fillStyle = 'rgba(0,0,0,0.6)';	
				context.beginPath();
				context.arc(r1+r3+iCx, canvas.height-r1-r3+iCy,r2,0,Math.PI*2,true);
				context.fill();

				context.beginPath();
				context.fillStyle = 'black';
				m = (game.landscape) ? canvas.width*0.8+(canvas.width-this.startX)/2 : canvas.width*0.9; 
				context.arc(m, canvas.height-r1-r3, r1/2,0,Math.PI*2,true);
				context.fill();
			}
		}
	},
	Timer = {
		constructor: function(color){
			this.active = false;
			this.mTmp = 0;
			this.sTmp = 0;
			this.x = window.innerWidth * 0.4;
			this.y = window.innerHeight * 0.3;
			this.font =  32 + 'px Arial';
			this.s = 0;
			this.m = 0;
			this.color = color || "black";
			this.callback = restart;
			return this;
		},
		set: function(duration, callback){
			this.active = true;
			this.startTime = Date.now();
			this.duration = duration || 0;
			this.callback = callback;
		},
		countDown: function(now, callback){
			this.sTmp = this.duration - Math.floor((now - this.startTime) / 1000);
			if (this.sTmp < 0) {
				this.active = false;
				this.callback();
			}
			else {
			this.mTmp = parseInt(this.sTmp / 60);
			this.s = this.sTmp < 10 ? "0" + this.sTmp : this.sTmp;
			this.m = this.mTmp < 10 ? "0" + this.mTmp : this.mTmp;
			}
		},
		update: function(now){
			this.sTmp = Math.floor((now - this.startTime) / 1000); 
			if (this.sTmp % 60 === 0 && this.sTmp !== 0) {
				this.startTime = now;
				this.mTmp++;
				this.sTmp = 0;
			}
			this.s = this.sTmp < 10 ? "0" + this.sTmp : this.sTmp;
			this.m = this.mTmp < 10 ? "0" + this.mTmp : this.mTmp;
		},
		draw: function(context){
			this.text = this.m + ':' + this.s;
			context.font = this.font;
			context.fillStyle = this.color;
			context.fillText(this.text, this.x, this.y); 
		}
	},
	Enemy = {
		constructor: function(rand8, type){
			this.dir = rand8;
			this.type = type;
			if (this.dir<4) {
                this.x = (this.dir===0 || this.dir===2) ? 0 : window.innerWidth
				this.y = (this.dir===2 || this.dir===3) ? window.innerHeight : 0;
            }
			else {
				this.x = (this.dir===4 || this.dir===6) ? window.innerWidth/2 : this.dir===5 ? window.innerWidth : 0;
				this.y = (this.dir===5 || this.dir===7) ? window.innerHeight/2 : this.dir===6 ? window.innerHeight : 10;				
			}
			this.img = new Image();
			switch(this.type) {
				case 0:
					this.setAttributes(0.4, 5, "img/eSpider.png", 3);
					break;
				case 1:
					this.setAttributes(0.4, 3, "img/eGrass.png", 2);
					break;
				case 2:
					this.setAttributes(0.5, 5, "img/eCpillar.png", 3);
					break;		
				case 3:
					this.setAttributes(0.9, 3, "img/eBird.png", 4);
					break;
				case 4:
					this.setAttributes(0.7, 8, "img/eScorp.png", 4);
					break;
				case 5:
					this.setAttributes(0.3, 10, "img/eDino.png", 2);
					break;
				case 6:
					this.setAttributes(0.8, 15, "img/eDemon.png", 8);
					break;
				case 7:
					this.setAttributes(0.4, 80, "img/eDinoB.png", 15);
					break;
				default:
					this.setAttributes(0.4, 5, "img/eSpider.png", 3);
			}
			this.width = this.img.width;
			this.height = this.img.height;
			this.angle = this.dir * 90;
			this.active = (this.width && this.height) ? true : false;
			return this;
		},
		setAttributes: function(velocity, lives, src, ppu){
			this.velocity = velocity;
			this.lives = lives;
			this.img.src = src;
			this.ppu = ppu;
		},
		draw: function(context){
			rotateImage(context, this.img, this.x, this.y, this.angle);
		},
		
		update: function(canvas, player){
			var diffX = player.x - this.x,
				diffY = player.y - this.y;
				
			this.x = (player.x > this.x) ? this.x + this.velocity : this.x - this.velocity;
			this.y = (player.y > this.y) ? this.y + this.velocity : this.y - this.velocity;
			
			if (diffX <= 4 && diffX >= -4)
				this.angle = diffY > 0 ? 180 : 0;
			if (diffY <= 4 && diffY >= -4){	
				if (diffX > 4) this.angle = 90;
				else if (diffX < -4) this.angle = 270;
			}
			else if (diffY > 4){	
				if (diffX > 4) this.angle=135;
				else if (diffX < -4) this.angle=225;	
			}
			else if (diffY < -4){	
				if (diffX > 4) this.angle=45;
				else if (diffX < -4) this.angle=315;	
			}
		},	
		hit: function(game, player){
			this.lives -= player.damage;
			if (this.lives <= 0) {
				this.active = false;
				game.points += this.ppu;
				--game.bugs;
				if (!game.bugs){
					mBox.send(canvas, "You won!", "black", 3, 40);
					timer.set(2, nextLevel);
				} 
			} 
		}
	},
	Item = {
		constructor: function(type, game){
			this.active = true;
			this.type = type;
			this.maxX = (game.landscape) ? window.innerWidth * 0.75 : window.innerWidth;
			this.x = Math.floor(Math.random() * this.maxX);
			this.y = Math.floor(Math.random() * window.innerHeight);
			this.width = 32;
			this.height = 32;
			this.img = new Image();
			switch(this.type) {
				case 0:
					this.img.src = 'img/oAid.jpg';
					break;
				case 1:
					this.img.src = 'img/gPlazma.jpg';
					break;
				case 2:
					this.img.src = 'img/gLaser.jpg';
					break;
				case 3:
					this.img.src = 'img/gSpringun.jpg';
					break;
				case 4:
				case 5:
				case 6:
					this.img.src = 'img/oBomb.jpg';
					break;
				default:
					this.img.src = 'img/oAid.jpg';
			}
			return this;
		},
		draw: function(context){
			rotateImage(context, this.img, this.x, this.y, 0);
		},
		pickup: function(mBox, player, game){
			this.active = false;
			switch(this.type) {
				case 0:
					player.health = 100;
					mBox.send(canvas, "First kit!", "white", 2, 40);
					break;
				case 1:
					plazma = true;
					player.weapon = 'Plazma';
					player.weaponId = 2;
					mBox.send(canvas, "Plazma available!", "darkblue", 2, 40);
					break;
				case 5:
					window.bullets.push(Object.create(Bullet).bomb(player, 'yellow'));
					mBox.send(canvas, "BOOM!!!", "yellow", 2, 40);
					break;
				case 4:
					window.bullets.push(Object.create(Bullet).bomb(player, 'purple'));
					mBox.send(canvas, "BOOM!!!", "purple", 2, 40);
					break;
				case 3:
					springun = true;
					player.weapon = 'Springun';
					player.weaponId = 3;
					mBox.send(canvas, "SPRINGUN!!!", "green", 2, 40);
					break;
				case 2:
					laser = true;
					player.weapon = 'Laser';
					player.weaponId = 4;
					mBox.send(canvas, "Laser available!", "red", 2, 40);
					break;
				case 6:
					//line bomb
					window.bullets.push(Object.create(Bullet).bomb(player, 'black'));
					mBox.send(canvas, "BOOM!!!", "black", 2, 40);
					break;
				default:
					player.health = 100;
					mBox.send(canvas, "First kit!", "white", 2, 40);
			}
			game.points += 3;
		}
	},
	Part = {
		constructor: function(loc, width, height, color, speed, angle){
			this.x = loc.x;
			this.y = loc.y;
			this.width = width;
			this.height = height;
			this.color = color;
			this.velocityX = speed * Math.sin(angle);
			this.velocityY = -speed * Math.cos(angle);
			this.active = true;
			this.angle = angle;
			return this;
		}, 
		draw: function(context){
			context.fillStyle = this.color;
			context.fillRect(this.x, this.y, this.width, this.height); 
		},
		update: function(){
			this.x += this.velocityX;
			this.y += this.velocityY;
			this.active = this.active && this.inBounds();
		},
		inBounds: function() {
			return this.x >= 0 && this.x <= window.innerWidth &&
					this.y >= 0 && this.y <= window.innerHeight;
		}
	},
	Bullet = {
		constructor: function(player){
			var loc0 = player.midPoint();
			this.parts = [];
			switch(player.weaponId) {
				case 1:
					this.setAttributes('Ak47', 'black', 2.5, 2.5, 1, 5, 0.5, -4 * Math.random());
					this.angle = player.angle;
					break;
				case 2:
					this.setAttributes('Plazma', 'darkblue', 3, 3, 3, 5, 0.8, 3);
					this.angle = player.angle - (this.len * this.shift);
					break;
				case 3:
					this.setAttributes('Springun', 'green', 2, 2, 5, 7, 0.5, 0.8, 6);
					this.angle = player.angle - (this.len * this.shift);
					break;
				case 4:
					this.setAttributes('Laser', 'red', 2, 2, 1, 5, 0.1, 0, 0);
					this.angle = player.angle;
					break;
			}
			for(var b=1; b <= this.len; b++){
				this.angle += (b * this.shift);
				this.parts[b] = Object.create(Part).constructor(loc0, this.width, this.height, this.color, this.speed, Math.PI/180*this.angle);
			}
			return this;
		},
		bomb: function(player, type){
			var loc0 = player.midPoint();
			this.parts = [];
			switch(type) {
				case 'yellow':
					this.setAttributes(0, type, 7, 7, 20, 5, 6, 5);
					break;
				case 'purple':
					this.setAttributes(0, type, 7, 7, 20, 5, 6, 5);
					break;
				case 'black':
					this.setAttributes(0, type, 7, 7, 20, 5, 6, 5);
					break;
			}
			this.angle = player.angle - (this.len * this.shift);
			for(var b=1; b <= this.len; b++){
				this.angle += (b * this.shift);
				this.parts[b] = Object.create(Part).constructor(loc0, this.width, this.height, this.color, this.speed, Math.PI/180*this.angle);
			}
			return this;	
		},
		setAttributes: function(weapon, color, width, height, len, speed, damage, shift){
			player.weapon = weapon || player.weapon;
			this.color = color;
			this.width = width;
			this.height = height;
			this.len = len;
			this.speed = speed;
			player.damage = damage;
			this.shift = shift || 0;
		},
		draw: function(context){
			this.parts.forEach(function(p){
				p.draw(context);
			});
		},
		update: function(game, player, enemies){
			this.parts.forEach(function(p){
				p.update();
				enemies.forEach(function(enemy) {
					if(enemy.active && collides(p, enemy)) {
						enemy.hit(game, player);
						p.active = (player.weaponId===4) ? true : false;
					}
				});
			});
		}
	};
       

