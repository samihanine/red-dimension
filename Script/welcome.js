function welcome(){
	ctx.fillStyle = 'black'
  ctx.font = 1 + 'px Arial';
  ctx.textAlign = 'center';
  ctx.fillText("x",window.innerWidth,window.innerHeight/2.2);

	if (canvas.width != window.innerWidth || canvas.height != window.innerHeight) window.location.reload();

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var w = window.innerWidth*0.15;
	var h = window.innerWidth*0.075;

	// interface jouer
	ctx.drawImage(game.sprite[22],0,0,window.innerWidth/2,window.innerHeight)
	ctx.lineWidth = 2;
	ctx.fillStyle = 'rgba(0,0,0,0.1)'
	ctx.fillRect(window.innerWidth/4-w/2,window.innerHeight/2-h/2,w,h);
	if (mousex > window.innerWidth/2) {
		ctx.fillStyle = 'rgba(0,0,0,0.2)';
		ctx.fillRect(0,0,window.innerWidth/2,window.innerHeight)
		ctx.fillStyle = 'rgba(60,60,60,1)';
		ctx.strokeStyle = 'rgba(60,60,60,1)';
	 } else {
		ctx.strokeStyle = 'black'; ctx.fillStyle = 'black';
		if (clic == 0 && mousex > window.innerWidth/4-w/2 && mousex < window.innerWidth/4+w/2 && mousey > window.innerHeight/2-h/2 && mousey < window.innerHeight/2+h/2) game.state = 3;
	};
	ctx.strokeRect(window.innerWidth/4-w/2,window.innerHeight/2-h/2,w,h)
	ctx.lineWidth = 1;
	ctx.font = window.innerWidth/30 + 'px KulminoituvaRegular';
	ctx.textAlign = 'center';
	ctx.fillText(text.jouer,window.innerWidth/4,window.innerHeight/2+window.innerWidth/30/3)


	// interface options
	ctx.drawImage(game.sprite[53],window.innerWidth/2,0,window.innerWidth/2,window.innerHeight)
	ctx.lineWidth = 2;
	ctx.fillStyle = 'rgba(0,0,0,0.3)'
	ctx.fillRect(window.innerWidth*(3/4)-w/2,game.option.aff-h/2,w,h);
	if (mousex < window.innerWidth/2) {
		ctx.fillStyle = 'rgba(0,0,0,0.3)';
		ctx.fillRect(window.innerWidth/2,0,window.innerWidth/2,window.innerHeight)
		ctx.fillStyle = 'rgba(180,180,180,1)'; ctx.strokeStyle = 'rgba(180,180,180,1)';
	} else {
		ctx.fillStyle = 'white'; ctx.strokeStyle = 'white';
		if (clic == 0 && mousex > window.innerWidth*(3/4)-w/2 && mousex < window.innerWidth*(3/4)+w/2 && mousey > game.option.aff-h/2 && mousey < game.option.aff+h/2) {
			if (game.option.aff >= window.innerHeight/2) game.option.aff = game.option.aff-1;
		}
	}
	ctx.strokeRect(window.innerWidth*(3/4)-w/2,game.option.aff-h/2,w,h);
	ctx.lineWidth = 1;
	ctx.font = window.innerWidth/30 + 'px KulminoituvaRegular';
	ctx.textAlign = 'center';
	ctx.fillText(text.option,window.innerWidth*(3/4),game.option.aff+window.innerWidth/30/3)

	if (game.option.aff < window.innerHeight/2) { option(); }
	clic = -1;
}

var settings = [
	{ id : 'music', x : window.innerWidth*0.91, y : window.innerHeight*0.35, state : false},
	{ id : 'son', x : window.innerWidth*0.91, y : window.innerHeight*0.41, state : false},

	{ id : 'haut', x : window.innerWidth*0.71, y : window.innerHeight*0.585, state : 'Z'},
	{ id : 'bas', x : window.innerWidth*0.71, y : window.innerHeight*0.645, state : 'S'},
	{ id : 'gauche', x : window.innerWidth*0.91, y : window.innerHeight*0.585, state : 'Q'},
	{ id : 'droite', x : window.innerWidth*0.91, y : window.innerHeight*0.645, state : 'D'},

	{ id : 'int', x : window.innerWidth*0.71, y : window.innerHeight*0.705, state : '↳'},
	{ id : 'tp', x : window.innerWidth*0.91, y : window.innerHeight*0.706, state : '└┘'},

	{ id : 'fr', x : window.innerWidth*0.71, y : window.innerHeight*0.893, state : true},
	{ id : 'eng', x : window.innerWidth*0.91, y : window.innerHeight*0.893, state : false},
]

