import { useMemo, useEffect, useRef } from "react";
import { Box } from '@react-three/drei';
import { Object3D, InstancedMesh, BoxGeometry, MeshStandardMaterial, Color } from 'three';
import Tile from "./Tile";

interface MozaicManagerProps {
  widthMozaic: number;
  heightMozaic: number;
  widthTile: number;
  heightTile: number;
  padding: number
  backgroundColor: string;
  tilesData: TileData[];
}

const SCALE = 100;

function MozaicManager({
  widthMozaic,
  heightMozaic,
  widthTile,
  heightTile,
  padding,
  backgroundColor,
  tilesData}: MozaicManagerProps)
{
    const meshRef = useRef<InstancedMesh>(null);
    const geometry = useMemo(() => new BoxGeometry(widthTile, heightTile, 20), [widthTile, heightTile]);
    const material = useMemo(() => {
        return new MeshStandardMaterial({
            color: "#FFFFFF",
            emissive:"#212121",
            roughness:0.478,
            metalness:0.122
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
      const object = new Object3D();
      const colorThree = new Color(color);
      object.position.set(x, -y, 0.1);
      object.updateMatrix();
      meshRef.current?.setColorAt(index, colorThree);
      meshRef.current?.setMatrixAt(index, object.matrix);
    })

    meshRef.current!.instanceMatrix.needsUpdate = true;
  }


    return (
    <group scale={1/SCALE} position={[-widthMozaic/2/SCALE,heightMozaic/SCALE,0]}>
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

export default MozaicManager;