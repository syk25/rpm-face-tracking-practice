import { useEffect } from 'react';
import './App.css';

let video: HTMLVideoElement;

function App() {
  /*  */
  const handleOnChange = () => {

  }

    /* 비디오 설정 */
  const setup = () => {
    video = document.getElementById('video') as HTMLVideoElement;
    navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 }
    }).then((stream) => {
      video.srcObject = stream;
    })
  }

  /*  */
  useEffect(() => {
    setup();
  }, [])


  return (
    <div className="App">
      <input type="text" placeholder='Enter your RPM avatar URL' onChange={handleOnChange}/>
      <video autoPlay id='video' />
    </div>
  );
}

export default App;
