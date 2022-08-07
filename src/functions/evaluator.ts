import { Extractor } from "./extractor";
import { LangProcessor } from "./langProcessor";
import { Tokenizer } from "./tokenizer";
import { Token, TokenTypes } from "./types";

export class Evaluator {
  private tokens: Token[];
  private tree: any;
  private variables: string[];
  private chunks: string[];
  private grayCode: any;
  private negations: Set<string> = new Set();
  private keys: string[] = [];

  constructor(private expression: string) {
    this.tokens = new Tokenizer(expression).scan();
    this.variables = Array.from(
      new Set(
        this.tokens
          .filter((token) => token.type === TokenTypes.VARIABLE)
          .map((vo) => vo.value)
      )
    );
    this.tree = new LangProcessor(this.tokens).parser();
    this.chunks = new Extractor(expression).extract();
    this.grayCode = this.genGrayCode();
  }

  private loadExpression(expression: string) {
    this.tokens = new Tokenizer(expression).scan();
    this.variables = Array.from(
      new Set(
        this.tokens
          .filter((token) => token.type === TokenTypes.VARIABLE)
          .map((vo) => vo.value)
      )
    );
    this.tree = new LangProcessor(this.tokens).parser();
  }

  runForChunks() {
    this.loadExpression(this.expression);
    let obj: any = {};
    this.chunks.forEach((chunk: string) => {
      this.loadExpression(chunk);
      obj[chunk] = this.run();
    });

    this.loadExpression(this.expression);
    obj.result = this.run();
    obj = { ...obj, ...this.genGrayCode(true) };
    this.negations.forEach((negation: string) => {
      const negated = this.genGrayCode(true)[negation].map(
        (val: boolean) => !val
      );
      obj[`!${negation}`] = negated;
    });

    this.keys = [
      ...this.variables,
      ...Array.from(this.negations)
        .map((v) => `!${v}`)
        .sort((a: any, b: any) => a - b),
      ...this.chunks.sort((a: any, b: any) => a.length - b.length),
      "result",
    ];

    return this.generateTable(obj);
  }

  private generateTable(generated: any) {
    const transformed: any = [];
    const number_of_rows = generated[this.keys[0]].length;

    for (let index = 0; index < number_of_rows; index++) {
      const obj: any = {};
      this.keys.forEach((key: string) => {
        let k = key === "result" ? this.expression.toUpperCase() : key;
        obj[k] = { value: generated[key][index], badge: key === "result" };
      });
      transformed.push(obj);
    }

    return {
      heading: this.keys.map((k) => (k === "result" ? this.expression : k)),
      datas: transformed,
    };
  }

  run() {
    let arr: any = [];
    this.grayCode.forEach((row: any) => {
      arr.push(this.process(row));
    });
    return arr;
  }

  private process(combinations_per_row: any) {
    return this._process(this.tree, combinations_per_row);
  }

  private _process(root: any, combinations_per_row: any): any {
    if (root.action === null) {
      return this._process(root.args[0], combinations_per_row);
    }

    if (root.action === "variable") {
      return combinations_per_row[root.args[0]];
    }

    if (root.action === "negation") {
      this.negations.add(root.args[0]);
      return !combinations_per_row[root.args[0]];
    }

    if (root.action === "conjunction") {
      return (
        this._process(root.args[0], combinations_per_row) &&
        this._process(root.args[1], combinations_per_row)
      );
    }

    if (root.action === "disjunction") {
      return (
        this._process(root.args[0], combinations_per_row) ||
        this._process(root.args[1], combinations_per_row)
      );
    }

    if (root.action === "implication") {
      return (
        this._process(root.args[1], combinations_per_row) ||
        this._process(root.args[0], combinations_per_row) ===
          this._process(root.args[1], combinations_per_row)
      );
    }

    if (root.action === "biconditional") {
      return (
        this._process(root.args[0], combinations_per_row) ===
        this._process(root.args[1], combinations_per_row)
      );
    }

    if (root.action === "inclusive") {
      return (
        this._process(root.args[0], combinations_per_row) !==
        this._process(root.args[1], combinations_per_row)
      );
    }
  }

  genGrayCode(untransformed: boolean = false) {
    let output: any = {};
    let rows = Math.pow(2, this.variables.length);

    let flipIn = rows / 2;

    for (let j = 0; j < this.variables.length; j++) {
      let o = [];
      let flipIndex = 0;
      let value = true;
      const flip = () => {
        value = !value;
      };

      let index = 0;
      while (index < rows) {
        if (flipIndex < flipIn) {
          o.push(value);
          flipIndex++;
          index++;
        } else {
          flip();
          flipIndex = 0;
        }
      }

      output[this.variables[j]] = o;
      flipIn /= 2;
    }

    if (untransformed) {
      return output;
    }

    //transform
    /* 
    [
        { p : t , q : t },
        { p : t , q : f },
        { p : f , q : t },
        { p : f , q : t },
    ]
    */

    const transformed: any = [];
    const num_of_rows: number = output[this.variables[0]].length;

    for (let index = 0; index < num_of_rows; index++) {
      let obj: any = {};
      this.variables.forEach((varObj) => {
        const symbol = varObj;
        obj[symbol] = output[symbol][index];
      });
      transformed.push(obj);
    }

    return transformed;
  }
}
