import { isBoundary, isOperator, isVariable } from "./utils";

export class Extractor {
  private stack: any = [];
  private top: number = 0;
  private cursor: number = 0;
  private chunked: string[] = [];
  private extractedExpression: string = "";
  constructor(private expression: string) {}

  private push(value: string) {
    this.stack[this.top++] = value;
  }

  private pop() {
    if (!this.top) return;
    return this.stack[this.top--];
  }

  private current() {
    return this.expression.charAt(this.cursor);
  }

  extract() {
    while (this.cursor < this.expression.length) {
      if (isBoundary(this.current())) {
        if (this.current() === "(") {
          this.push(this.current());
        } else {
          this.pop();
          if (this.extractedExpression) {
            this.chunked.push(this.extractedExpression);
          }
        }
      } else if (this.top) {
        this.extractedExpression += isVariable(this.current())
          ? this.current().toUpperCase()
          : this.current();
      } else {
        if (this.extractedExpression) {
          this.chunked.push(this.extractedExpression);
          this.extractedExpression = "";
        }
      }

      this.cursor++;
    }

    return Array.from(new Set(this.chunked));
  }
}
