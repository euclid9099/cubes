import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0, 10);

//select renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#cube'),
})

//set size to be quadratic
renderer.setPixelRatio(window.devicePixelRatio);
if (window.innerHeight < window.innerWidth) {
  renderer.setSize(window.innerHeight, window.innerHeight);
} else {
  renderer.setSize(window.innerWidth, window.innerWidth);
}

//set camera position
camera.position.setZ(5);

//create a "box of boxes" using parameters like height, depth, and width
function createCube(params) {
  //checks if one of those three attributes is defined
  if(params.height === undefined && params.width === undefined && params.depth === undefined) {
    return;
  } else {

    //sets all parameters, either based on themselves or the next best attribute
    params.width = params.width || params.height || params.depth;
    params.depth = params.depth || params.width;
    params.height = params.height || params.width;
    
    const g = new THREE.BoxGeometry(1,1,1);
    const m = new THREE.MeshBasicMaterial({color: 0xAAAAAA});
    
    //create cubes
    let spaceperblock = 1.1;
    for(let x = -(params.width - 1) / 2; x <= (params.width - 1) / 2; x++) {
      for(let y = -(params.height - 1) / 2; y <= (params.height - 1) / 2; y++) {
        for(let z = -(params.depth - 1) / 2; z <= (params.depth - 1) / 2; z++) {
          const c = new THREE.Mesh(g,m);
          c.position.set(x * spaceperblock, y * spaceperblock, z * spaceperblock);
          scene.add(c)
        }
      }
    }
  }
}

//create first cube
createCube({height:3});
scene.add(new THREE.GridHelper(10, 10))

//get Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

//repeatedly update the screen
function update() {
  requestAnimationFrame(update);

  controls.update();

  renderer.render(scene,camera);
}

update();