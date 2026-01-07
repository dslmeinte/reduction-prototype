/*
 * language's metadata:
 *     name:    ReductionDSL
 *     version: 1
 *     key:     ReductionDSL
 *     id:      ReductionDSL
 */


import {
    Annotation,
    Classifier,
    Concept,
    Containment,
    Enumeration,
    EnumerationLiteral,
    Interface,
    Language,
    Property,
    Reference,
    SingleRef
} from "@lionweb/core";

import {
    LionWebId
} from "@lionweb/json";

import {
    ContainmentValueManager,
    DeltaReceiver,
    ILanguageBase,
    INamed,
    INodeBase,
    LionCore_builtinsBase,
    NodeBase,
    NodeBaseFactory,
    OptionalMultiContainmentValueManager,
    Parentage,
    PropertyValueManager,
    ReferenceValueManager,
    RequiredPropertyValueManager,
    RequiredSingleContainmentValueManager,
    RequiredSingleReferenceValueManager
} from "@lionweb/class-core";


export class ReductionDSLBase implements ILanguageBase {

    private readonly _language: Language = new Language("ReductionDSL", "1", "ReductionDSL", "ReductionDSL");
    get language(): Language {
        this.ensureWiredUp();
        return this._language;
    }

    public readonly _Reducible = new Interface(this._language, "Reducible", "ReductionDSL-Reducible", "ReductionDSL-Reducible");
    get Reducible(): Interface {
        this.ensureWiredUp();
        return this._Reducible;
    }

    public readonly _Statement = new Interface(this._language, "Statement", "ReductionDSL-Statement", "ReductionDSL-Statement");
    get Statement(): Interface {
        this.ensureWiredUp();
        return this._Statement;
    }

    public readonly _Value = new Interface(this._language, "Value", "ReductionDSL-Value", "ReductionDSL-Value");
    get Value(): Interface {
        this.ensureWiredUp();
        return this._Value;
    }

    public readonly _ArgumentDeclaration = new Concept(this._language, "ArgumentDeclaration", "ReductionDSL-ArgumentDeclaration", "ReductionDSL-ArgumentDeclaration", false);
    get ArgumentDeclaration(): Concept {
        this.ensureWiredUp();
        return this._ArgumentDeclaration;
    }

    public readonly _FunctionDeclaration = new Concept(this._language, "FunctionDeclaration", "ReductionDSL-FunctionDeclaration", "ReductionDSL-FunctionDeclaration", false);
    get FunctionDeclaration(): Concept {
        this.ensureWiredUp();
        return this._FunctionDeclaration;
    }
    private readonly _FunctionDeclaration_arguments = new Containment(this._FunctionDeclaration, "arguments", "ReductionDSL-FunctionDeclaration-arguments", "ReductionDSL-FunctionDeclaration-arguments").isOptional().isMultiple();
    get FunctionDeclaration_arguments(): Containment {
        this.ensureWiredUp();
        return this._FunctionDeclaration_arguments;
    }
    private readonly _FunctionDeclaration_value = new Containment(this._FunctionDeclaration, "value", "ReductionDSL-FunctionDeclaration-value", "ReductionDSL-FunctionDeclaration-value");
    get FunctionDeclaration_value(): Containment {
        this.ensureWiredUp();
        return this._FunctionDeclaration_value;
    }

    public readonly _Literal = new Interface(this._language, "Literal", "ReductionDSL-Literal", "ReductionDSL-Literal");
    get Literal(): Interface {
        this.ensureWiredUp();
        return this._Literal;
    }

    public readonly _NumberLiteral = new Concept(this._language, "NumberLiteral", "ReductionDSL-NumberLiteral", "ReductionDSL-NumberLiteral", false);
    get NumberLiteral(): Concept {
        this.ensureWiredUp();
        return this._NumberLiteral;
    }
    private readonly _NumberLiteral_value = new Property(this._NumberLiteral, "value", "ReductionDSL-NumberLiteral-value", "ReductionDSL-NumberLiteral-value");
    get NumberLiteral_value(): Property {
        this.ensureWiredUp();
        return this._NumberLiteral_value;
    }

