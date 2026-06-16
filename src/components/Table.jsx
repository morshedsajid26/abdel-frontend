"use client";
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Search } from "lucide-react";

export default function Table({ TableHeads, TableRows, headClass, tableClass }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);

  // 1. Transform user's TableHeads into TanStack columns
  const columns = React.useMemo(
    () =>
      TableHeads.map((head) => ({
        accessorKey: head.key,
        header: head.Title,
        cell: (info) => {
          if (head.render) {
            return head.render(info.row.original, info.row.index);
          }
          return info.getValue();
        },
        size: head.width,
        enableSorting: head.sortable !== false,
      })),
    [TableHeads]
  );

  // 2. Initialize the table
  const table = useReactTable({
    data: TableRows,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4 w-full">
      <div className="overflow-x-auto  w-full">
        <table className={`w-full border-collapse ${tableClass}`}>
          {/* ==== TABLE HEADER ==== */}  
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`text-left border-b border-gray-800/50 bg-[#0E0E10] font-semibold text-white py-4 px-4 ${headClass} select-none`}
                    style={{ width: header.column.columnDef.size }}
                  >
                    <div 
                      className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      
                      {header.column.getCanSort() && (
                        <span className="text-gray-500">
                          {{
                            asc: <ArrowUp size={14} className="text-gray-300" />,
                            desc: <ArrowDown size={14} className="text-gray-300" />,
                          }[header.column.getIsSorted()] ?? <ArrowUpDown size={14} />}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* ==== TABLE BODY ==== */}
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-800/30 transition-all border-b border-gray-800/50 last:border-0 group">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="py-5 text-left px-4 text-[15px] font-normal text-white transition-colors"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ==== PAGINATION CONTROLS ==== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 bg-transparent border-t border-gray-800/50">
        <div className="text-sm text-gray-400 text-center sm:text-left">
          Page <span className="font-semibold text-white">{table.getState().pagination.pageIndex + 1}</span> of{" "}
          <span className="font-semibold text-white">{table.getPageCount()}</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
            <button
                className="p-2 sm:p-2.5 rounded-lg border border-gray-700 bg-[#151515] text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center gap-1.5">
                {table.getPageOptions().map((pageIdx) => (
                    <button
                        key={pageIdx}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border text-sm font-medium transition-all ${
                            table.getState().pagination.pageIndex === pageIdx
                                ? "bg-blue-600/20 text-blue-500 border-blue-500/50"
                                : "bg-[#151515] text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white"
                        }`}
                        onClick={() => table.setPageIndex(pageIdx)}
                    >
                        {pageIdx + 1}
                    </button>
                ))}
            </div>

            <button
                className="p-2 sm:p-2.5 rounded-lg border border-gray-700 bg-[#151515] text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                <ChevronRight size={18} />
            </button>
        </div>
      </div>
    </div>
  );
}