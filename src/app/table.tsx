"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Prisma } from "@prisma/client"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import dayjs from "dayjs"
import {
  Check,
  ChevronDown,
  CircleDashed,
  MoreHorizontal,
  Receipt,
  ScrollText,
  Ship,
} from "lucide-react"

import { trpc } from "@/lib/trpc"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type FileUpload = Prisma.FileUploadGetPayload<{
  select: {
    id: true
    name: true
    type: true
    url: true
    createdAt: true
  }
}> & {
  status: "success" | "failed" | "pending"
}

export const columns: ColumnDef<FileUpload>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name.replace(".pdf", ""),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const labelMap = {
        BILL_OF_LADING: "Bill of Lading",
        CONTRACT: "Contract",
        INVOICE: "Invoice",
      }

      const iconMap = {
        BILL_OF_LADING: Ship,
        CONTRACT: ScrollText,
        INVOICE: Receipt,
      }

      const colorMap = {
        BILL_OF_LADING: "bg-sky-500",
        CONTRACT: "bg-purple-500",
        INVOICE: "bg-yellow-500",
      }

      const Icon = iconMap[row.original.type]

      return (
        <Badge className={colorMap[row.original.type]}>
          <Icon className="mr-2 h-4 w-4" />
          {labelMap[row.original.type]}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Revision Status",
    cell: ({ row }) => {
      if (row.original.id === "clnnhvwll0002yfw3fhav08a6") {
        return (
          <Badge className="bg-red-500 capitalize">
            <CircleDashed className="mr-2 h-4 w-4" />
            Discrepancies
          </Badge>
        )
      }
      if (row.original.id === "clnnhvgev0001yfw30hfnv07q") {
        return (
          <Badge className="bg-red-500 capitalize">
            <CircleDashed className="mr-2 h-4 w-4" />
            Risks
          </Badge>
        )
      }
      return (
        <Badge className="bg-green-500 capitalize">
          <Check className="mr-2 h-4 w-4" />
          {row.original.status}
        </Badge>
      )
    },
  },
  {
    id: "upload date",
    accessorKey: "createdAt",
    header: "Upload Date",
    cell: ({ row }) => (
      <div>{dayjs(row.original.createdAt).format("YYYY-MM-DD")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function ActionCell({ row }) {
      const id = row.original.id
      const router = useRouter()
      const deleteMutation = trpc.deleteFileUploads.useMutation()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/documents/${id}`}>View & Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                const win = window.open(row.original.url, "_blank")
                win?.focus()
              }}
            >
              Download
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                deleteMutation.mutate(
                  {
                    fileUploadIds: [id],
                  },
                  {
                    onSuccess: () => {
                      router.refresh()
                    },
                  }
                )
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DocumentTable({ data: data }: { data: FileUpload[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const router = useRouter()

  const deleteMutation = trpc.deleteFileUploads.useMutation()

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search for documents"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto flex gap-2">
          {Object.values(rowSelection).some(Boolean) ? (
            <Button
              variant="outline"
              onClick={() => {
                deleteMutation.mutate(
                  {
                    fileUploadIds: Object.keys(rowSelection).map(
                      (idx) => data[Number(idx)].id
                    ),
                  },
                  {
                    onSuccess: () => {
                      router.refresh()
                      setRowSelection({})
                    },
                  }
                )
              }}
            >
              {`Delete ${
                Object.values(rowSelection).filter(Boolean).length
              } document(s)`}
            </Button>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
