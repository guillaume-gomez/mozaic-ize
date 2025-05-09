import { useMemo, useEffect, useRef } from "react";
import { useLoader } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import { Object3D, InstancedMesh, BoxGeometry, MeshStandardMaterial, Color,TextureLoader } from 'three';
import { useSpringRef, easings, useTrail} from '@react-spring/web';
import { rgbToHex } from "../../utils";
import { TileData } from "../Hooks/useMozaic";

const { BASE_URL } = import.meta.env;

interface MozaicInstanceMeshProps {
  width: number;
  height: number;
  tileSize: number;
  padding: number
  backgroundColor: string;
  tilesData: TileData[];
  visible: boolean;
}

const SCALE = 100;

const TRANSITION_DURATION = 90; //ms
const DELAY_DURATION = 1000; //ms


function MozaicInstanceMesh({
  width,
  height,
  tileSize,
  padding,
  backgroundColor,
  visible,
  tilesData
  }: MozaicInstanceMeshProps)
{
    const [displacementMap, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
      `${BASE_URL}/plastic_0021/reduced/height_1k.png`,
      `${BASE_URL}/plastic_0021/reduced/normal_1k.png`,
      `${BASE_URL}/plastic_0021/reduced/roughness_1k.jpg`,
      `${BASE_URL}/plastic_0021/reduced/ao_1k.jpg`,
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
    useTrail(tilesData.length, (index) => ({
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
          if(!meshRef.current) {
            return;
          }
          renderTileSizePosition(index, ratio)
        }
      }) 
    );

  useEffect(() => {
    if(visible) {
      if(meshRef.current) {
        init();
        springApi.stop();
        springApi.start();
        
      }
    } else if(meshRef.current) {
      meshRef.current.dispose();
    }
  }, [tilesData, meshRef.current, visible]);


  function init() {
    if(!meshRef.current) {
        console.log("not loaded")
        return;
    }
    tilesData.map(({x, y, color}, index) => {
      const { red, green, blue } = color;
      const object = new Object3D();
      const colorThree = new Color(rgbToHex(red, green, blue));
      //finale position -> object.position.set(x, -y, 0.1);
      object.position.set(x, -y, 100);
      object.updateMatrix();
      meshRef.current?.setColorAt(index, colorThree);
      meshRef.current?.setMatrixAt(index, object.matrix);
    })

    if(meshRef.current && meshRef.current.instanceMatrix) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }


  function renderTileSizePosition(index: number, ratio: number) {
    if(!meshRef.current) {
        console.log("not loaded")
        return;
    }
    const { x, y } = tilesData[index];
    const object = new Object3D();
    object.position.set(x, -y,  0.1 + (1.0 - ratio) * 100);
    object.updateMatrix();
    meshRef.current?.setMatrixAt(index, object.matrix);
    
    if(meshRef.current && meshRef.current.instanceMatrix) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }


  return (
    <group
      visible={visible}
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