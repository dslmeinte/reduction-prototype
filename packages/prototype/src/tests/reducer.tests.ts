import { writeFileSync } from "fs"
import { asString } from "littoral-templates"
import { join } from "path"
import { transientNodeFactory } from "../factory.js"
import { verbalizationOf } from "../findings.js"
import { reduceUsing } from "../reducer.js"
import { tracedTextRenderOf } from "../renderer.js"
import { exampleProgram } from "./example-program.js"
import { asTreeText } from "./utils.js"


describe(`binary operation-reducer`, () => {

    it(`reduces the example program (producing artifacts)`, () => {
        const artifactsPath = "artifacts"
        const programName = "example-program"
        const pathPostFixedWith  = (postFix: string) => join(artifactsPath, `${programName}${postFix}`)
        writeFileSync(pathPostFixedWith(".tree.txt"), asTreeText(exampleProgram))
        writeFileSync(pathPostFixedWith(".syntax.txt"), tracedTextRenderOf(exampleProgram))

        const transientsFactory = transientNodeFactory()
        const reduce = reduceUsing(transientsFactory)
        const {value, findings} = reduce(exampleProgram, [])
        const allRoots = [
            value,
            ...transientsFactory.instantiations.filter((transientNode) => transientNode.parent === undefined)
        ]
        writeFileSync(pathPostFixedWith(".reduction.tree.txt"), asTreeText(...allRoots))
        writeFileSync(pathPostFixedWith(".reduction.syntax.txt"), tracedTextRenderOf(value))
        writeFileSync(
            pathPostFixedWith(".findings.txt"),
            asString(findings.map(verbalizationOf))
        )
    })

})

