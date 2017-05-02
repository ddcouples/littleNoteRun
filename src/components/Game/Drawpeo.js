function Drawpeo(ctx,w,h){
	this.ctx=ctx;
	this.w=w;
	this.h=h;
	this.x;
	this.y;
	this.floorLen=30;
	this.offset=50;//偏移
	this.timer=0;
	this.bgCount=0;
	this.speed=0.5;
	this.peoImgs=[];
	this.recH=0;
	this.reH1=this.recH+this.h/5*2;this.reH2=this.recH+this.h/5*4;
     for (var i = 0; i < 5; i++) {
       var img=new Image();
       img.src=require('./imgs/'+(i+1)+'.png');
       this.peoImgs.push(img);
     }	
}
function rndi2(m, n) {
	var a = Math.random() * (n - m) + m;
	return Math.floor(a);
}
Drawpeo.prototype.init=function(s,x,y,delay){
     var _minH=this.w>this.h?this.h:this.w;
	 this.s=s;
	 this.x=x;
	 this.y=y;
	 this.x=this.x<0?0:this.x;
	 this.y=this.y<0?0:this.y;

	 this.timer+=delay*this.speed;
	 if(this.timer>50){
	 	this.timer%=50;
        this.bgCount=(this.bgCount+1)%3;
	 }
	 this.recH+=1;
    	 this.reH1+=1;
    	 this.reH2+=1;
}
Drawpeo.prototype.draw=function(){
	 

	 var ctx=this.ctx;
	 var _r=this._r;
	 (_r<0)&&(_r=0);

     ctx.save();
     ctx.fillStyle = "#ccc";
     
     if(this.recH>this.h){
     	this.recH=-this.h/5;
     } 
     if(this.reH1>this.h){
     	this.reH1=-this.h/5;
     } 
     if(this.reH2>this.h){
     	this.reH2=-this.h/5;
     }              
     ctx.fillRect(this.w/2-this.w/60,this.recH, this.w/30,this.h/5);
     ctx.fillRect(this.w/2-this.w/60,this.reH1, this.w/30,this.h/5);
     ctx.fillRect(this.w/2-this.w/60,this.reH2, this.w/30,this.h/5);
	ctx.restore();       

	 //绘制白色半圆的代码如下：
     ctx.save();
     ctx.translate(this.x,this.y);
     
     switch(this.s) {
     	case 1:
           this.ctx.drawImage(this.peoImgs[this.bgCount],-this.peoImgs[this.bgCount].width/2,-this.peoImgs[this.bgCount].height/2);
     		break;
     	case 0:
           this.ctx.drawImage(this.peoImgs[0],-this.peoImgs[this.bgCount].width/2,-this.peoImgs[this.bgCount].height/2);
     		break;
        case 2:
           this.speed*=1.1;
           this.ctx.drawImage(this.peoImgs[this.bgCount],-this.peoImgs[this.bgCount].width/2,-this.peoImgs[this.bgCount].height/2);
     		break;
         case 3:
           this.bgCount=(this.bgCount+1)%2;
           this.ctx.drawImage(this.peoImgs[this.bgCount+3],-this.peoImgs[this.bgCount].width/2,-this.peoImgs[this.bgCount].height/2);
     	break;      	     	
     }
     ctx.restore();

           

    
     

 //左边吊绳
     ctx.save();
     ctx.strokeStyle = "#ddd";
     ctx.strokeRect(this.offset,0,this.w/30,this.h);
     ctx.beginPath();
     ctx.lineWidth=1;
     for (var i = 0; i < this.floorLen; i++) {

        let s_x=this.w/30+this.offset,s2=this.h/this.floorLen*(i);
     	ctx.moveTo(s_x,s2);
     	ctx.lineTo(this.offset,s2+20);
     }
    ctx.stroke();
	ctx.restore();  

//右边边吊绳
     ctx.save();
     ctx.strokeStyle = "#ddd";

     ctx.strokeRect((this.w-this.offset-this.w/30),0,this.w/30,this.h);
     ctx.beginPath();
     ctx.lineWidth=1;
     for (var i = 0; i < this.floorLen; i++) {

        let s_x=this.w-this.offset,s2=this.h/this.floorLen*(i);
     	ctx.moveTo(s_x,s2);
     	ctx.lineTo(s_x-this.w/30,s2+20);
     }
    ctx.stroke();
	ctx.restore(); 	

    ctx.save();
     ctx.fillStyle = "#000";
     ctx.fillRect(0,this.y+this.peoImgs[this.bgCount].height/2, this.w,6);
     // ctx.fillRect(10, 10, 100, 100);
     ctx.beginPath();
     ctx.lineWidth=2;
     ctx.moveTo(0,this.y+this.peoImgs[this.bgCount].height/2);
     for (var i = 0; i < this.floorLen; i++) {
     	let s_y,_deltaH=this.h-6-(this.y+this.peoImgs[this.bgCount].height/2);
     	if(i%2){
     		s_y=this.h-_deltaH;
     	}else{
     		s_y=this.h+_deltaH;
     	}
        let s1=this.w/this.floorLen*(i);
     	ctx.lineTo(s1,s_y);
     }
    ctx.fillRect(0,this.h-6, this.w,6);
    ctx.stroke();
	ctx.restore();  

           	  
			
}


export default Drawpeo;