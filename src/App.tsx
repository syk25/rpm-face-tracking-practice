import { useEffect } from 'react';
import './App.css';
import { Canvas, useGraph } from '@react-three/fiber';
import { Color } from 'three';
import { useGLTF } from '@react-three/drei';

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
      <input type="text" placeholder='Enter your RPM avatar URL' onChange={handleOnChange} />
      <video autoPlay id='video' />
      <Canvas style={{
        backgroundColor: 'purple',
        height: 400,
      }}
      camera={{
        fov: 25
      }}>

        <ambientLight intensity={0.5} />
        <pointLight position={[1, 1, 1]} color={new Color(1, 0, 0)} intensity={0.5} />
        <pointLight position={[-1, 0, 1]} color={new Color(0, 1, 0)} intensity={0.5} />

        <Avatar />
      </Canvas>

    </div>
  );
}

/* 아바타 컴포넌트 */
function Avatar() {
  const avatar = useGLTF("https://models.readyplayer.me/6682c315649e11cdd6dd8a8a.glb?morphTargets=ARKit")
  const { nodes } = useGraph(avatar.scene)
  return <primitive object={avatar.scene} position={[0, -1.65, 4]} />
}

export default App;
