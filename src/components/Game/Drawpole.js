function Drawpole(ctx,w,h){
	this.ctx=ctx;
	this.w=w;
	this.h=h;
	this.x;
	this.y;
	this.degree=0;
}
function rndi2(m, n) {
	var a = Math.random() * (n - m) + m;
	return Math.floor(a);
}
Drawpole.prototype.init=function(v,x,y){
     var _minH=this.w>this.h?this.h:this.w;
	 this._r=v;
	 if(this._r>_minH/6){
	 	this._r=_minH/6;
	 }
	 this.x=x;
	 this.y=y;
	 this.x=this.x<0?0:this.x;
	 this.y=this.y<0?0:this.y;
}
Drawpole.prototype.draw=function(){
	 
	 var ctx=this.ctx;
	 var _r=this._r;
	 (_r<0)&&(_r=0);
	 //绘制白色半圆的代码如下：
     ctx.save();
     ctx.translate(this.x,this.y);
     this.degree+=3
     ctx.rotate((this.degree)*Math.PI/180);
     ctx.translate(-this.x,-this.y);//将画布原点移动
	 ctx.beginPath();
	 ctx.arc(this.x,this.y,_r,1.5*Math.PI,Math.PI/2,false);
	 ctx.fillStyle="#eee";
	 ctx.closePath();
	 ctx.fill();
	 
	 //绘制黑色半圆的代码如下：
	 ctx.beginPath();
	 ctx.arc(this.x,this.y,_r,Math.PI/2,1.5*Math.PI,false);
	 ctx.fillStyle="black";
	 ctx.closePath();
	 ctx.fill();
	 
	 //绘制黑色小圆
	 ctx.beginPath();
	 ctx.arc(this.x,this.y+_r/2,_r/2,0,Math.PI*2,true);
	 ctx.fillStyle="black";
	 ctx.closePath();
	 ctx.fill();
	 
	 //绘制白色小圆
	 ctx.beginPath();
	 ctx.arc(this.x,this.y-_r/2,_r/2,0,Math.PI*2,true);
	 ctx.fillStyle="#eee";
	 ctx.closePath();
	 ctx.fill();
	 
	 //绘制白色小圆心
	 ctx.beginPath();
	 ctx.arc(this.x,this.y-_r/2,_r/16,0,Math.PI*2,true);
	 ctx.fillStyle="black";
	 ctx.closePath();
	 ctx.fill();
	 
	  //绘制黑色小圆心
	 ctx.beginPath();
	 ctx.arc(this.x,this.y+_r/2,_r/16,0,Math.PI*2,true);
	 ctx.fillStyle="#eee";
	 ctx.closePath();
	 ctx.fill();
	 
	 //绘制文字代码如下：
	 
	 
	 
	 ctx.restore();
}


export default Drawpole;