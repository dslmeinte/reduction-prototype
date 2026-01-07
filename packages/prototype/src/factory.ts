import {
    ArgumentBinding,
    ArgumentDeclaration,
    BinaryOperation,
    BinaryOperators,
    FunctionDeclaration,
    FunctionInvocation,
    NumberLiteral,
    Reducible,
    StringLiteral,
    TraceAnnotation,
    Value,
    WrappedOriginalNode
} from "./gen/ReductionDSL.g.js"
import { IdProvider, isOriginal, originalId, transientId } from "./ids.js"


export const argumentBinding = (argument: ArgumentDeclaration, value: Value, idProvider: IdProvider = originalId) => {
    const binding = ArgumentBinding.create(idProvider())
    binding.argument = argument
    binding.value = value
    return binding
}

export const binaryOperation = (operator: BinaryOperators, left: Value, right: Value, idProvider: IdProvider = originalId) => {
    const binaryOperation = BinaryOperation.create(idProvider())
    binaryOperation.operator = operator
    binaryOperation.left = left
    binaryOperation.right = right
    return binaryOperation
}

export const functionInvocation = (functionDeclaration: FunctionDeclaration, argumentBindings: ArgumentBinding[], idProvider: IdProvider = originalId) => {
    const invocation = FunctionInvocation.create(idProvider())
    invocation.function = functionDeclaration
    argumentBindings.forEach((binding) => {
        invocation.addBindings(binding)
    })
    return invocation
}

export const numberLiteral = (value: number, idProvider: IdProvider = originalId) => {
    const node = NumberLiteral.create(idProvider())
    node.value = value
    return node
}

export const stringLiteral = (value: string, idProvider: IdProvider = originalId) => {
    const node = StringLiteral.create(idProvider())
    node.value = value
    return node
}



export const withTrace = (resultNode: Reducible, reducedNode: Reducible) => {
    const traceAnnotation = TraceAnnotation.create(transientId())
    traceAnnotation.reducedNode = reducedNode
    resultNode.addAnnotation(traceAnnotation)
    return resultNode
}

export const wrappedOriginalNode = (originalNode: Reducible) => {
    if (!isOriginal(originalNode)) {
        throw new Error(`wrapping a transient node as original`)
    }
    const wrappedOriginalNode = WrappedOriginalNode.create(transientId())
    wrappedOriginalNode.originalNode = originalNode
    return wrappedOriginalNode
}

