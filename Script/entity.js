class Entity {

	constructor(t,img,v,xmax,data,p,degat,vie,side,dir) {
		this.text = t || 'Objet sans nom';
		this.pro = p || 1;

		this.degats = degat;
		this.vie = vie;
		this.viemax = vie;
		this.side = side;

		this.mode = 'walk';
		this.ymax = 8;
		this.img = img;
		this.xmax = xmax;
		this.v = v/10;
		this.dir = dir;

		this.walk = {
			data : data,
			time : Date.now(),
			tick : (900/(1+v))/xmax,
			current : 0,
		}

		this.px = 0; this.py = 0; this.x = 0; this.y = 0; this.w = 0; this.h = 0;
	}

	update(t){
		if (this.vie < 0) { this.vie = 0;}
		if (this.vie <= 0) this.death();
		if (this.vie > this.viemax) this.vie = this.viemax;

		// calcul position
		switch (this.mode) {
			case "walk":
					if (Date.now() - this.walk.time > this.walk.tick && game.anime && this.walk.current > 0) {
			    	this.walk.time = Date.now();
			    	this.walk.current--;
					}

					this.xx = (game.sprite[this.img].width/this.xmax)*this.walk.current;
					this.yy = (game.sprite[this.img].height/this.ymax)*this.walk.data[this.dir]+1;
					this.ww = (game.sprite[this.img].width/this.xmax);
					this.hh = (game.sprite[this.img].height/this.ymax);
				break;
				case "atk":

				if (this.type == 1) {

					if (Date.now() - this.atk.time > this.atk.tick && game.anime) {
			    	this.atk.time = Date.now();
			    	this.atk.current--;

					}

					if (this.atk.current < 0) {
						game.audio[10].play();
						game.audio[10].volume = 0.65;
						this.atk.current = this.xmax2-1;
						if (this.cible) this.cible.vie-=this.degats;
						if (this.cible.vie < 0) {
							this.cible.vie=0;
							this.state = 'walk';
						}
					}

					this.xx = (game.sprite[this.img2].width/this.xmax2)*this.atk.current;
					this.yy = (game.sprite[this.img2].height/this.ymax)*this.atk.data[this.dir]+1;
					this.ww = (game.sprite[this.img2].width/this.xmax2);
					this.hh = (game.sprite[this.img2].height/this.ymax);

				} else {
					if (this.walk.current!=0) {
						this.walk.current=0;
						this.xx = (game.sprite[this.img].width/this.xmax)*this.walk.current;
						this.yy = (game.sprite[this.img].height/this.ymax)*this.walk.data[this.dir]+1;
						this.ww = (game.sprite[this.img].width/this.xmax);
						this.hh = (game.sprite[this.img].height/this.ymax);
					}
				}
				break;
		}

		this.w = Math.round(this.ww*(game.s/this.ww))*this.pro;
		this.h = Math.round(this.hh*(game.s/this.ww))*this.pro;

		// si l'entité se trouve nulle part, on la replace
		if (!(game.getpos(this.x+this.w/2,this.h+this.y,this.px,this.py))) {
			this.x = game.pos_x(this.px,this.py);
			this.y = game.pos_y(this.px,this.py,t+this.h-game.s/2);
		}

		// affichage
		this.z = t;
		this.draw(this.x,this.y-this.z,this.w,this.h)
	}

	draw(x,y,w,h){

		if (this.mode == 'walk' || this.type == 2) {
			ctx.drawImage(game.sprite[this.img],this.xx,this.yy,this.ww,this.hh,x,y,w,h);
		} else {
			ctx.drawImage(game.sprite[this.img2],this.xx,this.yy,this.ww,this.hh,x,y,w,h);
		}

	}

	moove(xx,yy){

		// calcul position
		var test = true;
		if (this.walk.current == 0) this.walk.current = this.xmax-1;

		// on avance
		this.x+=xx;
		this.y+=yy;

		// on vérifie la nouvelle position
		if (!(game.getpos(this.x+this.w/2,this.h+this.y,this.px,this.py))) {
			for (var i = 0; i < game.map.length; i++) {
				for (var j = 0; j < game.map[i].length; j++) {
						if (game.getpos(this.x+this.w/2,this.h+this.y,i,j)) {
							// élément trop haut
							if (game.map[i][j][game.map[i][j].length-1].z - this.z > game.s/3) test=false;
							if (game.map[i][j].length > 1) if (game.map[i][j][game.map[i][j].length-2].z - this.z < game.s/3 && (game.map[i][j][game.map[i][j].length-1].obstacle == 2 || game.map[i][j][game.map[i][j].length-1].obstacle == 3)) test=true;
							// obstacle
							if (game.map[i][j][game.map[i][j].length-1].obstacle == 1) test=false;
							// on récupère la nouvelle position
							if (test) {
								this.px = i;
								this.py = j;
							}
						}
					}
				}
			}

		// on vérifie qu'on est toujours sur une case
		if (!(game.getpos(this.x+this.w/2,this.h+this.y,this.px,this.py))) { test=false; }

		// on recule si la case d'arrivé est impossible
		if (!test){
			this.x-=xx;
			this.y-=yy;
		}

	}

	death(){}

}

