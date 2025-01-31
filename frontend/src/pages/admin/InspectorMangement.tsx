import DemoPage from "@/app/InspectorManagment/page";

type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

// eslint-disable-next-line react-refresh/only-export-components
export const payments: Payment[] = [
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
    },
    {
        id: "489e1d42",
        amount: 125,
        status: "processing",
        email: "example@gmail.com",
    },
    // ...
]


const InspectorMangement = () => {
    return (
        <>
            <div className="flex flex-col px-5 ">
                <h1 className="text-xl font-bold">Inspector Managment</h1>
                <DemoPage />
            </div>
        </>
    )
}

export default InspectorMangement