import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Object3D, Group } from "three";
import { CameraControls } from '@react-three/drei';

interface CustomCameraControlsProps {
  speed?: number;
  rotationTimerThrottle?: number;
}

export interface ExternalActionInterface {
  recenter: (groupRef: any) => void;
}


const CustomCameraControls = forwardRef<ExternalActionInterface, CustomCameraControlsProps>(({
  speed = 20,
  rotationTimerThrottle = 2000
}, ref) => {
	const cameraRef = useRef<CameraControls>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [directionRotation, setDirectionRotation] = useState<number>(1);
  
  useFrame(
    (_state, delta) => {
      if(!autoRotate) {
        return;
      }
      if(!cameraRef.current) {
        return;
      }

      const { minAzimuthAngle, maxAzimuthAngle } = cameraRef.current;

      const newAzimuthAngle = cameraRef.current.azimuthAngle + ((speed * delta * MathUtils.DEG2RAD) * directionRotation);
      
      if(newAzimuthAngle > minAzimuthAngle && newAzimuthAngle <  maxAzimuthAngle) {
        cameraRef.current.azimuthAngle = newAzimuthAngle;
      } else {
        setDirectionRotation(-1 * directionRotation)
      }


    }
  );

  useImperativeHandle(ref, () => ({
    async recenter(group: Group) {
      setAutoRotate(false);
      
      if(!cameraRef.current || !cameraRef.current) {
        return;
      }
      await cameraRef.current.setPosition(50, 10, 20, true);
      await cameraRef.current.fitToBox(group as Object3D, true,
        { paddingLeft: 2, paddingRight: 2, paddingBottom: 2, paddingTop: 2 }
      );

      setTimeout(() => {
        setAutoRotate(true);
      }, rotationTimerThrottle)
    }
  }));


  return (<CameraControls
      makeDefault
      maxDistance={80}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 1.9}
      minAzimuthAngle={0.5}
      maxAzimuthAngle={1.9}
      onStart={() => {
        setAutoRotate(false);
      }}
      onEnd={() => {
        setTimeout(() => {
          setAutoRotate(true);
        }, rotationTimerThrottle);
      }}
      ref={cameraRef}
    />);
});

export default CustomCameraControls;