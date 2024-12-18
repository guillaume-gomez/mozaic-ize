import { useRef, Suspense, useEffect } from 'react';
import { useFullscreen } from "rooks";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport, Stage, Grid, Bounds, Box } from '@react-three/drei';
import FallBackLoader from "./FallBackLoader";
import Tile from "./Tile";

interface ThreeJsRendererProps {
  widthMozaic: number;
  heightMozaic: number;
  widthTile: number;
  heightTile: number;
  padding: number
  backgroundColor: string;
}

interface TileData {
  color: Color;
  x: number;
  y: number;
}


function generateRandomData() {
  TileData
}

const SCALE = 100;

function ThreejsRenderer({
  widthMozaic,
  heightMozaic,
  widthTile,
  heightTile,
  padding,
  backgroundColor
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
        camera={{ position: [0,0.75, 1.5], fov: 75, far: 50 }}
        dpr={window.devicePixelRatio}
        shadows
        onDoubleClick={() => {
          toggleFullscreen();
         // recenter();
        }}
      >
        <color attach="background" args={['#06092c']} />
        <Suspense fallback={<FallBackLoader/>}>
          <Stage preset="rembrandt" adjustCamera={false} intensity={0.5} environment="studio">
             <group scale={1/SCALE}>
              <Box args={[widthMozaic, heightMozaic, 0.2]} material-color={backgroundColor} />
              <Tile x={1} y={1} width={widthTile} heightTile={heightTile} color="purple" />
             </group>
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