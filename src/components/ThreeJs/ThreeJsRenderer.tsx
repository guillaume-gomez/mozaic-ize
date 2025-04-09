import { useRef, Suspense, useEffect } from 'react';
import { useFullscreen } from "rooks";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport, Stage, Grid, Bounds, Stats } from '@react-three/drei';
import FallBackLoader from "./FallBackLoader";
import MozaicManager from "./MozaicManager";
import MozaicInstanceMesh from "./MozaicInstanceMesh";
import { TileData } from "../Hooks/useMozaic";

interface ThreeJsRendererProps {
  widthMozaic: number;
  heightMozaic: number;
  base64Texture: string;
  tilesData: TileData[];
}

const SCALE = 100;

function ThreejsRenderer({
  widthMozaic,
  heightMozaic,
  base64Texture,
  tilesData
} : ThreeJsRendererProps ): React.ReactElement {
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
        camera={{ position: [0,0, 1.5], fov: 75, far: 50 }}
        dpr={window.devicePixelRatio}
        shadows
        onDoubleClick={() => {
          toggleFullscreen();
         // recenter();
        }}
      >
        <color attach="background" args={['#06092c']} />
        { import.meta.env.MODE === "development" ? <Stats/> : <></> }
        <ambientLight intensity={1.0} />
        <Suspense fallback={<FallBackLoader/>}>
          <Stage  adjustCamera={false} intensity={1} shadows="contact" environment="city">
             <MozaicManager
                base64Texture={base64Texture}
                widthMozaic={widthMozaic}
                heightMozaic={heightMozaic}
             />
             <MozaicInstanceMesh
                width={widthMozaic}
                height={heightMozaic}
                tile={32}
                padding={0}
                backgroundColor={"red"}
                tilesData={tilesData}
             />
             <Grid args={[50, 50]} position={[0,0,0]} cellColor='white' />
          </Stage>
        </Suspense>
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
        <OrbitControls makeDefault maxDistance={20} />
      </Canvas>
    </div>
  );
}

export default ThreejsRenderer;