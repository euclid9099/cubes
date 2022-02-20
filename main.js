import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

console.log("start");

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
    
		const colors = [];
    colors.length = 108;
    colors.fill(0,0,107);

    console.log(colors);
    
    //create cubes
    let spaceperblock = 1.1;
    //since the cube should be centered, the "first" one should be placed at basically half the distance from center
    let xbound = (params.width - 1) / 2;
    let ybound = (params.height - 1) / 2;
    let zbound = (params.depth - 1) / 2;
    for(let x = -xbound; x <= xbound; x++) {
      for(let y = -ybound; y <= ybound; y++) {
        for(let z = -zbound; z <= zbound; z++) {
          //color cubes:
          //if cubes position equals the outermost possible position, color that side
          if(x == xbound) {
            //change color of all 2 triangles making up one side. 2 triangles * 3 points -> 6 points * 3 colors -> 18 values to change 
            for(let i = 0; i < 18; i += 3) {
              colors[i] = params.coloring.right.r;
              colors[i + 1] = params.coloring.right.g;
              colors[i + 2] = params.coloring.right.b;
            }
          }
          //continue for each side/direction
          if (x == -xbound) {
            for(let i = 0; i < 18; i += 3) {
              colors[18 + i] = params.coloring.left.r;
              colors[18 + i + 1] = params.coloring.left.g;
              colors[18 + i + 2] = params.coloring.left.b;
            }
          }
          if (y == ybound) {
            for(let i = 0; i < 18; i += 3) {
              colors[36 + i] = params.coloring.top.r;
              colors[36 + i + 1] = params.coloring.top.g;
              colors[36 + i + 2] = params.coloring.top.b;
            }
          }
          if (y == -ybound) {
            for(let i = 0; i < 18; i += 3) {
              colors[54 + i] = params.coloring.bottom.r;
              colors[54 + i + 1] = params.coloring.bottom.g;
              colors[54 + i + 2] = params.coloring.bottom.b;
            }
          }
          if (z == zbound) {
            for(let i = 0; i < 18; i += 3) {
              colors[72 + i] = params.coloring.front.r;
              colors[72 + i + 1] = params.coloring.front.g;
              colors[72 + i + 2] = params.coloring.front.b;
            }
          }
          if (z == -zbound) {
            for(let i = 0; i < 18; i += 3) {
              colors[90 + i] = params.coloring.back.r;
              colors[90 + i + 1] = params.coloring.back.g;
              colors[90 + i + 2] = params.coloring.back.b;
            }
          }          
          
          //create geometry and mesh
          const g = new THREE.BoxGeometry(1,1,1).toNonIndexed();
          const m = new THREE.MeshBasicMaterial({vertexColors: true});

          //set color so the cube reflects the coloring
          g.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

          const c = new THREE.Mesh(g,m);
          c.position.set(x * spaceperblock, y * spaceperblock, z * spaceperblock);
          scene.add(c)
          
          //reset colorings for next cube
          colors.fill(0,0,108);
        }
      }
    }
  }
}

//create first cube
createCube({height:3, coloring:{top: new THREE.Color(0xFFFFFF), bottom: new THREE.Color(0xFFD700), left: new THREE.Color(0xFF8C00), right: new THREE.Color(0xFF0000), front: new THREE.Color(0x00AA00), back: new THREE.Color(0x0000AA)}});
scene.add(new THREE.GridHelper(10, 10))

//set camera position
camera.position.set(4,4,4);
camera.setRotationFromEuler(new THREE.Euler(-1,-1,-1));

//get Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

//repeatedly update the screen
function update() {
  requestAnimationFrame(update);

  controls.update();

  renderer.render(scene,camera);
}

update();