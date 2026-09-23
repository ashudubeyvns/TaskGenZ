import type {
  ReactNode,
} from "react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (
    row: T,
  ) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (
    row: T,
    index: number,
  ) => string | number;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = "No data available.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 bg-slate-950">
            <tr>
              {columns.map(
                (column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={`px-4 py-3 font-semibold text-slate-400 ${column.className ?? ""}`}
                  >
                    {column.header}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {data.length ===
            0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length
                  }
                  className="px-4 py-10 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map(
                (row, index) => (
                  <tr
                    key={getRowKey(
                      row,
                      index,
                    )}
                    className="transition hover:bg-slate-800/50"
                  >
                    {columns.map(
                      (column) => (
                        <td
                          key={
                            column.key
                          }
                          className={`px-4 py-3 text-slate-300 ${column.className ?? ""}`}
                        >
                          {column.render
                            ? column.render(
                                row,
                              )
                            : String(
                                (
                                  row as Record<
                                    string,
                                    unknown
                                  >
                                )[
                                  column
                                    .key
                                ] ??
                                  "",
                              )}
                        </td>
                      ),
                    )}
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}