import React from 'react';
class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      isBegin:this.props.isBegin,
      bgColor:'#0094ff',
      text:'小音符快跑',
      score:0
    };
    this.start=this.start.bind(this);
  }

  start() {
    var newState = !this.state.isBegin;
    this.setState({
      isBegin: true,
      bgColor:'transparent',
      score:0
    });
    // 这里要注意：setState 是一个异步方法，所以需要操作缓存的当前值
    this.props.callbackParent(newState);
  }
   componentWillReceiveProps(nextProps) {
        if(nextProps.isBegin.toString()!=this.state.isBegin.toString()){
          this.setState({isBegin: nextProps.isBegin,text:'被💩砸啦！',score:nextProps.Store});
          document.title='我躲过了好多萌粑粑,得了'+nextProps.Store+'分,来超过我呀!(小音符快跑)';
        }
        
        
        var that=this;
        if(!nextProps.isBegin){
          var a=setTimeout(function(){
             clearTimeout(a);
             that.setState({bgColor: '#0094ff',text:'小音符快跑'});
          },1000)          
        }
        
    }
  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    var width = this.props.width,
        height = this.props.height,
        showButton=this.state.bgColor=='#0094ff';
    return (
      <div className="start" style={{display:!this.state.isBegin?'block':'none',
         width:width,height:height,background :this.state.bgColor
       }}>
        <h1>{this.state.text}</h1>
        <div>分数:{this.state.score}</div>
        <button style={{opacity:showButton?'1':'0'}} onClick={this.start}>别被💩砸</button>
      </div>
    );
  }
}
export default Start;