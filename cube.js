import * as THREE from 'three';
import rotateOnAxis from './helpers';

export default class cube {

    constructor(params) {
        //checks if one of those three attributes is defined
        if(params.height === undefined && params.width === undefined && params.depth === undefined) {
            return;
        } else {
            this.scene = params.scene;
            this.blocksize = 0.9;
            this.parts = new Array();
            this.colors = params.coloring;

            this.textures = {
                right: new THREE.MeshBasicMaterial({color: this.colors.right}),
                left: new THREE.MeshBasicMaterial({color: this.colors.left}),
                top: new THREE.MeshBasicMaterial({color: this.colors.top}),
                bottom: new THREE.MeshBasicMaterial({color: this.colors.bottom}),
                back: new THREE.MeshBasicMaterial({color: this.colors.back}),
                front: new THREE.MeshBasicMaterial({color: this.colors.front}),
                none: new THREE.MeshBasicMaterial({color: this.colors.none})
            }
      
            //sets all parameters, either based on themselves or the next best attribute
            this.width = params.width || params.height || params.depth;
            this.depth = params.depth || this.width;
            this.height = params.height || this.width;
            
            //create cubes
            //since the cube should be centered, the "first" one should be placed at basically half the distance from center
            let xbound = (this.width - 1) / 2;
            let ybound = (this.height - 1) / 2;
            let zbound = (this.depth - 1) / 2;
            for(let x = -xbound; x <= xbound; x++) {
                for(let y = -ybound; y <= ybound; y++) {
                    for(let z = -zbound; z <= zbound; z++) {
                        if (Math.abs(x) == xbound || Math.abs(y) == ybound || Math.abs(z) == zbound) {
                            //create geometry and mesh
                            let g = new THREE.BoxGeometry(this.blocksize,this.blocksize,this.blocksize);
              
                            let c = new THREE.Mesh(g);
                            c.material = [
                                (x == xbound ? this.textures.right : this.textures.none),
                                (x == -xbound ? this.textures.left : this.textures.none),
                                (y == ybound ? this.textures.top : this.textures.none),
                                (y == -ybound ? this.textures.bottom : this.textures.none),
                                (z == zbound ? this.textures.front : this.textures.none),
                                (z == -zbound ? this.textures.back : this.textures.none),
                            ];
                            c.position.set(x, y, z);
                            this.parts.push(c);
                            this.scene.add(c);
                        }
                    }
                }
            }
            this.textures.front = new THREE.MeshBasicMaterial({color: new THREE.Color(0x00FFFF)});
        }
    }

    static generateScramble(minlenght, maxlength) {
        let scramble = new Array();
        let possibleKeys = ['U', 'D', 'R', 'L', 'F', 'B'];

        //scrambles beyond 20 moves are nonsensical since 20 is already the most scrambled cube (see https://en.wikipedia.org/wiki/Optimal_solutions_for_Rubik%27s_Cube)
        if(maxlength > 20) maxlength = 20;

        let totallength = Math.floor(Math.random() * (maxlength - minlenght) + minlenght);

        while(scramble.length < totallength * 2) {
            //generate one key (possibly inverted/counterclockwise)
            scramble.push(possibleKeys.at(Math.floor(Math.random() * possibleKeys.length)));
            scramble.push((Math.floor(Math.random() * 2) - 0.5) * 2);

            if(scramble.length > 3 && scramble.at(-4) == scramble.at(-2)) {
                //combined may range from -3 to 3
                let combined = (scramble.at(-1) + scramble.at(-3)) % 4;
                if (combined < 0) combined += 4
                
                //remove last added element (duplicate of second to last)
                scramble.pop();
                scramble.pop();
                scramble.pop();

                switch(combined) {
                    //all recent rotations add up to nothing, remove
                    case 0:
                        scramble.pop();
                        break;
                    case 3:
                        scramble.push(-1);
                        break;
                    default:
                        scramble.push(combined);
                        break;
                }
            }
        }
        let scrambleString = "";
        for (let i = 0; i < scramble.length; i += 2) {
            scrambleString += scramble.at(i);
            scrambleString += (scramble.at(i + 1) == -1 ? "2" : "1");
            scrambleString += " ";
        }
        return scrambleString;
    }
  
    scramble(instructions) {
        let steps = instructions.split(" ");
        console.log(steps);
        console.log(this.scene.children.length);
        steps.forEach(e => {
            for(let j = 0; j < this.parts.length; j++) {
                switch(e[0]) {
                    case 'R':
                        if(this.parts[j].position.x == ((this.width - 1) / 2)) {
                            rotateOnAxis(this.parts[j], new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0), Math.PI * (e.at(1) * 0.5));
                        }
                        break;
                    case 'L':
                        if(this.parts[j].position.x == -((this.width - 1) / 2)) {
                            rotateOnAxis(this.parts[j], new THREE.Vector3(0,0,0), new THREE.Vector3(-1,0,0), Math.PI * (e.at(1) * 0.5));
                        }
                        break;
                    case 'U':
                        if(this.parts[j].position.y == ((this.height - 1) / 2)) {
                            rotateOnAxis(this.parts[j], new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), Math.PI * (e.at(1) * 0.5));
                        }
                        break;
                    case 'D':
                        if(this.parts[j].position.y == -((this.height - 1) / 2)) {
                            rotateOnAxis(this.parts[j], new THREE.Vector3(0,0,0), new THREE.Vector3(0,-1,0), Math.PI * (e.at(1) * 0.5));
                        }
                        break;
                    case 'F':
                        if(this.parts[j].position.z == ((this.depth - 1) / 2)) {
                            rotateOnAxis(this.parts[j], new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,1), Math.PI * (e.at(1) * 0.5));
                        }
                        break;
                    case 'B':
                        if(this.parts[j].position.z == -((this.depth - 1) / 2)) {
                            rotateOnAxis(this.parts[j], new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,-1), Math.PI * (e.at(1) * 0.5));
                        }
                        break;
                }
            }
        });
        console.log(this.scene.children.length);
    }
}