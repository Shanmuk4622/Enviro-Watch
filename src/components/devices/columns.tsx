"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SensorDevice } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"

const statusVariantMap: { [key in SensorDevice['status']]: "default" | "destructive" | "secondary" } = {
  Normal: "default",
  Warning: "secondary",
  Critical: "destructive",
  Offline: "outline"
};

const statusColorMap: { [key in SensorDevice['status']]: string } = {
  Normal: "bg-green-500/10 text-green-700 border-green-500/50 dark:text-green-400",
  Warning: "bg-yellow-500/10 text-yellow-700 border-yellow-500/50 dark:text-yellow-400",
  Critical: "bg-red-500/10 text-red-700 border-red-500/50 dark:text-red-400",
  Offline: "bg-gray-500/10 text-gray-700 border-gray-500/50 dark:text-gray-400"
};

export const getColumns = (
  onEdit: (device: SensorDevice) => void,
  onDelete: (device: SensorDevice) => void
): ColumnDef<SensorDevice>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Device Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "id",
    header: "Device ID",
  },
  {
    accessorKey: "location.name",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return <Badge className={cn("capitalize", statusColorMap[status])}>{status}</Badge>
    },
  },
  {
    accessorKey: "coLevel",
    header: ({ column }) => {
       return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CO Level (ppm)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
       const level = row.original.coLevel;
       const status = row.original.status;
       const color = status === 'Critical' ? 'text-red-500' : status === 'Warning' ? 'text-yellow-500' : '';
       return <div className={cn("text-center font-semibold", color)}>{level}</div>
    }
  },
  {
    accessorKey: "battery",
    header: "Battery",
    cell: ({ row }) => {
      const battery = row.original.battery;
      const color = battery < 20 ? 'text-red-500' : battery < 50 ? 'text-yellow-500' : 'text-green-500';
      return <div className={cn('font-medium', color)}>{battery}%</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const device = row.original

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
              <Link href={`/devices/${device.id}`} className="flex items-center cursor-pointer">
                <Eye className="mr-2 h-4 w-4" /> View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(device.id)}>
              Copy Device ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(device)}>Edit Device</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(device)}>Delete Device</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
