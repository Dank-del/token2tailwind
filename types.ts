export interface FigmaToken {
    version:     string;
    metadata:    Metadata;
    collections: CollectionElement[];
}

export interface CollectionElement {
    name:  string;
    modes: Mode[];
}

export interface Mode {
    name:      string;
    variables: Variable[];
}

export interface Variable {
    name:    string;
    type:    Type;
    isAlias: boolean;
    value:   ValueClass | number | string;
}

export type Type = "color" | "number" | "typography" | "effect";

export interface ValueClass {
    collection?:        CollectionEnum;
    name?:              string;
    fontSize?:          number;
    fontFamily?:        FontFamily;
    fontWeight?:        FontWeight;
    lineHeight?:        number;
    lineHeightUnit?:    LineHeightUnit;
    letterSpacing?:     number;
    letterSpacingUnit?: LetterSpacingUnit;
    textCase?:          TextCase;
    textDecoration?:    TextDecoration;
    effects?:           Effect[];
}

export type CollectionEnum = "Semantic ( Colors )" | "Primitives ( Colors )" | "Component ( Colors )" | "Primitives ( Dimensions )";

export interface Effect {
    type:   string;
    color:  Color;
    offset: Offset;
    radius: number;
    spread: number;
}

export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface Offset {
    x: number;
    y: number;
}

export type FontFamily = "Inter";

export type FontWeight = "Regular" | "Medium" | "Semi Bold" | "Bold" | "Extra Bold";

export type LetterSpacingUnit = "PERCENT";

export type LineHeightUnit = "PIXELS";

export type TextCase = "ORIGINAL";

export type TextDecoration = "NONE";

export interface Metadata {
}