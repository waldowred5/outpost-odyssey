// TODO: Check this store for unused code

import { create } from 'zustand';

export enum SCENE {
  CREW = 'CREW',
  GALAXY = 'GALAXY',
  SHIPYARD = 'SHIPYARD',
  SHOP = 'SHOP'
}

interface SceneState {
  activeScene: SCENE,
  updateScene: (newScene: SCENE) => void,
}

export default create<SceneState>((set) => {
  return {
    activeScene: SCENE.GALAXY,

    // Actions
    updateScene: (newScene: SCENE) => {
      set(() => {
        return {
          activeScene: newScene,
        };
      });
    }
  };
});