    public readonly _StringLiteral = new Concept(this._language, "StringLiteral", "ReductionDSL-StringLiteral", "ReductionDSL-StringLiteral", false);
    get StringLiteral(): Concept {
        this.ensureWiredUp();
        return this._StringLiteral;
    }
    private readonly _StringLiteral_value = new Property(this._StringLiteral, "value", "ReductionDSL-StringLiteral-value", "ReductionDSL-StringLiteral-value");
    get StringLiteral_value(): Property {
        this.ensureWiredUp();
        return this._StringLiteral_value;
    }

    public readonly _Parentheses = new Concept(this._language, "Parentheses", "ReductionDSL-Parentheses", "ReductionDSL-Parentheses", false);
    get Parentheses(): Concept {
        this.ensureWiredUp();
        return this._Parentheses;
    }
    private readonly _Parentheses_value = new Containment(this._Parentheses, "value", "ReductionDSL-Parentheses-value", "ReductionDSL-Parentheses-value");
    get Parentheses_value(): Containment {
        this.ensureWiredUp();
        return this._Parentheses_value;
    }

    public readonly _BinaryOperators = new Enumeration(this._language, "BinaryOperators", "ReductionDSL-BinaryOperators", "ReductionDSL-BinaryOperators");
    get BinaryOperators(): Enumeration {
        this.ensureWiredUp();
        return this._BinaryOperators;
    }
    private readonly _BinaryOperators_plus = new EnumerationLiteral(this._BinaryOperators, "plus", "ReductionDSL-BinaryOperators-plus", "ReductionDSL-BinaryOperators-plus");
    get BinaryOperators_plus(): EnumerationLiteral {
        this.ensureWiredUp();
        return this._BinaryOperators_plus;
    }
    private readonly _BinaryOperators_plusWithPositiveOperands = new EnumerationLiteral(this._BinaryOperators, "plusWithPositiveOperands", "ReductionDSL-BinaryOperators-plusWithPositiveOperands", "ReductionDSL-BinaryOperators-plusWithPositiveOperands");
    get BinaryOperators_plusWithPositiveOperands(): EnumerationLiteral {
        this.ensureWiredUp();
        return this._BinaryOperators_plusWithPositiveOperands;
    }

    public readonly _BinaryOperation = new Concept(this._language, "BinaryOperation", "ReductionDSL-BinaryOperation", "ReductionDSL-BinaryOperation", false);
    get BinaryOperation(): Concept {
        this.ensureWiredUp();
        return this._BinaryOperation;
    }
    private readonly _BinaryOperation_operator = new Property(this._BinaryOperation, "operator", "ReductionDSL-BinaryOperation-operator", "ReductionDSL-BinaryOperation-operator");
    get BinaryOperation_operator(): Property {
        this.ensureWiredUp();
        return this._BinaryOperation_operator;
    }
    private readonly _BinaryOperation_left = new Containment(this._BinaryOperation, "left", "ReductionDSL-BinaryOperation-left", "ReductionDSL-BinaryOperation-left");
    get BinaryOperation_left(): Containment {
        this.ensureWiredUp();
        return this._BinaryOperation_left;
    }
    private readonly _BinaryOperation_right = new Containment(this._BinaryOperation, "right", "ReductionDSL-BinaryOperation-right", "ReductionDSL-BinaryOperation-right");
    get BinaryOperation_right(): Containment {
        this.ensureWiredUp();
        return this._BinaryOperation_right;
    }

    public readonly _ArgumentBinding = new Concept(this._language, "ArgumentBinding", "ReductionDSL-ArgumentBinding", "ReductionDSL-ArgumentBinding", false);
    get ArgumentBinding(): Concept {
        this.ensureWiredUp();
        return this._ArgumentBinding;
    }
    private readonly _ArgumentBinding_argument = new Reference(this._ArgumentBinding, "argument", "ReductionDSL-ArgumentBinding-argument", "ReductionDSL-ArgumentBinding-argument");
    get ArgumentBinding_argument(): Reference {
        this.ensureWiredUp();
        return this._ArgumentBinding_argument;
    }
    private readonly _ArgumentBinding_value = new Containment(this._ArgumentBinding, "value", "ReductionDSL-ArgumentBinding-value", "ReductionDSL-ArgumentBinding-value");
    get ArgumentBinding_value(): Containment {
        this.ensureWiredUp();
        return this._ArgumentBinding_value;
    }

