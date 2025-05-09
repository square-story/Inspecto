import Features02Page from "@/app/AboutUs"
import Footer05Page from "@/app/Footer"
import Hero01 from "@/app/hero"
import Navbar04Page from "@/app/navbar/page"

const HomePage = () => {

    return (<>
        <div className="dark:bg-[#000000] dark:bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] dark:bg-[size:20px_20px] bg-[#ffffff] bg-[radial-gradient(#00000033_1px,#ffffff_1px)] bg-[size:20px_20px] overflow-x-hidden">
            <Navbar04Page />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Hero01 />
            <Features02Page />
            </main>
            <Footer05Page />
        </div>
    </>
    )
}

export default HomePage