// -----------------------------------------------------------------------------

class Player extends Entity {

	constructor(t,img,v,xmax,data,p,degat,vie,img2,xmax2,side,dir){
		super(t,img,v,xmax,data,p,degat,vie,img2,xmax2,side,dir);
		this.gold = 0;
		this.energie = 50;
		this.energiemax = 50;

		this.sort = [
			{ state : false, max : 6, current : 7, e : 2, img : 41},
			{ state : false, max : 300, current : 300, e : 15, img : 42, tick : 10000, time : 0},
			{ state : false, max : 200, current : 200, e : 20, img : 43, tick : 120, time : 0, c : 5},
		]

		this.var = {
			a : false, // accès moulin map 2
			b : false, // pont map 10
			c : false, // piece map 9
			vague : 0, // vague map 8
		}

		this.tuto = {
			m1 : true, // tuto map 1
			m2 : true, // tuto map 2
			m4 : true, // tuto map 4
		}

		this.number_of_death = 0;

		player = this;
		game.entity_data.push(this);
	}

	deplacement(){
		if (this.energie < this.energiemax) player.energie+=0.15;

		if (this.sort[2].c<5) {

			this.xx = (game.sprite[44].width/6)*this.sort[2].c;
			this.yy = 0;
			this.ww = (game.sprite[44].width/6);
			this.hh = (game.sprite[44].height);
			ctx.drawImage(game.sprite[44],this.xx,this.yy,this.ww,this.hh,this.x,this.y-this.z,this.w,this.h);

			if (Date.now() - this.sort[2].time > this.sort[2].tick) {
				this.sort[2].c+=1;
				this.sort[2].time = Date.now();
			}

		}

		if ((keyState[39] || keyState[68]) && (keyState[38] || keyState[90])) { this.moove(game.s*this.v,-game.s*this.v/2); this.dir = 4; } // h droite
		else if ((keyState[37] || keyState[81]) && (keyState[38] || keyState[90])) { this.moove(-game.s*this.v,-game.s*this.v/2); this.dir = 5; } // h gauche
		else if ((keyState[39] || keyState[68]) && (keyState[40] || keyState[83])) { this.moove(game.s*this.v,game.s*this.v/2); this.dir = 6; } // b droite
		else if ((keyState[37] || keyState[81]) && (keyState[40] || keyState[83])) { this.moove(-game.s*this.v,game.s*this.v/2); this.dir = 7; } // b gauche
		else if ((keyState[37] || keyState[81])) { this.moove(-game.s*this.v,0); this.dir = 0; } // gauche
		else if ((keyState[39] || keyState[68])) { this.moove(game.s*this.v,0); this.dir = 1; } // droite
		else if ((keyState[38] || keyState[90])) { this.moove(0,-game.s*this.v); this.dir = 2; } // haut
		else if ((keyState[40] || keyState[83])) { this.moove(0,game.s*this.v); this.dir = 3; } // bas
	}

	death(){
		this.number_of_death+=1;
		loadgame();
		game.update();
	}

}

class Monster extends Entity {

