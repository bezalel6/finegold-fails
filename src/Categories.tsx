import { Kind } from "./App";
import { Game } from "./GameParser";
import { Rarity } from "./Rarity";


export interface OuterCategory {
    description: string;
}
export const F3Outer: OuterCategory = {
    description: "ayyyo this is f3"
}
export const Misc: OuterCategory = {
    description: "meow misc"
}

export const outerCategoriesArr: OuterCategory[] = [Misc, F3Outer];


export const f3Mate: CategoryInterface = {
    name: "F3#",
    explanation: "mate your opponent with f3",
    rarity: Rarity.Legendary,
    outerCategory: F3Outer,
    kind: "win"
};
export const f3Check: CategoryInterface = {
    name: "F3+",
    explanation: "checked with f3. what happened? couldn't resist check?",
    rarity: Rarity.Common,
    outerCategory: F3Outer,

    kind: "fail"
};
export const f3: CategoryInterface = {
    name: "f3",
    explanation: "NEVER PLAY F3",
    rarity: Rarity.Common,
    outerCategory: F3Outer,

    kind: "fail"
};
export const f3ConfuseOnTime: CategoryInterface = {
    name: "F3 to confuse your opponent and make them flag",
    explanation: "your opponent must've calculated every reasonable move. naturally, f3 wasn't one of them. when you played it you confused them so much they flagged.",
    rarity: Rarity.Legendary,
    outerCategory: F3Outer,

    kind: "win"
};
export const opponentPlayedF3: CategoryInterface = {
    name: "opponent F3",
    explanation: "opponent played f3",
    rarity: Rarity.Common,
    outerCategory: F3Outer,

    kind: "win"
};
export const opponentPlayedF3Lost: CategoryInterface = {
    name: "opponent played f3 and you lost",
    explanation: "opponent played f3 and you didnt punish him. shame.",
    rarity: Rarity.Uncommon,
    outerCategory: F3Outer,

    kind: "fail"
};
export const opponentPlayedF3Won: CategoryInterface = {
    name: "opponent played f3 and you won",
    explanation: "opponent played f3 and you punished him. good job.",
    rarity: Rarity.Common,
    outerCategory: F3Outer,

    kind: "win"
};
export const f3StillWon: CategoryInterface = {
    name: "F3 and still won",
    explanation: "you learned a bad lesson. you played f3 and still won.",
    rarity: Rarity.Legendary,
    outerCategory: F3Outer,

    kind: "fail"
};
export const f3Drew: CategoryInterface = {
    name: "F3 and drew",
    explanation: "you learned a bad lesson. you managed to squeeze a draw after playing f3",
    rarity: Rarity.Epic,
    outerCategory: F3Outer,

    kind: "fail"
};
export const drew: CategoryInterface = {
    name: "Drew",
    explanation: "you tried to win, and failed. lesson is never try.",
    rarity: Rarity.Uncommon,
    outerCategory: Misc,
    kind: "fail"
};
export const won: CategoryInterface = {
    name: "Won",
    explanation: "you won somehow!",
    outerCategory: Misc,
    rarity: Rarity.Epic,
    kind: "win"
};
export const lost: CategoryInterface = {
    name: "Lost",
    explanation: "you tried to win, and you failed. lesson is never try.",
    outerCategory: Misc,
    rarity: Rarity.Common,
    kind: "fail"
};
export const wonOnTime: CategoryInterface = {
    name: "Never resign!",
    explanation: "you tried to win, and you failed. lesson is never try.",
    outerCategory: Misc,
    rarity: Rarity.Common,
    kind: "fail"
};

export const allCategories = [f3, f3Check, f3Mate, f3StillWon, f3Drew, drew, won, lost, opponentPlayedF3, opponentPlayedF3Lost, opponentPlayedF3Won, f3ConfuseOnTime];


export interface CategoryInterface {
    name: string;
    explanation: string;
    rarity: Rarity;
    kind: Kind;
    outerCategory: OuterCategory;
    exampleBoard?: string;
    exampleVideo?: string;
    numMade?: number;
    addToCategory?: (game: Game) => void;
    resetCategory?: () => void;
}