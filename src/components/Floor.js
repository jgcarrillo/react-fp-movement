import { usePlane } from '@react-three/cannon';

const Floor = (props) => {
  const [ref] = usePlane((index) => ({ type: 'Static', mass: 0, ...props }));

  return (
    <mesh receiveShadow rotation={props.rotation} ref={ref}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
};

export default Floor;
