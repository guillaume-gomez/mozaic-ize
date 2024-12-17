import { Box } from '@react-three/drei';

interface TileProps {
    width: number;
    height: number;
    x: number;
    y: number
    color: string;
}

function Tile({x, y, width, height, color}: TileProps) {
    return (
        <mesh
            position={[x, y, 0]}
        >
            <boxGeometry args={[width, height, 0.2]} />
            <meshStandardMaterial
                color={color}
                emissive={"#212121"}
                roughness={0.478}
                metalness={0.122}
            />
        </mesh>
    )
}

export default Tile;