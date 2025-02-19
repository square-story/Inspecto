"use client"

import { FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { useEffect, useState } from "react"
import { inspectorService } from "@/services/inspector.service"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Clock, User } from "lucide-react"
import { Inspectors } from "@/app/InspectorManagment/columns";

const Step2 = () => {
    const { control, watch } = useFormContext()
    const latitude = watch("latitude")
    const longitude = watch("longitude")

    const [inspectors, setInspectors] = useState<Inspectors[]>([])

    useEffect(() => {
        async function fetchInspectors() {
            if (latitude && longitude) {
                const response = await inspectorService.getInspectorsBasedOnLocation(latitude, longitude)
                setInspectors(response.data)
            }
        }
        fetchInspectors()
    }, [latitude, longitude])

    const availableInspectors = inspectors.filter((inspector) => inspector.status === "APPROVED")

    return (
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
                            {availableInspectors.length > 0 ? (
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-4">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[50px]"></TableHead>
                                                <TableHead>Inspector</TableHead>
                                                <TableHead>Specialization</TableHead>
                                                <TableHead>Experience</TableHead>
                                                <TableHead>Availability</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {availableInspectors.map((inspector) => (
                                                <TableRow key={inspector._id} className="cursor-pointer hover:bg-muted/50">
                                                    <TableCell>
                                                        <RadioGroupItem value={inspector._id} id={inspector._id} className="mt-1" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar>
                                                                <AvatarImage src={inspector.profile_image} />
                                                                <AvatarFallback>
                                                                    <User className="h-4 w-4" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-medium">
                                                                    {inspector.firstName} {inspector.lastName}
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">{inspector.email}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {inspector.specialization?.map((spec) => (
                                                                <Badge key={spec} variant="secondary">
                                                                    {spec}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{inspector.yearOfExp} years</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                                            <span>
                                                                {inspector.start_time} - {inspector.end_time}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </RadioGroup>
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
    )
}

export default Step2