    public readonly _FunctionInvocation = new Concept(this._language, "FunctionInvocation", "ReductionDSL-FunctionInvocation", "ReductionDSL-FunctionInvocation", false);
    get FunctionInvocation(): Concept {
        this.ensureWiredUp();
        return this._FunctionInvocation;
    }
    private readonly _FunctionInvocation_function = new Reference(this._FunctionInvocation, "function", "ReductionDSL-FunctionInvocation-function", "ReductionDSL-FunctionInvocation-function");
    get FunctionInvocation_function(): Reference {
        this.ensureWiredUp();
        return this._FunctionInvocation_function;
    }
    private readonly _FunctionInvocation_bindings = new Containment(this._FunctionInvocation, "bindings", "ReductionDSL-FunctionInvocation-bindings", "ReductionDSL-FunctionInvocation-bindings").isOptional().isMultiple();
    get FunctionInvocation_bindings(): Containment {
        this.ensureWiredUp();
        return this._FunctionInvocation_bindings;
    }

    public readonly _ArgumentReference = new Concept(this._language, "ArgumentReference", "ReductionDSL-ArgumentReference", "ReductionDSL-ArgumentReference", false);
    get ArgumentReference(): Concept {
        this.ensureWiredUp();
        return this._ArgumentReference;
    }
    private readonly _ArgumentReference_argument = new Reference(this._ArgumentReference, "argument", "ReductionDSL-ArgumentReference-argument", "ReductionDSL-ArgumentReference-argument");
    get ArgumentReference_argument(): Reference {
        this.ensureWiredUp();
        return this._ArgumentReference_argument;
    }

    public readonly _Program = new Concept(this._language, "Program", "ReductionDSL-Program", "ReductionDSL-Program", false);
    get Program(): Concept {
        this.ensureWiredUp();
        return this._Program;
    }
    private readonly _Program_statements = new Containment(this._Program, "statements", "ReductionDSL-Program-statements", "ReductionDSL-Program-statements").isOptional().isMultiple();
    get Program_statements(): Containment {
        this.ensureWiredUp();
        return this._Program_statements;
    }

    public readonly _TraceAnnotation = new Annotation(this._language, "TraceAnnotation", "ReductionDSL-TraceAnnotation", "ReductionDSL-TraceAnnotation");
    get TraceAnnotation(): Annotation {
        this.ensureWiredUp();
        return this._TraceAnnotation;
    }
    private readonly _TraceAnnotation_reducedNode = new Reference(this._TraceAnnotation, "reducedNode", "ReductionDSL-TraceAnnotation-reducedNode", "ReductionDSL-TraceAnnotation-reducedNode");
    get TraceAnnotation_reducedNode(): Reference {
        this.ensureWiredUp();
        return this._TraceAnnotation_reducedNode;
    }

