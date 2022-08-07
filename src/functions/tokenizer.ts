import { Token, TokenTypes } from "./types";
import {
  isBoundary,
  isOperator,
  isSpace,
  isSpecial,
  isVariable,
  unrecognizedToken,
} from "./utils";

export class Tokenizer {
  private counter: number = 0;
  private tokens: Token[] = [];
  private operatorBuilder: string = "";
  private hasSpace = true;

  constructor(private expression: string) {}

  private push(type: TokenTypes, value: string) {
    this.tokens.push({
      type,
      value,
    });
  }

  private currentCharacter() {
    return this.expression.charAt(this.counter);
  }

  scan() {
    if (this.expression.length < 2) throw Error("Invalid expression");
    while (this.counter < this.expression.length) {
      if (isSpecial(this.currentCharacter())) {
        this.hasSpace = true;
        this.operatorBuilder += this.currentCharacter();
        if (this.operatorBuilder.length > 3) {
          throw Error("Invalid expression");
        }
        if (isOperator(this.operatorBuilder)) {
          this.push(TokenTypes.OPERATOR, this.operatorBuilder);
          this.operatorBuilder = "";
        }
      } else {
        if (this.operatorBuilder.length) {
          unrecognizedToken(this.operatorBuilder, this.counter);
        }

        if (isBoundary(this.currentCharacter())) {
          this.hasSpace = true;
          this.push(TokenTypes.BOUNDARY, this.currentCharacter());
        } else if (isVariable(this.currentCharacter())) {
          if (!this.hasSpace) throw Error("Invalid expression");
          this.push(TokenTypes.VARIABLE, this.currentCharacter().toUpperCase());
          this.hasSpace = false;
        } else if (!isSpace(this.currentCharacter()))
          unrecognizedToken(this.currentCharacter(), this.counter);
        else this.hasSpace = true;
      }

      this.counter++;
    }
    return this.tokens;
  }
}
