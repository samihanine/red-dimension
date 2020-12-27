class Game {

	constructor(s) {
		this.s = s;
		this.mx = 0;
		this.my = 0;
		this.load = 0;
		this.loadmax = -1;
		this.current_clavier = 0;
		this.number_of_ennemis = 0;
		this.sprite = [];
		this.audio = [];

		this.map = [];
		this.maps = [];
		this.current_map = 0;
		this.entity = [];
		this.asset_data = [];
		this.entity_data = [];

		this.ui = {type : 0};

		this.time = Date.now();
		this.tick = 59;
		this.anime = true;
		this.reload = true;
		this.state = 1;

		this.option = { aff : window.innerHeight/2 }
		this.color = {
			background : ['#EEE','#111111'],
			ui1 : ['rgba(130,130,130,0.3)','rgba(255,60,60,0.8)'],
			ui2 : ['rgba(60,60,60,0.4)','rgba(0,0,0,0.4)'],
			ui3 : ['rgba(155,155,155,0.55)','rgba(120,120,120,0.5)'],
			text : ['rgba(0,0,0,1)','rgba(255,255,255,1)'],
		}
	}

	update(){

		if (game.audio[0].currentTime == 0 || game.audio[0].currentTime >= 142) {
			game.audio[0].play();
			game.audio[0].volume = 0.3;
		}
		// -------------- Gestion map --------------

		if (this.s != Math.round(window.innerHeight/9)) {
			this.s = Math.round(window.innerHeight/9)
			game.reload = true;
		}
		var tp = true;


		// positionnement de la map sur l'écran
		this.map = this.maps[this.current_map];
		this.mx = window.innerWidth/2-game.s/2;
		this.my = window.innerHeight/2-(game.s*game.map.length)/4+game.s/3;

		// affichage des éléments
		ctx.fillStyle = this.color.background[this.current_map%2];
		ctx.fillRect(0,0,canvas.width, canvas.height);

		//affichage fond
		if (this.current_map%2==0) {
			ctx.drawImage(game.sprite[22],0,0,canvas.width, canvas.height);
		}

		// affichage du texte isometric
		game.textlimit();

		// -------------------------------------------------------------------------

		this.number_of_ennemis = 0;

		// update asset & entity
		for (var x = 0; x < game.map.length; x++) {
			for (var y = 0; y < game.map[x].length; y++) {
				var t = 0;
				// update asset
				for (var z = 0; z < game.map[x][y].length; z++) { t += game.map[x][y][z].update(x,y,z,t); }
				// update entity
				for (var i = 0; i < game.entity[this.current_map].length; i++) {
					if (game.entity[this.current_map][i].px == x && game.entity[this.current_map][i].py == y) {
						if (game.entity[this.current_map][i].side != player.side) this.number_of_ennemis += 1;
						game.entity[this.current_map][i].update(t);
						game.map[x][y][game.map[x][y].length-1].collision_entity(game.entity[this.current_map][i]);
					}
				}
			}
		}

		// -------------------------------------------------------------------------

		// ---------------- scripted event ----------------
		switch (this.current_map) {
			case 0:
				if (player.tuto.m1) {
					game.ui = {
						type : 3,
						t1 : text.tuto1a,
						t2 : text.tuto1b,
						t3 : text.tuto1c,
					}
					fetch('https://api.countapi.xyz/update/sam411/red-dimension-visit/?amount=1');
					player.tuto.m1 = false;
				}
			break;
			case 2:
			if (player.tuto.m2) {
				game.ui = {
					type : 3,
					t1 : text.tuto2a,
					t2 : text.tuto2b,
					t3 : text.tuto2c,
				}
				player.tuto.m2 = false;
			}
			break;
			case 4:
				if (this.number_of_ennemis == 0) {
					if (this.maps[4][7][5].length == 1) {
						this.maps[4][7][5].push(clone(game.asset_data[52]));
					} else {
						if (this.maps[4][7][5][1].text != "un coffre") this.maps[4][7][5].splice(1,1);
					}
				}
			break;
			case 8:
			if (player.tuto.m4) {
				game.ui = {
					type : 3,
					t1 : text.tuto3a,
					t2 : text.tuto3b,
					t3 : text.tuto3c,
				}
				player.tuto.m4 = false;
			}

			if (this.number_of_ennemis == 0) {
				if (player.var.vague == 0) {
					player.var.vague = 1;
					this.entity[this.current_map].push(clone(game.entity_data[0]));
					this.entity[this.current_map][this.entity[this.current_map].length-1].px = 3;
					this.entity[this.current_map][this.entity[this.current_map].length-1].py = 3;
				} else {
					if (this.maps[8][7][5][2].text == "feu de camp") {
						this.maps[8][7][5].splice(2,1);
						this.maps[8][7][5].push(clone(game.asset_data[52]));
					}
				}
			}
			break;
			case 10:
				if (player.px < 12) {
					// suppression du pont
					if (!player.var.b) {
						for (var i = 12; i < 16; i++) {
						 	for (var j = 6; j < 9; j++) {
						 		this.maps[10][i][j].splice(0,2);
								this.maps[10][i][j].push(clone(game.asset_data[17]));
						 	}
						}
						game.audio[6].play();
					}
					player.var.b = true;
				} else {
					tp = false;
					clic= -1;
				}

				if (this.number_of_ennemis == 0) {
					if (!game.ui.end) {
						game.ui.end = Date.now();
					} else {
						if (Date.now() - game.ui.end > 4000) {
							game.ui.end = false;
							game.state = 4;
						}
					}
				}
			break;
			default:

		}

		// -------------------------------------------------------------------------

		// joueur devant une interraction clavier ?
		var x = player.px;
		var y = player.py;
		var tab = [];

		if (player.dir == 0) { tab = [[1,-1],[0,-1],[1,0]] } // gauche
		if (player.dir == 1) { tab = [[0,1],[-1,0],[-1,1]] }; // droite
		if (player.dir == 2) { tab = [[0,-1],[-1,-1],[-1,0]] } // haut
		if (player.dir == 3) { tab = [[1,0],[1,1],[0,1]] } // bas
		if (player.dir == 4) { tab = [[-1,-1],[-1,0],[-1,1]] } // h droite
		if (player.dir == 5) { tab = [[1,-1],[0,-1],[-1,-1]] } // h gauche
		if (player.dir == 6) { tab = [[-1,1],[0,1],[1,0]] } // b droite
		if (player.dir == 7) { tab = [[1,-1],[1,0],[1,1]] } // b gauche

		for (var i = 0; i < tab.length; i++) {
			if (game.map[player.px+tab[i][0]] && game.map[player.px+tab[i][0]][player.py+tab[i][1]]) {
				for (var z = 0; z < game.map[player.px+tab[i][0]][player.py+tab[i][1]].length; z++) {
					if (game.map[player.px+tab[i][0]][player.py+tab[i][1]][z].collision_clavier) {
						this.current_clavier = game.map[player.px+tab[i][0]][player.py+tab[i][1]][z];
					}
				}
			}
		}

		// déplacement entité
		if (this.ui.type == 0) {
			for (var i = 0; i < game.entity[this.current_map].length; i++) game.entity[this.current_map][i].deplacement();
		}

		if (keycode == 13) {
			if (this.ui.type != 0) {
				game.ui = {type : 0};
			} else {
				if (this.current_clavier != 0) {
					this.current_clavier.collision_clavier();
					keycode=0;
				}
			}
		}

		// -------------------------------------------------------------------------

		var marge = game.s*0.28;
		var t = game.s*3.5;
		var tt = game.s*2.2;
		ctx.strokeStyle = "black";
		ctx.lineWidth = game.s/45;
		ctx.textAlign = "left";

		// -------------- interface téléportation --------------

		// le joueur peut-il se téléporter ?

		if (this.current_map%2 == 1) var destination = this.current_map-1;
		else var destination = this.current_map+1;

		if (this.maps[destination][player.px][player.py][game.maps[destination][player.px][player.py].length-1].obstacle == 1) {
			tp = false;
		}

		game.teleportation(tp,destination,marge)

		// -------------- interface interragir --------------

		if (this.current_clavier != 0) {
			// affichage des rectange
			ctx.fillStyle = game.color.ui1[this.current_map%2];
			newRect(window.innerWidth-marge-t,window.innerHeight-marge-tt,t,tt,8);
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = game.color.ui2[this.current_map%2];
			newRect(window.innerWidth-marge-t/4-t/2.1,window.innerHeight-marge-t/2.3-tt/12,t/2.3,t/2.3,5);
			ctx.fill();

			if (mousex > window.innerWidth-marge-t && mousex < window.innerWidth-marge && mousey > window.innerHeight-marge-tt && mousey < window.innerHeight-marge) {
				ctx.strokeStyle = 'rgba(5,5,5,0.7)';
				ctx.stroke();
				if (clic == 0) {
					this.current_clavier.collision_clavier();
					clic=-1;
				}
			}

			// affichage du texte
			ctx.fillStyle = 'black';
			ctx.font = game.s*0.18 + 'px KulminoituvaRegular';
			ctx.textAlign = "center";
			ctx.fillText(text.entrer, window.innerWidth-marge-game.s*1.75, window.innerHeight-game.s*2.155);

			// affichage de l'objet concerné
			var w = this.current_clavier.w;
			var h = this.current_clavier.h;
			if (w > h) { var coef=t/2.3/w; } else { var coef=t/2.3/h; }
			w*=coef; h*=coef;
			this.current_clavier.draw(window.innerWidth-marge-t/1.96-w/2,window.innerHeight-tt/1.8-h/2,w,h);
		}


		// -------------- interface info joueur --------------
		var t=game.s*3.7;
		var tt=game.s*0.3;

		// barre de vie
		ctx.drawImage(game.sprite[31],t+marge*2,marge,game.s*0.26,game.s*0.26);
		if (this.current_map%2==0) game.state_barre(player.vie/player.viemax,marge,marge,t,tt,'#FF777C','#FF1814','#610000');
		if (this.current_map%2==1) game.state_barre(player.vie/player.viemax,marge,marge,t,tt,'#FF777C','#FF1814','#111111');

		// barre d'énergie
		ctx.drawImage(game.sprite[30],t+marge*2,marge*2+tt,game.s*0.26,game.s*0.26);
		if (this.current_map%2==0) game.state_barre(player.energie/player.energiemax,marge,marge*2+tt,t,tt,'#A8CCFF','#2982C6','#0F3049');
		if (this.current_map%2==1) game.state_barre(player.energie/player.energiemax,marge,marge*2+tt,t,tt,'#A8CCFF','#2982C6','#111111');
		game.asset_data[43].update();
		game.asset_data[43].draw(marge,marge*3+tt*2,marge,marge);

		// nombre de pièce
		ctx.fillStyle = game.color.text[this.current_map%2];
		ctx.font = game.s*0.22 + 'px KulminoituvaRegular';
		ctx.textAlign = "left";
		ctx.fillText(player.gold, game.s*0.69, marge*3+tt*2+game.s*0.215);

		// -------------- interface fenêtre de texte --------------

		if (this.ui.type != 0) {
			if (this.ui.type == 3) {
				game.interface2(this.ui.t1,this.ui.t2,this.ui.t3);
			} else {
				game.interface(
					this.ui.type,
					this.ui.img,
					this.ui.t1,
					this.ui.t2,
					this.ui.t3,
					this.ui.t4,
					this.ui.t5,
					this.ui.t6
				);
			}

		}

		// ---------------- sort ----------------
		if (this.ui.type != 0) clic = -1;

		for (var i = 0; i < player.sort.length; i++) {
			if (player.sort[i].state) {
				// affichage du sort
				var t = game.s*1.3;

				ctx.strokeStyle = "rgb(0,0,0)";
				ctx.fillStyle = game.color.ui1[this.current_map%2];
				newRect(marge+(marge*2+t)*i,window.innerHeight-marge-t,t,t,t*0.1);
				ctx.stroke();
				ctx.fillStyle = game.color.ui1[this.current_map%2];
				ctx.fill();

				ctx.drawImage(game.sprite[player.sort[i].img],marge+(marge*2+t)*i,window.innerHeight-marge-t,t,t);

				// si le sort est indisponible
				if (player.energie <= player.sort[i].e) {
					ctx.fillStyle = 'rgb(0,0,0,0.6)';
					newRect(marge+(marge*2+t)*i,window.innerHeight-marge-t,t,t,t*0.1);
					ctx.fill();
				}

				if (player.sort[i].current < player.sort[i].max) {
					var a = t-t/(player.sort[i].max/player.sort[i].current);
					ctx.fillStyle = 'rgb(0,0,0,0.4)';
					newRect(marge+(marge*2+t)*i,window.innerHeight-marge-a,t,a,t*0.1);
					ctx.fill();
					player.sort[i].current+=1;
				} else {

					if (player.energie >= player.sort[i].e) {
						// sort 1
						if (i == 0 && clic == 0 && mousey < window.innerHeight-t-marge) {
							player.energie-=player.sort[i].e;
							new Projectile(41,player,mousex,mousey,3,player.degats);
							player.sort[i].current = 0;

							game.audio[12].play();
							game.audio[12].volume=0.15;
						}

						if (clic == 0 && mousex > marge+(marge*2+t)*i && mousex < marge+(marge*2+t)*i+t && mousey > window.innerHeight-marge-t && mousey < window.innerHeight-marge) {
							// sort 2
							if (i == 1) {
								this.entity[this.current_map].push(clone(game.entity_data[2]));
								this.entity[this.current_map][this.entity[this.current_map].length-1].x = player.x;
								this.entity[this.current_map][this.entity[this.current_map].length-1].y = player.y+player.h;
								this.entity[this.current_map][this.entity[this.current_map].length-1].px = player.px;
								this.entity[this.current_map][this.entity[this.current_map].length-1].py = player.py;

								game.audio[9].play();
								game.audio[9].volume=0.35;

								player.sort[1].time = Date.now();
								player.energie -= player.sort[i].e;
								player.sort[i].current = 0;
							}

							// sort 3
							if (i == 2 && player.vie < player.viemax && this.current_map%2==0) {
								game.audio[2].play();
								game.audio[2].volume=0.35;
								player.vie += 17.5;
								player.sort[2].c = 0;
								player.energie-=player.sort[i].e;
								player.sort[i].current = 0;
							}
						}

					}

				}

			}
		}

		if (save.state) sauvegarde();

		// reset
		this.current_clavier = 0;
		game.reload = false;
		clic = -1;
		keycode = 0;
	}

	teleportation(tp,destination,marge){
		var t = game.s*2.3;
		var tt = game.s*0.6;

		// téléportation
		if (keycode == 32 || (mousex > window.innerWidth-marge-t && mousex < window.innerWidth-marge && mousey > marge && mousey < 60 && clic == 0)) {
			clic=-1;
			keycode = 0;
			if (tp) {
				this.current_map = destination;
				game.reload = true;
				game.update();
			} else {
				this.ui.time = Date.now();
				this.ui.t1 = this.maps[destination][player.px][player.py][game.maps[destination][player.px][player.py].length-1].text;
				game.audio[1].play();
				game.audio[1].volume = 0.2;
			}
		}

			// affichage rectangle
			ctx.strokeStyle = game.color.background[1];
			newRect(window.innerWidth-marge-t,marge,t,tt,5);
			ctx.stroke();
			ctx.fillStyle = game.color.ui1[this.current_map%2];
			ctx.fill();

			// logo
			ctx.drawImage(game.sprite[23],window.innerWidth-tt*1.1-marge,marge+tt*0.05,tt*0.9,tt*0.9);

			// texte
			if (tp) { ctx.fillStyle = 'black'; } else { ctx.fillStyle = 'rgba(100,20,20,1)'; }
			ctx.font = game.s/4 + 'px KulminoituvaRegular';
			ctx.textAlign = "center";
			ctx.fillText(text.tp, window.innerWidth-marge-t+game.s/1.14,marge+tt/2+game.s/9);

			if (this.ui.time) {
				if (Date.now() - this.ui.time < 3000) {
					var t = game.s*4.6;
					var tt = game.s*0.7;
					ctx.strokeStyle = 'black';
					ctx.lineWidth = game.s*0.01;
					if (this.current_map%2==0) { ctx.fillStyle = 'rgba(155,155,155,0.4)'; } else { ctx.fillStyle = 'rgba(175,175,175,0.55)'; }
					newRect(window.innerWidth/2-t/2+game.s/1.5,marge,t,tt,5);
					ctx.fill();
					ctx.stroke();
					ctx.lineWidth = game.s/45;

					ctx.textAlign = "center";
					ctx.fillStyle = 'rgba(190,0,0,1)';
					ctx.font = game.s/6 + 'px KulminoituvaRegular';
					ctx.fillText(text.tpimpo, window.innerWidth/2+game.s/1.5,marge+game.s*0.24);
					ctx.fillStyle = 'black';
					ctx.font = game.s/6 + 'px KulminoituvaRegular';
					if (settings[8].state == true) {
						ctx.fillText("Vous essayez de vous téléporter dans " + this.ui.t1 + ".", window.innerWidth/2+game.s/1.5,marge+game.s*0.5);
					} else {
						ctx.fillText("You try to teleport into an obstacle.", window.innerWidth/2+game.s/1.5,marge+game.s*0.5);
					}


				} else {
					this.ui.time = false;
				}
			}
	}

	interface(type,img,t1,t2,t3,t4,t5,t6) {
		ctx.strokeStyle = 'rgba(0,0,0,1)';
		ctx.fillStyle = game.color.ui3[this.current_map%2];

		var my = window.innerHeight/2-game.s;
		var t = game.s*7; var tt = game.s*4;

		newRect(window.innerWidth/2-t/2,my-tt/2,t,tt,8);
		ctx.fill();
		ctx.stroke();

		var t = game.s*1.7; var tt = game.s*0.4;

		if (mousex > window.innerWidth/2-t/2+game.s*2.1 && mousex < window.innerWidth/2-t/2+game.s*2.1+t && mousey > window.innerHeight/2-game.s+game.s*1.4 && mousey < window.innerHeight/2-game.s+game.s*1.4+tt){
			if (clic == 0) {
				game.ui = {type : 0};
				clic = -1;
			}
			ctx.fillStyle = 'rgb(250,0,0,0.8)';
		} else { ctx.fillStyle = 'rgb(250,0,0,0.5)'; }
		if (keycode == 13) game.ui = {type : 0};

		newRect(window.innerWidth/2-t/2+game.s*2.1,window.innerHeight/2-game.s+game.s*1.4,t,tt,8);
		ctx.fill();
		ctx.stroke();

		ctx.textAlign = "center";
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.font = game.s/4.7 + 'px KulminoituvaRegular';
		ctx.fillText(text.continuer,window.innerWidth/2-t/2+game.s*2.93,window.innerHeight/2-game.s+game.s*1.68);

		if (type == 1) {
			ctx.font = game.s/3 + 'px KulminoituvaRegular';
			ctx.fillStyle = '#FFC200';
			ctx.fillText(text.nsort,window.innerWidth/2-t/2+game.s*1.7,my-game.s*1.4);

			ctx.font = game.s/5.5 + 'px KulminoituvaRegular';
			ctx.fillStyle = 'rgba(0,0,0,1)';
			ctx.textAlign = "left";
			ctx.fillText(t1,window.innerWidth/2-t/2-game.s*0.4,my-game.s*0.8);
			ctx.fillText(t2,window.innerWidth/2-t/2-game.s*0.4,my-game.s*0.4);
			ctx.fillText(t3,window.innerWidth/2-t/2-game.s*0.4,my);
			ctx.fillText(t4,window.innerWidth/2-t/2-game.s*0.4,my+game.s*0.4);

			ctx.font = game.s/5 + 'px KulminoituvaRegular';
			ctx.fillText(t5 + " sec",window.innerWidth/2-game.s*0.65,my+game.s*1.05,game.s*0.5,game.s*0.5);
			ctx.fillText(t6,window.innerWidth/2+game.s*1.68,my+game.s*1,game.s*0.5,game.s*0.5);

			ctx.filter = 'opacity(87%)';
			ctx.drawImage(game.sprite[img],window.innerWidth/2-game.s*3.4,my-game.s,game.s*2,game.s*2);
			ctx.drawImage(game.sprite[47],window.innerWidth/2-game.s*1.3,my+game.s*0.73,game.s*0.5,game.s*0.5);
			ctx.drawImage(game.sprite[30],window.innerWidth/2+game.s*1.2,my+game.s*0.78,game.s*0.3,game.s*0.32);
			ctx.filter = 'none'
		}

		if (type == 2){
			var w = game.sprite[img].width;
			var h = game.sprite[img].height;

			if (w > h) { var coef=game.s*2.5/w; } else { var coef=game.s*2.5/h; }
			w*=coef; h*=coef;
			ctx.drawImage(game.sprite[img],window.innerWidth/2-game.s*3.4,my-game.s*1.25,w,h);

			ctx.font = game.s/4.5 + 'px KulminoituvaRegular';
			ctx.fillStyle = 'rgba(0,0,0,1)';
			ctx.textAlign = "left";
			ctx.fillText(t1,window.innerWidth/2-t/2-game.s*0.4,my-game.s*0.8);
			ctx.fillText(t2,window.innerWidth/2-t/2-game.s*0.4,my-game.s*0.4);
			ctx.fillText(t3,window.innerWidth/2-t/2-game.s*0.4,my);
			ctx.fillText(t4,window.innerWidth/2-t/2-game.s*0.4,my+game.s*0.4);
			ctx.fillText(t5,window.innerWidth/2-t/2-game.s*0.4,my+game.s*0.8);
		}

	}

	interface2(t1,t2,t3){
		var my = window.innerHeight/2-game.s*1.5;
		var t = game.s*7; var tt = game.s*1.6;
		ctx.strokeStyle = 'rgba(0,0,0,1)';
		ctx.fillStyle = 'rgba(175,175,175,0.75)';

		newRect(window.innerWidth/2-t/2,my-game.s/3.4,t,tt,8);
		ctx.fill();
		ctx.stroke();

		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.textAlign = "center";
		ctx.font = game.s/6 + 'px KulminoituvaRegular';
		ctx.fillText(t1,window.innerWidth/2,my-game.s/3.4+game.s*0.3);
		ctx.fillText(t2,window.innerWidth/2,my-game.s/3.4+game.s*0.6);
		ctx.fillText(t3,window.innerWidth/2,my-game.s/3.4+game.s*0.9);

		var t = game.s*1.7; var tt = game.s*0.34;

		if (keycode == 13) game.ui = {type : 0};

		if (mousex > window.innerWidth/2-t/2 && mousex < window.innerWidth/2-t/2+t && mousey > my+game.s*0.82 && mousey < my+game.s*0.82+tt){
			if (clic == 0) {
				game.ui = {type : 0};
				clic = -1;
			}
			ctx.fillStyle = 'rgb(250,0,0,0.8)';
		} else { ctx.fillStyle = 'rgb(250,0,0,0.5)'; }

		newRect(window.innerWidth/2-t/2,my+game.s*0.82,t,tt,8);
		ctx.fill();
		ctx.stroke();
		ctx.textAlign = "center";
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.font = game.s/5 + 'px KulminoituvaRegular';
		ctx.fillText(text.compris,window.innerWidth/2-t/2+game.s*0.83,my-game.s+game.s*2.07);
	}

	ini(){

		// -------- text - obstacle - size - couleur - contour
		new Formes('du vide',1,0,'rgba(255,255,255,0)',false); // 0
		new Formes('herbe',0,1,'#91BC45',false); // 1
    new Formes('route',0,0.4,'#FFBB47',false); // 2
		new Formes('sol',0,2,'#632437',true); // 3 ----

		// -------- text - obstacle - img
		new Images('des fleurs roses',0,2); // 4
		new Images('une barrière',1,7); // 5
		new Images('un arbre',1,6); // 6
		new Images('fleurs rouges',0,4); // 7
		new Images('fleurs jaunes',0,5); // 8

		// -------- text - obstacle - img - nbr d'anim - tick
		new Pieces('piece',2,1,9,250,0.7); // 9

		// ----
		new Formes('terre',0,5,'#B56A3B',false); // 10
		new Images('une barrière',1,9); // 11
		new Images('un buisson',0,10); // 12
		new Images('pierre',0,11); // 13
		new Images('pierre',0,11); // 14

		new Doors ('#1',true,'porte',0,3.5,'#AE1C1C',true); // 15

		new Formes('terre',0,0.4,'#AB6634',false); // 16

		new Animations("de l'eau",1,14,16,50); // 17

		new Teleportations('tp',0,0,'rgba(255,255,255,0)',false,"haut"); // 18

		new Images('un arbre',1,15); // 19

		new Formes('mur rouge',0,6.5,'#AE1C1C',true); // 20 ----
		new Formes('sol rouge',0,1,'#AE1C1C',true); // 21 ----

		new Animations("de l'eau",1,16,16,50); // 22
		new Images('un buisson',1,17); // 23
		new Images('un buisson',1,18); // 24

		new Formes('sol',0,0.3,'#635F55',true); // 25

		new Teleportations('tp',0,0,'rgba(255,255,255,0)',false,"bas"); // 26
		new Coffres('un coffre',1,26,1,27); // 27

		new Images('un obstacle',1,48); // 28
		new Images('des champignons',1,23); // 29
		new Formes('sol beige',0,0.3,'#CA5834',true); // 21 ----

		new Images('herbe',1,1); // 31

		new Switchs('2',2,'un obstacle',1,20,1,24) //32

		new Doors('#2',false,'porte',0,0.4,'#AB6634',false); // 33

		new Switchs('1',3,'un obstacle',1,20,1,24) //34
		new Formes('sol',0,0.7,'#AE1C1C',true); // 35

		new Teleportations('',0,0,'rgba(255,255,255,0)',false,"gauche"); // 36
		new Teleportations('',0,0,'rgba(255,255,255,0)',false,"droite"); // 37
		new Teleportations('',0,0,'rgba(255,255,255,0)',false,"tp"); // 38

		new Images('wall',2,28); // 39
		new Formes('sol',0,1,'#CCCCCC',true); // 40
		new Images('wall',2,29); // 41
		new Formes('sol',0,1,'rgba(0,255,0,0)',true); // 42

		new Intergolds('piece',2,1,9,350); // 43

		new Images('un arbre',1,3,1); // 44

		new Images('un tonneau',1,10,1); // 45
		new Tables('une table',1,19,1); // 46
		new Images('fenêtre',0,32,1); // 47
		new Images('un obstacle',1,33,1); // 48

		new Images('maison',2,21,1); // 49
		new Images('maison',2,12,1); // 50
		new Images('maison',2,16,1); // 51

		new Coffres('un coffre',1,40,1,45); // 52
		new Formes('terre',0,2.3,'#AB6634',false); // 53

		new Campfires('feu de camp',2,46,18,55,0.8); // 54
		new Graves('une tombe',1,25,1); // 55
		new Signs('un panneau',1,36); // 56
		new Formes('terre',0,0.8,'#825012',false); // 57
		new Formes('terre',0,3,'#AB6634',false); // 58
		new Images('nénuphare',2,49); // 59
		new Images('plante',2,50); // 60
		new Images('pierre',2,51); // 61
		new Images('pierre',2,52); // 62

		new Cadavres("cadavre d'arraigné",3,38,1) // 63
		new Cadavres("cadavre de gobelin",3,34,1) // 64
		new Cadavres("cadavre de chef gobelin",3,34,1.5) // 65

		new Formes('mur rouge',0,5.5,'#AE1C1C',true); // 66 ----
		// --------

		new Monster('gobelin',	// 0
			13, // img
			1.1, // vitesse
			4, // nbr d'anim
		  // g d h b hd hg bd bg
			[0,4,2,6,3,1,5,7], // data
			0.8, // p
			15, // dégat
			70, // vie
		  1, // camp
			6,
			1, // type
			35, // img atk
			2, // nb img atk
			5, // son mort
			64, // img mort
		);

		new Monster('spider',	// 1
			0, // img
			0.6, // vitesse
			8, // nbr d'anim
		  // g d h b hd hg bd bg
			[0,4,2,6,3,1,5,7], // data
			1, // p
			18, // dégat
			110, // vie
		  1, // camp
			6,
			1, // type
			37, // img atk
			4, // nb img atk
			4, // son mort
			63, // img mort
		);

		new Monster('clone',	// 2
			39, // img
			0.6, // vitesse
			3, // nbr d'anim
			// g d h b hd hg bd bg
			[4,5,6,2,7,3,1,0], // data
			0.75, // p
			12, // dégat
			70, // vie
			0, // camp
			4,
			2, // type
			40, // img atk
			1000, // nb atk
			3, // son mort
		);

		new Monster('boss',	// 3
			13, // img
			1, // vitesse
			4, // nbr d'anim
			 // g d h b hd hg bd bg
			[0,4,2,6,3,1,5,7], // data
			1.3, // p
			20, // dégat
			400, // vie
			 1, // camp
			 4,
			1, // type
			35, // img atk
			2, // nb img atk
			5, // son mort
			65, // img mort
		);
		// --------

		new Player('joueur',
			8, // img
			1.4, // vitesse
			3, // nbr d'anim
			[4,5,6,2,7,3,1,0], // data
			0.75, // p
			10, // dégat 10
			100, // vie
			0, // camp
			4,
		);


		game.generate_map();

	}

	generate_map(){

			// --- map 0 ---
			this.maps.push([
				[[10,1],[10,1,13],[10,1],[10,1],[2,18],[1,18],[10,1],[10,1],[10,1],[10,1],[10,1,8],[10,1],[17],[10,1],[10,1],[10,1]],
				[[10,1],[10,1],[10,1],[10,1],[2],[1],[1],[1,23],[1,23],[10,1],[10,1],[10,1],[17],[10,1],[10,1],[10,1]],
				[[10,1],[10,1],[1],[1],[2],[1],[1],[1],[1],[1],[1],[1,7],[17],[1],[1],[1,19]],
				[[10,1],[10,1],[1],[1],[2],[2],[2],[2],[2],[1],[1],[1],[17],[1],[1],[1,6]],
				[[10,1],[10,1],[1,6],[1,19],[1],[1],[1],[1],[2],[1],[1],[1],[17],[1],[1,4],[1]],
				[[10,1],[10,1],[1,19],[1,6],[1],[1,4],[1],[1],[2],[1],[1],[17],[17],[1],[1],[1]],
				[[10,1],[10,1],[1,6],[1,6],[1],[1],[1],[1],[2],[1],[17],[17],[17],[17],[17],[17]],
				[[10,1],[10,1],[1,19],[1],[1],[1],[17],[17],[17],[17],[17],[1,11],[1,11],[1,11],[1,11],[1,11]],
				[[10,1],[10,1],[1],[1],[1],[17],[17],[1],[2],[1],[1],[1],[1],[1],[1],[1]],
				[[17],[17],[17],[17],[17],[17],[1],[1],[2],[1],[1],[1],[1],[1],[1],[1]],
				[[10,1],[10,1],[1,11],[1,11],[1,11],[1],[1],[1],[2],[1,13],[1],[1],[1],[1],[1],[1]],
				[[10,1,19],[10,1],[10,1],[1],[1],[1],[1],[1],[2],[1],[1],[1],[1],[1],[1],[1]],
				[[10,1,6],[10,1],[10,1],[1],[1],[1],[1],[1],[2],[1],[1],[1],[1],[1],[1],[1]],
				[[10,1],[10,1],[10,1],[1,24],[1],[1],[1,4],[1,4],[2],[1],[1],[1],[1],[1,8],[1,8],[1]],
				[[10,10,1],[10,1],[10,1,9],[10,1],[1],[1],[1],[1],[2],[1],[1],[1],[1],[1,8],[1,8],[1]],
				[[10,10,1,13],[10,1],[10,1],[10,1],[1],[1],[1],[1],[2],[1],[1],[1],[1],[1],[1],[1]],
			]);

			// --- anti map 1 --- 1
			this.maps.push([
				[[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30]],
				[[20,30],[3,28],[3,28],[21],[21],[21],[21],[20,30],[20,30],[21],[3],[3],[3],[3],[3],[20,30]],
				[[20,30],[3],[3],[21],[21],[21],[21],[21],[21],[21],[3],[3],[3],[3],[3],[20,30]],
				[[20,30],[3],[3],[21],[21],[21],[21],[21],[21],[21],[3],[3],[3],[3],[3],[20,30]],
				[[20,30],[3],[3],[21],[21],[21],[21],[21],[21],[21],[3],[20,9],[3],[3],[3],[20,30]],
				[[20,30],[3],[3],[21],[21],[21],[21],[21],[21],[21],[3],[3],[3],[3],[3],[20,30]],
				[[20,30],[20,30],[3],[21],[21],[21],[21],[21],[21],[21],[3],[3],[3],[3],[3],[20,30]],
				[[20,30],[20,30],[3],[21],[21],[21],[21],[21],[21],[21],[3],[3],[3],[3],[3],[20,30]],
				[[20,30],[20,30],[3],[21],[21],[21],[21],[21],[21],[21],[3],[3],[3],[3],[3],[20,30]],
				[[20,30],[3],[3],[21],[3],[3],[3],[21],[21],[21],[3],[3],[3],[3],[3],[20,30]],
				[[20,30],[3],[3],[21],[3],[20],[3],[21],[21],[21],[3],[3],[3],[3],[3],[20,30]],
				[[20,30],[3],[3],[21],[3],[20,9],[3],[21],[21],[21],[3],[3],[3],[3],[20,30],[20,30]],
				[[20,30],[3],[3],[21],[3],[3],[3],[21],[21],[21],[3],[3],[3],[3],[20,30],[20,30]],
				[[20,30],[3],[3],[21],[21],[21],[21],[21],[21],[21],[3],[3],[3],[3],[20,30],[20,30]],
				[[20,30],[3],[3],[21],[21],[21],[21],[21],[21],[21],[3],[3],[3],[3],[20,30],[20,30]],
				[[20,30],[3],[3],[21],[21],[21],[21],[21],[21],[21],[3],[3],[3],[3],[3],[20,30]],
			]);

			// --- map 2 --- 2
			this.maps.push([
				[[10,1],[10,1],[17],[1],[1,6],[1],[1],[1],[1],[1],[1,6],[1],[1],[1],[17],[1,6]],
				[[10,1],[10,1],[17],[1],[1,6],[1],[1,0],[1,0],[1,0],[1],[1,19],[1],[1,9],[1],[17],[1,19]],
				[[10,1],[1,44],[17],[1],[1,19],[1],[1,0],[1,0],[1,0],[1,51],[1,6],[1],[1],[1],[17],[1]],
				[[10,1],[1],[17],[17],[17],[1],[1,0],[1,38],[1,50,38],[1],[1,6],[1],[17],[17],[17],[1]],
				[[10,1],[1],[1,4],[1],[17],[1],[1],[1,49],[1],[1],[1],[17],[17],[1],[1],[1]],
				[[10,1],[1],[1],[1],[17],[17],[17],[17,33],[17,33],[17],[17],[17],[1],[1,13],[1],[1]],
				[[1,36],[1],[1],[1],[1],[1],[1],[2],[2],[1],[1],[17],[1],[1],[1],[1]],
				[[2,36],[2],[2],[2],[2],[1],[1],[1],[2],[1],[1],[17],[1],[1],[16],[1]],
				[[1,36],[1],[1],[1],[2],[1],[1],[1],[2],[1],[1],[17],[1],[1],[16,34],[1]],
				[[1,36],[1],[1],[1],[2],[1],[1],[1],[2],[1],[1],[17],[1],[1],[16],[1]],
				[[10,1],[10,1],[1],[1],[2],[1],[1],[1],[2],[1],[1],[17],[17],[1],[1],[1]],
				[[10,1],[10,1],[10,1],[1],[2],[2],[2],[2],[2],[1],[1],[1],[17],[1],[1],[1]],
				[[10,1],[10,1,7],[10,1],[1],[2],[1,13],[1],[1],[1],[1],[1],[1],[17],[1,13],[1],[1,4]],
				[[10,1,19],[10,1],[10,1],[1],[2],[1],[1],[1],[1],[1],[1],[1],[17],[1],[1],[1,19]],
				[[10,1,19],[10,1],[10,1],[1],[2],[1],[1],[1],[1],[1],[1],[1],[17],[1],[1],[1,6]],
				[[10,1],[10,1],[10,1],[1],[2,26],[1,26],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[17],[1],[1],[1]],
			]);

			// --- anti map 2 --- 3
			this.maps.push([
				[[21],[21],[21],[3],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[3],[21],[21],[21],[21]],
				[[21],[3,48],[21],[3],[20,30],[3],[3],[3],[3],[3],[20,30],[3],[21],[3,48],[21],[21]],
				[[21],[21],[21],[3],[20,30],[3],[3],[3],[3],[3],[20,30],[3],[21],[21],[21],[21]],
				[[21],[21],[21],[3],[20,30],[3],[3],[3],[3],[3],[20,30],[3],[21],[21],[21],[21]],
				[[21],[3,48],[21],[3],[20,30],[3],[3],[3],[3],[3],[20,30],[3],[21],[3,48],[21],[21]],
				[[21],[21],[21],[3],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[3],[21],[21],[21],[21]],
				[[21],[21],[21],[3],[3],[3],[3],[3],[3],[3],[3],[3],[21],[21],[21],[21]],
				[[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21]],
				[[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21]],
				[[3],[3],[3],[3],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21]],
				[[20,30],[20,30],[20,30,0],[3],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21]],
				[[3],[3],[20,30],[3],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21],[21]],
				[[3,35,32],[3],[3,15],[3],[21],[21],[21],[21],[21],[21],[21],[21],[20,30],[20,30],[20,30],[20,30]],
				[[3],[3],[3,15],[3],[21],[21],[21],[21],[21],[21],[21],[21],[20,30],[3],[3],[3]],
				[[3],[3],[20,30],[3],[21],[21],[21],[21],[21],[21],[21],[21],[20,30],[3],[3,9],[3]],
				[[20,30],[20,30],[20,30],[3],[21],[21],[21],[21],[21],[21],[21],[21],[20,30],[3],[3],[3]],
			]);

			// --- map 3 --- 4
			this.maps.push([
				[[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1]],
				[[10,1],[1],[1,6],[1],[1],[1,6],[1,6],[1],[1],[1],[1],[1],[1],[1,6],[1],[1]],
				[[10,1],[1],[1],[1],[1],[1],[1],[1],[1],[1,4],[1],[1],[1],[1],[1],[1]],
				[[10,1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1,13],[1],[1]],
				[[10,1],[16],[16],[16],[16],[16],[16],[16],[16],[1],[1],[1],[1],[1],[1],[1]],
				[[10,1],[16],[16],[16],[16],[16],[16],[16],[16],[1],[1],[1],[1],[1],[1],[1]],
				[[16,5],[16],[16],[16],[16],[16],[16],[16],[16],[1],[1],[1],[1],[1],[1],[1,37]],
				[[16,5],[16,"0"],[16],[16],[16],[16],[16],[16],[16],[1],[1],[1],[2],[2],[2],[2,37]],
				[[16,5],[16],[16],[16],[16],[16],[16],[16],[16],[1],[1],[1],[1],[1],[1],[1,37]],
				[[10,1],[16],[16],[16],[16],[16],[16],[16],[16],[1],[1],[1],[1],[1],[1],[1]],
				[[10,1],[16,56],[16],[16],[16],[16],[16],[16],[16],[1],[1],[1],[1],[1],[1],[1]],
				[[10,1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1]],
				[[10,1],[1,6],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1,4],[1],[1]],
				[[10,1],[1,6],[1],[1],[1],[1],[1],[1,8],[1,8],[1],[1],[1],[1],[1],[1],[1]],
				[[10,1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1]],
				[[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1]],
			]);

			// --- anti map 3 --- 5
			this.maps.push([
				[[3],[3],[3],[3],[0],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3]],
				[[3],[21],[21],[3],[0],[3],[21],[21],[21],[21],[21],[21],[21],[21],[21],[3]],
				[[3],[21],[21],[3],[0],[3],[21],[21],[21],[21],[21],[21],[21],[21],[21],[3]],
				[[3],[21],[21],[3],[0],[3],[21],[21],[21],[21],[21],[21,9],[21],[21],[21],[3]],
				[[3],[21],[21],[3],[0],[3],[21],[21],[21],[21],[21],[21],[21],[21],[21],[3]],
				[[3],[3],[3],[3],[0],[3],[3],[3],[3],[3],[21],[21],[21],[21],[21],[3]],
				[[0],[0],[0],[0],[0],[0],[0],[0],[0],[3],[21],[21],[21],[21],[21],[3]],
				[[3],[3],[3],[3],[3],[3],[3],[3],[0],[3],[21],[21],[21],[21],[21],[3]],
				[[3],[21],[21],[21],[21],[21],[21],[3],[0],[3],[3],[3],[3],[3],[3],[3]],
				[[3],[21],[21],[21],[21],[21],[21],[3],[0],[0],[0],[0],[0],[0],[0],[0]],
				[[3],[21],[21],[21],[21],[21],[21],[3],[0],[3],[3],[3],[3],[3],[3],[3]],
				[[3],[21],[21],[21,9],[21],[21],[21],[3],[0],[3],[21],[21],[21],[21],[21],[3]],
				[[3],[21],[21],[21],[21],[21],[21],[3],[0],[3],[21],[21],[21],[21],[21],[3]],
				[[3],[21],[21],[21],[21],[21],[21],[3],[0],[3],[21],[21],[21],[21],[21],[3]],
				[[3],[21],[21],[21],[21],[21],[21],[3],[0],[3],[21],[21],[21],[21],[21],[3]],
				[[3],[3],[3],[3],[3],[3],[3],[3],[0],[3],[3],[3],[3],[3],[3],[3]],
			]);

			// --- map moulin --- 6
			this.maps.push([
				[[0,41],[0,41],[0,41],[0,41]],
				[[40,39],[40,27],[40],[40,45]],
				[[40,39,47],[40],[40],[40,45]],
				[[40,39],[40],[40],[40]],
				[[40,39,46],[40],[40],[40]],
				[[0],[40,38],[40,38],[0]],
			]);

			// --- anti map moulin --- 7
			this.maps.push([
				[[0],[0],[0],[0]],
				[[3],[3,9],[3,],[3]],
				[[3],[21],[21],[3]],
				[[3],[21],[21],[3]],
				[[3],[21],[21],[3]],
				[[0],[21],[21],[0]],
			]);
			// --- map feu de camp --- 8
			this.maps.push([
					[[10,1,5],[10,1,23],[10,1],[10,1],[10,1],[10,1,5],[1,53,62,18],[1,53,62,18],[1,53,62,18],[10,1,5],[10,1],[16,53],[1],[1,6],[1,6],[1]],
					[[10,1,5],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1,11],[10,1,11],[10,1,11],[10,1],[10,1],[16,53],[1],[1],[1],[1]],
					[[10,1,5],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[16,53],[1],[1],[1],[1]],
					[[10,1,5],[10,1],[10,1],[10,1],[10,1,"0"],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[16,53],[1],[1],[1],[1]],
					[[10,1,5],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[16,53],[16],[16],[16],[16]],
					[[10,1,5],[10,1],[10,1,4],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[16,53],[16],[16],[16],[16]],
					[[10,1,5],[10,1],[10,1],[10,1],[1,53],[1,53],[1,53],[10,1],[10,1],[10,1],[10,1],[16,53],[16],[16],[16],[16,37]],
					[[10,1,5],[10,1],[10,1],[10,1],[1,53],[1,53,54],[1,53],[10,1],[10,1],[10,1],[10,1],[16,53],[16],[16],[16],[16,37]],
					[[10,1,5],[10,1],[10,1],[10,1],[1,53],[1,53],[1,53],[10,1],[10,1],[10,1],[10,1],[16,53],[16],[16],[16],[16,37]],
					[[10,1,5],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[16,53],[16],[16],[16],[16]],
					[[10,1,5],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[16,53],[16],[16],[16],[16]],
					[[10,1,6],[10,16],[10,16],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[16,53],[16],[16],[16],[16]],
					[[10,1,6],[10,16,55],[10,16],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[16,53],[1],[1],[1],[1]],
					[[10,1,6],[10,16],[10,16],[10,1],[10,1],[10,1],[10,1],[10,1,7],[10,1],[10,1],[10,1],[16,53],[1],[1,4],[1],[1]],
					[[10,1,6],[10,1,6],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[16,53],[1],[1],[1],[1]],
					[[10,1,6],[10,1,6],[10,1],[10,1],[10,1],[10,1,"1"],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[1],[1,6],[1,6],[1]],
				]);

			// --- anti map feu de camp --- 9
			this.maps.push([
				[[66,21,30],[66,21,30],[66,21,30],[66,21,30],[66,21,30],[66,21,30],[66,21,30],[66,21,30],[66,21,30],[66,21,30],[66,21,30],[66,21,30],[66,21,30],[66,21,30],[66,21,30],[66,21,30]],
				[[66,21,30],[21,3],[21,3],[21,3],[21,3],[21,3],[66],[66],[66],[66],[66],[21,3],[21],[21],[21],[21]],
				[[66,21,30],[21,3],[21,3],[21,3],[21,3],[21,3],[66],[66],[66],[66],[66],[21,3],[21],[21],[3,48],[21]],
				[[66,21,30],[21,3],[21,3],[21,3],[21,3],[21,3],[66],[66],[66],[66],[66],[21,3],[21],[21],[21],[21]],
				[[66,21,30],[21,3],[21,3],[21,3],[21,3],[21,3],[66],[66],[66],[66],[66],[21,3],[21],[21],[21],[21]],
				[[66,21,30],[21,3],[21,3],[21,3],[21,3],[21,3],[66],[66],[66],[66],[66],[21,3],[21],[21],[21],[21]],
				[[66,21,30],[66],[66],[66],[66],[66],[66],[66],[66],[66],[66],[21,3],[21],[21],[21],[21]],
				[[66,21,30],[66],[66],[66],[66],[66],[66],[66],[66],[66],[66],[21,3],[21],[21],[21],[21]],
				[[66,21,30],[66],[66],[66],[66],[66],[66],[66,56],[66],[66],[66],[21,3],[21],[21],[21],[21]],
				[[66,21,30],[66],[66],[66],[66],[66],[66],[66],[66],[66],[66],[21,3],[21],[21],[21],[21]],
				[[66,21,30],[21,3],[21,3],[21,3],[21,3],[21,3],[66],[66],[66],[66],[66],[21,3],[21],[21],[21],[21]],
				[[66,21,30],[21,3],[21,3],[21,3],[21,3],[21,3],[66],[66],[66],[66],[66],[21,3],[21],[21],[21],[21]],
				[[66,21,30],[21,3,34],[21,3],[21,3],[21,3],[21,3],[66],[66],[66],[66],[66],[21,3],[21],[21],[21],[21]],
				[[66,21,30],[21,3],[21,3],[21,3],[21,3],[21,3],[66],[66],[66],[66],[66],[21,3],[21],[21],[21],[21]],
				[[66,21,30],[21,3],[21,3],[21,3],[21,3],[21,3],[66],[66],[66],[66],[66],[21,3],[21],[21],[3,48],[21]],
				[[66,21,30],[66],[66],[66],[66],[66],[66],[66],[66],[66],[66],[66],[21],[21],[21],[21]],
			]);

			// --- map boss --- 10
			this.maps.push([
				[[1,6],[1,6],[1],[1],[17],[17],[17],[17],[17],[17],[17],[17],[17],[1],[1],[1]],
				[[1],[1],[17],[17],[17],[17],[17],[17],[17],[17],[17],[17],[17],[17],[1],[1,4]],
				[[17],[17],[17],[17,59],[17],[17],[17],[17],[17],[17],[17,61],[17],[17],[17],[1],[1]],
				[[17],[17],[17],[17],[17],[17],[17],[17],[17],[17],[17],[17],[17],[17],[17],[17]],
				[[17],[17],[17],[1],[1],[1],[1],[1],[1],[1],[1],[1],[17],[17],[17],[17]],
				[[17],[17],[17],[1],[1,54],[1],[1],[1,"3"],[1],[1],[1,54],[1],[17],[17],[17],[17]],
				[[17],[17],[17],[1],[1],[16],[16],[16],[16],[16],[1],[1],[17],[17],[17],[17]],
				[[17],[17],[17],[1],[1],[16],[16],[16],[16],[16],[1],[1],[17],[17],[17],[17]],
				[[17],[17],[17],[1],[1],[16],[16],[16],[16],[16],[1],[1],[17],[17],[17,60],[17]],
				[[17],[17],[17],[1],[1],[16],[16],[16],[16],[16],[1],[1],[17],[17],[17,59],[17]],
				[[17],[17],[17],[1],[1],[1],[1],[1],[1],[1],[1],[1],[17],[17],[17],[17]],
				[[17],[17,60],[17],[1],[1],[1],[1],[1],[1],[1],[1],[1],[17],[17],[17],[17]],
				[[17],[17],[17],[17],[17],[17],[57,62],[57,62],[57,62],[17],[17],[17],[17],[17],[17],[17]],
				[[17],[17],[17],[17],[17],[17],[57,62],[57,62],[57,62],[17],[17],[17,59],[17],[17],[17],[17]],
				[[17],[17],[17],[17],[17],[17],[57,62],[57,62],[57,62],[17],[17],[17],[17],[17],[17],[17]],
				[[58,1],[58,1,6],[58,1],[58,1],[58,1],[58,1],[57,62,26],[57,62,26],[57,62,26],[58,1],[58,1],[58,1],[1],[1],[1],[1]],
			]);

			// --- anti map boss --- 11
			this.maps.push([
				[[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30]],
				[[20,30],[20,30],[3],[3],[3],[3],[20,30],[20,30],[20,30],[3],[3],[3],[3],[3],[20,30],[20,30]],
				[[20,30],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[20,30],[20,30]],
				[[20,30],[3],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[3],[3],[20,30]],
				[[20,30],[3],[0],[21,48],[21],[21],[21],[21],[21],[21],[21],[21,48],[0],[3],[3],[20,30]],
				[[20,30],[3],[0],[21],[21],[21],[21],[21],[21],[21],[21],[21],[0],[3],[3],[20,30]],
				[[20,30],[3],[0],[21],[21],[21],[21],[21],[21],[21],[21],[21],[0],[3],[3],[20,30]],
				[[20,30],[3],[0],[21],[21],[21],[21],[21],[21],[21],[21],[21],[0],[3],[3],[20,30]],
				[[20,30],[3],[0],[21],[21],[21],[21],[21],[21],[21],[21],[21],[0],[3],[3],[20,30]],
				[[20,30],[3],[0],[21],[21],[21],[21],[21],[21],[21],[21],[21],[0],[3],[3],[20,30]],
				[[20,30],[3],[0],[21],[21],[21],[21],[21],[21],[21],[21],[21],[0],[3],[3],[20,30]],
				[[20,30],[3],[0],[21,48],[21],[21],[21],[21],[21],[21],[21],[21,48],[0],[3],[3],[20,30]],
				[[20,30],[3],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[3],[3],[20,30]],
				[[20,30],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[20,30]],
				[[20,30],[20,30],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[3],[20,30],[20,30],[20,30]],
				[[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30],[20,30]],
			]);

		for (var i = 0; i < this.maps.length; i++) {
			this.entity[i]=[];
			game.entity[i].push(player);
			this.entity[i][this.entity[i].length-1].px = 15;
			this.entity[i][this.entity[i].length-1].py = 8;
		}

		for (var i = 0; i < this.maps.length; i++) {
			// conversion en objet
	    for (var x = 0; x < this.maps[i].length; x++) {
	    	for (var y = 0; y < this.maps[i][x].length; y++) {
	        for (var z = 0; z < this.maps[i][x][y].length; z++) {

							if (typeof(this.maps[i][x][y][z])=="string") {
								this.entity[i].push(clone(game.entity_data[parseInt(this.maps[i][x][y][z],10)]));
								this.entity[i][this.entity[i].length-1].px = x;
								this.entity[i][this.entity[i].length-1].py = y;
								this.maps[i][x][y].splice(this.maps[i][x][y].length-1,1);
							} else {
								this.maps[i][x][y][z] = clone(game.asset_data[this.maps[i][x][y][z]]);
							}

	        }
	    	}
	    }

		}


	}

	getpos(px,py,i,j) {
		// création de la base de détaction
		this.base = new Path2D();
		this.base.moveTo(game.s/2, 0);
		this.base.lineTo(game.s, game.s/4);
		this.base.lineTo(game.s/2, game.s/2);
		this.base.lineTo(0, game.s/4);
		this.base.closePath();

		// détection de la case
		for (var x = 0; x < game.map.length; x++) {
			for (var y = 0; y < game.map[x].length; y++) {
				var xx = game.pos_x(x,y);
				var yy = game.pos_y(x,y,0,0);
				if (px > xx && px < xx + game.s && py > yy && py < yy + game.s) {
					ctx.translate(xx,yy);
					if ((ctx.isPointInPath(this.base,px,py)) && (x == i && y == j)) {
						ctx.setTransform(1, 0, 0, 1, 0, 0);
						return true;
					}
					ctx.setTransform(1, 0, 0, 1, 0, 0);
				}
			}
		}

		return false;
	}

	pos_x(x,y) {
		return game.mx + (game.s-1)/2*y - (game.s-1)/2*x;
	}

	pos_y(x,y,z) {
		return game.my + (game.s-1)/4*y + (game.s-1)/4*x-z;
	}

	detect_img(rx,ry,img,x,y,w,h,xx,yy,ww,hh){
		var c = document.createElement('canvas');
		var ctx2 = c.getContext("2d");
		if (rx > x && x+w > rx && ry > y && ry < y+h){
			c.width = window.innerWidth;
			c.height = window.innerHeight;
			if (ww) { ctx2.drawImage(img,xx,yy,ww,hh,x,y,w,h); } else { ctx2.drawImage(img,x,y,w,h); }
			if (ctx2.getImageData(rx, ry, 1, 1).data[3] > 10) return true;
		}

		return false;
	}

	load_img(tab){
		for (var x = 0; x < tab.length; x++) {
			var img = new Image();
			img.src = 'Image/'+tab[x];
			img.addEventListener('load', function() {
			  game.load += 1;
			}, false);
			game.sprite.push(img);
			game.loadmax += 1;
		}

	}

	load_audio(tab){
		for (var x = 0; x < tab.length; x++) {
			var myAudio = document.createElement("audio");
			myAudio.src = 'Sound/'+tab[x];
			myAudio.addEventListener('load', function() {
			  game.load += 1;
			}, false);
			// myAudio.muted = true;
			game.audio.push(myAudio);
		}
		game.loadmax += 1;
	}

  state_barre(a,x,y,w,h,c1,c2,c3){

		ctx.fillStyle = c1;
		newRect(x,y,w,h);
		ctx.fill();
		ctx.fillStyle = c2;
		if (a*w>w-5) {
			newRect(x,y,(a*w),h);
		} else {
			newRect2(x,y,(a*w),h);
		}

		ctx.fill();

		ctx.strokeStyle = c3;
		ctx.beginPath();
		ctx.moveTo(x+(w/5),y);
		ctx.lineTo(x+(w/5),y+h);
		ctx.moveTo(x+(w/5)*2,y);
		ctx.lineTo(x+(w/5)*2,y+h);
		ctx.moveTo(x+(w/5)*3,y);
		ctx.lineTo(x+(w/5)*3,y+h);
		ctx.moveTo(x+(w/5)*4,y);
		ctx.lineTo(x+(w/5)*4,y+h);
		ctx.stroke();
		newRect(x,y,w,h);
		ctx.stroke();
	}

	textlimit(){
		// ctx.setTransform(1, 0.5, -1, 0.5, 0, 0) sol droit
		// ctx.setTransform(1, 0.5, 0, 1, 0, -350/1.5) droite
		// ctx.setTransform(1, -0.5, 0, 1, 0, 350/1.5) gauche

		if (this.current_map==2){
			var px=game.pos_x(8,0)-game.s/2;
			var py=game.pos_y(8,0,0)-game.s/2;
			var zone=game.s;
			if (Distance(player.x,player.y+player.h/2,px+game.s,py)<zone && !player.var.a) {
				var a = 1.6 - Distance(player.x,player.y,px+game.s,py)*(1/zone);
				var c = document.createElement('canvas');
				var ctx2 = c.getContext("2d");
				c.width = 600;
				c.height = 600;
				ctx2.fillStyle = 'rgba(0,0,0,' + a + ')';
				ctx2.font = game.s/6.5 + 'px KulminoituvaRegular';
				ctx2.setTransform(1, -0.5, 0, 1, 0, 0);
				ctx.textAlign = "center";
				ctx2.fillText(text.moulin1, 0, game.s/5*7);
				ctx2.fillText(text.moulin2, 0, game.s/5*7+game.s/4);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.drawImage(c,Math.round(px),Math.round(py-game.s/4*5),c.width,c.height);
			}
		}

	}

}

