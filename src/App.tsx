import { useEffect } from 'react';
import './App.css';
import { Canvas, useFrame, useGraph } from '@react-three/fiber';
import { Color, Euler, Matrix4 } from 'three';
import { useGLTF } from '@react-three/drei';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

/* 타입지정 */
let video: HTMLVideoElement;
let faceLandmarker: FaceLandmarker;
let lastVideoTime = -1;
let headMesh: any;
let rotation: Euler;

function App() {
  /*  */
  const handleOnChange = () => {

  }



  /* 비디오 설정 */
  const setup = async () => {
    const vision = await FilesetResolver.forVisionTasks(

      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    faceLandmarker = await FaceLandmarker.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true,
        runningMode: "VIDEO"
      });
    video = document.getElementById('video') as HTMLVideoElement;
    navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 }
    }).then((stream) => {
      video.srcObject = stream;
      video.addEventListener('loadeddata', predict)
    })
  }

  const predict = () => {
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
      lastVideoTime = video.currentTime;
      const result = faceLandmarker.detectForVideo(video, startTimeMs);
      if (result.facialTransformationMatrixes && result.facialTransformationMatrixes.length > 0) {
        const matrix = new Matrix4().fromArray(result.facialTransformationMatrixes[0].data);
        rotation = new Euler().setFromRotationMatrix(matrix);
      }
    }
    requestAnimationFrame(predict);
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
  const avatar = useGLTF("https://models.readyplayer.me/6682c315649e11cdd6dd8a8a.glb?morphTargets=ARKit&textureAtlas=1024")
  const { nodes } = useGraph(avatar.scene)
  useEffect(() => {
    headMesh = nodes.Wolf3D_Avatar
  }, [nodes])

  useFrame((_, delta) => {
    nodes.Head.rotation.set(rotation.x / 3, rotation.y / 3, rotation.z / 3);
    nodes.Neck.rotation.set(rotation.x / 3, rotation.y / 3, rotation.z / 3);
    nodes.Spine1.rotation.set(rotation.x / 3, rotation.y / 3, rotation.z / 3);
  })

  return <primitive object={avatar.scene} position={[0, -1.65, 4]} />
}

export default App;
