import UserManagmentTable from "@/app/UserManagement"


const UserManagement = () => {
    return (
        <div className="flex flex-col px-5 space-y-4">
            <h1 className="text-xl font-bold">User Managment</h1>
            <UserManagmentTable />
        </div>
    )
}

export default UserManagement