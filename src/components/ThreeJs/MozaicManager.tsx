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
  base64Texture: string;
  tileSize: number;
  padding: number;
}

const geometry = new BoxGeometry(1, 1, 0.2, 1, 1, 1);

const offset = 0;

const SCALE = 10

function MozaicManager({
  widthMozaic,
  heightMozaic,
  base64Texture,
  tileSize,
  padding
  }: MozaicManagerProps)
{
    const [texture, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
      base64Texture,
      '/plastic_0021/reduced/normal_1k.png',
      '/plastic_0021/reduced/roughness_1k.jpg',
      '/plastic_0021/reduced/ao_1k.jpg',
    ]);

    normalMap.repeat.set( widthMozaic/tileSize, heightMozaic/tileSize );
    normalMap.offset.set( offset, offset );
    normalMap.wrapS = RepeatWrapping;
    normalMap.wrapT = RepeatWrapping;

    roughnessMap.repeat.set( 1, 1 );
    roughnessMap.wrapS = RepeatWrapping;
    roughnessMap.wrapT = RepeatWrapping;

    aoMap.repeat.set( widthMozaic/tileSize, heightMozaic/tileSize );
    aoMap.offset.set( offset, offset );
    aoMap.wrapS = RepeatWrapping;
    aoMap.wrapT = RepeatWrapping;

  return (
    <mesh
      scale={[SCALE,SCALE * (heightMozaic/widthMozaic),2]}
      position={[0,0,0]}
      geometry={geometry}
      castShadow
    >
      <meshStandardMaterial attach="material-0" color="brown" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-1" color="red" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-2" color="green" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-3" color="purple" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-5" color="orange" />
      <meshStandardMaterial

          attach="material-4"
          color="#AAAAAA"
          map={texture}
          // debug map={normalMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          aoMap={aoMap}
      />
    </mesh>
    )
}

export default MozaicManager;