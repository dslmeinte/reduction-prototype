import { generateLanguage } from "@lionweb/class-core-generator"
import { builtinClassifiers, builtinPrimitives, LanguageFactory } from "@lionweb/core"
import { concatenator } from "@lionweb/ts-utils"
import { generatePlantUmlForLanguage, languageAsText } from "@lionweb/utilities"
import { writeFileSync } from "fs"
import { join } from "path"

const languageName = "ReductionDSL"
const factory = new LanguageFactory(languageName, "1", concatenator("-"), concatenator("-"))
const { language } = factory

const { inamed } = builtinClassifiers
const { integerDataType, stringDataType } = builtinPrimitives


const Statement = factory.interface("Statement")
const Value = factory.interface("Value")


const ArgumentDeclaration = factory.concept("ArgumentDeclaration", false).implementing(inamed)

const FunctionDeclaration = factory.concept("FunctionDeclaration", false).implementing(inamed, Statement)
factory.containment(FunctionDeclaration, "arguments").ofType(ArgumentDeclaration).isOptional().isMultiple()
factory.containment(FunctionDeclaration, "value").ofType(Value)


const Literal = factory.interface("Literal").extending(Value)

const NumberLiteral = factory.concept("NumberLiteral", false).implementing(Literal)
factory.property(NumberLiteral, "value").ofType(integerDataType)

const StringLiteral = factory.concept("StringLiteral", false).implementing(Literal)
factory.property(StringLiteral, "value").ofType(stringDataType)

const Parentheses = factory.concept("Parentheses", false).implementing(Value)
factory.containment(Parentheses, "value").ofType(Value)

const BinaryOperators = factory.enumeration("BinaryOperators")
factory.enumerationLiteral(BinaryOperators, "plus")
factory.enumerationLiteral(BinaryOperators, "plusWithPositiveOperands")

const BinaryOperation = factory.concept("BinaryOperation", false).implementing(Value)
factory.property(BinaryOperation, "operator").ofType(BinaryOperators)
factory.containment(BinaryOperation, "left").ofType(Value)
factory.containment(BinaryOperation, "right").ofType(Value)

const ArgumentBinding = factory.concept("ArgumentBinding", false)
factory.reference(ArgumentBinding, "argument").ofType(ArgumentDeclaration)
factory.containment(ArgumentBinding, "value").ofType(Value)

const FunctionInvocation = factory.concept("FunctionInvocation", false).implementing(Value, Statement)
factory.reference(FunctionInvocation, "function").ofType(FunctionDeclaration)
factory.containment(FunctionInvocation, "bindings").ofType(ArgumentBinding).isOptional().isMultiple()

const ArgumentReference = factory.concept("ArgumentReference", false).implementing(Value)
factory.reference(ArgumentReference, "argument").ofType(ArgumentDeclaration)


const Program = factory.concept("Program", false)
factory.containment(Program, "statements").ofType(Statement).isOptional().isMultiple()


const artifactsPath = "artifacts"
writeFileSync(join(artifactsPath, `${languageName}.language.txt`), languageAsText(language))
writeFileSync(join(artifactsPath, `${languageName}.language.puml`), generatePlantUmlForLanguage(language))
generateLanguage(language, "../prototype/src/gen")

