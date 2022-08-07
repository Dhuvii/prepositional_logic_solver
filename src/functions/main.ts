import { Evaluator } from "./evaluator";

const ev = new Evaluator("(p | q) -> (p & q)");
const table = ev.runForChunks();
console.table(table);
