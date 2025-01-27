// app/InspectorManagement/DemoPage.tsx
"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { Inspectors, columns } from "./columns";
import { AdminService } from "@/services/admin.service";

export default function DemoPage() {
    const [data, setData] = useState<Inspectors[]>([]);

    useEffect(() => {
        async function fetchData() {
            const response = await AdminService.getInspectors();
            setData(response.data)
        }
        fetchData();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    );
}

