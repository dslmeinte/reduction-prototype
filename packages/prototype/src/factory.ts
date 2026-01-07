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
import { LionWebId } from "@lionweb/json"


export type IdProvider = () => LionWebId
let previousId = 0  // (use one integer sequence to avoid confusion with duplicate numbers)
const idProviderWith = (prefix: string) =>
    () => `${prefix}${++previousId}`

export const originalId = idProviderWith("id-")
export const transientId = idProviderWith("transient-id-")


export const argumentBinding = (argument: ArgumentDeclaration, value: Value, idProvider = originalId) => {
    const binding = ArgumentBinding.create(idProvider())
    binding.argument = argument
    binding.value = value
    return binding
}

export const binaryOperation = (operator: BinaryOperators, left: Value, right: Value, idProvider = originalId) => {
    const binaryOperation = BinaryOperation.create(idProvider())
    binaryOperation.operator = operator
    binaryOperation.left = left
    binaryOperation.right = right
    return binaryOperation
}

export const functionInvocation = (functionDeclaration: FunctionDeclaration, argumentBindings: ArgumentBinding[], idProvider = originalId) => {
    const invocation = FunctionInvocation.create(idProvider())
    invocation.function = functionDeclaration
    argumentBindings.forEach((binding) => {
        invocation.addBindings(binding)
    })
    return invocation
}

export const numberLiteral = (value: number, idProvider = originalId) => {
    const node = NumberLiteral.create(idProvider())
    node.value = value
    return node
}

export const stringLiteral = (value: string, idProvider = originalId) => {
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
    const wrappedOriginalNode = WrappedOriginalNode.create(transientId())
    wrappedOriginalNode.originalNode = originalNode
    return wrappedOriginalNode
}

