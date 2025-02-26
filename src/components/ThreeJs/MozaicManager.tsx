import { useMemo, useEffect, useRef } from "react";
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useLoader } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import { Object3D, InstancedMesh, BoxGeometry, MeshStandardMaterial, Color, Vector2, RepeatWrapping } from 'three';
import Tile from "./Tile";
import { rgbToHex } from "../../utils";

interface MozaicManagerProps {
  widthMozaic: number;
  heightMozaic: number;
  base64Texture
}

const geometry = new BoxGeometry(1, 1, 0.1);

const split = 64
const offset = 0.125

function MozaicManager({
  widthMozaic,
  heightMozaic,
  base64Texture
  }: MozaicManagerProps)
{
    const [texture, displacementMap, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
      base64Texture,
      '/plastic_0021/reduced/height_1k.png',
      '/plastic_0021/reduced/normal_1k.png',
      '/plastic_0021/reduced/roughness_1k.jpg',
      '/plastic_0021/reduced/ao_1k.jpg',
    ]);

    normalMap.repeat.set( split, split );
    normalMap.offset.set( offset, offset );
    normalMap.wrapS = RepeatWrapping;
    normalMap.wrapT = RepeatWrapping;

    displacementMap.repeat.set( split, split );
    displacementMap.offset.set( offset, offset );
    displacementMap.wrapS = RepeatWrapping;
    displacementMap.wrapT = RepeatWrapping;

    roughnessMap.repeat.set( 1, 1 );
    roughnessMap.wrapS = RepeatWrapping;
    roughnessMap.wrapT = RepeatWrapping;

    aoMap.repeat.set( split, split );
    aoMap.offset.set( offset, offset );
    aoMap.wrapS = RepeatWrapping;
    aoMap.wrapT = RepeatWrapping;

  return (
    <mesh
      scale={1}
      position={[0,0,0]}
      geometry={geometry}
      castShadow
    >
      <meshStandardMaterial
         //attach="material-4"
         //color="red"
         map={texture}
         displacementScale={0}
         displacementMap={displacementMap}
         normalMap={normalMap}
         roughnessMap={roughnessMap}
         aoMap={aoMap}
      />
    </mesh>
    )
}

export default MozaicManager;