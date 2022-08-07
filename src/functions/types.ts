export enum TokenTypes {
  "OPERATOR" = "operator",
  "VARIABLE" = "variable",
  "BOUNDARY" = "boundary",
}

export type Token = {
  type: TokenTypes;
  value: string;
};

export type Args = {
  action: string | null;
  args: Args[] | string[];
};
