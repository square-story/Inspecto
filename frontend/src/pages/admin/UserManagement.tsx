import UserManagmentTable from "@/features/admin/users"


const UserManagement = () => {
    return (
        <div className="flex flex-col px-5 ">
            <h1 className="text-xl font-bold">User Managment</h1>
            <UserManagmentTable />
        </div>
    )
}

export default UserManagement