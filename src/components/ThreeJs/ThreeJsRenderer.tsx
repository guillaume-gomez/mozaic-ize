import { useRef, Suspense, useEffect } from 'react';
import { useFullscreen } from "rooks";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport, Stage, Grid, Bounds } from '@react-three/drei';
import FallBackLoader from "./FallBackLoader";

interface ThreeJsRendererProps {
}

const SCALE = 1000;

function ThreejsRenderer({} : ThreeJsRendererProps ): React.ReactElement {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const {
    toggleFullscreen,
    isFullscreenEnabled
  } = useFullscreen({ target: canvasContainerRef });

  function handleGenerate() {

  }

  return (
    <div ref={canvasContainerRef} className="w-full h-full max-h-[92%]">
      <div className={`self-start relative ${isFullscreenEnabled ? "" : "hidden"}`}>
        <button onClick={handleGenerate} className="btn btn-outline absolute z-10 top-6 left-1">
          Generate
        </button>
      </div>
      <Canvas
        camera={{ position: [0,0.75, 1.5], fov: 75, far: 5 }}
        dpr={window.devicePixelRatio}
        shadows
        onDoubleClick={() => {
          toggleFullscreen();
          recenter();
        }}
      >
        <color attach="background" args={['#06092c']} />
        <Suspense fallback={<FallBackLoader/>}>
          <Stage preset="rembrandt" adjustCamera={false} intensity={0.5} environment="studio">
             <Grid args={[50, 50]} position={[0,0,0]} cellColor='white' />
          </Stage>
        </Suspense>
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
        <OrbitControls makeDefault maxDistance={5} />
      </Canvas>
    </div>
  );
}

export default ThreejsRenderer;