function option(){

	if (game.option.aff > window.innerHeight/7) { game.option.aff -= 10; return; }

	// ----
	var t = window.innerHeight*0.035;

	for (var i = 0; i < settings.length; i++) {
		ctx.fillRect(settings[i].x,settings[i].y,t,t);

		if (mousex > settings[i].x && mousex < settings[i].x+t && mousey > settings[i].y && mousey < settings[i].y+t && clic == 0) {
			if (settings[i].id == 'music') {
					settings[i].state = !settings[i].state;
					game.audio[0].muted = settings[i].state;
					game.audio[13].muted = settings[i].state;
			}
			if (settings[i].id == 'son') {
				settings[i].state = !settings[i].state;
				for (var j = 1; j < game.audio.length-1; j++) {
					game.audio[j].muted = settings[i].state;
				}
			}
			if (settings[i].id == 'eng') {
				settings[i].state = true;
				settings[i-1].state = false;
				languages('eng');
			}
			if (settings[i].id == 'fr') {
				settings[i].state = true;
				settings[i+1].state = false;
				languages('fr');
			}
		}
	}

	// ----
	ctx.font = window.innerHeight*0.05 + 'px KulminoituvaRegular';
	ctx.textAlign = 'left';
	ctx.fillText(text.audio,window.innerWidth*0.53,window.innerHeight*0.3)
	ctx.fillRect(window.innerWidth*0.53,window.innerHeight*0.31,window.innerWidth*0.43,2)

	ctx.font = window.innerHeight*0.03 + 'px KulminoituvaRegular';
	ctx.fillText(text.music,window.innerWidth*0.55,window.innerHeight*0.38);
	ctx.fillText(text.son,window.innerWidth*0.55,window.innerHeight*0.44);

	// ----
	ctx.font = window.innerHeight*0.05 + 'px KulminoituvaRegular';
	ctx.fillText(text.controle,window.innerWidth*0.53,window.innerHeight*0.54)
	ctx.fillRect(window.innerWidth*0.53,window.innerHeight*0.55,window.innerWidth*0.43,2)

	ctx.font = window.innerHeight*0.03 + 'px KulminoituvaRegular';
	ctx.fillText(text.haut,window.innerWidth*0.55,window.innerHeight*0.615);
	ctx.fillText(text.bas,window.innerWidth*0.55,window.innerHeight*0.675);
	ctx.fillText(text.interagir,window.innerWidth*0.55,window.innerHeight*0.735);

	ctx.fillText(text.gauche,window.innerWidth*0.78,window.innerHeight*0.615);
	ctx.fillText(text.droite,window.innerWidth*0.78,window.innerHeight*0.675);
	ctx.fillText(text.teleport,window.innerWidth*0.78,window.innerHeight*0.735);

	// ----
	ctx.font = window.innerHeight*0.05 + 'px KulminoituvaRegular';
	ctx.fillText(text.langues,window.innerWidth*0.53,window.innerHeight*0.83)
	ctx.fillRect(window.innerWidth*0.53,window.innerHeight*0.845,window.innerWidth*0.43,2)

	ctx.font = window.innerHeight*0.03 + 'px KulminoituvaRegular';
	ctx.fillText(text.fr,window.innerWidth*0.55,window.innerHeight*0.92);
	ctx.fillText(text.eng,window.innerWidth*0.78,window.innerHeight*0.92);

	ctx.fillStyle = 'black';
	ctx.font = window.innerHeight*0.03 + 'px KulminoituvaRegular';
	ctx.textAlign = 'center';

	for (var i = 0; i < settings.length; i++) {
		if (settings[i].state == true) {
			ctx.fillText("✔",settings[i].x+window.innerHeight*0.018,settings[i].y+window.innerHeight*0.03);
		} else if (settings[i].state == '└┘') {
			ctx.fillText(settings[i].state,settings[i].x+window.innerHeight*0.018,settings[i].y+window.innerHeight*0.035);
		} else if (settings[i].state != false) {
			ctx.fillText(settings[i].state,settings[i].x+window.innerHeight*0.018,settings[i].y+window.innerHeight*0.03);
		}
	}

}
