import React, { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ContactShadows } from "@react-three/drei";
const MODEL_PATH = '/robot.glb';

const Model = ({ currentAction, loading }) => {
  const modelRef = useRef();
  const { scene, animations } = useGLTF(MODEL_PATH);
  const mixerRef = useRef();
  const actionsRef = useRef({});
  const activeActionRef = useRef();

useEffect(() => {
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((mat) => {
        if (mat.name === "Mat_Orange") {
          mat.map = null; // remove texture if any
          mat.color.set("rgb(61, 183, 240)"); // change to white
          mat.needsUpdate = true;
        }
        if (mat.name === "Mat_Black") {
          mat.map = null; // remove texture if any
          mat.color.set("black"); // change to white
          mat.needsUpdate = true;
        }
      });
    }
  });
}, [scene]);


  useEffect(() => {
    if (!scene || animations.length === 0) return;

    mixerRef.current = new THREE.AnimationMixer(scene);
    animations.forEach((clip) => {
      actionsRef.current[clip.name] = mixerRef.current.clipAction(clip);
    });

    activeActionRef.current = actionsRef.current.idle1 || actionsRef.current.idle;
    activeActionRef.current?.play();

    return () => {
      mixerRef.current?.stopAllAction();
      mixerRef.current?.uncacheRoot(scene);
    };
  }, [scene, animations]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);

    // Subtle breathing sway when thinking
    if (loading && modelRef.current) {
      modelRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  useEffect(() => {
    const nextAction = actionsRef.current[currentAction];
    const previousAction = activeActionRef.current;

    if (nextAction && previousAction !== nextAction) {
      activeActionRef.current = nextAction;

      if (previousAction) {
        previousAction.fadeOut(0.5);
      }

      nextAction
        .reset()
        .setEffectiveWeight(1)
        .setEffectiveTimeScale(loading ? 0.6 : 1) // Slow down when thinking
        .fadeIn(0.5)
        .play();
    }
  }, [currentAction, loading]);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={0.06}
      position={[0, -2.6, 0]}
      castShadow
    />
  );
};

const CharacterModel = ({ talking, background, wave, loading }) => {
  // const idleStates = ["idle1","idle2","idle5","idle6","idle7","idle8","idle9","idle10","idle11"];
    const idleStates = ["idle5"];

  const talkStates = ["talk1","talk2","talk3","talk4","talk5","talk6"];
  const waveState = ["idle5"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [repeatCount, setRepeatCount] = useState(0);

  const getRepeatLimit = () => Math.floor(Math.random() * 2) + 3;

  useEffect(() => {
    if (loading) return; // Freeze switching when thinking

    setRepeatCount(0);
    setCurrentIndex(0);

    const states = wave ? waveState : talking ? talkStates : idleStates;
    const randomIndex = Math.floor(Math.random() * states.length);
    setCurrentIndex(randomIndex);

    const interval = setInterval(() => {
      setRepeatCount((prev) => {
        if (prev < getRepeatLimit()) {
          return prev + 1;
        } else {
          const nextIndex = Math.floor(Math.random() * states.length);
          setCurrentIndex(nextIndex);
          return 0;
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [talking, wave, loading]);

  const action = loading
    ? "idle11"
    : wave
    ? waveState[0]
    : talking
    ? talkStates[currentIndex]
    : idleStates[currentIndex];

  return (
    <div className="w-full flex justify-center relative">
    
      <div className="w-full max-w-[100vw] h-[80vh] relative">
        <Canvas
          shadows
          camera={{ position: [0, 0.9, 8] }}
          gl={{ preserveDrawingBuffer: true }}
        >
          {/* Soft shadow plane */}
          {/* Visible Debug Platform */}
<ContactShadows
  position={[0, -2.35, 0]}
  opacity={0.65}     // softer
  scale={8}
  blur={1}           // more blur = less harsh
  far={5}
  color="#000000"
/>


          {/* Ambient lighting */}
          <ambientLight intensity={0.6} />

          {/* Directional */}
          <directionalLight
            position={[-2, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Subtle blue thinking rim light */}
          

          <Suspense
            fallback={
              <Html center>
                <span className="text-white text-lg">Loading...</span>
              </Html>
            }
          >
            <Model currentAction={action} loading={loading} />
          </Suspense>

          <OrbitControls enableRotate={false} enablePan={false} />
        </Canvas>

        {/* Thinking Callout */}
       {loading && (
  <div className="fixed top-120 left-45 z-100 animate-calloutIn">

  {/* Outer Glow Ring */}
  <div className="absolute inset-0 rounded-full blur-2xl animate-ping"
    style={{ background: 'rgba(14,180,141,0.25)' }}></div>

  {/* Main Bubble */}
  <div className="relative w-50 h-20 flex justify-center items-center 
    backdrop-blur-xl 
    px-6 py-3 
    rounded-full 
    border
    animate-[pulseScale_2s_ease-in-out_infinite]"
    style={{
      background: 'linear-gradient(135deg, #0eb48d, #0a9070)',
      boxShadow: '0 0 40px rgba(14,180,141,0.75), 0 0 80px rgba(249,115,22,0.15)',
      borderColor: 'rgba(14,180,141,0.5)'
    }}>

    <div className="flex items-center gap-2 text-white text-lg font-medium tracking-wide">
      Thinking
      <span className="flex gap-1">
        <span className="animate-bounce">.</span>
        <span className="animate-bounce [animation-delay:150ms]">.</span>
        <span className="animate-bounce [animation-delay:300ms]">.</span>
      </span>
    </div>

    {/* Callout Circles */}
    <div className="absolute -bottom-8 right-10 w-6 h-6 rounded-full border-2 animate-pulse"
      style={{
        background: '#0eb48d',
        borderColor: 'rgba(14,180,141,0.4)',
        boxShadow: '0 0 15px rgba(14,180,141,0.8)'
      }}></div>

    <div className="absolute -bottom-12 right-6 w-4 h-4 rounded-full border animate-pulse"
      style={{
        background: '#0eb48d',
        borderColor: 'rgba(14,180,141,0.4)',
        boxShadow: '0 0 12px rgba(14,180,141,0.7)'
      }}></div>

    <div className="absolute -bottom-16 right-2 w-2.5 h-2.5 rounded-full border animate-pulse"
      style={{
        background: '#0eb48d',
        borderColor: 'rgba(14,180,141,0.4)',
        boxShadow: '0 0 10px rgba(14,180,141,0.7)'
      }}></div>

  </div>
</div>
)}




        {/* Soft Pulse Ring Under Character */}
        

      </div>
    </div>
  );
};

export default CharacterModel;