	constructor(t,img,v,xmax,data,p,degat,vie,side,dir,type,img2,xmax2,son,death){
		super(t,img,v,xmax,data,p,degat,vie,side,dir);

		this.img2 = img2;
		this.xmax2 = xmax2;
		this.type = type;

		if (type == 1) {
			this.atk = {
				data : data,
				time : Date.now(),
				tick : 1300/this.xmax2,
				current : 0,
			}
		} else {
			this.atk = {
				data : data,
				time : Date.now(),
				tick : this.xmax2,
				current : false,
			}
		}

		this.son = son;
		this.img_death = death;
		this.reward = 1;

		game.entity_data.push(this);
	}

	deplacement(){
		this.cible = false;

		for (var i = 0; i < game.entity[game.current_map].length; i++){
			if (this.side != game.entity[game.current_map][i].side && !game.entity[game.current_map][i].proj) {
				this.cible = game.entity[game.current_map][i];
			}
		}

		for (var i = 0; i < game.entity[game.current_map].length; i++){
			if (this.side != game.entity[game.current_map][i].side) {
			 	if (Distance(this.x,this.y,game.entity[game.current_map][i].x,game.entity[game.current_map][i].y) < Distance(this.x,this.y,this.cible.x,this.cible.y) && !game.entity[game.current_map][i].proj) {
					this.cible = game.entity[game.current_map][i];
				}
			}
		}

		if (this.type == 2) {
			if (Distance(this.px,this.py,this.cible.px,this.cible.py) > 6 || !this.cible) {
				this.cible = player;
			}
			if (Distance(this.px,this.py,this.cible.px,this.cible.py) < 4) {
				if (Date.now() - this.atk.time > this.atk.tick) {
					this.atk.time = Date.now();
					if (this.cible != player) new Projectile(41,this,this.cible.x+this.cible.w/2,this.cible.y+this.cible.h/2,3,player.degats);
				}
				if (Date.now() - player.sort[1].time > player.sort[1].tick) {

					this.death();
					return;
				}
			}
		}



		this.ox = this.cible.px;
		this.oy = this.cible.py;

		// barre de vie
		ctx.lineWidth = 1;
		if (this.pro < 1) game.state_barre(this.vie/this.viemax,this.x+game.s*0.125-game.s*(1-this.pro)/2,this.y-this.z-game.s*0.125,game.s*0.8,game.s*0.125,'rgba(255,75,72,0.5)','rgba(255,25,12,0.85)','#610000');
		else if (this.pro > 1) game.state_barre(this.vie/this.viemax,this.x+game.s*0.125,this.y-this.z-game.s*0.125,game.s*0.8*this.pro-1,game.s*0.125*this.pro-1,'rgba(255,75,72,0.5)','rgba(255,25,12,0.85)','#610000');
		else {
			game.state_barre(this.vie/this.viemax,this.x+game.s*0.125,this.y-this.z-game.s*0.125,game.s*0.8,game.s*0.125,'rgba(255,75,72,0.5)','rgba(255,25,12,0.85)','#610000');
		}

		ctx.lineWidth = 2;

		if (this.px != this.ox || this.py != this.oy) {
			this.mode='walk';
		} else {
			this.mode='atk';
		}

		if (this.mode == 'walk') {
				if (this.text == "boss" && !player.var.b) return

				if (this.px != this.ox || this.py != this.oy) {
					if (this.px < this.ox && this.py == this.oy) { this.moove(-game.s*this.v,game.s*this.v/2); this.dir = 7; } // b gauche
					if (this.py < this.oy && this.px < this.ox) { this.moove(0,game.s*this.v*1.5); this.dir = 3; } // bas
	        if (this.px == this.ox && this.py < this.oy) { this.moove(game.s*this.v*0.75,game.s*this.v*0.75); this.dir = 6;} // b droite
					if (this.px > this.ox && this.py < this.oy ) { this.moove(game.s*this.v*1.5,0); this.dir = 1; } // droite
					if (this.px > this.ox && this.py == this.oy) { this.moove(game.s*this.v,-game.s*this.v/2); this.dir = 4; } // h droite
					if (this.px > this.ox && this.py > this.oy) { this.moove(0,-game.s*this.v*1.5); this.dir = 2; } // haut
					if (this.px == this.ox && this.py > this.oy) { this.moove(-game.s*this.v,-game.s*this.v/2); this.dir = 5;} // h gauche
					if (this.px < this.ox && this.py > this.oy) { this.moove(-game.s*this.v*1.5,0); this.dir = 0; } // gauche
				}
			}

		}

