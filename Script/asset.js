class Asset {

	constructor(t,c) {
		this.text = t || 'Objet sans nom';
		this.souris = false;
		this.obstacle = c;
	}

	collision_entity(e){}

}

// -----------------------------------------------------------------------------

class Images extends Asset {

	constructor(t,c,img,p){
		super(t,c);
		this.img = img;
		this.pro = p || 1;
		game.asset_data.push(this);
	}

	update(x,y,z,t){
		// calcul position
		this.w = game.sprite[this.img].width/(game.sprite[this.img].width/game.s)*this.pro;
		this.h = game.sprite[this.img].height/(game.sprite[this.img].width/game.s)*this.pro;
		this.z = t+this.h-game.s/2;
		this.x = game.pos_x(x,y);
		this.y = game.pos_y(x,y,this.z);

		// affichage
		this.draw(this.x,this.y,this.w,this.h);

		if (this.obstacle == 2) { return 0; }
		return this.h-this.w/2;
	}

	draw(x,y,w,h){
		ctx.drawImage(game.sprite[this.img],x,y,w,h);
	}

}

class Animations extends Asset {

	constructor(t,c,img,nb,tick,p){
		super(t,c);
		this.img = img;
		this.pro = p || 1;

		this.animation = {
			data : nb,
			time : Date.now(),
			tick : tick,
			current : 0,
		}

		game.asset_data.push(this);
	}

	update(x,y,z,t){
		// calcul position
		if (Date.now() - this.animation.time > this.animation.tick && game.anime) {
			this.animation.time = Date.now();
			this.animation.current++;
			if (this.animation.current == this.animation.data) this.animation.current = 0;
		}

		this.w = (game.sprite[this.img].width/this.animation.data)/((game.sprite[this.img].width/this.animation.data)/game.s)*this.pro;
		this.h = game.sprite[this.img].height/((game.sprite[this.img].width/this.animation.data)/game.s)*this.pro;
		this.z = t+this.h-game.s/2;
		this.x = game.pos_x(x,y);
		this.y = game.pos_y(x,y,this.z);

		// calcul d'échelle
		if (this.pro !== 1) {
			if (this.pro < 1) {
				this.x += (this.w/this.pro-this.w)/2;
				this.y -= (this.h/this.pro-this.h)/2;
			} else {
				this.x -= (this.w-this.w/this.pro)/2;
			  this.y += (this.h/this.pro-this.h)/2;
			}
		}

		// affichage
		this.draw(this.x,this.y,this.w,this.h);

		if (this.obstacle == 2) { return 0; }
		return this.h-this.w/2;
	}

	draw(x,y,w,h){
		ctx.drawImage(game.sprite[this.img],(game.sprite[this.img].width/this.animation.data)*this.animation.current,0,game.sprite[this.img].width/this.animation.data,game.sprite[this.img].height,x,y,w,h);
	}

}

class Formes extends Asset {

	constructor(t,c,size,color,cc){
		super(t,c);

		this.size = size;
		this.color = color || 'red';
		this.contour = cc;

		this.forme = 0;
		this.left = 0;
		this.right = 0;

		this.h = 0;
		this.ini = true;

		game.asset_data.push(this);
	}

	update(x,y,z,t) {
		// génération de la forme
		if (game.reload == true || this.forme == 0 || this.forme == 1) this.base();

		// calcul positions
		this.h = game.s*(this.size/10);
		this.z = t+this.h;
		this.x = game.pos_x(x,y);
		this.y = game.pos_y(x,y,this.z);

		ctx.translate(this.x,this.y);

		// affichage normal
		ctx.fillStyle = this.color;
		ctx.fill(this.forme);
		ctx.fill(this.right);
		ctx.fill(this.left);
		ctx.fillStyle = 'rgba(0,0,0,0.2)';
		ctx.fill(this.right);
		ctx.fill(this.left);

		// affichage contour
		if (this.contour) {
			ctx.lineWidth = 0.1;
			ctx.strokeStyle = 'black';
			ctx.stroke(this.forme);
			ctx.stroke(this.right);
			ctx.stroke(this.left);
		}

		ctx.setTransform(1, 0, 0, 1, 0, 0);

		if (this.obstacle == 2) { return 0; }
		return this.h;
	}

	base(){
		// forme principal
		this.forme = new Path2D();
		this.forme.moveTo(game.s/2, 0);
		this.forme.lineTo(game.s, game.s/4);
		this.forme.lineTo(game.s/2, game.s/2);
		this.forme.lineTo(0, game.s/4);
		this.forme.closePath();

		// gauche
		this.left = new Path2D();
		this.left.moveTo(0, game.s/4);
		this.left.lineTo(0, game.s/4+game.s*(this.size/10));
		this.left.lineTo(game.s/2, game.s/2+game.s*(this.size/10));
		this.left.lineTo(game.s/2, game.s/2);
		this.left.closePath();

		//droite
		this.right = new Path2D();
		this.right.moveTo(game.s, game.s/4);
		this.right.lineTo(game.s, game.s/4+game.s*(this.size/10));
		this.right.lineTo(game.s/2, game.s/2+game.s*(this.size/10));
		this.right.lineTo(game.s/2, game.s/2);
		this.right.closePath();
	}

}

