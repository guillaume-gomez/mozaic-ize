import { useMemo, useEffect, useRef } from "react";
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useLoader } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import { Object3D, InstancedMesh, BoxGeometry, MeshStandardMaterial, Color } from 'three';
import Tile from "./Tile";
import { rgbToHex } from "../../utils";

interface MozaicInstanceMeshProps {
  width: number;
  height: number;
  tile: number;
  padding: number
  backgroundColor: string;
  tilesData: TileData[];
}

const SCALE = 100;

function MozaicInstanceMesh({
  width,
  height,
  tile,
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
    const geometry = useMemo(() => new BoxGeometry(tile, tile, 20), [tile, tile]);
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

  useEffect(() => {
    init();
  }, [tilesData,  meshRef.current]);


  function init() {
    if(!meshRef.current) {
        console.log("not loaded")
    }
    tilesData.map(({x, y, color}, index) => {
      const { red, green, blue } = color;
      const object = new Object3D();
      const colorThree = new Color(rgbToHex(red, green, blue));
      object.position.set(x, -y, 0.1);
      object.updateMatrix();
      meshRef.current?.setColorAt(index, colorThree);
      meshRef.current?.setMatrixAt(index, object.matrix);
    })

    meshRef.current!.instanceMatrix.needsUpdate = true;
  }


    return (
    <group scale={1/SCALE} position={[-width/2/SCALE,height/SCALE,0]}>
      {/*<Box args={[widthMozaic, heightMozaic, 10]} material-color={backgroundColor} />*/}
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