		death(){
			game.audio[this.son].play();
			game.audio[this.son].volume = 0.55;

			if (this.img_death) {
				if (game.map[this.px][this.py][game.map[this.px][this.py].length-1].text != 'feu de camp') {
					game.map[this.px][this.py].push(clone(game.asset_data[this.img_death]));
				}
			}

			if (this.text == "boss") {
				for (var i = 12; i < 16; i++) {
					for (var j = 6; j < 9; j++) {
						game.maps[10][i][j].splice(0,1);
						game.maps[10][i][j].push(game.asset_data[57]);
						game.maps[10][i][j].push(game.asset_data[62]);
						if (i==15) game.maps[10][i][j].push(clone(game.asset_data[26]));
					}
				}
			}

			for (var i = 0; i < game.entity[game.current_map].length; i++) {
				if (game.entity[game.current_map][i]==this) {
					game.entity[game.current_map].splice(i,1);
				}
			}

		}

}

// -----------------------------------------------------------------------------

class Projectile {

	constructor(img,parent,ox,oy,v,degat) {
		this.pro = 1;

		this.img = img;
		this.v = game.s/3;

		this.px = 15;
		this.py = 15;

		this.px2 = parent.px;
		this.py2 = parent.py;

		this.x = parent.x;
		this.y = parent.y+parent.h/4-parent.z;
		this.z = parent.z;

		this.side = parent.side;
		this.degats = parent.degats;
		this.w = game.s/3;
		this.h = game.s/3;

		this.proj = true;

		this.angle = Math.atan2(oy-this.y-this.w/2,ox-this.x-this.h/2);
		game.entity[game.current_map].push(this);
	}

	update(t){

		this.moove(Math.cos(this.angle)*this.v,Math.sin(this.angle)*this.v)

		for (var i = 0; i < game.entity[game.current_map].length; i++){
			if (this.x > game.entity[game.current_map][i].x && this.x < game.entity[game.current_map][i].x+game.entity[game.current_map][i].w) {
				if (this.y+this.z > game.entity[game.current_map][i].y && this.y+this.z < game.entity[game.current_map][i].y+game.entity[game.current_map][i].h) {
					if (this.side != game.entity[game.current_map][i].side) {
						game.entity[game.current_map][i].vie-=this.degats;
						if (game.entity[game.current_map][i].vie<0) game.entity[game.current_map][i].vie=0;
						this.death();
					}
				}
			}
		}

		// affichage
		this.draw(this.x,this.y,this.w,this.h)
	}

	draw(x,y,w,h){
		ctx.drawImage(game.sprite[this.img],x,y,w,h);
	}

	moove(xx,yy){
		// calcul position
		var test = true;

		// on avance
		this.x+=xx;
		this.y+=yy;

		// on vérifie la nouvelle position
		if (!(game.getpos(this.x+this.w/2,this.h+this.y,this.px2,this.py2))) {
			for (var i = 0; i < game.map.length; i++) {
				for (var j = 0; j < game.map[i].length; j++) {
						if (game.getpos(this.x+this.w/2,this.h+this.y,i,j)) {
							// on récupère la nouvelle position
							if (test) {
								this.px2 = i;
								this.py2 = j;
							}
						}
					}
				}
			}

		// on vérifie qu'on est toujours sur une case
		if (!(game.getpos(this.x+this.w/2,this.h+this.y,this.px2,this.py2))) test=false;

		// on recule si la case d'arrivé est impossible
		if (!test){
			this.death();
		}

	}

	deplacement(){}

	death(){
		for (var i = 0; i < game.entity[game.current_map].length; i++){
			if (game.entity[game.current_map][i] == this) {
				game.entity[game.current_map].splice(i,1);
			}
		}
	}

}
