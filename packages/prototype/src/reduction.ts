import { Reducible } from "./gen/ReductionDSL.g.js"
import { Finding } from "./findings.js"


export type Reduction = {
    value: Reducible
    wasReductive: boolean
    findings: Finding[]
}

