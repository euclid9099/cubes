import * as THREE from 'three';

export function rotateOnAxis(Element, rotationPoint, rotationAxis, angle) {
    //this was basically stolen from this stackoverflow post: https://stackoverflow.com/questions/43623549/how-to-rotate-a-vector-around-a-particular-axis
    let SinVal = Math.sin(angle);
    let CosVal = Math.cos(angle);
    let OneMinCos = 1.0 - CosVal;

    rotationAxis.normalize();

    let tempVector = new THREE.Vector3();

    let Temp = (rotationAxis.x * Element.position.x) + (rotationAxis.y * Element.position.y) + (rotationAxis.z * Element.position.z);
    tempVector.x = (rotationPoint.x * (rotationAxis.y * rotationAxis.y)) - (rotationAxis.x * (((-rotationPoint.y * rotationAxis.y) + (-rotationPoint.z * rotationAxis.z)) - Temp));
    tempVector.y = (rotationPoint.y * (rotationAxis.x * rotationAxis.x)) - (rotationAxis.y * (((-rotationPoint.x * rotationAxis.x) + (-rotationPoint.z * rotationAxis.z)) - Temp));
    tempVector.z = (rotationPoint.z * (rotationAxis.x * rotationAxis.x)) - (rotationAxis.z * (((-rotationPoint.x * rotationAxis.x) + (-rotationPoint.y * rotationAxis.y)) - Temp));

    tempVector.x = (tempVector.x * OneMinCos) + (Element.position.x * CosVal);
    tempVector.y = (tempVector.y * OneMinCos) + (Element.position.y * CosVal);
    tempVector.z = (tempVector.z * OneMinCos) + (Element.position.z * CosVal);

    tempVector.x += (-(rotationPoint.z * rotationAxis.y) + (rotationPoint.y * rotationAxis.z) - (rotationAxis.z * Element.position.y) + (rotationAxis.y * Element.position.z)) * SinVal;    
    tempVector.y += ( (rotationPoint.z * rotationAxis.x) - (rotationPoint.x * rotationAxis.z) + (rotationAxis.z * Element.position.x) - (rotationAxis.x * Element.position.z)) * SinVal;
    tempVector.z += (-(rotationPoint.y * rotationAxis.x) + (rotationPoint.x * rotationAxis.y) - (rotationAxis.y * Element.position.x) + (rotationAxis.x * Element.position.y)) * SinVal;    

    Element.rotateOnWorldAxis(rotationAxis, angle);
    Element.position.set(...tempVector.toArray());
}

export function closestAxis(point, axes) {
    let min = 181;
    let curbest = null;
    axes.forEach(axis => {
        if(point.angleTo(axis) < min) {
            min = point.angleTo(axis);
            curbest = axis;
        }
    });
    return curbest.normalize();
}

export function componentMultiplication(vector1, vector2) {
    return new THREE.Vector3(Math.max(vector1.x * vector2.x, 0), Math.max(vector1.y * vector2.y, 0), Math.max(vector1.z * vector2.z, 0));
}