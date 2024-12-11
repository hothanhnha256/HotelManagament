"use client";
import { useState, useMemo } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { useRouter } from "next/navigation";

export interface datafetch {
  id: string;
  year: string;
  quarter: string;
  defaultNoPages: number;
  startDate: string;
  endDate: string;
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const sampleData: datafetch[] = [
  {
    id: "1",
    year: "2021",
    quarter: "Q1",
    defaultNoPages: 10,
    startDate: "2021-01-01",
    endDate: "2021-03-31",
  },
  {
    id: "2",
    year: "2021",
    quarter: "Q2",
    defaultNoPages: 15,
    startDate: "2021-04-01",
    endDate: "2021-06-30",
  },
  {
    id: "3",
    year: "2021",
    quarter: "Q3",
    defaultNoPages: 20,
    startDate: "2021-07-01",
    endDate: "2021-09-30",
  },
  {
    id: "4",
    year: "2021",
    quarter: "Q4",
    defaultNoPages: 25,
    startDate: "2021-10-01",
    endDate: "2021-12-31",
  },
  {
    id: "5",
    year: "2022",
    quarter: "Q1",
    defaultNoPages: 10,
    startDate: "2022-01-01",
    endDate: "2022-03-31",
  },
  {
    id: "6",
    year: "2022",
    quarter: "Q2",
    defaultNoPages: 15,
    startDate: "2022-04-01",
    endDate: "2022-06-30",
  },
  {
    id: "7",
    year: "2022",
    quarter: "Q3",
    defaultNoPages: 20,
    startDate: "2022-07-01",
    endDate: "2022-09-30",
  },
  {
    id: "8",
    year: "2022",
    quarter: "Q4",
    defaultNoPages: 25,
    startDate: "2022-10-01",
    endDate: "2022-12-31",
  },
];

export default function AllPermittedType() {
  const [data, setData] = useState<datafetch[]>(sampleData);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Năm học",
        accessor: "year",
      },
      {
        Header: "Học kỳ",
        accessor: "quarter",
      },
      {
        Header: "Số trang mặc định",
        accessor: "defaultNoPages",
      },
      {
        Header: "Ngày bắt đầu",
        accessor: "startDate",
        Cell: ({ value }: { value: string }) => formatDate(value),
      },
      {
        Header: "Ngày kết thúc",
        accessor: "endDate",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "Xem chi tiết",
        accessor: "actions",
        Cell: ({ row }: { row: any }) => (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded"
            onClick={() => {
              router.push(`/room/${row.original.id}`);
            }}
          >
            Xem chi tiết
          </button>
        ),
      },
    ],
    [router]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setGlobalFilter,
    state: { pageIndex, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const handleSearch = (e: any) => {
    const value = e.target.value || undefined;
    setGlobalFilter(value);
    setSearchInput(value);
  };

  return (
    <div className="relative w-full md:w-2/3 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      ) : (
        <div className="justify-between items-center mb-4 w-full">
          <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">
            Danh sách loại file được phép
          </h2>
          <input
            value={searchInput}
            onChange={handleSearch}
            placeholder="Tìm kiếm..."
            className="mb-4 p-2 border border-gray-300 rounded"
          />
          <div className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="min-w-full divide-y divide-gray-200"
            >
              <thead className="bg-gray-50 dark:bg-gray-700">
                {headerGroups.map((headerGroup: any) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column: any) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="bg-white dark:bg-gray-800 divide-y divide-gray-200"
              >
                {page.map((row: any) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell: any) => (
                        <td
                          {...cell.getCellProps()}
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="pagination mt-4">
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="px-2 py-1 border rounded"
            >
              {"<<"}
            </button>{" "}
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="px-2 py-1 border rounded"
            >
              {"<"}
            </button>{" "}
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="px-2 py-1 border rounded"
            >
              {">"}
            </button>{" "}
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className="px-2 py-1 border rounded"
            >
              {">>"}
            </button>{" "}
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