    private _wiredUp: boolean = false;
    private ensureWiredUp() {
        if (this._wiredUp) {
            return;
        }
        this._language.havingEntities(this._Reducible, this._Statement, this._Value, this._ArgumentDeclaration, this._FunctionDeclaration, this._Literal, this._NumberLiteral, this._StringLiteral, this._Parentheses, this._BinaryOperators, this._BinaryOperation, this._ArgumentBinding, this._FunctionInvocation, this._ArgumentReference, this._Program, this._TraceAnnotation);
        this._Value.extending(this._Reducible, this._Statement);
        this._ArgumentDeclaration.implementing(LionCore_builtinsBase.INSTANCE._INamed);
        this._FunctionDeclaration.implementing(LionCore_builtinsBase.INSTANCE._INamed, this._Statement);
        this._FunctionDeclaration.havingFeatures(this._FunctionDeclaration_arguments, this._FunctionDeclaration_value);
        this._FunctionDeclaration_arguments.ofType(this._ArgumentDeclaration);
        this._FunctionDeclaration_value.ofType(this._Value);
        this._Literal.extending(this._Value);
        this._NumberLiteral.implementing(this._Literal);
        this._NumberLiteral.havingFeatures(this._NumberLiteral_value);
        this._NumberLiteral_value.ofType(LionCore_builtinsBase.INSTANCE._Integer);
        this._StringLiteral.implementing(this._Literal);
        this._StringLiteral.havingFeatures(this._StringLiteral_value);
        this._StringLiteral_value.ofType(LionCore_builtinsBase.INSTANCE._String);
        this._Parentheses.implementing(this._Value);
        this._Parentheses.havingFeatures(this._Parentheses_value);
        this._Parentheses_value.ofType(this._Value);
        this._BinaryOperators.havingLiterals(this._BinaryOperators_plus, this._BinaryOperators_plusWithPositiveOperands);
        this._BinaryOperation.implementing(this._Value);
        this._BinaryOperation.havingFeatures(this._BinaryOperation_operator, this._BinaryOperation_left, this._BinaryOperation_right);
        this._BinaryOperation_operator.ofType(this._BinaryOperators);
        this._BinaryOperation_left.ofType(this._Value);
        this._BinaryOperation_right.ofType(this._Value);
        this._ArgumentBinding.havingFeatures(this._ArgumentBinding_argument, this._ArgumentBinding_value);
        this._ArgumentBinding_argument.ofType(this._ArgumentDeclaration);
        this._ArgumentBinding_value.ofType(this._Value);
        this._FunctionInvocation.implementing(this._Value, this._Statement);
        this._FunctionInvocation.havingFeatures(this._FunctionInvocation_function, this._FunctionInvocation_bindings);
        this._FunctionInvocation_function.ofType(this._FunctionDeclaration);
        this._FunctionInvocation_bindings.ofType(this._ArgumentBinding);
        this._ArgumentReference.implementing(this._Value);
        this._ArgumentReference.havingFeatures(this._ArgumentReference_argument);
        this._ArgumentReference_argument.ofType(this._ArgumentDeclaration);
        this._Program.implementing(this._Reducible);
        this._Program.havingFeatures(this._Program_statements);
        this._Program_statements.ofType(this._Statement);
        this._TraceAnnotation.havingFeatures(this._TraceAnnotation_reducedNode);
        this._TraceAnnotation_reducedNode.ofType(this._Reducible);
        this._wiredUp = true;
    }

    factory(receiveDelta?: DeltaReceiver): NodeBaseFactory {
        return (classifier: Classifier, id: LionWebId) => {
            switch (classifier.key) {
                case this._ArgumentDeclaration.key: return ArgumentDeclaration.create(id, receiveDelta);
                case this._FunctionDeclaration.key: return FunctionDeclaration.create(id, receiveDelta);
                case this._NumberLiteral.key: return NumberLiteral.create(id, receiveDelta);
                case this._StringLiteral.key: return StringLiteral.create(id, receiveDelta);
                case this._Parentheses.key: return Parentheses.create(id, receiveDelta);
                case this._BinaryOperation.key: return BinaryOperation.create(id, receiveDelta);
                case this._ArgumentBinding.key: return ArgumentBinding.create(id, receiveDelta);
                case this._FunctionInvocation.key: return FunctionInvocation.create(id, receiveDelta);
                case this._ArgumentReference.key: return ArgumentReference.create(id, receiveDelta);
                case this._Program.key: return Program.create(id, receiveDelta);
                case this._TraceAnnotation.key: return TraceAnnotation.create(id, receiveDelta);
                default: {
                    const {language} = classifier;
                    throw new Error(`can't instantiate ${classifier.name} (key=${classifier.key}): classifier is not known in language ${language.name} (key=${language.key}, version=${language.version})`);
                }
            }
        }
    }

    enumLiteralFrom<EnumType>(enumerationLiteral: EnumerationLiteral): EnumType {
        const {enumeration} = enumerationLiteral;
        if (enumeration.key === this._BinaryOperators.key) {
            return enumerationLiteral.key as EnumType;
        }
        const {language} = enumeration;
        throw new Error(`enumeration with key ${enumeration.key} is not known in language ${language.name} (key=${language.key}, version=${language.version})`);
    }

    public static readonly INSTANCE = new ReductionDSLBase();
}


export interface Reducible extends INodeBase {
}

export interface Statement extends INodeBase {
}

export interface Value extends Reducible, Statement {
}

