import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'
import { CircleCheck, X } from 'lucide-react'

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    onSearchChange: (value: string) => void
    searchValue: string
    isLoading?: boolean
}


export const InspectorTypes = [
    {
        label: 'Verified',
        value: true,
        icon: CircleCheck,
    },
    {
        label: 'Not Verified',
        value: false,
        icon: X,
    }
] as const

export function DataTableToolbar<TData>({
    table,
    onSearchChange,
    searchValue,
    isLoading = false,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0 || searchValue !== ''

    return (
        <div className='flex items-center justify-between'>
            <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
                <Input
                    placeholder='Filter inspectors...'
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    className='h-8 w-[150px] lg:w-[250px]'
                    disabled={isLoading}
                />
                <div className='flex gap-x-2'>
                    {table.getColumn('isListed') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('isListed')}
                            title='Verification Status'
                            options={InspectorTypes.map((t) => ({ ...t }))}
                        />
                    )}
                </div>
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
            <DataTableViewOptions table={table} />
        </div>
    )
}
