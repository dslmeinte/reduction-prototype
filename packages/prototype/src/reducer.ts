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

import { isRef } from "@lionweb/core"
import {
    ArgumentBinding,
    ArgumentReference,
    BinaryOperation,
    FunctionInvocation,
    NumberLiteral,
    Parentheses,
    Program,
    Reducible,
    StringLiteral
} from "./gen/ReductionDSL.g.js"
import { isReducible } from "./gen/reducibles.g.js"
import { reduceBinaryOperation } from "./binary-operation.js"
import { NodeFactory, withTrace } from "./factory.js"
import { finding } from "./findings.js"
import { isOriginal } from "./ids.js"
import { Reduction } from "./reduction.js"


/**
 * Type def. for functions that reduce a given reducible *original* node,
 * also given *non-local values* in the form of {@link ArgumentBinding argument bindings}.
 */
export type Reducer<NT extends Reducible> = (node: NT, nonLocalValues: ArgumentBinding[]) => Reduction

/**
 * @return a {@link Reducer} given a {@link NodeFactory} for transient nodes.
 */
export const reduceUsing = (transientNodeFactory: NodeFactory): Reducer<Reducible> => {

    // (define a recursively-called function:)
    const reduce = (node: Reducible, nonLocalValues: ArgumentBinding[]): Reduction => {

        if (!isOriginal(node)) {
            throw new Error(`trying to reduce a non-original node with ID "${node.id}"`)
        }

        if (node instanceof ArgumentReference) {
            const lookups = nonLocalValues.filter((binding) => binding.argument === node.argument)
            return lookups.length === 1
                ? {
                    value: withTrace(transientNodeFactory.wrappedOriginalNode(lookups[0].value), node, lookups[0]),
                    wasReductive: true,
                    findings: []
                }
                : {
                    value: node,
                    wasReductive: false,
                    findings: [
                        finding(node, isRef(node.argument) ? `The argument ${node.argument!.name} is not bound locally.` : `The argument reference doesn’t resolve.`)
                    ]
                }
        }

        if (node instanceof BinaryOperation) {
            const leftReduction = reduce(node.left, nonLocalValues)
            const rightReduction = reduce(node.right, nonLocalValues)
            return reduceBinaryOperation(node, leftReduction, rightReduction, transientNodeFactory)
        }

        if (node instanceof FunctionInvocation) {
            if (isRef(node.function)) {
                // TODO  check whether bindings match exactly with the arguments declared on the function — can’t reduce if not all are bound / need findings on doubly-bound ones
                const reduction = reduce(node.function.value, [...nonLocalValues, ...node.bindings])
                return {
                    value: withTrace(reduction.value, node, ...nonLocalValues),
                    wasReductive: true,
                    findings: reduction.findings   // (see TODO above)
                }
            }
            return {
                value: node,
                wasReductive: false,
                findings: [
                    finding(node, `The function reference doesn’t resolve.`)
                ]
            }
        }

        if (node instanceof NumberLiteral || node instanceof StringLiteral) {
            return {
                value: transientNodeFactory.wrappedOriginalNode(node),
                wasReductive: false,
                findings: []
            }
        }

        if (node instanceof Parentheses) {
            const innerReduction = reduce(node.inner, nonLocalValues)
            return {
                value: withTrace(innerReduction.value, node),
                wasReductive: true,
                findings: innerReduction.findings
            }
        }

        if (node instanceof Program) {
            const reductionsOfReducibleStatements = node.statements.filter(isReducible).map((statement) => reduce(statement, nonLocalValues))
            // (We don’t have to keep function declarations in case function invocation don’t reduce completely, because the partial reductions would reference the original function declarations.)
            return {
                value: withTrace(transientNodeFactory.program(...reductionsOfReducibleStatements.map(({value}) => value)), node),
                wasReductive: reductionsOfReducibleStatements.some(({wasReductive}) => wasReductive),
                findings: reductionsOfReducibleStatements.flatMap(({findings}) => findings)
            }
        }

        throw new Error(`couldn’t reduce instance of ${node.classifier.name}: not implemented`)
    }

    return reduce
}

