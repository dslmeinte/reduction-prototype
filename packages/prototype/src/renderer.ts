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
import { isRef } from "@lionweb/core"
import { asString, indentWith } from "littoral-templates"

import {
    ArgumentBinding,
    ArgumentDeclaration,
    ArgumentReference,
    BinaryOperation,
    BinaryOperators,
    FunctionDeclaration,
    FunctionInvocation,
    NumberLiteral,
    Program,
    StringLiteral,
    WrappedOriginalNode
} from "./gen/ReductionDSL.g.js"
import { traceAnnotationsOf } from "./functions.js"


const indent = indentWith("    ")(1)


export type TextRenderer = (node: INodeBase) => string


const operatorToSymbol = (operator: BinaryOperators): string => {
    switch (operator) {
        case BinaryOperators.plus: return "+"
        case BinaryOperators.plusWithPositiveOperands: return "⊕"
    }
}


/**
 * @return a textual rendering of the given {@link INodeBase node}, *without* any tracing information.
 */
export const textRenderOf: TextRenderer = (node) => {

    if (node instanceof ArgumentBinding) {
        return `${node.argument!.name} = ${textRenderOf(node.value)}`
    }

    if (node instanceof ArgumentDeclaration) {
        return `${node.name}`
    }

    if (node instanceof ArgumentReference) {
        return `ref<${node.argument!.name}>`
    }

    if (node instanceof BinaryOperation) {
        return `${textRenderOf(node.left)} ${operatorToSymbol(node.operator)} ${textRenderOf(node.right)}`
    }

    if (node instanceof FunctionDeclaration) {
        return `function ${node.name}(${node.arguments.map(textRenderOf).join(", ")}) ⇒ ${textRenderOf(node.value)}`
    }

    if (node instanceof FunctionInvocation) {
        return `${node.function!.name}(${node.bindings.map(textRenderOf).join(", ")})`
    }

    if (node instanceof NumberLiteral) {
        return `${node.value}`
    }

    if (node instanceof Program) {
        return asString([
            `program:`,
            indent(node.statements.map(textRenderOf))
        ])
    }

    if (node instanceof StringLiteral) {
        return `"${node.value}"`
    }

    if (node instanceof WrappedOriginalNode) {
        return `${isRef(node.originalNode) ? textRenderOf(node.originalNode) : "<unresolved original node>"}`
    }

    throw new Error(`couldn’t render instance of ${node.classifier.name} as text: not implemented`)

}


/**
 * @return a textual rendering of the given {@link INodeBase node}, *with* tracing information.
 * (In case a node has multiple {@link TraceAnnotation trace annotations} on it, only the first is shown.)
 */
export const tracedTextRenderOf = (node: INodeBase): string => {

    const internalRenderOf = (node: INodeBase): string => {
        if (node instanceof ArgumentBinding) {
            return `${node.argument!.name} = ${tracedTextRenderOf(node.value)}`
        }

        if (node instanceof ArgumentDeclaration) {
            return `${node.name}`
        }

        if (node instanceof ArgumentReference) {
            return `ref<${node.argument!.name}>`
        }

        if (node instanceof BinaryOperation) {
            return `${tracedTextRenderOf(node.left)} ${operatorToSymbol(node.operator)} ${tracedTextRenderOf(node.right)}`
        }

        if (node instanceof FunctionDeclaration) {
            return `function ${node.name}(${node.arguments.map(tracedTextRenderOf).join(", ")}) ⇒ ${tracedTextRenderOf(node.value)}`
        }

        if (node instanceof FunctionInvocation) {
            return `${node.function!.name}(${node.bindings.map(tracedTextRenderOf).join(", ")})`
        }

        if (node instanceof NumberLiteral) {
            return `${node.value}`
        }

        if (node instanceof Program) {
            return asString([
                `program:`,
                indent(node.statements.map(tracedTextRenderOf))
            ])
        }

        if (node instanceof StringLiteral) {
            return `"${node.value}"`
        }

        if (node instanceof WrappedOriginalNode) {
            return `${isRef(node.originalNode) ? tracedTextRenderOf(node.originalNode) : "<unresolved original node>"}`
        }

        throw new Error(`couldn’t render instance of ${node.classifier.name} as text: not implemented`)
    }

    const innerRender = internalRenderOf(node)
    const traceAnnotations = traceAnnotationsOf(node)
    if (traceAnnotations.length === 0) {
        return innerRender
    }

    // take the first one (=arbitrary choice):
    const {reducedNode, relevantBindings} = traceAnnotations[0]
    const innerTraceMessage = (isRef(reducedNode) ? internalRenderOf(reducedNode) : "<unresolved reduced node>")
        + (relevantBindings.length === 0 ? "" : `, with ${relevantBindings.filter(isRef).map(({argument, value}) => `${argument!.name} = ${textRenderOf(value)}`).join(", ")}`)
    return `[${innerRender} {= reduction of: ${innerTraceMessage}}]`
}

