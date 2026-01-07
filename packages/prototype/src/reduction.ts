import { INodeBase } from "@lionweb/class-core"
import { ArgumentBinding, Reducible } from "./gen/ReductionDSL.g.js"


export type Finding = {
    node: Reducible
    findingMessage: string
}

export type Reduction = {
    value: Reducible
    findings: Finding[]
}

export type Reducer<NT extends INodeBase> = (node: NT, nonLocalValues: ArgumentBinding[]) => Reduction

