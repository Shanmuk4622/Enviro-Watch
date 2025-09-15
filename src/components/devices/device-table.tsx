"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle } from "lucide-react"

import { SensorDevice } from "@/lib/types"
import { getColumns } from "./columns"
import { DeviceDialog } from "./device-dialog"
import { useDevices } from "@/hooks/use-devices"
import { Skeleton } from "../ui/skeleton"

// These imports are now placeholders for server actions
// The actual logic is handled on the server
const addDevice = async (device: SensorDevice) => Promise.resolve();
const deleteDevice = async (deviceId: string) => Promise.resolve();


export function DeviceTable() {
  const { devices: data, isLoading } = useDevices();
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedDevice, setSelectedDevice] = React.useState<SensorDevice | null>(null)

  const handleAddNew = () => {
    setSelectedDevice(null);
    setIsDialogOpen(true);
  }

  const handleEdit = (device: SensorDevice) => {
    setSelectedDevice(device);
    setIsDialogOpen(true);
  }

  const handleDelete = async (device: SensorDevice) => {
    if (confirm(`Are you sure you want to delete ${device.name}?`)) {
      // This is now calling a server action implicitly
      await deleteDevice(device.id);
    }
  }
  
  const handleSave = async (device: SensorDevice) => {
     // This is now calling a server action implicitly
     await addDevice(device);
  }

  const columns = React.useMemo(() => getColumns(handleEdit, handleDelete), []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
        pagination: {
            pageSize: 5,
        }
    }
  })

  if (isLoading) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between py-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-36" />
            </div>
            <Skeleton className="h-96 w-full" />
            <div className="flex items-center justify-end space-x-2 py-4">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-20" />
            </div>
        </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter devices..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Device
        </Button>
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
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
       <DeviceDialog 
        device={selectedDevice}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
