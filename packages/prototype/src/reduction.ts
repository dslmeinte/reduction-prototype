import { INodeBase } from "@lionweb/class-core"
import { Reducible } from "./gen/ReductionDSL.g.js"


export type Finding = {
    node: INodeBase
    findingMessage: string
}

export const verbalizationOf = ({node, findingMessage}: Finding) =>
    `on node with ID "${node.id}": ${findingMessage}`

export type Reduction = {
    value: Reducible
    findings: Finding[]
}

