import { Inspection } from "@/features/inspection/types"
import { ColumnDef } from "@tanstack/react-table"
import { MapPin } from "lucide-react"


export const columns: ColumnDef<Inspection>[] = [
    {
        accessorKey: "bookingReference",
        header: "Booking Reference",
        cell: ({ row }) => <div className="font-medium">{row.getValue("bookingReference")}</div>,
    },
    {
        accessorKey: "vehicle.make",
        header: "Vehicle",
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate max-w-[200px]">{row.getValue("location")}</span>
            </div>
        ),
    },
]