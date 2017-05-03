import React from 'react';
import AudioAPI from '../../js/AudioAPI';
import Tools from '../../js/Tools';

import Start  from './Start'
import Drawpeo  from './Drawpeo'

import DrawImg from './DrawImg';
import GameCss from './game.css';
import WXShare from '../../js/WXShare'
WXShare();
let analyser;
const states={
	    WIDTH: document.body.offsetWidth?document.body.offsetWidth:document.documentElement.clientWidth,
      HEIGHT: document.body.offsetHeight?document.body.offsetHeight:document.documentElement.clientHeight,
      maxVoice:6,//声音的灵敏度
      deltaTime:10,
      pole_x:0,
      pole_y:0,
      places:[],
      voiceContainer:0,
      loc_p:1,
      speed:0,
      wayLen:100,//粑粑的个数
      img:[],
      imgStates:[],
      moveLen:0,//画布的位移
      maxTop:0,
      peoState:0, //0静止 1run  2 加速 3跳
      wxImg:[]
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    states.wxImg[0]=new Image();
    states.wxImg[0].src=require('./imgs/wx.jpg');
    states.wxImg[1]=new Image();
    states.wxImg[1].src=require('./imgs/zfb.jpg');    
    this.state={
       start:false,
       voiceSize: 0,
       sensitivity: 1000,
       voice:0,
       score:0,
       move:'translateY(0)',
       wxImg:states.wxImg[0],
       palyTimes:0,
       choicePayMet:0
    };
    console.log(this.state.wxImg);
    this.onStart = this.onStart.bind(this);
    this.gameloop=this.gameloop.bind(this);
    this.voiceChanged=this.voiceChanged.bind(this);
  }
  onStart(newState) {
    // Explicitly focus the text input using the raw DOM API
    this.state.score=0;
    states.speed=0.2;
    this.state.palyTimes+=1;
    this.setState({
      start: true,
      voice:states.minWH/6,
      score:0
    });
    if(!states.peoImg){
      this.oneInit();
    }
    if(!analyser&&AudioAPI.isSupport) {
        AudioAPI.start().then(a => {
          analyser = a
          this.gameStart()
        })
        
      } else{
        this.gameStart()
      }

  }
  oneInit(){
    states.ctxFront=this.canvasFront.getContext('2d');
    // states.bgImg=new Image();
    // states.bgImg.src=require('./imgs/bg.jpg');
     states.peoImg=new Drawpeo(states.ctxFront,states.WIDTH-40,states.HEIGHT-140);
  }
   init(){
    
    // states.canvasBack=this.canvasBack.getContext('2d');
    states.canWIDTH = this.canvasFront.width,states.canHEIGHT = this.canvasFront.height;
    states.minWH=states.canWIDTH>states.canHEIGHT?states.canHEIGHT:states.canWIDTH;     
    this.setState({
      voice:states.minWH/6,
    })
    states.moveLen=0;
    // states.Drawpole=new Drawpole(states.ctxFront,states.WIDTH-40,states.HEIGHT-140);
         
    for(var i=0;i<2;i++){
      var _p=states.canWIDTH/4*(2*i+1);
      states.places.push(_p);
    }
  }  
   voice () {
      return parseInt(this.state.voiceSize / this.state.sensitivity)
    }  
   gameStart () {
      //this.startGetVoiceSize()
      this.game();
   }
   //添加触屏端访问
   touch(e){
     this.moveForward();
     if(e.targetTouches[0].clientX>states.WIDTH/2){
      console.log('right');
      this.stopDefault();
      e.stopPropagation();
        this.locChange();
        states.isTouch=true
      return false;
     }
     else{
      console.log('left');
      if(!states.isTouch){ 
        states.isTouch=true;
      }
     }
   }
   touchEnd(){
      states.isTouch=false;
   }
   //判断小人位置X方向的方法
   get_pole_x(){
        if(states.loc_p==0)states.pole_x+=states.deltaTime*0.5;
        if(states.loc_p==1)states.pole_x-=states.deltaTime*0.5;
        if(states.pole_x>states.places[1]){
           states.pole_x=states.places[1];
           states.peoState=0;
        }
        if(states.pole_x<states.places[0]){
           states.pole_x=states.places[0];
           states.peoState=0;
        }    
       
        states.pole_y=states.canHEIGHT-states.minWH/6;     
   }
   //小人的前进
   moveForward(){
          var _v=this.state.voice+states.deltaTime*0.01;
          states.speed=states.speed+states.deltaTime*0.0001;
          this.setState({
                voice:_v
           })
          if(states.peoState!=3)states.peoState=1;    
   }
   //小人没有了前进的动能
   moveBack(){
         var _v=this.state.voice-states.deltaTime*0.03;
         states.speed=states.speed-states.deltaTime*0.0002;
          this.setState({
                voice:_v
           })
          if(states.peoState!=3)states.peoState=0;     
   }
   //交换位置
   locChange(){
           states.peoState=3;
           states.loc_p=(states.loc_p+1)%2;
           states.speed=states.speed+0.02;    
   }
   //速度判断
   speedChange(){
        
        if(states.speed>0.5){
            states.speed=0.5;
         } 
         if(states.speed<-0.02){
            states.speed=-0.02;
         }            
   }
    //判断声音达到标准 即可以 套圈    
   voiceChanged () {
         
         var _voice=this.voice();
              
        if (_voice > states.maxVoice*2) {
          var _v=this.state.voice+states.deltaTime*0.02;
          this.setState({
                voice:_v
           })
          if(states.peoState!=3){
            states.peoState=2;
          }
          
        } 
        if(_voice > states.maxVoice){
          this.moveForward()
        }else{
          this.moveBack()
        }
        states.voiceContainer+=states.deltaTime;       
        if(_voice > states.maxVoice*10&&states.voiceContainer>this.state.sensitivity){
           
           states.voiceContainer=0;
           this.locChange()
           
        }        
        this.speedChange();
                  
    }

   
   game() {
     states.lastTime=Date.now();
     states.deltaTime=0;
     this.init();
     if(states.imgStates.length==0){
      this.startImgInit();
     }
     this.gameloop();
   }
  

   gameloop(){
     states.loopid=requestAnimationFrame(this.gameloop);
     states.now=Date.now();
     states.deltaTime=states.now-states.lastTime;
     states.lastTime=states.now;
     if(AudioAPI.isSupport){
       const voiceSize = AudioAPI.getVoiceSize(analyser)
        this.setState({
          voiceSize:voiceSize
        })     
       this.voiceChanged() 
     }
     this.collision() 
     this.get_pole_x();
     if(states.isTouch){
       this.moveForward()
     }
     this.drawCanvas(); 
   }

   drawCanvas(){
          states.ctxFront.clearRect(0, 0, states.canWIDTH, states.canHEIGHT);
          // states.ctxFront.drawImage(states.bgImg,0,0,states.bgImg.width,states.bgImg.height);
          // states.Drawpole.init(this.state.voice,states.pole_x,states.pole_y);
          // states.Drawpole.draw(); 
          states.peoImg.init(states.peoState,states.pole_x,states.pole_y,states.deltaTime,states.speed);
          states.peoImg.draw();  
          this.imgMove();    
   }
   //碰撞检测
   collision(){
    for (var i = 0; i < states.imgStates.length; i++) {
      var relative_O_y=states.imgStates[i].top+states.moveLen+states.imgStates[i].height/2,
          relative_O_x=states.imgStates[i].left+states.imgStates[i].width/2;

      if(relative_O_y>0&&relative_O_y<states.canHEIGHT){
        //this.state.voice,states.pole_x,states.pole_y
        if(Tools.distance(relative_O_x, relative_O_y, states.pole_x, states.pole_y,states.peoImg.peoImgs[0].width/2)){
            this.setState({
                start:false,
                voice:states.minWH/6
             })
             this.stopGameloop()  
        }
      }
    }
   }

   stopGameloop(){
     cancelAnimationFrame(states.loopid);
     clearTimeout(states.loopid);
   }


  startImgInit(){
    var _img=[];
    var a=[1,2,3];

    for (var i = 0; i < states.wayLen; i++) {
      var _obj={};
      _obj.width=Tools.rndi2((states.WIDTH-40)/8,(states.WIDTH-40)/4);
      _obj.height=_obj.width/4*3;
      _obj.top=-states.HEIGHT/2*(i);
      var _i=Math.random()>0.5?1:0;
      _obj.left=states.places[_i]-_obj.width/2;
      var _bgIndex=a[Math.floor(Math.random()*a.length)],imgClass;
      switch(_bgIndex) {
        case 1:
         imgClass=GameCss.img;
          break;
        case 2:
          imgClass=GameCss.imgwin;
          break;
        case 3:
          imgClass=GameCss.imgyun;
          break;          
      }
      
      states.imgStates.push(_obj);
      const _dom=(
             <div key={i} className={`${GameCss.img_body} ${imgClass}`}
                  style={{width:_obj.width,top:_obj.top,left:_obj.left,height:_obj.height}}></div>        
        );
      states.maxTop=states.HEIGHT/2*(states.wayLen+1);
      _img.push(_dom);
    }
    states.img=_img;
    // console.log(states.imgStates);
  }
  imgMove(){
    states.moveLen=states.moveLen+states.deltaTime*states.speed;
    var _score=this.state.score+(states.deltaTime*states.speed*0.005);
    this.setState({
      move:'translateY('+states.moveLen+'px)',
      score:parseFloat(_score.toFixed(2))
    })
    if(states.moveLen>states.maxTop){
      states.moveLen=0;
      states.speed=states.speed*1.2;
    }
  }
  noMove(e){
    this.stopDefault(e)
  }
  stopDefault(e){
     
     if (event.cancelable) {
    // 判断默认行为是否已经被禁用
      if (!event.defaultPrevented) {
         event.preventDefault();
      }
     }   
    
  }
  closePay(){
    this.setState({
      palyTimes:0
    })
  }
  choicePay(e){
    this.setState({
      choicePayMet:e,
      wxImg:states.wxImg[e]
    })
    this.stopDefault(e);
  }
