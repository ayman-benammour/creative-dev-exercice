import * as THREE from 'three'
import { Bodies, Body } from 'matter-js'

export default class GravityCube extends THREE.Mesh {
    constructor(size = 30) {
        const colors = ['purple', 'orange', 'red']
        const randomNmbr = Math.floor(Math.random() * 3);
        const color = colors[randomNmbr]
        const geometry_ = new THREE.BoxGeometry(size, size, size)
        const material_ = new THREE.MeshBasicMaterial({ color })
        super(geometry_, material_)

        this.body = Bodies.rectangle(
            0, 0, size, size
        )
    }

    setPosition(x, y) {
        this.position.x = x
        this.position.y = y

        Body.setPosition(this.body, { x: x, y: -y })
    }

    update() {
        this.position.x = this.body.position.x
        this.position.y = -this.body.position.y
        this.rotation.z = -this.body.angle
    }
}