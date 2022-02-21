import * as THREE from 'three';

export default class cube {

    constructor(params) {
      //checks if one of those three attributes is defined
      if(params.height === undefined && params.width === undefined && params.depth === undefined) {
        return;
      } else {
        this.scene = params.scene;
        this.spaceperblock = 1.0625
        this.parts = new Array();
        this.colors = params.coloring;
  
        //sets all parameters, either based on themselves or the next best attribute
        this.width = params.width || params.height || params.depth;
        this.depth = params.depth || this.width;
        this.height = params.height || this.width;
        
        const colors = [];
        colors.length = 108;
        colors.fill(0,0,107);
  
        
        //create cubes
        //since the cube should be centered, the "first" one should be placed at basically half the distance from center
        let xbound = (this.width - 1) / 2;
        let ybound = (this.height - 1) / 2;
        let zbound = (this.depth - 1) / 2;
        for(let x = -xbound; x <= xbound; x++) {
          for(let y = -ybound; y <= ybound; y++) {
            for(let z = -zbound; z <= zbound; z++) {
              let placecube = false;
              //color cubes:
              //if cubes position equals the outermost possible position, color that side
              if(x == xbound) {
                //change color of all 2 triangles making up one side. 2 triangles * 3 points -> 6 points * 3 colors -> 18 values to change 
                for(let i = 0; i < 18; i += 3) {
                  colors[i] = this.colors.right.r;
                  colors[i + 1] = this.colors.right.g;
                  colors[i + 2] = this.colors.right.b;
                }
                placecube = true;
              }
              //continue for each side/direction
              if (x == -xbound) {
                for(let i = 0; i < 18; i += 3) {
                  colors[18 + i] = this.colors.left.r;
                  colors[18 + i + 1] = this.colors.left.g;
                  colors[18 + i + 2] = this.colors.left.b;
                }
                placecube = true;
              }
              if (y == ybound) {
                for(let i = 0; i < 18; i += 3) {
                  colors[36 + i] = this.colors.top.r;
                  colors[36 + i + 1] = this.colors.top.g;
                  colors[36 + i + 2] = this.colors.top.b;
                }
                placecube = true;
              }
              if (y == -ybound) {
                for(let i = 0; i < 18; i += 3) {
                  colors[54 + i] = this.colors.bottom.r;
                  colors[54 + i + 1] = this.colors.bottom.g;
                  colors[54 + i + 2] = this.colors.bottom.b;
                }
                placecube = true;
              }
              if (z == zbound) {
                for(let i = 0; i < 18; i += 3) {
                  colors[72 + i] = this.colors.front.r;
                  colors[72 + i + 1] = this.colors.front.g;
                  colors[72 + i + 2] = this.colors.front.b;
                }
                placecube = true;
              }
              if (z == -zbound) {
                for(let i = 0; i < 18; i += 3) {
                  colors[90 + i] = this.colors.back.r;
                  colors[90 + i + 1] = this.colors.back.g;
                  colors[90 + i + 2] = this.colors.back.b;
                }
                placecube = true;
              }          
              
              if (placecube) {
                //create geometry and mesh
                const g = new THREE.BoxGeometry(1,1,1).toNonIndexed();
                const m = new THREE.MeshBasicMaterial({vertexColors: true});
  
                const c = new THREE.Mesh(g,m);
                c.position.set(x * this.spaceperblock, y * this.spaceperblock, z * this.spaceperblock);
                this.parts.push(c);
                params.scene.add(c);
  
                //set color so the cube reflects the coloring
                g.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
                
                //reset colorings for next cube
                colors.fill(0,0,108);
              }
            }
          }
        }
      }
    }
  