// fonctions utiles
function clone(originalObject){
		if((typeof originalObject !== 'object') || originalObject === null){
				throw new TypeError("originalObject parameter must be an object which is not null");
		}

		var deepCopy = JSON.parse(JSON.stringify(originalObject));

		// Une petite récursivité
		function deepProto(originalObject, deepCopy){
				deepCopy.__proto__ = Object.create(originalObject.constructor.prototype);
				for(var attribute in originalObject){
						if(typeof originalObject[attribute] === 'object' && originalObject[attribute] !== null){
								deepProto(originalObject[attribute], deepCopy[attribute]);
						}
				}
		}
		deepProto(originalObject, deepCopy);

		return deepCopy;
}

function Random(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min +1)) + min;
}


function roundRect(x, y, w, h, r) {
		if (w < 2 * r || h < 2 * r) r = w / 2;
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
    ctx.fill();
  }

function newRect(x, y, w, h, r) {
	if (!r) r = h/4;
	if (r>h || r>w) r = 0;

	ctx.beginPath();
	ctx.moveTo(x+r, y);
	ctx.lineTo(x+w, y);
	ctx.lineTo(x+w, y+h-r);
	ctx.lineTo(x+w-r, y+h);
	ctx.lineTo(x, y+h);
	ctx.lineTo(x, y+r);
  ctx.closePath();
}

function newRect2(x, y, w, h, r) {
 	if (!r) r = h/4;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
	ctx.lineTo(x+w, y);
	ctx.lineTo(x+w, y+h);
	ctx.lineTo(x+w, y+h);
	ctx.lineTo(x, y+h);
	ctx.lineTo(x, y+r);
  ctx.closePath();
}

function Distance(x1, y1, x2, y2) {
    return Math.sqrt(sqr(y2 - y1) + sqr(x2 - x1));
}

function sqr(a) {
    return a*a;
}

function sauvegarde() {

	save.maps = [];
	for (var i = 0; i < game.maps.length; i++) {
		save.maps[i] = [];
		for (var x = 0; x < game.maps[i].length; x++) {
			save.maps[i][x] = [];
			for (var y = 0; y < game.maps[i][x].length; y++) {
				save.maps[i][x][y] = [];
				for (var z = 0; z < game.maps[i][x][y].length; z++) {
					if (game.maps[i][x][y][z].img) { save.maps[i][x][y][z] = clone(game.maps[i][x][y][z]);}
					else { save.maps[i][x][y][z] = game.maps[i][x][y][z]; }
				}
			}
		}
	}

	save.current_map = game.current_map;
	for (var m = 0; m < game.maps.length; m++) {
		save.entity[m] = [player];
		for (var i = 1; i < game.entity[m].length; i++) {
				save.entity[m][i] = clone(game.entity[m][i])
		}
	}
	save.vie = player.vie;
	save.gold = player.gold;
	save.energie = player.energie;
	save.walk = clone(player.walk);
	save.px = player.px;
	save.py = player.py;
	save.x = player.x;
	save.y = player.y;
	save.dir = player.dir;
	save.sort = clone(player.sort);
	save.var = clone(player.var);

	save.state = false;
	console.log('[Jeu sauvegardé]')
}

function loadgame() {

	game.maps = [];
	for (var i = 0; i < save.maps.length; i++) {
		game.maps[i] = [];
		for (var x = 0; x < save.maps[i].length; x++) {
			game.maps[i][x] = [];
			for (var y = 0; y < save.maps[i][x].length; y++) {
				game.maps[i][x][y] = [];
				for (var z = 0; z < save.maps[i][x][y].length; z++) {
					if (save.maps[i][x][y][z].img) { game.maps[i][x][y][z] = clone(save.maps[i][x][y][z]);}
					else { game.maps[i][x][y][z] = save.maps[i][x][y][z]; }
				}
			}
		}
	}

	game.current_map = save.current_map;
	for (var m = 0; m < game.maps.length; m++) {
		game.entity[m] = [player];
		for (var i = 1; i < save.entity[m].length; i++) {
			game.entity[m][i] = clone(save.entity[m][i])
		}
	}
	game.ui = {type : 0};

	player.vie = save.vie;
	player.gold = save.gold;
	player.energie = save.energie;
	player.px = save.px;
	player.py = save.py;
	player.x = save.x;
	player.y = save.y;
	player.dir = save.dir;
	player.walk = clone(save.walk);
	player.sort = clone(save.sort);
	player.var = clone(save.var);
}
