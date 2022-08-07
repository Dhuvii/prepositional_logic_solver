import parse from "html-react-parser";

const Table = ({
  headings = [],
  datas = [],
}: {
  headings: any[];
  datas: any[];
}) => {
  return (
    <div className="w-full max-h-[30rem] relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full  overflow-auto text-sm text-left text-gray-500">
        <thead className="text-xs text-white bg-gray-800">
          <tr>
            {headings.map((heading, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-6 py-3 text-center whitespace-nowrap"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {datas.map((data, idx) => (
            <tr key={idx} className="bg-white border-b">
              {Object.keys(data).map((key, idx) => (
                <td
                  key={idx}
                  className={`${
                    data[key].class && data[key].class
                  } px-6 py-4 text-center border-r
                                } `}
                >
                  {data[key].badge ? (
                    <span
                      className={`${
                        data[key].value
                          ? " bg-green-100 text-green-900"
                          : "bg-red-100 text-red-900"
                      } p-1 px-2 rounded-md`}
                    >
                      {data[key].value ? "T" : "F"}
                    </span>
                  ) : (
                    parse(data[key].value ? "T" : "F")
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
