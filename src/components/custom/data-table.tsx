/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { LucideIcon, MoreVertical } from "lucide-react";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";

type Row = Record<string, string | Date | boolean | number | null | undefined>;

type ColumnItem = {
  name: string;
  key: string;
  isBold?: boolean;
  isDate?: boolean;
  width?: number;
  align?: "left" | "center" | "right";
  render?: (value: any, row: Record<string, any>) => React.ReactNode;
};

type ActionItem = {
  label: string;
  Icon?: LucideIcon;
  onClick: (row: Row) => void;
};

type Props = {
  columns: ColumnItem[];
  data?: Row[];
  isLoading?: boolean;
  className?: string;
  rowClassName?: string;
  actions?: ActionItem[];
};

const DataTable = ({
  columns,
  data = [],
  isLoading = false,
  className = "",
  rowClassName = "",
  actions,
}: Props) => {
  return (
    <Table className={cn("", className)}>
      <TableHeader>
        <TableRow className="h-12 bg-primary/5">
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className="px-6"
              style={{
                width: col.width,
                textAlign: col.align || "left",
              }}
            >
              {col.name}
            </TableHead>
          ))}
          {actions && actions.length > 0 && <TableHead />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow className="h-12">
            <TableCell className="px-6 opacity-50 animate-pulse">
              Loading...
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow className="h-12">
            <TableCell className="px-6 opacity-75">Nothing here...</TableCell>
          </TableRow>
        ) : (
          data.map((row, idx) => (
            <TableRow key={idx} className={cn("h-12", rowClassName)}>
              {columns.map((col) => {
                return (
                  <TableCell
                    key={col.key}
                    className={cn("px-6", col.isBold ? "font-medium" : "")}
                    style={{ textAlign: col.align || "left" }}
                  >
                    {row[col.key] ? (
                      typeof row[col.key] === "boolean" ? (
                        <Badge>True</Badge>
                      ) : col.isDate ? (
                        format(
                          (row[col.key] as Date) || new Date(),
                          "dd MMM yyy"
                        )
                      ) : col.render ? (
                        col.render(row[col.key], row)
                      ) : (
                        row[col.key]?.toString() || "N/A"
                      )
                    ) : typeof row[col.key] === "boolean" ? (
                      <Badge variant={"destructive"}>False</Badge>
                    ) : (
                      <span className="opacity-50">None</span>
                    )}
                  </TableCell>
                );
              })}
              {actions && actions.length > 0 && (
                <TableCell className="px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="size-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[156px] mx-2">
                      {actions.map((action, actionIdx) => (
                        <DropdownMenuItem
                          key={actionIdx}
                          onClick={() => action.onClick(row)}
                          className="flex items-center gap-2"
                        >
                          {action.Icon && <action.Icon className="w-4 h-4" />}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default DataTable;
