import { useMemo, useEffect, useRef } from "react";
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useLoader } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import { Object3D, InstancedMesh, BoxGeometry, MeshStandardMaterial, Color } from 'three';
import Tile from "./Tile";
import { useSpring, useSpringRef, easings} from '@react-spring/web';
import { rgbToHex } from "../../utils";

interface MozaicInstanceMeshProps {
  width: number;
  height: number;
  tileSize: number;
  padding: number
  backgroundColor: string;
  tilesData: TileData[];
}

const SCALE = 100;
const TRANSITION_DURATION = 2000; //ms
const DELAY_DURATION = 5000; //ms


function MozaicInstanceMesh({
  width,
  height,
  tileSize,
  padding,
  backgroundColor,
  tilesData}: MozaicInstanceMeshProps)
{
    const [displacementMap, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
      '/plastic_0021/reduced/height_1k.png',
      '/plastic_0021/reduced/normal_1k.png',
      '/plastic_0021/reduced/roughness_1k.jpg',
      '/plastic_0021/reduced/ao_1k.jpg',
    ]);
    const meshRef = useRef<InstancedMesh>(null);
    const geometry = useMemo(() => new BoxGeometry(tileSize - padding, tileSize - padding, tileSize - padding), [tileSize, padding]);
    const material = useMemo(() => {
        return new MeshStandardMaterial({
            //color: "#FFFFFF",
            displacementScale: 0,
            displacementMap,
            normalMap,
            roughnessMap,
            aoMap
        });
    },[]);

  const springApi = useSpringRef();
    useSpring({
        ref: springApi,
        from: { ratio: 0 },
        to: { ratio: 1 },
        delay: DELAY_DURATION,
        config: {
          duration: TRANSITION_DURATION,
          easing: easings.easeOutElastic
        },
        reset: true,
        onChange: ({value: {ratio}}) => {
          renderFramePosition(ratio)
        }
      },
    );

  useEffect(() => {
    init();
    springApi.stop();
    springApi.start();
  }, [tilesData,  meshRef.current]);


  function init() {
    if(!meshRef.current) {
        console.log("not loaded")
    }
    tilesData.map(({x, y, color}, index) => {
      const { red, green, blue } = color;
      const object = new Object3D();
      const colorThree = new Color(rgbToHex(red, green, blue));
      //finale position -> object.position.set(x, -y, 0.1);
      object.position.set(x, -y, -1000);
      object.updateMatrix();
      meshRef.current?.setColorAt(index, colorThree);
      meshRef.current?.setMatrixAt(index, object.matrix);
    })

    meshRef.current!.instanceMatrix.needsUpdate = true;
  }


  function renderFramePosition(ratio: number) {
    if(!meshRef.current) {
        console.log("not loaded")
    }
    tilesData.map(({x, y, color}, index) => {
      const { red, green, blue } = color;
      const object = new Object3D();
      const colorThree = new Color(rgbToHex(red, green, blue));
      object.position.set(x * ratio, -y * ratio, 0.1);
      object.updateMatrix();
      meshRef.current?.setColorAt(index, colorThree);
      meshRef.current?.setMatrixAt(index, object.matrix);
    })

    meshRef.current!.instanceMatrix.needsUpdate = true;
  }


  return (
    <group
      scale={1/SCALE}
      position={[-width/2/SCALE,height/2/SCALE,0]}
    >
      <Box
        args={[width, height, tileSize/4]}
        material-color={backgroundColor}
        position={[width/2-padding,-height/2 + padding,0]}
      />
      <instancedMesh
          receiveShadow={true}
          castShadow={true}
          ref={meshRef}
          args={[geometry, material, tilesData.length ]}
        />
    </group>
  )
}

export default MozaicInstanceMesh;