"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export type Column<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
};
type ComplianceTableProps<T> = {
  columns: Column<T>[];
  data: T[]; // current page rows
  page: number; // current page (1- based)
  pageCount: number; // total pages
  onPageChange?: (page: number) => void; // parent decides how to fetch
  onRowSelect?: (row: T) => void; // optional row click/keyboard select
};
const ComplianceTable = <T extends { id: string | number }>({
  columns,
  data,
  page,
  pageCount,
  onPageChange,
  onRowSelect,
}: ComplianceTableProps<T>) => {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
                return (
                  <TableHead key={String(column.key)}>
                    {column.header}{" "}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-muted-foreground"
                >
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              data?.map((item) => (
                <TableRow
                  key={String(item.id)}
                  tabIndex={0} // click or Enter/Space = select row
                  onClick={() => onRowSelect?.(item)}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && onRowSelect) {
                      e.preventDefault();
                      onRowSelect(item);
                    }
                  }}
                  className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render ? col.render(item) : String(item[col.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Simple pagination controls */}
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">
          Page {page} of {pageCount}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || !onPageChange}
            onClick={() => onPageChange?.(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pageCount || !onPageChange}
            onClick={() => onPageChange?.(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceTable;
