import { useLoader } from '@react-three/fiber';
import { BoxGeometry, RepeatWrapping, TextureLoader } from 'three';

const { BASE_URL } = import.meta.env;

interface MozaicManagerProps {
  widthMozaic: number;
  heightMozaic: number;
  base64Texture: string;
  tileSize: number;
  visible: boolean;
}

const geometry = new BoxGeometry(1, 1, 0.2, 1, 1, 1);

const offset = 0;

const SCALE = 10

function MozaicManager({
  widthMozaic,
  heightMozaic,
  base64Texture,
  tileSize,
  visible
  }: MozaicManagerProps)
{
    const [texture, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
      base64Texture,
      `${BASE_URL}/plastic_0021/reduced/normal_1k.png`,
      `${BASE_URL}/plastic_0021/reduced/roughness_1k.jpg`,
      `${BASE_URL}/plastic_0021/reduced/ao_1k.jpg`,
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
      visible={visible}
    >
      <meshStandardMaterial attach="material-0" color="black" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-1" color="black" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-2" color="black" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-3" color="black" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-5" color="black" />
      <meshStandardMaterial

          attach="material-4"
          color="#FFFFFF"
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