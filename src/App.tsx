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
          console.log({ datas, heading });
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

  const handleReset = () => {
    setError("");
    setExpression("");
    setCurrentExpression("");
    setDatas([]);
    setHeadings([]);
  };

  const handleOperatorInput = (ch: string) => {
    setCurrentExpression((pv: string) => (pv += ch));
    if (inputRef && inputRef.current) {
      //@ts-ignore
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative lg:overflow-hidden w-full h-full min-h-[100dvh] p-3 md:p-10 flex-col flex items-center justify-center">
      {/* background effects */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full w-full [mask-image:linear-gradient(180deg,transparent,black,transparent,transparent)]">
        <div className="pattern -ml-2 -mt-1 h-full w-full opacity-80"></div>
      </div>

      <div className="pointer-events-none absolute bottom-0 right-0 mt-10 flex items-center justify-center">
        <div className="flex -rotate-45 items-end justify-end">
          <div className="h-40 w-96 rounded-full bg-green-500 opacity-40 blur-[100px]"></div>
          <div className="h-96 w-[12rem] rounded-full bg-blue-500 opacity-40 blur-[150px]"></div>
        </div>
      </div>
      {/* background effects */}

      <div className="relative z-[50] w-full mb-10 max-w-xl">
        <h1 className="w-full block text-center text-xl sm:text-6xl font-bold text-gray-800">
          Prepositional Truth Table Generator
        </h1>
        <h3 className="mt-3 text-xs sm:text-base text-center tracking-wide text-gray-600">
          This represents of all the combinations of values for inputs and their
          corresponding outputs.
        </h3>
      </div>
      <div className="p-5 w-full md:w-auto md:min-w-[32rem] max-w-7xl rounded-xl bg-gray-50/10 border flex flex-col items-center justify-start">
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

          <div className="w-full md:w-auto flex items-center justify-between gap-5">
            <button
              onClick={handleSubmit}
              type="button"
              className="w-full md:w-auto focus:outline-none text-white bg-green-700 hover:bg-green-800 focus-visible:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3.5"
            >
              Compute
            </button>

            {datas.length > 0 && (
              <>
                <button
                  onClick={handleReset}
                  type="button"
                  className="w-auto focus:outline-none text-gray-800 bg-gray-300 hover:bg-gray-400 focus-visible:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-3.5"
                >
                  Reset
                </button>
              </>
            )}
          </div>
        </form>
        {error && (
          <p className="mt-1  w-full block text-left text-xs text-red-600">
            {error}
          </p>
        )}

        <div
          className={`w-full ${
            !expression
              ? "grid grid-cols-1 sm:grid-cols-2 items-start justify-start pb-5"
              : ""
          } `}
        >
          {/* keypad */}
          <div
            className={`w-full mt-5 ${
              !expression ? "grid grid-cols-3" : "grid grid-cols-3 md:flex"
            } items-center justify-center gap-5`}
          >
            <Button
              onClick={(e: any) => {
                handleOperatorInput("( ");
              }}
            >
              (
            </Button>
            <Button
              onClick={(e: any) => {
                handleOperatorInput("!");
              }}
            >
              {replacer("!")}
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
                handleOperatorInput("R");
              }}
            >
              R
            </Button>
            <Button
              onClick={() => {
                handleOperatorInput("S");
              }}
            >
              S
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

          {/* description */}
          {!expression && (
            <div className="w-full sm:min-w-max h-full sm:w-auto mt-5 p-3 bg-gray-50 border rounded-lg">
              <ul className="list-disc list-inside">
                <li className="w-full max-w-sm text-sm text-gray-500 italic leading-relaxed">
                  ex:{" "}
                  <span className="not-italic bg-gray-200 rounded-md px-1 py-0.5 text-gray-800">
                    (P → Q) ∧ S
                  </span>
                </li>
                <li className="w-full max-w-sm mt-2 text-sm text-gray-500 italic leading-relaxed">
                  <span className="mr-2 not-italic bg-gray-200 rounded-md px-1 py-0.5 text-gray-800">
                    {"->"}
                  </span>
                  is for
                  <span className="mx-2 not-italic bg-gray-200 rounded-md px-1 py-0.5 text-gray-800">
                    {"→"}
                  </span>
                  (implification)
                </li>
                <li className="w-full max-w-sm mt-2 text-sm text-gray-500 italic leading-relaxed">
                  <span className="mr-2 not-italic bg-gray-200 rounded-md px-1 py-0.5 text-gray-800">
                    {"<->"}
                  </span>
                  is for
                  <span className="mx-2 not-italic bg-gray-200 rounded-md px-1 py-0.5 text-gray-800">
                    {"↔"}
                  </span>
                  (bi-conditional)
                </li>
                <li className="w-full max-w-sm mt-2 text-sm text-gray-500 italic leading-relaxed">
                  <span className="mr-2 not-italic bg-gray-200 rounded-md px-1 py-0.5 text-gray-800">
                    {"&"}
                  </span>
                  is for
                  <span className="mx-2 not-italic bg-gray-200 rounded-md px-1 py-0.5 text-gray-800">
                    {"∧"}
                  </span>
                  (conjunction)
                </li>
                <li className="w-full max-w-sm mt-2 text-sm text-gray-500 italic leading-relaxed">
                  <span className="mr-2 not-italic bg-gray-200 rounded-md px-1 py-0.5 text-gray-800">
                    {"|"}
                  </span>
                  is for
                  <span className="mx-2 not-italic bg-gray-200 rounded-md px-1 py-0.5 text-gray-800">
                    {"∨"}
                  </span>
                  (disjunction)
                </li>
                <li className="w-full max-w-sm mt-2 text-sm text-gray-500 italic leading-relaxed">
                  <span className="mr-2 not-italic bg-gray-200 rounded-md px-1 py-0.5 text-gray-800">
                    {"+"}
                  </span>
                  is for
                  <span className="mx-2 not-italic bg-gray-200 rounded-md px-1 py-0.5 text-gray-800">
                    {"⊕"}
                  </span>
                  (exclusive OR)
                </li>
              </ul>
            </div>
          )}
        </div>

        {expression && (
          <div className="mt-5 w-full flex flex-col items-center justify-center">
            <h1 className="mb-3 text-base md:text-2xl font-bold tracking-wider text-gray-800">
              {replacer(expression)}
            </h1>
            <Table headings={headings} datas={datas} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
