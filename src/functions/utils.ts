export const unrecognizedToken = (ch: string, position: number) => {
  throw Error(`Invalid character : ${ch} at position : ${position}`);
};

export const isSpace = (ch: string) => {
  return /[\s | \t]/.test(ch);
};

export const isVariable = (ch: string) => {
  return /[a-zA-Z]/.test(ch);
};

export const isBoundary = (ch: string) => {
  return /[\(\)]/.test(ch);
};

export const isSpecial = (ch: string) => {
  return /[<>\-|&!+]/.test(ch);
};

export const isOperator = (ch: string) => {
  return ["|", "&", "<->", "->", "!", "+"].includes(ch);
};

export const isNegation = (ch: string | null) => {
  return ch && ch === "!";
};

export const interpret = (operator: string | null) => {
  const map: any = {
    "!": "negation",
    "|": "disjunction",
    "&": "conjunction",
    "->": "implication",
    "<->": "biconditional",
    "+": "inclusive",
    variable: "variable",
  };

  if (operator && operator in map) return map[operator];
  return null;
};

export const replacer = (string: string) => {
  return string
    .replaceAll("<->", " ↔ ")
    .replaceAll("->", " → ")
    .replaceAll("!", " ¬ ")
    .replaceAll("&", " ∧ ")
    .replaceAll("|", " ∨ ")
    .replaceAll("+", " ⊕ ")
    .toUpperCase();
};

export const replaceOriginal = (string: string) => {
  return string
    .replaceAll(" ↔ ", "<->")
    .replaceAll(" → ", "->")
    .replaceAll(" ¬ ", "!")
    .replaceAll(" ∧ ", "&")
    .replaceAll(" ∨ ", "|")
    .replaceAll(" ⊕ ", "+")
    .toUpperCase();
};

export const formatter = (string: string) => {
  const rms = string.replaceAll(" ", "");
  return rms
    .replaceAll("↔", " ↔ ")
    .replaceAll("→", " → ")
    .replaceAll("¬", " ¬ ")
    .replaceAll("∧", " ∧ ")
    .replaceAll("∨", " ∨ ")
    .replaceAll("⊕", " ⊕ ");
};