export class ArgumentDeclaration extends NodeBase implements INamed {
    static create(id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage): ArgumentDeclaration {
        return new ArgumentDeclaration(ReductionDSLBase.INSTANCE.ArgumentDeclaration, id, receiveDelta, parentInfo);
    }

    private readonly _name: RequiredPropertyValueManager<string>;
    get name(): string {
        return this._name.get();
    }
    set name(newValue: string) {
        this._name.set(newValue);
    }

    public constructor(classifier: Classifier, id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage) {
        super(classifier, id, receiveDelta, parentInfo);
        this._name = new RequiredPropertyValueManager<string>(LionCore_builtinsBase.INSTANCE.INamed_name, this);
    }

    getPropertyValueManager(property: Property): PropertyValueManager<unknown> {
        if (property.key === LionCore_builtinsBase.INSTANCE.INamed_name.key) {
            return this._name;
        }
        return super.getPropertyValueManager(property);
    }
}

export class FunctionDeclaration extends NodeBase implements INamed, Statement {
    static create(id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage): FunctionDeclaration {
        return new FunctionDeclaration(ReductionDSLBase.INSTANCE.FunctionDeclaration, id, receiveDelta, parentInfo);
    }

    private readonly _arguments: OptionalMultiContainmentValueManager<ArgumentDeclaration>;
    get arguments(): ArgumentDeclaration[] {
        return this._arguments.get();
    }
    addArguments(newValue: ArgumentDeclaration) {
        this._arguments.add(newValue);
    }
    removeArguments(valueToRemove: ArgumentDeclaration) {
        this._arguments.remove(valueToRemove);
    }
    addArgumentsAtIndex(newValue: ArgumentDeclaration, index: number) {
        this._arguments.insertAtIndex(newValue, index);
    }
    moveArguments(oldIndex: number, newIndex: number) {
        this._arguments.move(oldIndex, newIndex);
    }
    replaceArgumentsAtIndex(movedChild: ArgumentDeclaration, newIndex: number) {
        this._arguments.replaceAtIndex(movedChild, newIndex);
    }

    private readonly _value: RequiredSingleContainmentValueManager<Value>;
    get value(): Value {
        return this._value.get();
    }
    set value(newValue: Value) {
        this._value.set(newValue);
    }
    replaceValueWith(newValue: Value) {
        this._value.replaceWith(newValue);
    }

    private readonly _name: RequiredPropertyValueManager<string>;
    get name(): string {
        return this._name.get();
    }
    set name(newValue: string) {
        this._name.set(newValue);
    }

    public constructor(classifier: Classifier, id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage) {
        super(classifier, id, receiveDelta, parentInfo);
        this._arguments = new OptionalMultiContainmentValueManager<ArgumentDeclaration>(ReductionDSLBase.INSTANCE.FunctionDeclaration_arguments, this);
        this._value = new RequiredSingleContainmentValueManager<Value>(ReductionDSLBase.INSTANCE.FunctionDeclaration_value, this);
        this._name = new RequiredPropertyValueManager<string>(LionCore_builtinsBase.INSTANCE.INamed_name, this);
    }

    getPropertyValueManager(property: Property): PropertyValueManager<unknown> {
        if (property.key === LionCore_builtinsBase.INSTANCE.INamed_name.key) {
            return this._name;
        }
        return super.getPropertyValueManager(property);
    }

    getContainmentValueManager(containment: Containment): ContainmentValueManager<INodeBase> {
        switch (containment.key) {
            case ReductionDSLBase.INSTANCE.FunctionDeclaration_arguments.key: return this._arguments;
            case ReductionDSLBase.INSTANCE.FunctionDeclaration_value.key: return this._value;
            default: return super.getContainmentValueManager(containment);
        }
    }
}

export interface Literal extends Value {
}

export class NumberLiteral extends NodeBase implements Literal {
    static create(id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage): NumberLiteral {
        return new NumberLiteral(ReductionDSLBase.INSTANCE.NumberLiteral, id, receiveDelta, parentInfo);
    }

    private readonly _value: RequiredPropertyValueManager<number>;
    get value(): number {
        return this._value.get();
    }
    set value(newValue: number) {
        this._value.set(newValue);
    }

    public constructor(classifier: Classifier, id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage) {
        super(classifier, id, receiveDelta, parentInfo);
        this._value = new RequiredPropertyValueManager<number>(ReductionDSLBase.INSTANCE.NumberLiteral_value, this);
    }

