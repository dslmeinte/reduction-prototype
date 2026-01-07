import { asTreeTextWith } from "@lionweb/class-core"
import { idOf } from "@lionweb/core"
import { writeFileSync } from "fs"

import { exampleProgram } from "./example-program.js"


writeFileSync("artifacts/example-program.textualization.txt", asTreeTextWith(idOf)([exampleProgram]))

