import { asTreeTextWith, serializeNodeBases } from "@lionweb/class-core"
import { idOf } from "@lionweb/core"
import { writeJsonAsFile } from "@lionweb/utilities"
import { writeFileSync } from "fs"
import { asString } from "littoral-templates"
import { join } from "path"

import { exampleProgram } from "./example-program.js"
import { reduce } from "./reducer.js"
import { verbalizationOf } from "./reduction.js"
import { tracedTextRenderOf } from "./renderer.js"


const artifactsPath = "artifacts"
const programName = "example-program"
const pathPostFixedWith  = (postFix: string) => join(artifactsPath, `${programName}${postFix}`)
writeFileSync(pathPostFixedWith(".tree.txt"), asTreeTextWith(idOf)([exampleProgram]))
writeFileSync(pathPostFixedWith(".syntax.txt"), tracedTextRenderOf(exampleProgram))

const {value, findings} = reduce(exampleProgram, [])
writeJsonAsFile(pathPostFixedWith(".reduction.json"), serializeNodeBases([value]))
writeFileSync(pathPostFixedWith(".reduction.tree.txt"), asTreeTextWith(idOf)([value]))
writeFileSync(pathPostFixedWith(".reduction.syntax.txt"), tracedTextRenderOf(value))
writeFileSync(
    pathPostFixedWith(".findings.txt"),
    asString(findings.map(verbalizationOf))
)

