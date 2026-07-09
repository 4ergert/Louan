import { LVL_2_Boss } from '../models/enemies/lvl-2-boss.class.js';
import { SkeletonWarrior1 } from '../models/enemies/skeleton_warrior_1.class.js';
import { SkeletonWarrior2 } from '../models/enemies/skeleton_warrior_2.class.js';
import { LVL } from './lvl.class.js';
import { Coins } from '../models/objects/coin-object.class.js';
import { BackgroundObject } from '../models/objects/background-object.class.js';
import { EnvironmentObject } from '../models/objects/environment-objects.class.js';
import { PlatformObjects } from '../models/objects/platform-objects.class.js';
import { ThrowableObject } from '../models/objects/throwable-objects.class.js';

const backgroundObjects = [];

// add an extra background object at the beginning to ensure seamless scrolling
backgroundObjects.push(
  new BackgroundObject('./assets/img/lvl-2/Background/Crystal_Caves_Forest_2D_Platformer_Tileset_Background - Layer 00.png', 0.25, -720)
);

// Add multiple background objects to create a seamless scrolling effect for the parallax layers
for (let index = 0; index < 3; index++) {
  const x = index * 720;

  backgroundObjects.push(
    new BackgroundObject('./assets/img/lvl-2/Background/Crystal_Caves_Forest_2D_Platformer_Tileset_Background - Layer 00.png', 0.25, x)
  );
}

// Add multiple background objects for the second parallax layer 
for (let index = 0; index < 5; index++) {
  const x = index * 720;

  backgroundObjects.push(
    new BackgroundObject('./assets/img/lvl-2/Background/Crystal_Caves_Forest_2D_Platformer_Tileset_Background - Layer 01.png', 0.55, x)
  );
}

const platformObjects = [];

for (let index = 0; index < 70; index++) {
  const x = index * 50 - 200;

  platformObjects.push(
    new PlatformObjects('./assets/img/lvl-2/Platfromer/Crystal_Caves_Forest_2D_Platformer_Tileset_Platformer - Ground 02.png', x, 400, 50, 50),
    new PlatformObjects('./assets/img/lvl-2/Platfromer/Crystal_Caves_Forest_2D_Platformer_Tileset_Platformer - Ground 06.png', x, 450, 50, 50)
  );
}

platformObjects.push(
  new PlatformObjects('./assets/img/lvl-2/Platfromer/Crystal_Caves_Forest_2D_Platformer_Tileset_Platformer - Ground 04.png', -250, 400, 50, 50),
  new PlatformObjects('./assets/img/lvl-2/Platfromer/Crystal_Caves_Forest_2D_Platformer_Tileset_Platformer - Ground 09.png', -250, 450, 50, 50),
  new PlatformObjects('./assets/img/lvl-2/Platfromer/Crystal_Caves_Forest_2D_Platformer_Tileset_Platformer - Ground 04.png', 3500, 400, 50, 50),
  new PlatformObjects('./assets/img/lvl-2/Platfromer/Crystal_Caves_Forest_2D_Platformer_Tileset_Platformer - Ground 09.png', 3500, 450, 50, 50),
  new PlatformObjects('./assets/img/lvl-2/Platfromer/Crystal_Caves_Forest_2D_Platformer_Tileset_Platformer - Ground 08.png', 3300, 400, 50, 50),
  new PlatformObjects('./assets/img/lvl-2/Platfromer/Crystal_Caves_Forest_2D_Platformer_Tileset_Platformer - Ground 13.png', 3300, 450, 50, 50)
);

for (let index = 0; index < 20; index++) {
  const x = index * 50 + 3550;

  platformObjects.push(
    new PlatformObjects('./assets/img/lvl-2/Platfromer/Crystal_Caves_Forest_2D_Platformer_Tileset_Platformer - Ground 02.png', x, 400, 50, 50),
    new PlatformObjects('./assets/img/lvl-2/Platfromer/Crystal_Caves_Forest_2D_Platformer_Tileset_Platformer - Ground 06.png', x, 450, 50, 50)
  );
}

