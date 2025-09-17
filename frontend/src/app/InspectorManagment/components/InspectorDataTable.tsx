import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    PaginationState,
} from "@tanstack/react-table"


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { DataTablePagination } from "@/components/Pagination"
import { DataTableToolbar } from "./DataTableToolbar"


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pageCount: number
    onPaginationChange: (pagination: PaginationState) => void
    onSortingChange: (sorting: SortingState) => void
    onColumnFiltersChange: (filters: ColumnFiltersState) => void
    pagination: PaginationState
    isLoading: boolean
    searchValue: string
    onSearchChange: (value: string) => void
}

export function InspectorDataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    pagination,
    isLoading,
    searchValue,
    onSearchChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    // Handle sorting changes
    useEffect(() => {
        onSortingChange(sorting);
    }, [sorting, onSortingChange]);

    // Handle filter changes
    useEffect(() => {
        onColumnFiltersChange(columnFilters);
    }, [columnFilters, onColumnFiltersChange]);

    const table = useReactTable({
        data,
        columns,
        pageCount: pageCount,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: (updaterOrValue) => {
            onPaginationChange(
                typeof updaterOrValue === "function"
                    ? updaterOrValue(pagination)
                    : updaterOrValue
            );
        },
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        state: {
            sorting,
            columnFilters,
            pagination,
        },
    })
    return (
        <div className="space-y-4">
            <DataTableToolbar
                table={table}
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                isLoading={isLoading}
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
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
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
                <DataTablePagination table={table} isLoading={isLoading} />
            </div>
        </div>
    );
}


