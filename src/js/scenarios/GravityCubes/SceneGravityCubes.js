import * as THREE from 'three'
import Scene3D from "../../template/Scene3D"
import { Composite, Engine, Runner } from 'matter-js'
import { randomRange } from '../../Utils/MathUtils'
import GravityCube from './GravityCubes'
import Wall from './Wall'
import { clamp } from 'three/src/math/MathUtils.js'

const THICKNESS = 10

export default class SceneGravityCubes extends Scene3D {
    constructor(id) {
        super(id)

        /** Debug tool */
        this.params = {
            gScale: 1
        }
        if(!!this.debugFolder) {
            this.debugFolder.add(this.params, "gScale", 0.5, 10, 0.1).onChange(() => {
                if(!!this.engine) this.engine.gravity.scale *= this.params.gScale
            })
        }

        this.camera = new THREE.OrthographicCamera(
            -this.width / 2, this.width / 2, this.height / 2, -this.height / 2,
            0.1, 2000
        )

        this.camera.position.z = 1000
        this.wallTop = new Wall('white')
        this.wallRight = new Wall('white')
        this.wallBottom = new Wall('white')
        this.wallLeft = new Wall('white')
        this.add(this.wallTop)
        this.add(this.wallRight)
        this.add(this.wallBottom)
        this.add(this.wallLeft)

        this.bodies = [
            this.wallTop.body,
            this.wallRight.body,
            this.wallBottom.body,
            this.wallLeft.body,
        ]

        this.engine = Engine.create({ render: { visible: false } })
        this.engine.gravity.scale *= this.params.gScale
        Composite.add(this.engine.world, this.bodies)
        this.runner = Runner.create()
        Runner.run(this.runner, this.engine)

        this.cubes = []
        for (let i = 0; i < 10; i++) {
            const x_ = randomRange(-this.width / 2, this.width / 2)
            const y_ = randomRange(-this.height / 2, this.height / 2)

            this.addCube(x_, y_)
        }

        this.globalContext.useDeviceOrientation = true
        this.orientation = this.globalContext.orientation

        this.resize()
    }

    removeCube(cube) {
        cube.geometry.dispose()
        cube.material.dispose()
        cube.removeFromParent()

        Composite.remove(this.engine.world, cube.body)

        this.cubes = this.cubes.filter(c => { return c !== cube })
    }

    update() {
        this.cubes.forEach(c => { c.update() })
        super.update()
    }

    scroll() {
        super.scroll()
    }

    resize() {
        super.resize()

        this.camera.left = -this.width / 2
        this.camera.right = this.width / 2
        this.camera.top = this.height / 2
        this.camera.bottom = -this.height / 2
        
        if (this.wallTop)
        {
            this.wallTop.setSize(this.width * 0.6, THICKNESS)
            this.wallTop.setPosition((-this.width / 2) * 0.4, this.height * 0.2)
        }

        if (this.wallRight)
        {
            this.wallRight.setPosition(this.width / 2 + THICKNESS / 2, 0)
            this.wallRight.setSize(THICKNESS, this.height)
        }

        if (this.wallBottom)
        {
            this.wallBottom.setSize(this.width * 0.6, THICKNESS)
            this.wallBottom.setPosition((this.width / 2) * 0.4, -this.height * 0.2)
        }

        if (this.wallLeft)
        {
            this.wallLeft.setPosition(-this.width / 2 - THICKNESS / 2, 0)
            this.wallLeft.setSize(THICKNESS, this.height)
        }


    }

    addCube(x, y) {
        const cube_ = new GravityCube()
        cube_.setPosition(x, y)

        this.add(cube_)
        this.cubes.push(cube_)
        this.bodies.push(cube_.body)
        Composite.add(this.engine.world, cube_.body)

        return cube_
    }

    onDeviceOrientation() {
        if (this.orientation.beta && this.orientation.gamma) {
            let gx_ = this.orientation.gamma / 90
            let gy_ = this.orientation.beta / 90
            gx_ = clamp(gx_, -1, 1)
            gy_ = clamp(gy_, -1, 1)

            let coordinates_ = ""
            coordinates_ = coordinates_.concat(
                gx_.toFixed(2), ", ",
                gy_.toFixed(2)
            )
            this.debug.domDebug = coordinates_

            this.engine.gravity.x = gx_
            this.engine.gravity.y = gy_
        }
    }
}