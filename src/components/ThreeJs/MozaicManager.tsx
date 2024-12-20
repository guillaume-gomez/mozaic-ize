import { useMemo } from "react";
import { Box } from '@react-three/drei';
import { BoxGeometry, MeshStandardMaterial } from "three";
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
    const geometry = useMemo(() => new BoxGeometry(widthTile, heightTile, 20), [widthTile, heightTile]);
    const materials = useMemo(() => {
        let materialsMap = new Map();
        tilesData.forEach(({color}) => {
            const meshStandardMaterial = new MeshStandardMaterial({
                color,
                emissive:"#212121",
                roughness:0.478,
                metalness:0.122
            });
            materialsMap.set(color, meshStandardMaterial);
        });
        return materialsMap;
    },[tilesData]);

    console.log(materials)

    return (
    <group scale={1/SCALE} position={[0,heightMozaic/SCALE/2,0]}>
      {/*<Box args={[widthMozaic, heightMozaic, 10]} material-color={backgroundColor} />*/}
      {tilesData.map(({x, y, color}, position) =>
        <Tile
            key={position}
            position={[x - widthMozaic/2, -y +heightMozaic/2, 0.1 ]}
            geometry={geometry}
            material={materials.get(color)}
            color={color}
        />
      )}
    </group>
    )
}

export default MozaicManager;