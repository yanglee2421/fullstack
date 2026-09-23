"use client";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffectReady } from "@/hooks/use-effect-ready";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "cn";
import { format } from "date-fns";
import type { schema } from "db/postgres";
import {
  Loader,
  RefreshCcw,
  Square,
  SquareCheck,
  SquareCheckBig,
  Trash,
} from "lucide-react";
import React from "react";

type Row = typeof schema.overtimes.$inferSelect;

const columnHelper = createColumnHelper<Row>();
const columns = [
  columnHelper.display({
    id: "selection",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onCheckedChange={(c) => {
            table.toggleAllPageRowsSelected(c);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={row.getToggleSelectedHandler()}
        />
      );
    },
    footer: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onCheckedChange={(c) => {
            table.toggleAllPageRowsSelected(c);
          }}
        />
      );
    },
  }),
  columnHelper.accessor("id", {
    cell: ({ getValue }) => {
      return <>#{getValue()}</>;
    },
  }),
  columnHelper.accessor("date", {
    cell: ({ getValue }) => {
      return format(getValue(), "yyyy-MM-dd");
    },
  }),
  columnHelper.accessor("duration", {}),
  columnHelper.accessor("note", {}),
  columnHelper.accessor("cashed", {
    cell: ({ getValue }) => {
      return getValue() ? <SquareCheck /> : <Square />;
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "action",
    cell: () => {
      return (
        <>
          <Dialog>
            <DialogTrigger
              render={
                <Button size={"icon"} variant={"ghost"}>
                  <SquareCheckBig />
                </Button>
              }
            />
            <DialogContent className={"gap-0"}>
              <DialogHeader>
                <DialogTitle>Warnning</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <p className="mb-2">
                Are you sure you want to update this record?
              </p>
              <DialogFooter>
                <Button>Confirm</Button>
                <DialogClose
                  render={<Button variant={"secondary"}>Cancel</Button>}
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger
              render={
                <Button size={"icon"} variant={"ghost"}>
                  <Trash />
                </Button>
              }
            />
            <DialogContent className={"gap-0"}>
              <DialogHeader>
                <DialogTitle>Warnning</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <p className="mb-2">
                Are you sure you want to delete this record?
              </p>
              <DialogFooter>
                <Button>Confirm</Button>
                <DialogClose
                  render={<Button variant={"secondary"}>Cancel</Button>}
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  }),
];

interface QueryResult {
  count: number;
  rows: Row[];
}

interface OvertimesProps {
  action: () => Promise<QueryResult>;
}

export const Overtimes = (props: OvertimesProps) => {
  "use no memo";

  const enabled = useEffectReady();

  const query = useQuery({
    queryKey: ["overtimes"],
    queryFn: async () => {
      const data = await props.action();

      return data;
    },
    enabled,
  });

  const data = React.useMemo(() => query.data?.rows || [], [query.data]);

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    columns,
    data,
    getRowId: (row) => row.id.toString(),
  });

  const renderBody = () => {
    if (query.isPending) {
      return (
        <TableRow>
          <TableCell colSpan={table.getAllLeafColumns().length}>
            <div className="flex items-center justify-center p-3">
              <Loader className="animate-spin" />
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (query.isError) {
      return (
        <TableRow>
          <TableCell colSpan={table.getAllLeafColumns().length}>
            {query.error.message}
          </TableCell>
        </TableRow>
      );
    }

    if (table.getRowCount() === 0) {
      return (
        <TableRow>
          <TableCell colSpan={table.getAllLeafColumns().length}>
            No Data
          </TableCell>
        </TableRow>
      );
    }

    return table.getRowModel().rows.map((row) => {
      return (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => {
            return (
              <TableCell key={cell.id}>
                {cell.getIsPlaceholder() ||
                  flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Overtimes</CardTitle>
        <CardAction>
          <Button
            onClick={() => {
              query.refetch();
            }}
            disabled={query.isRefetching}
            variant={"ghost"}
            size={"icon"}
          >
            <RefreshCcw className={cn(query.isRefetching && "animate-spin")} />
          </Button>
        </CardAction>
      </CardHeader>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => {
              return (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => {
                    return (
                      <TableHead key={h.id}>
                        {h.isPlaceholder ||
                          flexRender(h.column.columnDef.header, h.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>{renderBody()}</TableBody>
        </Table>
        <Separator />
      </div>
      <div className="flex gap-2 px-2">
        <div className="mx-auto"></div>
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
          <Select defaultValue="25">
            <SelectTrigger className="w-20" id="select-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </Card>
  );
};
