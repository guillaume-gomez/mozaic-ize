import { Box } from '@react-three/drei';
import { useMemo } from "react";

interface TileProps {
    position: [number, number, number];
    geometry: any;
    material: any;
    color: string;
}

function Tile({ position, color, geometry, material}: TileProps) {
    return (
        <mesh
            position={position}
            geometry={geometry}
            material={material}
        />
    )
}

export default Tile;
