function outro(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.drawImage(game.sprite[22],0,0,canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(0,0,100,0.8)';
  ctx.textAlign = 'center';
  ctx.font = window.innerHeight*0.080+ 'px KulminoituvaRegular';
  ctx.fillText(text.e10,window.innerWidth/2,window.innerHeight/6.4);

  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.font = window.innerHeight*0.030+ 'px KulminoituvaRegular';
  ctx.fillText(text.e1,window.innerWidth/2,window.innerHeight/3.8);
  ctx.fillText(text.e2,window.innerWidth/2,window.innerHeight/3.3);

  ctx.fillText(text.e3,window.innerWidth/2,window.innerHeight/2.3);
  ctx.fillText(text.e4,window.innerWidth/2,window.innerHeight/2.1);

  ctx.fillText(text.e5,window.innerWidth/2,window.innerHeight/1.7);
  ctx.fillText(text.e6,window.innerWidth/2,window.innerHeight/1.6);

  ctx.fillText("@_sam0411",window.innerWidth/2.86,window.innerHeight/1.07)

  ctx.fillText(text.e7,window.innerWidth/1.45,window.innerHeight/1.07)
  ctx.font = window.innerHeight*0.014+ 'px KulminoituvaRegular';
  ctx.fillText(text.e8,window.innerWidth/2,window.innerHeight/3);


  ctx.drawImage(game.sprite[60],canvas.width/2-canvas.height/5*2,canvas.height*0.7,canvas.height/5, canvas.height/5);
  ctx.drawImage(game.sprite[61],canvas.width/2+canvas.height/5*1.3,canvas.height*0.7,canvas.height/3.5, canvas.height/6);
  if (clic == 0) {
    if (mousey > canvas.height*0.7) {
      if (mousex < canvas.width/2) { window.location = "https://twitter.com/_sam0411"; } else { window.location = "https://sam-0411.github.io/totorotale/" }
    }
  }

}
