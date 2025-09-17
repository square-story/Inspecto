import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    Table as TableFromTanstack,
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Cross2Icon } from "@radix-ui/react-icons"


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pageCount: number
    onPaginationChange: (pagination: PaginationState) => void
    pagination: PaginationState
    isLoading: boolean
    searchValue: string
    onSearchChange: (value: string) => void
    onColumnFiltersChange: (filters: ColumnFiltersState) => void
}

interface DataTableToolbarProps<TData> {
    table: TableFromTanstack<TData>
    onSearchChange: (value: string) => void
    searchValue: string
    isLoading?: boolean
}

function UserDataTableToolbar<TData>({
    table,
    searchValue,
    onSearchChange,
    isLoading = false,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0 || searchValue !== ''

    return (
        <div className='flex items-center justify-between mb-4'>
            <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
                <Input
                    placeholder='Filter users...'
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    className='h-8 w-[150px] lg:w-[250px]'
                    disabled={isLoading}
                />
                {isFiltered && (
                    <Button
                        variant='ghost'
                        onClick={() => {
                            table.resetColumnFilters();
                            onSearchChange('');
                        }}
                        className='h-8 px-2 lg:px-3'
                        disabled={isLoading}
                    >
                        Reset
                        <Cross2Icon className='ml-2 h-4 w-4' />
                    </Button>
                )}
            </div>
        </div>
    )
}

export function UserDataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    onPaginationChange,
    pagination,
    isLoading,
    searchValue,
    onSearchChange,
    onColumnFiltersChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    //handle filter changes
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
            <UserDataTableToolbar
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


