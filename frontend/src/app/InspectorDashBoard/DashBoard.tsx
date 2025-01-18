import { ModeToggle } from "@/components/ui/DarkModeSwitch"
import { MainNav } from "./DashBoardComponents/MainNav"
import { Search } from "./DashBoardComponents/Search"
import { UserNav } from "./DashBoardComponents/UserNav"

const DashBoard = () => {
    return (
        <>
            <div className="md:hidden">
                {/*
                Working of Mobile view
                */}
                <h1 className="text-5xl">Working on it!</h1>
            </div>
            <div className="hidden flex-col md:flex">
                <div className="border-b">
                    <div className="flex h-16 items-center justify-between px-3 space-x-4">
                        <MainNav className="mx-6" />
                        <div className="ml-auto flex items-center space-x-4">
                            <Search />
                        </div>
                        <div className="ml-auto flex items-center space-x-4">
                            <ModeToggle />
                            <UserNav />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashBoard