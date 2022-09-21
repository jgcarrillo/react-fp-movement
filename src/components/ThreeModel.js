import { useBox } from '@react-three/cannon';
import { useGLTF, Sparkles } from '@react-three/drei';

const ThreeModel = ({ ...props }) => {
  const { nodes, materials } = useGLTF('/assets/models/model.gltf');
  const [ref] = useBox((index) => ({
    type: 'Static',
    mass: 1,
    args: props.args,
    position: props.position,

    ...props,
  }));

  return (
    <group ref={ref} {...props} dispose={null}>
      <Sparkles count={200} scale={[20, 20, 10]} size={3} speed={2} />
      <mesh
        scale={props.scale}
        castShadow
        receiveShadow
        geometry={nodes['tree-beech'].geometry}
        material={materials.color_main}
      />
    </group>
  );
};

export default ThreeModel;
