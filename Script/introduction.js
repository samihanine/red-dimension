var current = 0;

function intro(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (game.audio[13].currentTime == 0) {
    game.audio[13].play();
    game.audio[13].volume = 0.65;
  }
  ctx.textAlign = 'center';
  ctx.drawImage(game.sprite[54],0,0,window.innerWidth,window.innerHeight);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  var w = window.innerWidth/10;
  var h = window.innerHeight/15;
  ctx.font = window.innerHeight*0.040+ 'px KulminoituvaRegular';
  if (current !== 5) {
    ctx.fillStyle = 'black'
    ctx.fillText(text.passer,window.innerWidth*0.8-w/1.5,window.innerHeight-h*1.3);
    ctx.strokeRect(window.innerWidth*0.8-w/2-w/1.5,window.innerHeight-h*2,w,h);
  }

  ctx.fillStyle = 'black';
  ctx.fillRect(window.innerWidth*0.8-w/2+w/1.5,window.innerHeight-h*2,w,h);
  ctx.fillStyle = 'white';
  if (this.current != 5) { ctx.fillText(text.suivant,window.innerWidth*0.8+w/1.5,window.innerHeight-h*1.3); } else {
    ctx.fillText(text.jouer,window.innerWidth*0.8+w/1.5,window.innerHeight-h*1.3);
  }

  if (mousey > window.innerHeight-h*2.25 && mousey < window.innerHeight-h*1.25 && clic == 0) {
    if (mousex > window.innerWidth*0.8-w*1.15 && mousex < window.innerWidth*0.8-w*0.15 && current !== 5) {
      game.state = 2;
      game.audio[13].muted = true;
    }

    if (mousex > window.innerWidth*0.8-w/2+w/1.5 && mousex < window.innerWidth*0.8-w/2+w/1.5+w) {
      if (current !== 5) { current+=1; } else {
        game.state = 2;
        game.audio[13].muted = true;
      }
    }
  }

  // ---

  ctx.fillStyle = 'black'
  ctx.font = window.innerWidth/40 + 'px Arial';
  ctx.textAlign = 'center';

  switch (current) {
    case 0:
    	 ctx.fillText(text.i1,window.innerWidth/2,window.innerHeight/2.2);
       var img = false;
    break;
    case 1:
        ctx.fillText(text.i2,window.innerWidth/2,window.innerHeight/1.5);
        ctx.fillText(text.i3,window.innerWidth/2,window.innerHeight/1.35);

        var img = 55;
      break;
      case 2:
        ctx.fillText(text.i4,window.innerWidth/2,window.innerHeight/1.5);
        ctx.fillText(text.i4b,window.innerWidth/2,window.innerHeight/1.35);

        var img = 56;
      break;
      case 3:
        ctx.fillText(text.i5,window.innerWidth/2,window.innerHeight/1.5);
        ctx.fillText(text.i6,window.innerWidth/2,window.innerHeight/1.35);

        var img = 57;
      break;
      case 4:
        ctx.fillText(text.i7,window.innerWidth/2,window.innerHeight/1.5);
        ctx.fillText(text.i8,window.innerWidth/2,window.innerHeight/1.35);

        var img = 59;
      break;
      case 5:
        ctx.fillText(text.i9,window.innerWidth/2,window.innerHeight/1.5);
        ctx.fillText(text.i10,window.innerWidth/2,window.innerHeight/1.35);

        var img = 58;
      break;
  }

  var t = window.innerHeight/2.5;
  ctx.filter = 'opacity(80%)'
  if (img) ctx.drawImage(game.sprite[img],window.innerWidth/2-t/2,window.innerHeight/9,t,t);
  ctx.filter = 'none'
  clic = -1;

}
