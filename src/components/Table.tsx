import parse from "html-react-parser";

const Table = ({
  headings = [],
  datas = [],
}: {
  headings: any[];
  datas: any[];
}) => {
  return (
    <div className="w-full h-full max-h-[20rem] overflow-x-auto relative shadow-md rounded-lg">
      <table className="w-full h-full overflow-y-auto text-sm text-left text-gray-500 rounded-lg">
        <thead className="text-xs sticky top-0 text-white bg-gray-800">
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
        <tbody className="">
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