platformObjects.push(

);

const coins = [
  new Coins(2400, 333),
  new Coins(2450, 333),
  new Coins(2500, 333),
  new Coins(2550, 333),
  new Coins(2600, 333),
  new Coins(2650, 333),
  new Coins(2700, 333),
  new Coins(2750, 333),
  new Coins(2800, 333),
  new Coins(2850, 333),
  new Coins(2900, 333),
];

const throwableObjects = [

];

const solidObjects = [

];

const enemies = [
  new SkeletonWarrior1(900, 280),
  new SkeletonWarrior1(1300, 280),
  new SkeletonWarrior2(2000, 280),
  new SkeletonWarrior2(3000, 280),
  new LVL_2_Boss()
];

const bossMusicTriggerSignpost = new EnvironmentObject(
  './assets/img/lvl-2/Environment/Crystal_Caves_Forest_2D_Platformer_Tileset_Environment - Signpost 04.png', 2100, 333, 70, 70
);

bossMusicTriggerSignpost.startsBossMusic = true;

const cleanupTriggerSignpost = new EnvironmentObject(
  './assets/img/lvl-2/Environment/Crystal_Caves_Forest_2D_Platformer_Tileset_Environment - Signpost 04.png', 3550, 333, 70, 70
);

cleanupTriggerSignpost.removeObjectsBeforeX = 3400;


// Combine all environment objects into a single array
const environmentObjects = [
  ...solidObjects,
  ...coins,
  ...throwableObjects,
  new EnvironmentObject('./assets/img/lvl-2/Environment/Crystal_Caves_Forest_2D_Platformer_Tileset_Environment - Signpost 04.png', -200, 333, 70, 70),
  new EnvironmentObject('./assets/img/lvl-2/Environment/Crystal_Caves_Forest_2D_Platformer_Tileset_Environment - Signpost 01.png', 180, 333, 70, 70),
  new EnvironmentObject('./assets/img/lvl-2/Platfromer/Crystal_Caves_Forest_2D_Platformer_Tileset_Platformer - Ground Additional 03.png', 400, -30, 400, 430),
  new EnvironmentObject('./assets/img/lvl-2/Environment/Crystal_Caves_Forest_2D_Platformer_Tileset_Environment - Crystal pile 01.png', 1050, 263, 291, 140),
  new EnvironmentObject('./assets/img/lvl-2/Platfromer/Crystal_Caves_Forest_2D_Platformer_Tileset_Platformer - Ground Additional 04.png', 1500, -30, 400, 430),
  new EnvironmentObject('./assets/img/lvl-2/Environment/Crystal_Caves_Forest_2D_Platformer_Tileset_Environment - Fire.png', 2300, 280, 100, 100),
  new EnvironmentObject('./assets/img/lvl-2/Environment/Crystal_Caves_Forest_2D_Platformer_Tileset_Environment - Fire.png', 2500, 280, 100, 100),
  new EnvironmentObject('./assets/img/lvl-2/Environment/Crystal_Caves_Forest_2D_Platformer_Tileset_Environment - Fire.png', 2700, 280, 100, 100),
  new EnvironmentObject('./assets/img/lvl-2/Environment/Crystal_Caves_Forest_2D_Platformer_Tileset_Environment - Fire.png', 2900, 280, 100, 100),
  new EnvironmentObject('./assets/img/lvl-2/Environment/Crystal_Caves_Forest_2D_Platformer_Tileset_Environment - Fire.png', 3100, 280, 100, 100),
  cleanupTriggerSignpost,
  bossMusicTriggerSignpost,
];

const worldSettings = {
  openingIntroLines: [],
  bossIntroLines: [],
  aliaIntroLines: [],
  characterResponseIntroLines: [],
};

export const lvl_2 = new LVL(
  enemies,
  platformObjects,
  solidObjects,
  environmentObjects,
  backgroundObjects,
  worldSettings,
);