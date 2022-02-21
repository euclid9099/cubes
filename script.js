import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import cube from './cube';

console.log("start");

//create scene and camera
const scene = new THREE.Scene();
//create camera
const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0, 10);
//select renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#cube'),
})
//get Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let curPuzzle = null;

function setup() {

  //create first cube
  curPuzzle = new cube({scene:scene, height:3, coloring:{top: new THREE.Color(0xFFFFFF), bottom: new THREE.Color(0xFFD700), left: new THREE.Color(0xFF8C00), right: new THREE.Color(0xFF0000), front: new THREE.Color(0x00AA00), back: new THREE.Color(0x0000AA)}});
  curPuzzle.scramble(cube.generateScramble(15, 20));

  //set renderer size to be quadratic
  renderer.setPixelRatio(window.devicePixelRatio);
  if (window.innerHeight < window.innerWidth) {
    renderer.setSize(window.innerHeight, window.innerHeight);
  } else {
    renderer.setSize(window.innerWidth, window.innerWidth);
  }

  //set camera position
  camera.position.set(3,3,3);
  camera.setRotationFromEuler(new THREE.Euler(-1,-1,-1));
}

//repeatedly update the screen
function update() {
  requestAnimationFrame(update);

  controls.update();

  renderer.render(scene,camera);
}


window.addEventListener("keypress", (event) => {
  console.log(event);
  if (curPuzzle.height <= 3 && curPuzzle.width <= 3 && curPuzzle.depth <= 3) {
    curPuzzle.scramble(event.key.toUpperCase() + (event.shiftKey ? "'" : ""));
  }
});

setup();
update();