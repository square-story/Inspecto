"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { inspectorService } from "@/services/inspector.service"
import type { IInspector } from "@/types/inspector"
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table"
import { Search, SortAsc, SortDesc, Star, } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"
import { SignedAvatar } from "@/components/SignedAvatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const Step2 = () => {
    const { control, watch } = useFormContext()
    const latitude = watch("latitude")
    const longitude = watch("longitude")

    const [inspectors, setInspectors] = useState<IInspector[]>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [specializationFilter, setSpecializationFilter] = useState<string>("all")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedInspector, setSelectedInspector] = useState<IInspector | null>(null)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

    // Fetch inspectors only when coordinates change
    useEffect(() => {
        async function fetchInspectors() {
            if (latitude && longitude) {
                setIsLoading(true)
                try {
                    const response = await inspectorService.getInspectorsBasedOnLocation(latitude, longitude)
                    setInspectors(response.data)
                } catch (error) {
                    console.error("Failed to fetch inspectors:", error)
                } finally {
                    setIsLoading(false)
                }
            }
        }
        fetchInspectors()
    }, [latitude, longitude])

    // Memoize available inspectors to prevent recalculation on every render
    const availableInspectors = useMemo(() => {
        return inspectors.filter((inspector) => inspector.status === "APPROVED")
    }, [inspectors])

    // Memoize specializations to prevent recalculation on every render
    const allSpecializations = useMemo(() => {
        return Array.from(new Set(availableInspectors.flatMap((inspector) => inspector.specialization || [])))
    }, [availableInspectors])

    // Function to open the profile modal
    const openProfileModal = (inspector: IInspector) => {
        setSelectedInspector(inspector)
        setIsProfileModalOpen(true)
    }

    // Memoize columns definition to prevent recreation on every render
    const columns = useMemo<ColumnDef<IInspector>[]>(
        () => [
            {
                id: "select",
                cell: ({ row }) => <RadioGroupItem value={row.original._id} id={row.original._id} className="mt-1" />,
            },
            {
                accessorKey: "inspector",
                header: "Inspector",
                cell: ({ row }) => {
                    const inspector = row.original
                    return (
                        <div className="flex items-center gap-3">
                            <SignedAvatar
                                publicId={inspector.profile_image}
                                fallback={`${inspector.firstName} ${inspector.lastName}`}
                            />
                            <div>
                                <div className="font-medium">
                                    {inspector.firstName} {inspector.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">{inspector.email}</div>
                                <div className="flex items-center mt-1">
                                    <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                                    <span className="text-sm font-medium">5</span>
                                    <span className="text-xs text-muted-foreground ml-1">({58} reviews)</span>
                                </div>
                            </div>
                        </div>
                    )
                },
            },
            {
                accessorKey: "specialization",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="p-0 hover:bg-transparent"
                        >
                            Specialization
                            {column.getIsSorted() === "asc" ? (
                                <SortAsc className="ml-2 h-4 w-4" />
                            ) : column.getIsSorted() === "desc" ? (
                                <SortDesc className="ml-2 h-4 w-4" />
                            ) : null}
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const specializations = row.original.specialization || []
                    return (
                        <div className="flex flex-wrap gap-1">
                            {specializations.map((spec) => (
                                <Badge key={spec} variant="secondary">
                                    {spec}
                                </Badge>
                            ))}
                        </div>
                    )
                },
                sortingFn: (rowA, rowB) => {
                    const specA = rowA.original.specialization?.join(", ") || ""
                    const specB = rowB.original.specialization?.join(", ") || ""
                    return specA.localeCompare(specB)
                },
            },
            {
                accessorKey: "yearOfExp",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="p-0 hover:bg-transparent"
                        >
                            Experience
                            {column.getIsSorted() === "asc" ? (
                                <SortAsc className="ml-2 h-4 w-4" />
                            ) : column.getIsSorted() === "desc" ? (
                                <SortDesc className="ml-2 h-4 w-4" />
                            ) : null}
                        </Button>
                    )
                },
                cell: ({ row }) => `${row.original.yearOfExp} years`,
            },
            {
                id: "actions",
                cell: ({ row }) => (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            openProfileModal(row.original)
                        }}
                    >
                        View Profile
                    </Button>
                ),
            },
        ],
        [],
    )

    // Memoize filtered inspectors to prevent recalculation on every render
    const filteredInspectors = useMemo(() => {
        return availableInspectors.filter((inspector) => {
            const matchesSearch =
                searchQuery === "" ||
                `${inspector.firstName} ${inspector.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inspector.specialization?.some((spec) => spec.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesSpecialization =
                specializationFilter === "all" || inspector.specialization?.includes(specializationFilter)

            return matchesSearch && matchesSpecialization
        })
    }, [availableInspectors, searchQuery, specializationFilter])

    // Memoize event handlers to prevent recreation on every render
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }, [])

    const handleSpecializationChange = useCallback((value: string) => {
        setSpecializationFilter(value)
    }, [])

    // Create and memoize the table instance
    const table = useReactTable({
        data: filteredInspectors,
        columns,
        state: {
            sorting,
            columnFilters,
        },
        enableSorting: true,
        manualFiltering: true, // We're handling filtering manually
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Choose Inspector</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormField
                        control={control}
                        name="inspectorId"
                        render={({ field }) => (
                            <FormItem>
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                ) : availableInspectors.length > 0 ? (
                                    <>
                                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search inspectors..."
                                                    value={searchQuery}
                                                    onChange={handleSearchChange}
                                                    className="pl-8"
                                                />
                                            </div>
                                            <div className="w-full sm:w-64">
                                                <Select value={specializationFilter} onValueChange={handleSpecializationChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Filter by specialization" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Specializations</SelectItem>
                                                        {allSpecializations.map((spec) => (
                                                            <SelectItem key={spec} value={spec}>
                                                                {spec}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="space-y-4"
                                            key={`inspector-radio-group-${filteredInspectors.length}`}
                                        >
                                            <div className="rounded-md border">
                                                <table className="w-full">
                                                    <thead>
                                                        {table.getHeaderGroups().map((headerGroup) => (
                                                            <tr key={headerGroup.id} className="border-b">
                                                                {headerGroup.headers.map((header) => (
                                                                    <th
                                                                        key={header.id}
                                                                        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                                                                    >
                                                                        {header.isPlaceholder
                                                                            ? null
                                                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </thead>
                                                    <tbody>
                                                        {table.getRowModel().rows.length > 0 ? (
                                                            table.getRowModel().rows.map((row) => (
                                                                <tr
                                                                    key={row.id}
                                                                    className="border-b cursor-pointer hover:bg-muted/50"
                                                                    onClick={() => field.onChange(row.original._id)}
                                                                >
                                                                    {row.getVisibleCells().map((cell) => (
                                                                        <td key={cell.id} className="p-4 align-middle">
                                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={columns.length} className="h-24 text-center">
                                                                    No inspectors found matching your criteria.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </RadioGroup>

                                        {table.getPageCount() > 1 && (
                                            <div className="flex items-center justify-end space-x-2 py-4">
                                                <div className="text-sm text-muted-foreground">
                                                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                                </div>
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
                                        )}
                                    </>
                                ) : (
                                    <FormDescription className="text-center py-8 text-muted-foreground">
                                        No inspectors are available at this moment. Please try again later.
                                    </FormDescription>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Inspector Profile Modal */}
            <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Inspector Profile</span>
                        </DialogTitle>
                    </DialogHeader>
                    
                    {selectedInspector && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                                <div className="flex-shrink-0">
                                    <SignedAvatar
                                        publicId={selectedInspector.profile_image}
                                        fallback={`${selectedInspector.firstName} ${selectedInspector.lastName}`}
                                        className="h-24 w-24"
                                    />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-xl font-bold">
                                        {selectedInspector.firstName} {selectedInspector.lastName}
                                    </h3>
                                    <p className="text-muted-foreground">{selectedInspector.email}</p>
                                    <div className="flex items-center justify-center sm:justify-start mt-2">
                                        <Star className="h-5 w-5 text-yellow-500 mr-1" fill="currentColor" />
                                        <span className="text-sm font-medium">5</span>
                                        <span className="text-xs text-muted-foreground ml-1">({58} reviews)</span>
                                    </div>
                                    <div className="mt-2">
                                        <Badge variant="outline" className="mr-1">
                                            {selectedInspector.yearOfExp} years experience
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium mb-2">Specializations</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedInspector.specialization?.map((spec) => (
                                        <Badge key={spec} variant="secondary">
                                            {spec}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium mb-2">Service Areas</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedInspector.serviceAreas?.map((area) => (
                                        <Badge key={area} variant="outline">
                                            {area}
                                        </Badge>
                                    )) || <span className="text-muted-foreground">No specific service areas listed</span>}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium mb-2">Coverage Radius</h4>
                                <p>{selectedInspector.coverageRadius || "Not specified"} km</p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium mb-2">Certifications</h4>
                                {selectedInspector.certificates?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {selectedInspector.certificates.map((cert, index) => (
                                            <Badge key={index} variant="outline" className="p-2">
                                                Certificate {index + 1}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No certificates uploaded</p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Step2

