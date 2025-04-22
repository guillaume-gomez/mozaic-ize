import { Gltf } from '@react-three/drei';

function GrassTerrain() {	
    return (
        <group >
            <Gltf src={"grass/corner.glb"} scale={5.0} position={[25,0, -25]}  rotation={[ 0, 0, 0]}/>
            <Gltf src={"grass/corner.glb"} scale={5.0} position={[-25,0, -25]}  rotation={[ 0, Math.PI/2, 0]}/>
            <Gltf src={"grass/corner.glb"} scale={5.0} position={[25,0, 25]}  rotation={[ 0, -Math.PI/2, 0]}/>
            <Gltf src={"grass/corner.glb"} scale={5.0} position={[-25,0, 25]}  rotation={[ 0, -Math.PI, 0]}/>
            <group position={[0,0,25]}>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[-15,0, 0]}  rotation={[ 0, Math.PI/2, 0]}/>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[-5,0, 0]}  rotation={[ 0, Math.PI/2, 0]}/>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[5,0, 0]}  rotation={[ 0, Math.PI/2, 0]}/>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[15,0, 0]}  rotation={[ 0, Math.PI/2, 0]}/>
            </group>
            <group position={[0,0,-25]}>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[-15,0, 0]}  rotation={[ 0, -Math.PI/2, 0]}/>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[-5,0, 0]}  rotation={[ 0,  -Math.PI/2, 0]}/>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[5,0, 0]}  rotation={[ 0,  -Math.PI/2, 0]}/>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[15,0, 0]}  rotation={[ 0,  -Math.PI/2, 0]}/>
            </group>
            <group position={[0,0,15]}>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[-25,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[-15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[-5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[25,0, 0]}  rotation={[ 0, Math.PI, 0]}/>
            </group>
            <group position={[0,0,5]}>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[-25,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[-15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[-5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[25,0, 0]}  rotation={[ 0, Math.PI, 0]}/>
            </group>
            <group position={[0,0,-5]}>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[-25,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[-15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[-5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[25,0, 0]}  rotation={[ 0, Math.PI, 0]}/>
            </group>
            <group position={[0,0,-15]}>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[-25,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[-15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[-5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[5,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/square.glb"} scale={5.0} position={[15,0, 0]}  rotation={[ 0, 0, 0]}/>
                <Gltf src={"grass/border.glb"} scale={5.0} position={[25,0, 0]}  rotation={[ 0, Math.PI, 0]}/>
            </group>
        </group>
    );
}

export default GrassTerrain;