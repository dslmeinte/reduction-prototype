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

