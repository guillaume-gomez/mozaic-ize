import { Gltf } from '@react-three/drei';

const { BASE_URL } = import.meta.env;

function GrassTerrain() {	
    return (
        <group >
            <Gltf src={`${BASE_URL}/grass/corner.glb`} scale={5.0} position={[25,0, -25]}  rotation={[ 0, 0, 0]}/>
            <Gltf src={`${BASE_URL}/grass/corner.glb`} scale={5.0} position={[-25,0, -25]}  rotation={[ 0, Math.PI/2, 0]}/>
            <Gltf src={`${BASE_URL}/grass/corner.glb`} scale={5.0} position={[25,0, 25]}  rotation={[ 0, -Math.PI/2, 0]}/>
            <Gltf src={`${BASE_URL}/grass/corner.glb`} scale={5.0} position={[-25,0, 25]}  rotation={[ 0, -Math.PI, 0]}/>
            <group position={[0,0,25]}>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[-15,0, 0]}  rotation={[ 0, Math.PI/2, 0]}/>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[-5,0, 0]}  rotation={[ 0, Math.PI/2, 0]}/>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[5,0, 0]}  rotation={[ 0, Math.PI/2, 0]}/>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[15,0, 0]}  rotation={[ 0, Math.PI/2, 0]}/>
            </group>
            <group position={[0,0,-25]}>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[-15,0, 0]}  rotation={[ 0, -Math.PI/2, 0]}/>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[-5,0, 0]}  rotation={[ 0,  -Math.PI/2, 0]}/>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[5,0, 0]}  rotation={[ 0,  -Math.PI/2, 0]}/>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[15,0, 0]}  rotation={[ 0,  -Math.PI/2, 0]}/>
            </group>
            <group position={[0,0,15]}>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[-25,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[-15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[-5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[25,0, 0]}  rotation={[ 0, Math.PI, 0]}/>
            </group>
            <group position={[0,0,5]}>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[-25,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[-15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[-5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[25,0, 0]}  rotation={[ 0, Math.PI, 0]}/>
            </group>
            <group position={[0,0,-5]}>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[-25,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[-15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[-5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[25,0, 0]}  rotation={[ 0, Math.PI, 0]}/>
            </group>
            <group position={[0,0,-15]}>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[-25,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[-15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[-5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/square.glb`} scale={5.0} position={[15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={`${BASE_URL}/grass/border.glb`} scale={5.0} position={[25,0, 0]}  rotation={[ 0, Math.PI, 0]}/>
            </group>
        </group>
    );
}

export default GrassTerrain;