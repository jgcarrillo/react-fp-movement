import { useBox } from '@react-three/cannon';

const BaseBox = ({ ...props }) => {
  const [ref] = useBox((index) => ({
    type: 'Static',
    mass: 1,
    onCollide: (e) => {
      console.log(e);
    },
    ...props,
  }));

  return (
    <mesh castShadow position={props.position} ref={ref}>
      <boxGeometry args={props.args} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
};

export default BaseBox;
