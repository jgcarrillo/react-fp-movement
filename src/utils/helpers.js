import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

/*****************
 * Player Controls
 ****************/
export const usePlayerControls = () => {
  const keys = {
    KeyW: 'forward',
    KeyS: 'backward',
    KeyA: 'left',
    KeyD: 'right',
    Space: 'jump',
    KeyP: 'punch',
    ShiftLeft: 'running',
  };
  const moveFieldByKey = (key) => keys[key];

  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false, jump: false });
  useEffect(() => {
    const handleKeyDown = (e) => setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }));
    const handleKeyUp = (e) => setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }));

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
};

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function useMixer(scene) {
  const ref = useRef();
  useEffect(() => {
    ref.current = new THREE.AnimationMixer(scene);
  }, [scene]);
  return ref.current;
}