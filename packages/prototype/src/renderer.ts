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
    Parentheses,
    Program,
    StringLiteral,
    WrappedOriginalNode
} from "./gen/ReductionDSL.g.js"
import { traceAnnotationOf } from "./functions.js"


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

    if (node instanceof Parentheses) {
        return `(${textRenderOf(node.inner)})`
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

        if (node instanceof Parentheses) {
            return `(${tracedTextRenderOf(node.inner)})`
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

    const recurse = internalRenderOf(node)
    const maybeTraceAnnotation = traceAnnotationOf(node)
    if (maybeTraceAnnotation === undefined) {
        return recurse
    }

    const {reducedNode, relevantBindings} = maybeTraceAnnotation
    const innerTraceMessage = (isRef(reducedNode) ? internalRenderOf(reducedNode) : "<unresolved reduced node>")
        + (relevantBindings.length === 0 ? "" : `, with ${relevantBindings.filter(isRef).map(({argument, value}) => `${argument!.name} = ${textRenderOf(value)}`).join(", ")}`)
    return `[${recurse} {= reduction of: ${innerTraceMessage}}]`
}

