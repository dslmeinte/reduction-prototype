import { asTreeTextWith, serializeNodeBases } from "@lionweb/class-core"
import { idOf } from "@lionweb/core"
import { writeJsonAsFile } from "@lionweb/utilities"
import { writeFileSync } from "fs"
import { join } from "path"

import { exampleProgram } from "./example-program.js"
import { reduce } from "./reducer.js"
import { verbalizationOf } from "./reduction.js"


const artifactsPath = "artifacts"
const programName = "example-program"
const pathPostFixedWith  = (postFix: string) => join(artifactsPath, `${programName}${postFix}`)
writeFileSync(pathPostFixedWith(".txt"), asTreeTextWith(idOf)([exampleProgram]))

const fullReduction = reduce(exampleProgram, [])
writeJsonAsFile(pathPostFixedWith(".reduction.json"), serializeNodeBases([fullReduction.value]))
writeFileSync(pathPostFixedWith(".reduction.txt"), asTreeTextWith(idOf)([fullReduction.value]))
writeFileSync(
    pathPostFixedWith(".findings.txt"),
    fullReduction.findings.map(verbalizationOf).map((str) => str + "\n").join("")
)