    getPropertyValueManager(property: Property): PropertyValueManager<unknown> {
        if (property.key === ReductionDSLBase.INSTANCE.NumberLiteral_value.key) {
            return this._value;
        }
        return super.getPropertyValueManager(property);
    }
}

export class StringLiteral extends NodeBase implements Literal {
    static create(id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage): StringLiteral {
        return new StringLiteral(ReductionDSLBase.INSTANCE.StringLiteral, id, receiveDelta, parentInfo);
    }

    private readonly _value: RequiredPropertyValueManager<string>;
    get value(): string {
        return this._value.get();
    }
    set value(newValue: string) {
        this._value.set(newValue);
    }

    public constructor(classifier: Classifier, id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage) {
        super(classifier, id, receiveDelta, parentInfo);
        this._value = new RequiredPropertyValueManager<string>(ReductionDSLBase.INSTANCE.StringLiteral_value, this);
    }

    getPropertyValueManager(property: Property): PropertyValueManager<unknown> {
        if (property.key === ReductionDSLBase.INSTANCE.StringLiteral_value.key) {
            return this._value;
        }
        return super.getPropertyValueManager(property);
    }
}

export class Parentheses extends NodeBase implements Value {
    static create(id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage): Parentheses {
        return new Parentheses(ReductionDSLBase.INSTANCE.Parentheses, id, receiveDelta, parentInfo);
    }

    private readonly _value: RequiredSingleContainmentValueManager<Value>;
    get value(): Value {
        return this._value.get();
    }
    set value(newValue: Value) {
        this._value.set(newValue);
    }
    replaceValueWith(newValue: Value) {
        this._value.replaceWith(newValue);
    }

    public constructor(classifier: Classifier, id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage) {
        super(classifier, id, receiveDelta, parentInfo);
        this._value = new RequiredSingleContainmentValueManager<Value>(ReductionDSLBase.INSTANCE.Parentheses_value, this);
    }

    getContainmentValueManager(containment: Containment): ContainmentValueManager<INodeBase> {
        if (containment.key === ReductionDSLBase.INSTANCE.Parentheses_value.key) {
            return this._value;
        }
        return super.getContainmentValueManager(containment);
    }
}

export enum BinaryOperators {
    plus = "ReductionDSL-BinaryOperators-plus",
    plusWithPositiveOperands = "ReductionDSL-BinaryOperators-plusWithPositiveOperands"
}

export class BinaryOperation extends NodeBase implements Value {
    static create(id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage): BinaryOperation {
        return new BinaryOperation(ReductionDSLBase.INSTANCE.BinaryOperation, id, receiveDelta, parentInfo);
    }

    private readonly _operator: RequiredPropertyValueManager<BinaryOperators>;
    get operator(): BinaryOperators {
        return this._operator.get();
    }
    set operator(newValue: BinaryOperators) {
        this._operator.set(newValue);
    }

    private readonly _left: RequiredSingleContainmentValueManager<Value>;
    get left(): Value {
        return this._left.get();
    }
    set left(newValue: Value) {
        this._left.set(newValue);
    }
    replaceLeftWith(newValue: Value) {
        this._left.replaceWith(newValue);
    }

    private readonly _right: RequiredSingleContainmentValueManager<Value>;
    get right(): Value {
        return this._right.get();
    }
    set right(newValue: Value) {
        this._right.set(newValue);
    }
    replaceRightWith(newValue: Value) {
        this._right.replaceWith(newValue);
    }

    public constructor(classifier: Classifier, id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage) {
        super(classifier, id, receiveDelta, parentInfo);
        this._operator = new RequiredPropertyValueManager<BinaryOperators>(ReductionDSLBase.INSTANCE.BinaryOperation_operator, this);
        this._left = new RequiredSingleContainmentValueManager<Value>(ReductionDSLBase.INSTANCE.BinaryOperation_left, this);
        this._right = new RequiredSingleContainmentValueManager<Value>(ReductionDSLBase.INSTANCE.BinaryOperation_right, this);
    }

