import { allSuperTypesOf, Concept, nameSorted } from "@lionweb/core"
import { asString, commaSeparated, indentWith } from "littoral-templates"

import { Reducible, reductionDSLLanguage } from "./language-definition.js"


const indent = indentWith("    ")(1)

export const contentsOfReduciblesFile = () => {
    const reducibles = nameSorted(
        reductionDSLLanguage.entities
            .filter((entity) => entity instanceof Concept)
            .filter((entity) => !entity.abstract && allSuperTypesOf(entity).indexOf(Reducible) > -1)
    )

    return asString([
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