// -----------------------------------------------------------------------------

// interupeurs
class Switchs extends Images {

		constructor(code,map,t,c,img,p,img2){
			super(t,c,img,p);
			this.code = code;
			this.map = map;
			this.state = false;
			this.img2 = img2;
			this.img1 = img;
		}

		collision_clavier(){
			for (var x = 0; x < game.maps[this.map].length; x++) {
				for (var y = 0; y < game.maps[this.map][x].length; y++) {
					for (var z = 0; z < game.maps[this.map][x][y].length; z++) {
						if (game.maps[this.map][x][y][z].code == '#' + this.code) {
							game.maps[this.map][x][y][z].collision_door();
						}
					}
				}
			}

			if (!player.var.c && game.current_map == 9) {
				game.map[3][3].push(clone(game.asset_data[9]));
				game.map[8][7].splice(1,1);
				game.entity[game.current_map].push(clone(game.entity_data[1]));
				game.entity[game.current_map][game.entity[game.current_map].length-1].px = 3;
				game.entity[game.current_map][game.entity[game.current_map].length-1].py = 3;
				player.var.c = true;
			}

			game.audio[6].play();
			game.audio[6].volume = 0.65;
			this.state = !this.state;
			if (this.state) {
				this.img = this.img2;
			} else {
				this.img = this.img1;
			}
		}

}

// porte maison
class Doors extends Formes {

	constructor(code,state,t,c,size,color,cc){
		super(t,c,size,color,cc)
		this.state = state;
		this.obstacle = 1;
		this.code = code;

		this.size1 = size;
		this.color1 = color;

		if (!this.state) {
			this.size = 0;
			this.color = 'rgba(0,0,0,0)';
		}

	}

	collision_door(){
		this.state = !this.state;
		if (this.obstacle == 1) { this.obstacle = 0; } else { this.obstacle = 1; }

		if (this.state) {
			this.size = this.size1;
			this.color = this.color1;
			this.ini = true;
		} else {
			this.size = 0;
			this.color = 'rgba(0,0,0,0)';
			this.ini = true;
		}

	}

}

// pièces
class Pieces extends Animations {
	constructor(t,c,size,color,cc,p){
		super(t,c,size,color,cc,p)
	}

	collision_entity(e){
		if (e == player) {
			player.gold += 1;
			game.audio[7].play();
			game.map[player.px][player.py].splice(game.map[player.px][player.py].length-1,1);
		}

	}

}

// feu de camps
class Campfires extends Animations {
	constructor(t,c,size,color,cc,p){
		super(t,c,size,color,cc,p)
	}

	collision_entity(e){
		if (e) e.vie -= 8;
		game.audio[11].play();
		game.audio[11].volume = 0.75;
	}

}

// changement de maps
class Teleportations extends Formes {
	constructor(t,c,size,color,cc,x,xx){
		super(t,c,size,color,cc);
		this.change = x;
	}

	collision_entity(e){
		if (e != player) return

		if (this.change == "haut") {
			player.px = game.maps[game.current_map].length-2;
			switch (game.current_map) {
				case 0:
					game.current_map=2;
				break;
				case 8:
					game.current_map=10;
				break;
			}
		}

		if (this.change == "bas") {
			player.px = 1;
			switch (game.current_map) {
				case 2:
					game.current_map=0;
				break;
				case 10:
					game.current_map=8;
				break;
			}
		}

		if (this.change == "gauche") {
			switch (game.current_map) {
				case 2:
					if (player.var.a) {
						player.py = game.maps[game.current_map].length-2;
						game.current_map=4;
					} else {
						return;
					}
				break;
				case 4:
					player.py = game.maps[game.current_map].length-2;
					game.current_map=8;
				break;
			}
		}

		if (this.change == "droite") {
			player.py = 1;
			switch (game.current_map) {
				case 4:
					game.current_map=2;
				break;
				case 8:
					game.current_map=4;
				break;
			}
		}

		if (this.change == "tp") {
			switch (game.current_map) {
				case 2:
					player.px = 4;
					player.py = 1;
					player.dir = 4;
					game.current_map=6;
				break;
				case 6:
					player.px = 4;
					player.py = 8;
					game.current_map=2;
				break;
			}
		}

		game.reload = true;
		player.x = 0;
		player.y = 0;

		game.ui = {type : 0};

		game.update();
	}

}

// coffres
class Coffres extends Images {

