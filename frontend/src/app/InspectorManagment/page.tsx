// app/InspectorManagement/DemoPage.tsx
"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { Inspectors, columns } from "./columns";

export default function DemoPage() {
    const [data, setData] = useState<Inspectors[]>([]);

    useEffect(() => {
        async function fetchData() {
            const response = await getData();
            setData(response);
        }
        fetchData();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    );
}

async function getData(): Promise<Inspectors[]> {
    return [
        {
            id: "728ed52f",
            firstName: "sadik",
            email: "sadik@gmail.com",
            status: "pending",
            profile_image: `https://avatar.iran.liara.run/public`
        },
        {
            id: "489e1d42",
            firstName: "somethings",
            status: "blocked",
            email: "example@gmail.com",
            profile_image: "https://avatar.iran.liara.run/public"
        },
        {
            id: "2385340",
            firstName: "sfdoome",
            status: "unblock",
            email: "some@gmail.com",
            profile_image: "https://avatar.iran.liara.run/public"
        },

    ];
}