    scramble(instructions) {
        let steps = instructions.split(" ");
        console.log(steps);
        steps.forEach(e => {
            switch(e[0]) {
                case 'R':
                    for(let j = 0; j < this.parts.length; j++) {
                        if(this.parts[j].position.x == ((this.width - 1) / 2) * this.spaceperblock) {
                            this.parts[j].position.set(...this.rotateXByPosition(this.parts[j].position.divideScalar(this.spaceperblock), Math.PI * (e.length == 1 ? 0.5 : (e[1] == "2" ? 1 : -0.5))).multiplyScalar(this.spaceperblock).toArray());
                            this.parts[j].rotateOnWorldAxis(new THREE.Vector3(1,0,0), Math.PI * (e.length == 1 ? -0.5 : (e[1] == "2" ? 1 : 0.5)));
                        }
                    }
                    break;
                case 'U':
                    for(let j = 0; j < this.parts.length; j++) {
                        if(this.parts[j].position.y == ((this.width - 1) / 2) * this.spaceperblock) {
                            this.parts[j].position.set(...this.rotateYByPosition(this.parts[j].position.divideScalar(this.spaceperblock), Math.PI * (e.length == 1 ? -0.5 : (e[1] == "2" ? 1 : 0.5))).multiplyScalar(this.spaceperblock).toArray());
                            this.parts[j].rotateOnWorldAxis(new THREE.Vector3(0,1,0), Math.PI * (e.length == 1 ? -0.5 : (e[1] == "2" ? 1 : 0.5)));
                        }
                    }
                    break;
                case 'F':
                    for(let j = 0; j < this.parts.length; j++) {
                        if(this.parts[j].position.z == ((this.width - 1) / 2) * this.spaceperblock) {
                            this.parts[j].position.set(...this.rotateZByPosition(this.parts[j].position.divideScalar(this.spaceperblock), Math.PI * (e.length == 1 ? -0.5 : (e[1] == "2" ? 1 : 0.5))).multiplyScalar(this.spaceperblock).toArray());
                            this.parts[j].rotateOnWorldAxis(new THREE.Vector3(0,0,1), Math.PI * (e.length == 1 ? -0.5 : (e[1] == "2" ? 1 : 0.5)));
                        }
                    }
                    break;
                case 'L':
                    for(let j = 0; j < this.parts.length; j++) {
                        if(this.parts[j].position.x == -((this.width - 1) / 2) * this.spaceperblock) {
                            this.parts[j].position.set(...this.rotateXByPosition(this.parts[j].position.divideScalar(this.spaceperblock), Math.PI * (e.length == 1 ? -0.5 : (e[1] == "2" ? 1 : 0.5))).multiplyScalar(this.spaceperblock).toArray());
                            this.parts[j].rotateOnWorldAxis(new THREE.Vector3(1,0,0), Math.PI * (e.length == 1 ? 0.5 : (e[1] == "2" ? 1 : -0.5)));
                        }
                    }
                    break;
                case 'D':
                    for(let j = 0; j < this.parts.length; j++) {
                        if(this.parts[j].position.y == -((this.width - 1) / 2) * this.spaceperblock) {
                            this.parts[j].position.set(...this.rotateYByPosition(this.parts[j].position.divideScalar(this.spaceperblock), Math.PI * (e.length == 1 ? 0.5 : (e[1] == "2" ? 1 : -0.5))).multiplyScalar(this.spaceperblock).toArray());
                            this.parts[j].rotateOnWorldAxis(new THREE.Vector3(0,1,0), Math.PI * (e.length == 1 ? 0.5 : (e[1] == "2" ? 1 : -0.5)));
                        }
                    }
                    break;
                case 'B':
                    for(let j = 0; j < this.parts.length; j++) {
                        if(this.parts[j].position.z == -((this.width - 1) / 2) * this.spaceperblock) {
                            this.parts[j].position.set(...this.rotateZByPosition(this.parts[j].position.divideScalar(this.spaceperblock), Math.PI * (e.length == 1 ? 0.5 : (e[1] == "2" ? 1 : -0.5))).multiplyScalar(this.spaceperblock).toArray());
                            this.parts[j].rotateOnWorldAxis(new THREE.Vector3(0,0,1), Math.PI * (e.length == 1 ? 0.5 : (e[1] == "2" ? 1 : -0.5)));
                        }
                    }
                    break;
                
            }
        });
    }

    rotateXByPosition(position, angle) {
        let z = position.z * Math.cos(angle) - position.y * Math.sin(angle);
        let y = position.z * Math.sin(angle) + position.y * Math.cos(angle);
        return new THREE.Vector3(position.x, Math.round(y), Math.round(z));
        //return new THREE.Vector3(2,0,0);
    }
    rotateYByPosition(position, angle) {
        let z = position.z * Math.cos(angle) - position.x * Math.sin(angle);
        let x = position.z * Math.sin(angle) + position.x * Math.cos(angle);
        return new THREE.Vector3(Math.round(x), position.y, Math.round(z));
        //return new THREE.Vector3(2,0,0);
    }
    rotateZByPosition(position, angle) {
        let x = position.x * Math.cos(angle) - position.y * Math.sin(angle);
        let y = position.x * Math.sin(angle) + position.y * Math.cos(angle);
        return new THREE.Vector3(Math.round(x), Math.round(y), position.z);
        //return new THREE.Vector3(2,0,0);
    }
}