	constructor(t,c,img,p,img2){
		super(t,c,img,p);
		this.open = false;
		this.img2 = img2;
	}

	collision_clavier(){
		if (!this.open){
			game.audio[8].play();
			game.audio[8].volume=0.2;

			switch (game.current_map) {
				case 6:
					player.var.a = true;
					player.sort[0].state = true;
					this.collision_clavier = false;

					game.ui = {
						type : 1,
						img : player.sort[0].img,
						t1 : text.sort1a,
						t2 : text.sort1b,
						t3 : text.sort1c,
						t4 : text.sort1d,
						t5 : "0.5",
						t6 : player.sort[0].e
					}
				break;
				case 4:
					this.open = true;
					player.sort[1].state = true;
					game.map[6][0].splice(1,1);
					game.map[7][0].splice(1,1);
					game.map[8][0].splice(1,1);
					game.map[6][0].push(clone(game.asset_data[36]));
					game.map[7][0].push(clone(game.asset_data[36]));
					game.map[8][0].push(clone(game.asset_data[36]));

					game.ui = {
						type : 1,
						img : player.sort[1].img,
						t1 : text.sort2a,
						t2 : text.sort2b,
						t3 : text.sort2c,
						t4 : text.sort2d,
						t5 : player.sort[1].max/15,
						t6 : player.sort[1].e
					}
				break;
				case 8:
					this.open = true;
					player.sort[2].state = true;
					game.ui = {
						type : 1,
						img : player.sort[2].img,
						t1 : text.sort3a,
						t2 : text.sort3b,
						t3 : text.sort3c,
						t4 : text.sort3d,
						t5 : Math.round(player.sort[2].max/15),
						t6 : player.sort[2].e
					}

					game.map[1][5].splice(2,1);
					game.map[1][6].splice(2,1);
					game.map[1][7].splice(2,1);
					game.map[1][8].splice(2,1);
					game.map[1][9].splice(2,1);
				break;
			}

			player.vie = player.viemax;
			player.energie = player.energiemax;
			this.open = true;
			save.state = true;

			this.img = this.img2;
			this.collision_clavier=false;
		}

	}

}

class Graves extends Images {

	constructor(t,c,img,p){
		super(t,c,img,p);
	}

	collision_clavier(){
		game.ui = {
			type : 2,
			img : this.img,
			t1 : "",
			t2 : text.tombea,
			t3 : text.tombeb,
			t4 : text.tombec,
			t5 : "",
		}
	}

}

class Signs extends Images {

	constructor(t,c,img,p){
		super(t,c,img,p);
	}

	collision_clavier(){
		if (game.current_map == 4) {
			game.ui = {
				type : 2,
				img : this.img,
				t1 : "",
				t2 : "",
				t3 : text.pancarte,
				t4 : "",
				t5 : "",
			}
		}

		if (game.current_map == 9) {
			game.ui = {
				type : 2,
				img : this.img,
				t1 : "",
				t2 : "",
				t3 : text.pancarte2,
				t4 : "",
				t5 : "",
			}
		}

	}

}

class Tables extends Images {

	constructor(t,c,img,p){
		super(t,c,img,p);
	}

	collision_clavier(){
		game.ui = {
			type : 2,
			img : this.img,
			t1 : text.tablea,
			t2 : text.tableb,
			t3 : "",
			t4 : text.tablec,
			t5 : "",
		}
	}

}

// animation pièce interface
class Intergolds extends Animations {

		constructor(t,c,img,nb,tick,p){
			super(t,c,img,nb,tick,p);
		}

		update(x,y,z,t){
			// calcul position
			if (Date.now() - this.animation.time > this.animation.tick && game.anime) {
				this.animation.time = Date.now();
				this.animation.current++;
				if (this.animation.current == this.animation.data) this.animation.current = 0;
			}

		}
}

class Cadavres extends Images {

	constructor(t,c,img,p){
		super(t,c,img,p);
		this.time = 0;
	}

	update(x,y,z,t){
		if (this.time == 0) this.time = Date.now();

		// calcul position
		this.w = game.sprite[this.img].width/(game.sprite[this.img].width/game.s)*this.pro;
		this.h = game.sprite[this.img].height/(game.sprite[this.img].width/game.s)*this.pro;
		this.z = t+this.h-game.s/2;
		this.x = game.pos_x(x,y);
		this.y = game.pos_y(x,y,this.z);

		// affichage
		var a=100-(Date.now() - this.time)/5000*100
		if (a<0) a = 0;
		ctx.filter = 'opacity(' + a + '%)';

		this.draw(this.x,this.y,this.w,this.h);

		ctx.filter = 'none';
		//--------------

		if (Date.now() - this.time > 5000) {
			game.map[x][y].splice(game.map[x][y].length-1,1);
			game.map[x][y].push(clone(game.asset_data[9]));
		}

		return 0;
	}
}
