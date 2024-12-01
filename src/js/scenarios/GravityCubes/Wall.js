import * as THREE from 'three'
import { Bodies, Body } from 'matter-js'

export default 
class Wall extends THREE.Mesh {
    #width
    #height

    constructor(color) {
        const geometry_ = new THREE.BoxGeometry(1, 1, 1)
        const material_ = new THREE.MeshBasicMaterial({ color: color })
        super(geometry_, material_)
        
        this.#width = 1
        this.#height = 1
        this.body = Bodies.rectangle(0, 0, 1, 1, { isStatic: true })
    }

    setPosition(x, y) {
        this.position.x = x
        this.position.y = y

        Body.setPosition(this.body, { x: x, y: -y })
    }

    setSize(width, height) {
        this.scale.set(width, height, 500)

        Body.scale(this.body, 1 / this.#width, 1 / this.#height)
        Body.scale(this.body, width, height)
        this.#width = width
        this.#height = height
    }

    update() {
        this.position.x = this.body.position.x
        this.position.y = -this.body.position.y
    }
}