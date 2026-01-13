import { INodeBase } from "@lionweb/class-core"
import { Reducible } from "./gen/ReductionDSL.g.js"
import { Reduction } from "./reduction.js"
import { textRenderOf } from "./renderer.js"
import { extractorOf } from "./utils.js"


/**
 * Type def. for a finding.
 */
export type Finding = {
    node: INodeBase
    findingMessage: string
}

/**
 * @return a {@link Finding} instance with the given node and finding message.
 * (convenience)
 */
export const finding = (node: INodeBase, findingMessage: string): Finding => ({ node, findingMessage })

/**
 * @return a textual verbalizatino of the given {@link Finding}.
 */
export const verbalizationOf = ({node, findingMessage}: Finding) =>
    `on node with ID "${node.id}": ${findingMessage}`


type FindingAdder = (condition: boolean, messageThunk: (findingNodeAsText: string) => string) => void

/**
 * Function to help with conveniently producing findings.
 */
export const findingsOnTopOf = (findingNode: Reducible, ...subReductions: Reduction[]):
        [findings: Finding[], produceFindingIf: FindingAdder] => {
    const findings = subReductions.flatMap(extractorOf("findings"))
    return [
        findings,
        (condition, messageThunk) => {
            if (condition) {
                findings.push(finding(findingNode, messageThunk(textRenderOf(findingNode))))
            }
        }
    ]
}

