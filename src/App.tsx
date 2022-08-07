import { useEffect, useRef, useState } from "react";
import Button from "./components/Button";
import Table from "./components/Table";
import { Evaluator } from "./functions/evaluator";
import {
  formatter,
  isSpecial,
  replaceOriginal,
  replacer,
} from "./functions/utils";
import "./styles/main.css";
function App() {
  const inputRef = useRef(null);
  const [currentExpression, setCurrentExpression] = useState<any>("");
  const [expression, setExpression] = useState("");
  const [datas, setDatas] = useState<any>([]);
  const [headings, setHeadings] = useState<any>([]);
  const [error, setError] = useState<any>("");

  useEffect(() => {
    try {
      if (expression) {
        setError("");
        let exp = expression;
        if (isSpecial(exp[exp.length - 1])) {
          exp += " ";
        }
        const ev = new Evaluator(exp);
        const { datas, heading } = ev.runForChunks();
        if (datas && heading) {
          setDatas(datas);
          setHeadings(heading.map((h) => replacer(h)));
        }
      }
    } catch (error: any) {
      if (error.message.includes("Cannot")) {
        setError("Invalid Expression");
      } else {
        setError(error.message);
      }
      setExpression("");
      setDatas([]);
      setHeadings([]);
    }
  }, [expression]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!currentExpression.length) {
      setError("");
      setExpression("");
      setDatas([]);
      setHeadings([]);
      return;
    }
    setExpression(replaceOriginal(currentExpression));
  };

  const handleOperatorInput = (ch: string) => {
    setCurrentExpression((pv: string) => (pv += ch));
    if (inputRef && inputRef.current) {
      //@ts-ignore
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full h-screen p-10 flex-col flex items-center justify-center">
      <div className="p-5 w-full max-h-[45rem] md:w-auto md:min-w-[32rem] max-w-7xl rounded-xl bg-gray-50/10 border flex flex-col items-center justify-start">
        <form
          onSubmit={handleSubmit}
          className="w-full flex md:flex-row flex-col items-center justify-between gap-5"
        >
          <div className="w-full relative">
            <input
              ref={inputRef}
              type="text"
              id="expression_input"
              value={formatter(replacer(currentExpression))}
              onKeyDown={(e: any) => {
                if (e.key === "Backspace") {
                  const cursor = e.target.selectionStart;
                  let str: string = e.target.value;
                  if (cursor === e.target.selectionEnd) {
                    if (str.charAt(cursor - 1) === " ") {
                      e.preventDefault();
                      str = str
                        .split("")
                        .map((s, idx: number) => {
                          if (idx === cursor - 2) {
                            return "";
                          }
                          return s;
                        })
                        .join("");

                      window.setTimeout(function () {
                        e.target.setSelectionRange(cursor - 3, cursor - 3); // Works
                      }, 0);
                      setCurrentExpression(replaceOriginal(str));
                    } else {
                      e.preventDefault();
                      str = str
                        .split("")
                        .map((s, idx: number) => {
                          if (idx === cursor - 1) {
                            return "";
                          }
                          return s;
                        })
                        .join("");

                      window.setTimeout(function () {
                        e.target.setSelectionRange(cursor - 1, cursor - 1); // Works
                      }, 0);
                      setCurrentExpression(replaceOriginal(str));
                    }
                  }
                }
              }}
              onChange={(e) => {
                setCurrentExpression(replaceOriginal(e.target.value));
              }}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="expression_input"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Enter the expression
            </label>
          </div>

          <button
            onClick={handleSubmit}
            type="button"
            className="w-full md:w-auto focus:outline-none text-white bg-green-700 hover:bg-green-800 focus-visible:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3.5"
          >
            Compute
          </button>
        </form>
        {error && (
          <p className="mt-1  w-full block text-left text-xs text-red-600">
            {error}
          </p>
        )}

        {/* keypad */}
        <div className="w-full mt-5 flex items-start justify-start gap-5 flex-wrap">
          <Button
            onClick={(e: any) => {
              handleOperatorInput("( ");
            }}
          >
            (
          </Button>
          <Button
            onClick={() => {
              handleOperatorInput("P");
            }}
          >
            P
          </Button>
          <Button
            onClick={() => {
              handleOperatorInput("Q");
            }}
          >
            Q
          </Button>
          <Button
            onClick={() => {
              handleOperatorInput(" & ");
            }}
          >
            {replacer("&")}
          </Button>
          <Button
            onClick={() => {
              handleOperatorInput(" | ");
            }}
          >
            {replacer("|")}
          </Button>
          <Button
            onClick={() => {
              handleOperatorInput(" -> ");
            }}
          >
            {replacer("->")}
          </Button>
          <Button
            onClick={() => {
              handleOperatorInput(" <-> ");
            }}
          >
            {replacer("<->")}
          </Button>
          <Button
            onClick={() => {
              handleOperatorInput(" + ");
            }}
          >
            {replacer("+")}
          </Button>
          <Button
            onClick={() => {
              handleOperatorInput(" )");
            }}
          >
            )
          </Button>
        </div>

        {expression && (
          <div className="my-5 w-full flex flex-col items-center justify-center">
            <h1 className="mb-3 text-2xl font-bold tracking-wider text-gray-800">
              {replacer(expression)}
            </h1>
            <div className="w-full h-full">
              <Table headings={headings} datas={datas} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
