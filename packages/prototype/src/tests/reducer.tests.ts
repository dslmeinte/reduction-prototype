// Copyright 2026 TRUMPF Laser SE and other contributors
//
// Licensed under the Apache License, Version 2.0 (the "License")
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-FileCopyrightText: 2026 TRUMPF Laser SE and other contributors
// SPDX-License-Identifier: Apache-2.0

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

