import { Token, TokenTypes } from "./types";
import { interpret, isNegation } from "./utils";

export class LangProcessor {
  private token: Token | undefined;
  constructor(private tokens: Token[]) {}

  parser() {
    return this.parse();
  }

  private parse(operation: string | null = null): any {
    let args: any = [];

    while (this.next()) {
      if (this.token?.type === TokenTypes.BOUNDARY) {
        if (this.token.value === "(") args.push(this.parse());
        else return this.convert(operation, args);
      }

      if (this.token?.type === TokenTypes.VARIABLE) {
        args.push(this.convert("variable", [this.token.value]));
        if (isNegation(operation)) {
          return this.convert(operation, [this.token.value]);
        }
      }

      if (this.token?.type === TokenTypes.OPERATOR) {
        if (isNegation(this.token.value)) {
          args.push(this.parse(this.token.value));
          continue;
        }

        if (operation) {
          const tmp = [...args];
          args = [];
          args.push(this.convert(operation, tmp));
        }

        operation = this.token.value;
      }
    }

    return this.convert(operation, args);
  }

  private convert(action: string | null, args: any[]) {
    return {
      action: interpret(action),
      args,
    };
  }

  private next() {
    this.token = this.tokens.shift();
    return this.token;
  }
}