    getPropertyValueManager(property: Property): PropertyValueManager<unknown> {
        if (property.key === ReductionDSLBase.INSTANCE.BinaryOperation_operator.key) {
            return this._operator;
        }
        return super.getPropertyValueManager(property);
    }

    getContainmentValueManager(containment: Containment): ContainmentValueManager<INodeBase> {
        switch (containment.key) {
            case ReductionDSLBase.INSTANCE.BinaryOperation_left.key: return this._left;
            case ReductionDSLBase.INSTANCE.BinaryOperation_right.key: return this._right;
            default: return super.getContainmentValueManager(containment);
        }
    }
}

export class ArgumentBinding extends NodeBase {
    static create(id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage): ArgumentBinding {
        return new ArgumentBinding(ReductionDSLBase.INSTANCE.ArgumentBinding, id, receiveDelta, parentInfo);
    }

    private readonly _argument: RequiredSingleReferenceValueManager<ArgumentDeclaration>;
    get argument(): SingleRef<ArgumentDeclaration> {
        return this._argument.get();
    }
    set argument(newValue: SingleRef<ArgumentDeclaration>) {
        this._argument.set(newValue);
    }

    private readonly _value: RequiredSingleContainmentValueManager<Value>;
    get value(): Value {
        return this._value.get();
    }
    set value(newValue: Value) {
        this._value.set(newValue);
    }
    replaceValueWith(newValue: Value) {
        this._value.replaceWith(newValue);
    }

    public constructor(classifier: Classifier, id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage) {
        super(classifier, id, receiveDelta, parentInfo);
        this._argument = new RequiredSingleReferenceValueManager<ArgumentDeclaration>(ReductionDSLBase.INSTANCE.ArgumentBinding_argument, this);
        this._value = new RequiredSingleContainmentValueManager<Value>(ReductionDSLBase.INSTANCE.ArgumentBinding_value, this);
    }

    getContainmentValueManager(containment: Containment): ContainmentValueManager<INodeBase> {
        if (containment.key === ReductionDSLBase.INSTANCE.ArgumentBinding_value.key) {
            return this._value;
        }
        return super.getContainmentValueManager(containment);
    }

    getReferenceValueManager(reference: Reference): ReferenceValueManager<INodeBase> {
        if (reference.key === ReductionDSLBase.INSTANCE.ArgumentBinding_argument.key) {
            return this._argument;
        }
        return super.getReferenceValueManager(reference);
    }
}

export class FunctionInvocation extends NodeBase implements Statement, Value {
    static create(id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage): FunctionInvocation {
        return new FunctionInvocation(ReductionDSLBase.INSTANCE.FunctionInvocation, id, receiveDelta, parentInfo);
    }

    private readonly _function: RequiredSingleReferenceValueManager<FunctionDeclaration>;
    get function(): SingleRef<FunctionDeclaration> {
        return this._function.get();
    }
    set function(newValue: SingleRef<FunctionDeclaration>) {
        this._function.set(newValue);
    }

    private readonly _bindings: OptionalMultiContainmentValueManager<ArgumentBinding>;
    get bindings(): ArgumentBinding[] {
        return this._bindings.get();
    }
    addBindings(newValue: ArgumentBinding) {
        this._bindings.add(newValue);
    }
    removeBindings(valueToRemove: ArgumentBinding) {
        this._bindings.remove(valueToRemove);
    }
    addBindingsAtIndex(newValue: ArgumentBinding, index: number) {
        this._bindings.insertAtIndex(newValue, index);
    }
    moveBindings(oldIndex: number, newIndex: number) {
        this._bindings.move(oldIndex, newIndex);
    }
    replaceBindingsAtIndex(movedChild: ArgumentBinding, newIndex: number) {
        this._bindings.replaceAtIndex(movedChild, newIndex);
    }

    public constructor(classifier: Classifier, id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage) {
        super(classifier, id, receiveDelta, parentInfo);
        this._function = new RequiredSingleReferenceValueManager<FunctionDeclaration>(ReductionDSLBase.INSTANCE.FunctionInvocation_function, this);
        this._bindings = new OptionalMultiContainmentValueManager<ArgumentBinding>(ReductionDSLBase.INSTANCE.FunctionInvocation_bindings, this);
    }