//GameCss({"modale":true,"class2":true})
  render() {
    return (
	  <div className={GameCss.container} style={{height:states.HEIGHT}} onTouchMove={this.noMove.bind(this)}>
        <Start isBegin={this.state.start} callbackParent={this.onStart} width={states.WIDTH}
              Store={this.state.score}
              height={states.HEIGHT}/>
        <div className={this.state.palyTimes>3?'modale swing':'modale'} style={{top:states.HEIGHT/4,left:states.WIDTH/4,height:states.HEIGHT/2,width:states.WIDTH/2,display:this.state.palyTimes>3?"block":"none"}}>
           <h1>您的支持</h1>
               <h2>是我的不懈动力!</h2>
           <div className="close" onClick={this.closePay.bind(this)}>&times;</div>
           <div className="content">
              <span className={this.state.choicePayMet==0?'active':''} onClick={this.choicePay.bind(this,0)}>微信</span>
              <span className={this.state.choicePayMet==1?'active':''} onClick={this.choicePay.bind(this,1)}>支付宝</span>
           </div>
           <img src={this.state.wxImg.src} width={states.WIDTH/2}/>
        </div>
        <div className="info" onClick={this.stopGameloop}>发出声音(点击左侧)控制前进,大声(点击右侧)可换左右！
             <h3><span>得分:</span><br/><span className="score">{this.state.score}</span></h3>
        </div>
        <canvas ref={(canvasFront) => { this.canvasFront=canvasFront;}} onTouchStart={this.touch.bind(this)}
              onTouchEnd={this.touchEnd.bind(this)}
              width={states.WIDTH - 40}
              height={states.HEIGHT - 140}></canvas>
        <div className="img_container" ref={(canvasBack) => { this.canvasBack=canvasBack;}}
             style={{height:states.HEIGHT -140,width:states.WIDTH-40,transform:this.state.move}}>
            {states.img}
        </div>
	  </div>	
     )
  }
}

export default Game;