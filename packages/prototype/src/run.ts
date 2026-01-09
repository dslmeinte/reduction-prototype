import { asTreeTextWith } from "@lionweb/class-core"
import { idOf } from "@lionweb/core"
import { writeFileSync } from "fs"
import { asString } from "littoral-templates"
import { join } from "path"

import { exampleProgram } from "./example-program.js"
import { transientNodeFactory } from "./factory.js"
import { reduceUsing } from "./reducer.js"
import { verbalizationOf } from "./reduction.js"
import { tracedTextRenderOf } from "./renderer.js"


const artifactsPath = "artifacts"
const programName = "example-program"
const pathPostFixedWith  = (postFix: string) => join(artifactsPath, `${programName}${postFix}`)
writeFileSync(pathPostFixedWith(".tree.txt"), asTreeTextWith(idOf)([exampleProgram]))
writeFileSync(pathPostFixedWith(".syntax.txt"), tracedTextRenderOf(exampleProgram))

const transientsFactory = transientNodeFactory()
const reduce = reduceUsing(transientsFactory)
const {value, findings} = reduce(exampleProgram, [])
const allRoots = [
    value,
    ...transientsFactory.instantiations.filter((transientNode) => transientNode.parent === undefined)
]
writeFileSync(pathPostFixedWith(".reduction.tree.txt"), asTreeTextWith(idOf)(allRoots))
writeFileSync(pathPostFixedWith(".reduction.syntax.txt"), tracedTextRenderOf(value))
writeFileSync(
    pathPostFixedWith(".findings.txt"),
    asString(findings.map(verbalizationOf))
)

