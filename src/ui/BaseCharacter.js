import { useBox } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useMixer, usePlayerControls } from '../utils/helpers.js';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

const BaseCharacter = (props) => {
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();
  const speed = new THREE.Vector3();
  const robot = useGLTF('/assets/models/robot-expressive.glb', true)
  const [animation, setAnimation] = useState('Idle')
  const [activeAnimation, setActiveAnimation] = useState()
  const [lookAt, setLookAt] = useState(0)

  const SPEED = 1;

  const { camera } = useThree();
  const mixer = useMixer(robot.scene);
  const [ref, api] = useBox((index) => ({
  // const [ref, api] = useSphere((index) => ({
    mass: 1,
    type: 'Dynamic',

    position: [0, 10, 0],
    ...props,
  }));

  const {
    forward, backward, left, right, jump,
    punch,
    running
  } = usePlayerControls();
  const velocity = useRef([0, 1, 0]);
  const position = useRef([0, 0, 0]);

  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), []);
  useEffect(() => api.position.subscribe((v) => (position.current = v)), []);

  if(mixer && !mixer.existingAction(getAnimation('Idle'), robot.scene)) {
    robot.animations.map(ra => mixer.clipAction(ra))
  }

  function playAnimation(name, fadeIn=1) {
    const newAction = mixer.existingAction(getAnimation(name), robot.scene)
    if (newAction) {
      newAction
        .reset()
        .setEffectiveTimeScale( 1 )
        .setEffectiveWeight( 1 )
        .fadeIn( 0.1 )
        .play()
    }
  }

  function getAnimation(name) {
    // ['Dance', 'Death', 'Idle', 'Jump', 'No', 'Punch', 'Running', 'Sitting', 'Standing', 'ThumbsUp', 'Walking', 'WalkJump', 'Wave', 'Yes']
    return robot.animations.filter((ra) => ra.name === name)[0]
  }

  useEffect(() => {
    if (animation !== activeAnimation && mixer) {
      mixer.stopAllAction()
      setActiveAnimation(animation)
      playAnimation(animation)
    }
  }, [animation])

  function getFaceDirection() {
    let faceDirection = lookAt
    if (backward && right && !left) faceDirection = Math.PI / 4
    else if (!backward && !forward && right) faceDirection = Math.PI / 2
    else if (forward && right) faceDirection = 3 * Math.PI / 4
    else if (forward && !left && !right) faceDirection = Math.PI
    else if (forward && left) faceDirection = 5 * Math.PI / 4
    else if (!backward && left && !right) faceDirection = 3 * Math.PI / 2
    else if (backward && left) faceDirection = 7 * Math.PI / 4
    else if (backward && !left && !right) { faceDirection = 0 }

    if (faceDirection !== lookAt) {
      setLookAt(faceDirection)
    }
    return faceDirection + Math.PI/4
  }

  useFrame((state, delta) => {
    const playerLocation = new THREE.Vector3()
    ref.current.getWorldPosition(playerLocation);
    camera.lookAt(playerLocation)
    const newCameraLocaiton = playerLocation.copy(playerLocation)
    newCameraLocaiton.addScalar(2)
    newCameraLocaiton.setY(newCameraLocaiton.y + 2)
    camera.position.copy(newCameraLocaiton)
    
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    const speedScaler = running ? 0.1: 0.05
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED*speedScaler).applyEuler(camera.rotation);
    speed.fromArray(velocity.current);

    const faceDirection = getFaceDirection()
    const moving = forward || right || left || backward
    if (mixer) mixer.update(delta)
    api.rotation.set(0, faceDirection.toFixed(1), 0)
    if (moving) {
      api.position.set(
        position.current[0] + direction.x,
        position.current[1],
        position.current[2] + direction.z
      )
    }
    
    updateAnimation(moving)
  });

  function updateAnimation(moving) {
    if (jump && Math.abs(velocity.current[1].toFixed(2)) < 0.05) {
      api.velocity.set(velocity.current[0], 5, velocity.current[2]);
      setAnimation('Jump')
    } else if (velocity.current[1] > -1.5 && animation === 'Jump') {
      // setAnimation('Jump') still jumping
    } else if (punch) {
      setAnimation('Punch')
    } else {
      const movement = running ? 'Running': 'Walking'
      setAnimation(moving ? movement: 'Idle')
    }
  }

  return (
    <group>
      <primitive
        ref={ref}
        castShadow
        position={props.position}
        args={props.args}
        object={robot.scene}
        scale={0.3}/>
    </group>
  );
};

export default BaseCharacter;