    getContainmentValueManager(containment: Containment): ContainmentValueManager<INodeBase> {
        if (containment.key === ReductionDSLBase.INSTANCE.FunctionInvocation_bindings.key) {
            return this._bindings;
        }
        return super.getContainmentValueManager(containment);
    }

    getReferenceValueManager(reference: Reference): ReferenceValueManager<INodeBase> {
        if (reference.key === ReductionDSLBase.INSTANCE.FunctionInvocation_function.key) {
            return this._function;
        }
        return super.getReferenceValueManager(reference);
    }
}

export class ArgumentReference extends NodeBase implements Value {
    static create(id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage): ArgumentReference {
        return new ArgumentReference(ReductionDSLBase.INSTANCE.ArgumentReference, id, receiveDelta, parentInfo);
    }

    private readonly _argument: RequiredSingleReferenceValueManager<ArgumentDeclaration>;
    get argument(): SingleRef<ArgumentDeclaration> {
        return this._argument.get();
    }
    set argument(newValue: SingleRef<ArgumentDeclaration>) {
        this._argument.set(newValue);
    }

    public constructor(classifier: Classifier, id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage) {
        super(classifier, id, receiveDelta, parentInfo);
        this._argument = new RequiredSingleReferenceValueManager<ArgumentDeclaration>(ReductionDSLBase.INSTANCE.ArgumentReference_argument, this);
    }

    getReferenceValueManager(reference: Reference): ReferenceValueManager<INodeBase> {
        if (reference.key === ReductionDSLBase.INSTANCE.ArgumentReference_argument.key) {
            return this._argument;
        }
        return super.getReferenceValueManager(reference);
    }
}

export class Program extends NodeBase implements Reducible {
    static create(id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage): Program {
        return new Program(ReductionDSLBase.INSTANCE.Program, id, receiveDelta, parentInfo);
    }

    private readonly _statements: OptionalMultiContainmentValueManager<Statement>;
    get statements(): Statement[] {
        return this._statements.get();
    }
    addStatements(newValue: Statement) {
        this._statements.add(newValue);
    }
    removeStatements(valueToRemove: Statement) {
        this._statements.remove(valueToRemove);
    }
    addStatementsAtIndex(newValue: Statement, index: number) {
        this._statements.insertAtIndex(newValue, index);
    }
    moveStatements(oldIndex: number, newIndex: number) {
        this._statements.move(oldIndex, newIndex);
    }
    replaceStatementsAtIndex(movedChild: Statement, newIndex: number) {
        this._statements.replaceAtIndex(movedChild, newIndex);
    }

    public constructor(classifier: Classifier, id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage) {
        super(classifier, id, receiveDelta, parentInfo);
        this._statements = new OptionalMultiContainmentValueManager<Statement>(ReductionDSLBase.INSTANCE.Program_statements, this);
    }

    getContainmentValueManager(containment: Containment): ContainmentValueManager<INodeBase> {
        if (containment.key === ReductionDSLBase.INSTANCE.Program_statements.key) {
            return this._statements;
        }
        return super.getContainmentValueManager(containment);
    }
}

export class TraceAnnotation extends NodeBase {
    static create(id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage): TraceAnnotation {
        return new TraceAnnotation(ReductionDSLBase.INSTANCE.TraceAnnotation, id, receiveDelta, parentInfo);
    }

    private readonly _reducedNode: RequiredSingleReferenceValueManager<Reducible>;
    get reducedNode(): SingleRef<Reducible> {
        return this._reducedNode.get();
    }
    set reducedNode(newValue: SingleRef<Reducible>) {
        this._reducedNode.set(newValue);
    }

    public constructor(classifier: Classifier, id: LionWebId, receiveDelta?: DeltaReceiver, parentInfo?: Parentage) {
        super(classifier, id, receiveDelta, parentInfo);
        this._reducedNode = new RequiredSingleReferenceValueManager<Reducible>(ReductionDSLBase.INSTANCE.TraceAnnotation_reducedNode, this);
    }

    getReferenceValueManager(reference: Reference): ReferenceValueManager<INodeBase> {
        if (reference.key === ReductionDSLBase.INSTANCE.TraceAnnotation_reducedNode.key) {
            return this._reducedNode;
        }
        return super.getReferenceValueManager(reference);
    }
}

