"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResponsiveTableWrapper } from "@/components/shared/ResponsiveTableWrapper";
import { formatDate } from "@/lib/utils/format";
import type { User } from "@/types/api/auth.types";

/** Column configuration for Users table - extensible for sorting/filtering */
const COLUMN_IDS = {
  NAME: "name",
  EMAIL: "email",
  ROLE: "role",
  STATUS: "status",
  CREATED: "createdAt",
  ACTIONS: "actions",
} as const;

const columnHelper = createColumnHelper<User>();

export interface UsersTableProps {
  /** User data to display (current page from server) */
  users: User[];
}

/**
 * Users data table built with TanStack React Table.
 * Supports server-side pagination and filtering via parent.
 * Structured for future column sorting, visibility, and inline filters.
 */
export function UsersTable({ users }: UsersTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor(
        (row) =>
          [row.firstName, row.lastName].filter(Boolean).join(" ").trim() || "N/A",
        {
          id: COLUMN_IDS.NAME,
          header: "Name",
          cell: ({ row }) => {
            const { firstName, lastName } = row.original;
            const name =
              firstName && lastName
                ? `${firstName} ${lastName}`
                : firstName || lastName || "N/A";
            return <span className="font-medium">{name}</span>;
          },
        }
      ),
      columnHelper.accessor("email", {
        id: COLUMN_IDS.EMAIL,
        header: "Email",
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue()}</span>
        ),
      }),
      columnHelper.accessor("role", {
        id: COLUMN_IDS.ROLE,
        header: "Role",
        cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
      }),
      columnHelper.accessor("isActive", {
        id: COLUMN_IDS.STATUS,
        header: "Status",
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? "default" : "secondary"}>
            {getValue() ? "Active" : "Inactive"}
          </Badge>
        ),
      }),
      columnHelper.accessor("createdAt", {
        id: COLUMN_IDS.CREATED,
        header: "Created",
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">
            {formatDate(getValue(), "PP")}
          </span>
        ),
      }),
      columnHelper.display({
        id: COLUMN_IDS.ACTIONS,
        header: "Actions",
        cell: ({ row }) => (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/users/${row.original.id}`}>View</Link>
          </Button>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;
  const isEmpty = users.length === 0;

  return (
    <ResponsiveTableWrapper>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    header.id === COLUMN_IDS.NAME && "min-w-[150px]",
                    header.id === COLUMN_IDS.EMAIL && "min-w-[200px]",
                    header.id === COLUMN_IDS.ROLE && "min-w-[100px]",
                    header.id === COLUMN_IDS.STATUS && "min-w-[100px]",
                    header.id === COLUMN_IDS.CREATED && "min-w-[120px]",
                    header.id === COLUMN_IDS.ACTIONS &&
                      "min-w-[100px] text-right"
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-8 text-center text-muted-foreground"
              >
                No users found
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      cell.column.id === COLUMN_IDS.ACTIONS && "text-right min-w-[100px]"
                    )}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ResponsiveTableWrapper>
  );
}
