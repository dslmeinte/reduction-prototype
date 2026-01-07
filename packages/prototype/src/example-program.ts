import {
    ArgumentDeclaration,
    ArgumentReference,
    BinaryOperators,
    FunctionDeclaration,
    Parentheses,
    Program,
    Value
} from "./gen/ReductionDSL.g.js"
import {
    argumentBinding,
    binaryOperation,
    functionInvocation,
    numberLiteral,
    stringLiteral
} from "./factory.js"
import { originalId } from "./ids.js"


const foo = FunctionDeclaration.create(originalId())
foo.name = "foo"
const argX = ArgumentDeclaration.create(originalId())
argX.name = "X"
foo.addArguments(argX)

const refX = ArgumentReference.create(originalId())
refX.argument = argX

const innerPlus = binaryOperation(BinaryOperators.plusWithPositiveOperands, numberLiteral(1), refX)

const parentheses = Parentheses.create(originalId())
parentheses.inner = innerPlus

const outerPlus = binaryOperation(BinaryOperators.plus, parentheses, numberLiteral(3))

foo.value = outerPlus


const invokeFooWith = (value: Value) =>
    functionInvocation(foo, [argumentBinding(argX, value)])

const fooAt2 = invokeFooWith(numberLiteral(2))
const fooAt_1 = invokeFooWith(numberLiteral(-1))
const fooAtBar = invokeFooWith(stringLiteral("bar"))


export const exampleProgram = Program.create(originalId())
exampleProgram.addStatements(foo)
exampleProgram.addStatements(fooAt2)
exampleProgram.addStatements(fooAt_1)
exampleProgram.addStatements(fooAtBar)

