import { allSuperTypesOf, Concept, inheritsDirectlyFrom, isConcrete, nameOf, nameSorted } from "@lionweb/core"
import { asString, commaSeparated, indentWith } from "littoral-templates"

import { Reducible, reductionDSLLanguage } from "./language-definition.js"
import { dependencyOrderOf } from "@lionweb/ts-utils";


const indent = indentWith("    ")(1)

export const generateReducersTemplate = () => {
    const reducibles = nameSorted(
        reductionDSLLanguage.entities
            .filter((entity) => entity instanceof Concept)
            .filter((entity) => !entity.abstract && allSuperTypesOf(entity).indexOf(Reducible) > -1)
    )

    const inInheritanceOrder = dependencyOrderOf(reducibles, inheritsDirectlyFrom)
    if (inInheritanceOrder === false) {
        throw new Error(`cycle detected: couldn’t determine inheritance order`)
    }

    const dslImports = [ ...[...reducibles, Reducible].map(nameOf), "ReductionDSLBase" ]
    dslImports.sort()
    return asString([
        `import { INodeBase } from "@lionweb/class-core"`,
        `import { Concept } from "@lionweb/core"`,
        ``,
        `import {`,
        indent(
            commaSeparated(dslImports)
        ),
        `} from "./ReductionDSL.g.js"`,
        `import { Reducer } from "../reduction.js"`,
        ``,
        ``,
        `/**`,
        ` * Type definition for objects with reducers for all reducible concepts.`,
        ` */`,
        `export type Reducers = {`,
        indent(
            reducibles.map(({name}) => `reduce${name}: Reducer<${name}>`)
        ),
        `}`,
        ``,
        `export const reducerWith = (reducers: Reducers): Reducer<Reducible> =>`,
        indent([
            `(node, nonLocalValues) => {`,
            indent(
                inInheritanceOrder.filter(isConcrete).reverse().map(({name}) => [
                    `if (node instanceof ${name}) {`,
                    indent(`return reducers.reduce${name}(node, nonLocalValues)`),
                    `}`
                ]),
                "throw new Error(`couldn’t reduce instance of ${node.classifier.name}: not implemented`)"
            ),
            `}`
        ]),
        ``,
        `const base = ReductionDSLBase.INSTANCE`,
        `const reducibleMetaTypes = [`,
        indent(commaSeparated(reducibles.map(({name}) => `base.${name}`))),
        `]`,
        `export const isReducible = (node: INodeBase): node is Reducible =>`,
        indent(`reducibleMetaTypes.indexOf(node.classifier as Concept) > -1`),
        ``
    ])
}

