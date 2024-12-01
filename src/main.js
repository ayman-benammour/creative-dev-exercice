import SceneGravityCubes from "./js/scenarios/GravityCubes/SceneGravityCubes"
import SceneBouncingBubbles from "./js/scenarios/SceneBouncingBubbles"
import GlobalContext from "./js/template/GlobalContext"
import { askMotionAccess } from "./js/Utils/DeviceAccess"
import { randomRange } from "./js/Utils/MathUtils"

/** motion sensors authorization */
const btn = document.getElementById("btn-access")
btn.addEventListener("click", function () {
    askMotionAccess()
}, false)

/** scenes */
const scene1 = new SceneBouncingBubbles("canvas-scene-1")
const scene2 = new SceneGravityCubes("canvas-scene-2")
const scene3 = new SceneBouncingBubbles("canvas-scene-3")

/** main */
const globalContext = new GlobalContext()
const params = {
    test: 0
}
if (!!globalContext.debug.ui) {
    globalContext.debug.ui.add(params, "test", 0, 10)
}
const time = globalContext.time
const update = () => {
    /** exemple css */
    const scale_ = 1 + (Math.cos(5 * time.elapsed / 1000) / 2 + 0.5) / 20
    btn.style.transform = `scale(${scale_}, ${1})`

    /** bubbles + cube scan = is IN or OUT ? */
    const outScene1_down = scene1.bubbles.filter(b => { return b.y > scene1.height })
    const outScene1_up = scene1.bubbles.filter(b => { return b.y < 0 })
    const outScene2_down = scene2.cubes.filter(c => { return c.position.y < -scene2.height / 2 })
    const outScene2_up = scene2.cubes.filter(c => { return c.position.y > scene2.height / 2 })
    const outScene3_down = scene3.bubbles.filter(b => { return b.y > scene3.height })
    const outScene3_up = scene3.bubbles.filter(b => { return b.y < 0 })

    /** remove entities (cube + bubble) OUT of their own scene */
    outScene1_down.forEach(entityToRemove => { scene1.removeBubble(entityToRemove) })
    outScene1_up.forEach(entityToRemove => { scene1.removeBubble(entityToRemove) })
    outScene2_down.forEach(entityToRemove => { scene2.removeCube(entityToRemove) })
    outScene2_up.forEach(entityToRemove => { scene2.removeCube(entityToRemove) })
    outScene3_down.forEach(entityToRemove => { scene3.removeBubble(entityToRemove) })
    outScene3_up.forEach(entityToRemove => { scene3.removeBubble(entityToRemove) })

    /** add new entities to corresponding scene, ex: bulle scene 1 -> cube scene 2 */
    outScene1_down.forEach(entityToRemove => {
        const newCube_ = scene2.addCube(entityToRemove.x - scene1.width / 2, scene2.height / 2)
    })
    outScene1_up.forEach(entityToRemove => {
        const newBubble_ = scene3.addBubble(entityToRemove.x, scene3.height)
        newBubble_.vy = entityToRemove.vy
        newBubble_.vx = entityToRemove.vx
    })
    outScene2_down.forEach(entityToRemove => {
        const newBubble_ = scene3.addBubble(entityToRemove.position.x + scene3.width / 2, 0)
        newBubble_.vy = Math.abs(newBubble_.vy)
    })
    outScene2_up.forEach(entityToRemove => {
        const newBubble_ = scene1.addBubble(entityToRemove.position.x + scene1.width / 2, scene1.height)
        newBubble_.vy = Math.abs(newBubble_.vy)
    })
    outScene3_down.forEach(entityToRemove => {
        const newBubble_ = scene1.addBubble(entityToRemove.x, 0)
        newBubble_.vy = entityToRemove.vy
        newBubble_.vx = entityToRemove.vx
    })
    outScene3_up.forEach(entityToRemove => {
        const newCube_ = scene2.addCube(entityToRemove.x - scene3.width / 2, -scene3.height / 2)
    })
}
time.on("update", update)