const navigator = window.navigator
navigator.getUserMedia = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia
const AudioContext = window.AudioContext ||
                      window.webkitAudioContext

const isSupport = !!(navigator.getUserMedia && AudioContext)
if(!isSupport){
  alert('请使用chrome或者火狐浏览器可体验声控功能!');
}
const context = isSupport && new AudioContext()
export default {
  isSupport,
  start () {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia({audio: true}, stream => {
        const source = context.createMediaStreamSource(stream)
        const analyser = context.createAnalyser()
        source.connect(analyser)
        analyser.fftSize = 2048
        resolve(analyser)
      }, () => {
        reject()
      })
    })
  },
  getVoiceSize (analyser) {
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(dataArray)
    const data = dataArray.slice(100, 1000)
    const sum = data.reduce((a, b) => a + b)
    return sum
  }
}
