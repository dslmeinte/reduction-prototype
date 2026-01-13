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

import { allSuperTypesOf, Concept, nameSorted } from "@lionweb/core"
import { asString, commaSeparated, indentWith } from "littoral-templates"

import { Reducible, reductionDSLLanguage } from "./language-definition.js"
import { header } from "./header.js"


const indent = indentWith("    ")(1)

export const contentsOfReduciblesFile = () => {
    const reducibles = nameSorted(
        reductionDSLLanguage.entities
            .filter((entity) => entity instanceof Concept)
            .filter((entity) => !entity.abstract && allSuperTypesOf(entity).indexOf(Reducible) > -1)
    )

    return asString([
        header,
        `import { INodeBase } from "@lionweb/class-core"`,
        `import { Concept } from "@lionweb/core"`,
        ``,
        `import { Reducible, ReductionDSLBase } from "./ReductionDSL.g.js"`,
        ``,
        ``,
        `const base = ReductionDSLBase.INSTANCE`,
        `const reducibleMetaTypes = [`,
        indent(commaSeparated(reducibles.map(({name}) => `base.${name}`))),
        `]`,
        ``,
        `/**`,
        ` * Type guard for the {@link Reducible} interface type.`,
        ` */`,
        `export const isReducible = (node: INodeBase): node is Reducible =>`,
        indent(`reducibleMetaTypes.indexOf(node.classifier as Concept) > -1`),
        ``
    ])
}

