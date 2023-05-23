import { Canvas } from '@react-three/fiber';
import { Loader, PointerLockControls, Stats } from '@react-three/drei';
import { Physics } from '@react-three/cannon';

import Lights from '../components/Lights.js';
import Floor from '../components/Floor.js';

const BasicScene = ({ children }) => {
  return (
    <div>
      <Canvas shadows camera={{ fov: 50 }}>
        <Lights />

        <Physics gravity={[0, -9.8, 0]}>
          {children}

          <Floor rotation={[Math.PI / -2, 0, 0]} color="white" />
        </Physics>

        <PointerLockControls />
        <Stats />
      </Canvas>
      <div className="app-info">
        <div>Controls :</div>
        <ul>
          <li>Use WASD to move characters.</li>
          <li>Hold 'shift' to run.</li>
          <li>'space' to jump.</li>
          <li>Hold 'p' for punching.</li>
        </ul>
      </div>
      <Loader />
    </div>
  );
};

export default BasicScene;
