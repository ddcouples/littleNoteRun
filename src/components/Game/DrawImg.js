function DrawImg(ctx,img){
   this.ctx=ctx;
   this.img=img;
   this.x;
   this.y;
}
DrawImg.prototype.init=function(){
   
}
DrawImg.prototype.draw=function(x,y){
  this.ctx.drawImage(this.img, x, y, this.img.width, this.img.height);
}

export default DrawImg;