import { useRef, Suspense, useEffect, useState } from 'react';
import { useFullscreen } from "rooks";
import { Canvas} from '@react-three/fiber';
import Toggle from "../Toggle";
import { CameraControls, GizmoHelper, GizmoViewport, Stage, Grid, Bounds, Stats, Gltf, Text } from '@react-three/drei';
import FallBackLoader from "./FallBackLoader";
import MozaicManager from "./MozaicManager";
import GrassTerrain from "./GrassTerrain";
import MozaicInstanceMesh from "./MozaicInstanceMesh";
import { TileData } from "../Hooks/useMozaic";


interface ThreeJsRendererProps {
  widthMozaic: number;
  heightMozaic: number;
  base64Texture: string;
  tilesData: TileData[];
  padding: number;
  tileSize: number;
  backgroundColor: string;
  artistName: string;
}

const SCALE = 100;

function ThreejsRenderer({
  widthMozaic,
  heightMozaic,
  base64Texture,
  tilesData,
  padding,
  tileSize,
  backgroundColor,
  artistName
} : ThreeJsRendererProps ): React.ReactElement {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const {
    toggleFullscreen,
    isFullscreenEnabled
  } = useFullscreen({ target: canvasContainerRef });
  const [optimized, setOptimized] = useState<boolean>(true);
  const groupRef = useRef<Group>(null);
  const cameraRef = useRef<CameraControls>(null);

  useEffect(() => {
    recenter();
  },[base64Texture, cameraRef, groupRef])
  
  async function recenter() {
    if(!cameraRef.current || !cameraRef.current) {
      return;
    }
    await cameraRef.current.setPosition(50, 10, 50, true);
    await cameraRef.current.fitToBox(groupRef.current, true,
      { paddingLeft: 2, paddingRight: 2, paddingBottom: 2, paddingTop: 2 }
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full h-full">
      <Toggle
        label="Optimized"
        value={optimized}
        toggle={() => setOptimized(!optimized)}
      />
      <div ref={canvasContainerRef} className="w-full h-full max-h-[92%]">
        <Canvas
          camera={{ position: [60,0, 60], fov: 75, far: 200 }}
          dpr={window.devicePixelRatio}
          shadows
          onDoubleClick={() => {
            toggleFullscreen();
          }}
        >
          <color attach="background" args={['#A1E3F9']} />
          { import.meta.env.MODE === "development" ? <Stats/> : <></> }
          <ambientLight intensity={1.0} />
          <Suspense fallback={<FallBackLoader/>}>
            <Stage adjustCamera={false} intensity={1} shadows="contact" environment="city">
               
                <group ref={groupRef} position={[-4.5,30,0]} scale={1.5} rotation={[0,Math.PI/2, 0]}>
                  <MozaicManager
                      base64Texture={base64Texture}
                      widthMozaic={widthMozaic}
                      heightMozaic={heightMozaic}
                      tileSize={tileSize}
                      padding={padding}
                      visible={optimized}
                   /> 
                   <MozaicInstanceMesh
                      width={widthMozaic}
                      height={heightMozaic}
                      tileSize={tileSize}
                      padding={padding}
                      backgroundColor={backgroundColor}
                      tilesData={tilesData}
                      visible={!optimized}
                   />
                   <Text 
                      font={'/font.woff'}
                      color={0x000000}
                      fontSize={1.2}
                      letterSpacing={0}
                      anchorY="top"
                      anchorX="center"
                      lineHeight={0.8}
                      position={[0, -6, 0.4]}>
                      {artistName}
                    </Text>
                 </group>
               
                <group position={[0, 0.2, 15]} >
                  <Gltf src={"road.glb"} scale={1.25} position={[-25,0,0]}  rotation={[ 0, Math.PI/2, 0]}/>
                  <Gltf src={"road.glb"} scale={1.25} position={[-15,0,0]}  rotation={[ 0, Math.PI/2, 0]}/>
                  <Gltf src={"road.glb"} scale={1.25} position={[-5,0,0]}  rotation={[ 0, Math.PI/2, 0]}/>
                  <Gltf src={"road.glb"} scale={1.25} position={[5,0,0]}  rotation={[ 0, Math.PI/2, 0]}/>
                </group>

                <group position={[0, 0.2, 0]} >
                  <Gltf src={"road.glb"} scale={1.25} position={[15,0,-25]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={"road.glb"} scale={1.25} position={[15,0,-15]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={"road.glb"} scale={1.25} position={[15,0,-5]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={"road.glb"} scale={1.25} position={[15,0,5]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={"street-t.glb"} scale={1.25} position={[15,0,15]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={"road.glb"} scale={1.25} position={[15,0,25]}  rotation={[ 0, 0, 0]}/>
                </group>

                <Gltf src={"buildings/skyscraper.glb"} scale={[8.5,10, 16.5]} position={[-10,0.2,0]}  rotation={[ 0, -Math.PI, 0]}/>
                <Gltf src={"buildings/skyscraper2.glb"} scale={[8.5,8.5, 16.5]} position={[-22,0.2,0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"buildings/large-building3.glb"} scale={[8.5,8.5, 16.5]} position={[3,0.2,0]}  rotation={[ 0, -Math.PI, 0]}/>
                <Gltf src={"buildings/large-building3.glb"} scale={8.5} position={[-20,0.2,-22]}  rotation={[ 0, -Math.PI/2, 0]}/>
                <Gltf src={"buildings/large-building.glb"} scale={8.5} position={[-20,0.2,24]}  rotation={[ 0, -Math.PI/2, 0]}/>
                

                <Gltf src={"patch-of-grass.glb"} scale={10} position={[-8, 0, -19]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"patch-of-grass.glb"} scale={10} position={[-8, 0, -25]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"patch-of-grass.glb"} scale={10} position={[-1, 0, -19]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"patch-of-grass.glb"} scale={10} position={[-1, 0, -25]}  rotation={[ 0, 0, 0]}/>

                <Gltf src={"trees/tree.glb"} scale={1.5} position={[-5, 0, -14]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"trees/tree2.glb"} scale={1.5} position={[6, 0, -14]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"trees/tree3.glb"} scale={1.5} position={[6, 0, -20]}  rotation={[ 0, Math.PI/2, 0]}/>
                <Gltf src={"trees/tree2.glb"} scale={1.5} position={[6, 0, -26]}  rotation={[ 0, Math.PI/4, 0]}/>

                <Gltf src={"field.glb"} scale={0.05} position={[-5, 0, 25]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"table.glb"} scale={2} position={[25, 0, -25]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"tent.glb"} scale={4} position={[22, 0, -22]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"rock-flat.glb"} scale={3} position={[26, 0, -19]}  rotation={[ 0, Math.PI/2, 0]}/>
                <Gltf src={"fence.glb"} scale={3} position={[20, 0, -19]}  rotation={[ 0, Math.PI/2, 0]}/>
                <Gltf src={"fence.glb"} scale={3} position={[20, 0, -20]}  rotation={[ 0, Math.PI/2, 0]}/>
                <Gltf src={"fence.glb"} scale={3} position={[20, 0, -21]}  rotation={[ 0, Math.PI/2, 0]}/>
                <Gltf src={"fence.glb"} scale={3} position={[20, 0, -22]}  rotation={[ 0, Math.PI/2, 0]}/>
                <Gltf src={"fence.glb"} scale={3} position={[20, 0, -23]}  rotation={[ 0, Math.PI/2, 0]}/>
                <Gltf src={"fence.glb"} scale={3} position={[20, 0, -24]}  rotation={[ 0, Math.PI/2, 0]}/>

                <Gltf src={"trees/tree.glb"} scale={1.25}  position={[24, 0, 25]}  rotation={[ 0, -Math.PI/4, 0]}/>
                <Gltf src={"trees/tree3.glb"} scale={1}  position={[24, 0, 20]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"trees/tree.glb"} scale={1}  position={[24, 0, 15]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"trees/tree.glb"} scale={1.25}  position={[24, 0, 10]}  rotation={[ 0, -Math.PI/4, 0]}/>
                <Gltf src={"trees/tree.glb"} scale={1.25}  position={[24, 0, 5]}  rotation={[ 0, -Math.PI/4, 0]}/>
                <Gltf src={"trees/tree.glb"} scale={1.25}  position={[24, 0, 0]}  rotation={[ 0, -Math.PI/4, 0]}/>
                

                <GrassTerrain />
               {/*<Grid args={[60, 60]} position={[0,0,0]} cellColor='white' />*/}
            </Stage>
          </Suspense>
          <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>
          <CameraControls
            makeDefault
            maxDistance={80}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 1.9}
            minAzimuthAngle={0.5}
            maxAzimuthAngle={1.9}
            ref={cameraRef}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default ThreejsRenderer;