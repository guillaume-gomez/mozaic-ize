import { useRef, Suspense, useEffect, useState } from 'react';
import { useFullscreen } from "rooks";
import { Group } from "three";
import { Canvas } from '@react-three/fiber';
import Toggle from "../Toggle";
import { 
  animated, 
  useSpring,
} from '@react-spring/three';
import { GizmoHelper, GizmoViewport, Stage, Grid, Stats, Gltf, Text } from '@react-three/drei';
import FallBackLoader from "./FallBackLoader";
import MozaicManager from "./MozaicManager";
import GrassTerrain from "./GrassTerrain";
import MozaicInstanceMesh from "./MozaicInstanceMesh";
import { TileData } from "../Hooks/useMozaic";
import CustomCameraControls, { ExternalActionInterface } from "./CustomCameraControls";

const AnimatedGltf = animated(Gltf);

const { BASE_URL, MODE } = import.meta.env;


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

const DEPTH_MAIN_BUILDING = 19.5

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
  } = useFullscreen({ target: canvasContainerRef });
  const [optimized, /* setOptimized */] = useState<boolean>(true);
  const groupRef = useRef<Group|null>(null);
  const cameraControlsRef = useRef<ExternalActionInterface| null>(null);
  
  const propsTaxi = useSpring({
    from: { z: -30, visible: false },
    to: [
      { z: -30, visible: true },
      { z: 30, visible: true},
      { z: 60, visible: false},
    ],
    config: {
      duration: 4500,
    },
    loop: true
  });

  const propsTruck = useSpring({
    from: { z: 60, visible: false },
    to: [
      { z: 30, visible: false},
      { z: 10, visible: true},
      { z: -30, visible: true},
      { z: -31, visible: false},
    ],
    config: {
      duration: 4000,
    },
    loop: true
  });


  useEffect(() => {
    if(cameraControlsRef.current && groupRef.current ) {
      cameraControlsRef.current.recenter(groupRef.current);
    }
  },[base64Texture, groupRef])
  


  function computeMozaicScale() {
    const maxRatio = 1.9 // empirical value
    const expectedRatio = 17 // same

    const ratio = widthMozaic > heightMozaic ? widthMozaic/widthMozaic : widthMozaic/heightMozaic
    
    return ratio*maxRatio*expectedRatio/DEPTH_MAIN_BUILDING;
  }


  return (
    <div className="flex flex-col gap-5 w-full h-full">
      {/*<Toggle
        label="Optimized"
        value={optimized}
        toggle={() => setOptimized(!optimized)}
      />*/}
      <div ref={canvasContainerRef} 
        className="hover:cursor-grabbing w-full h-full /*bg-secondary*/ bg-gradient-to-b from-sky-100 to-sky-500  rounded-xl"
      >
        <Canvas
          camera={{ position: [50,10, 20], fov: 75, far: 200 }}
          dpr={window.devicePixelRatio}
          shadows
          onDoubleClick={() => {
            toggleFullscreen();
          }}
        >
          
          { import.meta.env.MODE === "development" ? <Stats/> : <></> }
          <ambientLight intensity={1.0} />
            <Stage adjustCamera={false} intensity={1} shadows="contact" environment="city">
               
                <group ref={groupRef} position={[-4.5,30,0]} scale={computeMozaicScale()} rotation={[0,Math.PI/2, 0]}>
                  {base64Texture &&
                      <MozaicManager
                        base64Texture={base64Texture}
                        widthMozaic={widthMozaic}
                        heightMozaic={heightMozaic}
                        tileSize={tileSize}
                        visible={optimized}
                      />
                   } 
                   {tilesData.length > 0 &&
                      <MozaicInstanceMesh
                        width={widthMozaic}
                        height={heightMozaic}
                        tileSize={tileSize}
                        padding={padding}
                        backgroundColor={backgroundColor}
                        tilesData={tilesData}
                        visible={!optimized}
                      />
                    }
                 </group>
                
                <Suspense fallback={<FallBackLoader/>}>
                  {
                    (base64Texture || tilesData.length > 0) && <Text
                      font={`${BASE_URL}/fonts/good-bakwan.woff`}
                      color={0x000000}
                      fontSize={1.2}
                      letterSpacing={0}
                      anchorY="top"
                      anchorX="center"
                      lineHeight={0.8}
                      rotation={[0,Math.PI/2,0]}
                      position={[-4, 21, 0]}>
                      {artistName}
                    </Text>
                  }
                  
                  <Gltf src={`${BASE_URL}/buildings/skyscraper.glb`} scale={[8.5,10, 16.5]} position={[-10,0.2,0]}  rotation={[ 0, -Math.PI, 0]}/>
                 
                  <group position={[0, 0.2, 15]} >
                    <Gltf src={`${BASE_URL}/road.glb`} scale={1.25} position={[-25,0,0]}  rotation={[ 0, Math.PI/2, 0]}/>
                    <Gltf src={`${BASE_URL}/road.glb`} scale={1.25} position={[-15,0,0]}  rotation={[ 0, Math.PI/2, 0]}/>
                    <Gltf src={`${BASE_URL}/road.glb`} scale={1.25} position={[-5,0,0]}  rotation={[ 0, Math.PI/2, 0]}/>
                    <Gltf src={`${BASE_URL}/road.glb`} scale={1.25} position={[5,0,0]}  rotation={[ 0, Math.PI/2, 0]}/>
                  </group>

                  <group position={[0, 0.2, 0]} >
                    <Gltf src={`${BASE_URL}/road.glb`} scale={1.25} position={[15,0,-25]}  rotation={[ 0, 0, 0]}/>
                    <Gltf src={`${BASE_URL}/road.glb`} scale={1.25} position={[15,0,-15]}  rotation={[ 0, 0, 0]}/>
                    <Gltf src={`${BASE_URL}/road.glb`} scale={1.25} position={[15,0,-5]}  rotation={[ 0, 0, 0]}/>
                    <Gltf src={`${BASE_URL}/road.glb`} scale={1.25} position={[15,0,5]}  rotation={[ 0, 0, 0]}/>
                    <Gltf src={`${BASE_URL}/street-t.glb`} scale={1.25} position={[15,0,15]}  rotation={[ 0, 0, 0]}/>
                    <Gltf src={`${BASE_URL}/road.glb`} scale={1.25} position={[15,0,25]}  rotation={[ 0, 0, 0]}/>
                  </group>

                  <Gltf src={`${BASE_URL}/buildings/skyscraper2.glb`} scale={[8.5,8.5, 16.5]} position={[-22,0.2,0]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={`${BASE_URL}/buildings/large-building3.glb`} scale={[8.5,8.5, 16.5]} position={[3,0.2,0]}  rotation={[ 0, -Math.PI, 0]}/>
                  <Gltf src={`${BASE_URL}/buildings/large-building3.glb`} scale={8.5} position={[-20,0.2,-22]}  rotation={[ 0, -Math.PI/2, 0]}/>
                  <Gltf src={`${BASE_URL}/buildings/large-building.glb`} scale={8.5} position={[-20,0.2,24]}  rotation={[ 0, -Math.PI/2, 0]}/>
                  

                  <Gltf src={`${BASE_URL}/patch-of-grass.glb`} scale={10} position={[-8, 0, -19]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={`${BASE_URL}/patch-of-grass.glb`} scale={10} position={[-8, 0, -25]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={`${BASE_URL}/patch-of-grass.glb`} scale={10} position={[-1, 0, -19]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={`${BASE_URL}/patch-of-grass.glb`} scale={10} position={[-1, 0, -25]}  rotation={[ 0, 0, 0]}/>

                  <Gltf src={`${BASE_URL}/trees/tree.glb`} scale={1.5} position={[-5, 0, -14]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={`${BASE_URL}/trees/tree2.glb`} scale={1.5} position={[6, 0, -14]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={`${BASE_URL}/trees/tree3.glb`} scale={1.5} position={[6, 0, -20]}  rotation={[ 0, Math.PI/2, 0]}/>
                  <Gltf src={`${BASE_URL}/trees/tree2.glb`} scale={1.5} position={[6, 0, -26]}  rotation={[ 0, Math.PI/4, 0]}/>

                  <Gltf src={`${BASE_URL}/field.glb`} scale={0.05} position={[-5, 0, 25]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={`${BASE_URL}/table.glb`} scale={2} position={[25, 0, -25]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={`${BASE_URL}/tent.glb`} scale={4} position={[22, 0, -22]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={`${BASE_URL}/rock-flat.glb`} scale={3} position={[26, 0, -19]}  rotation={[ 0, Math.PI/2, 0]}/>
                  <Gltf src={`${BASE_URL}/fence.glb`} scale={3} position={[20, 0, -19]}  rotation={[ 0, Math.PI/2, 0]}/>
                  <Gltf src={`${BASE_URL}/fence.glb`} scale={3} position={[20, 0, -20]}  rotation={[ 0, Math.PI/2, 0]}/>
                  <Gltf src={`${BASE_URL}/fence.glb`} scale={3} position={[20, 0, -21]}  rotation={[ 0, Math.PI/2, 0]}/>
                  <Gltf src={`${BASE_URL}/fence.glb`} scale={3} position={[20, 0, -22]}  rotation={[ 0, Math.PI/2, 0]}/>
                  <Gltf src={`${BASE_URL}/fence.glb`} scale={3} position={[20, 0, -23]}  rotation={[ 0, Math.PI/2, 0]}/>
                  <Gltf src={`${BASE_URL}/fence.glb`} scale={3} position={[20, 0, -24]}  rotation={[ 0, Math.PI/2, 0]}/>

                  <Gltf src={`${BASE_URL}/trees/tree.glb`} scale={1.25}  position={[24, 0, 1]}  rotation={[ 0, -Math.PI/2, 0]}/>
                  <Gltf src={`${BASE_URL}/trees/tree2.glb`} scale={1.25}  position={[27, 0, 5]}  rotation={[ 0, -Math.PI/6, 0]}/>
                  <Gltf src={`${BASE_URL}/trees/tree.glb`} scale={1.25}  position={[23, 0, 10]}  rotation={[ 0, -Math.PI/4, 0]}/>
                  <Gltf src={`${BASE_URL}/trees/tree2.glb`} scale={1}  position={[28, 0, 11]}  rotation={[ 0, -Math.PI/4, 0]}/>
                  <Gltf src={`${BASE_URL}/trees/tree3.glb`} scale={0.85}  position={[23, 0, 15]}  rotation={[ 0, Math.PI, 0]}/>
                  <Gltf src={`${BASE_URL}/trees/tree2.glb`} scale={1}  position={[27, 0, 15]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={`${BASE_URL}/trees/tree3.glb`} scale={1}  position={[24, 0, 20]}  rotation={[ 0, 0, 0]}/>
                  <Gltf src={`${BASE_URL}/trees/tree.glb`} scale={1}  position={[28, 0, 22]}  rotation={[ 0, -Math.PI/3, 0]}/>
                  <Gltf src={`${BASE_URL}/trees/tree.glb`} scale={1.25}  position={[24, 0, 25]}  rotation={[ 0, -Math.PI/3, 0]}/>
                  
                  <Gltf src={`${BASE_URL}/wheel.glb`} scale={5}  position={[24, 6, -9]}  rotation={[ 0, -Math.PI/2, 0]}/>

                  <animated.group
                      visible={propsTaxi.visible}
                      >
                      <AnimatedGltf
                        src={`${BASE_URL}/cars/taxi.glb`}
                        scale={0.5}
                        position-x={13}
                        position-y={0}
                        position-z={propsTaxi.z}
                        rotation={[ 0, 0, 0]}
                        />
                     </animated.group>

                    <animated.group
                      visible={propsTruck.visible}
                      >
                      <AnimatedGltf
                        src={`${BASE_URL}/cars/truck.glb`}
                        scale={0.015}
                        position-x={17}
                        position-y={0}
                        position-z={propsTruck.z}
                        rotation={[ 0, -Math.PI/2, 0]}
                        />
                    </animated.group>

                    <GrassTerrain />
                  

                  { MODE === "development" &&
                    <Grid args={[60, 60]} position={[0,0,0]} cellColor='white' />
                  }
              </Suspense>
            </Stage>
          <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>
          <CustomCameraControls
            ref={cameraControlsRef}
            speed={2.5}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default ThreejsRenderer;