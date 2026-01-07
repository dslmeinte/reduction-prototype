import {
    ArgumentBinding,
    ArgumentDeclaration,
    FunctionDeclaration,
    FunctionInvocation,
    NumberLiteral,
    Reducible,
    TraceAnnotation,
    Value
} from "./gen/ReductionDSL.g.js"


let previousId = 0
export const id = () => `id-${++previousId}`


export const numberLiteral = (value: number) => {
    const node = NumberLiteral.create(id())
    node.value = value
    return node
}


export const functionInvocation = (functionDeclaration: FunctionDeclaration, ...argumentBindings: ArgumentBinding[]) => {
    const invocation = FunctionInvocation.create(id())
    invocation.function = functionDeclaration
    argumentBindings.forEach((binding) => {
        invocation.addBindings(binding)
    })
    return invocation
}


export const argumentBinding = (argument: ArgumentDeclaration, value: Value) => {
    const binding = ArgumentBinding.create(id())
    binding.argument = argument
    binding.value = value
    return binding
}


let previousTransientId = 0
export const transientId = () => `transient-id-${++previousTransientId}`

export const withTrace = (resultNode: Reducible, reducedNode: Reducible) => {
    const traceAnnotation = TraceAnnotation.create(id())
    traceAnnotation.reducedNode = reducedNode
    resultNode.addAnnotation(traceAnnotation)
    return resultNode
}

