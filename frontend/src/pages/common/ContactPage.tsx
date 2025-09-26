import Contact03Page from "@/components/marketing/contact/Contact"
import Footer05Page from "@/components/marketing/footer/Footer"
import Navbar04Page from "@/components/marketing/navbar/navbar/page"

const ContactPage = () => {
    return (
        <>
            <div className="dark:bg-[#000000] dark:bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] dark:bg-[size:20px_20px] bg-[#ffffff] bg-[radial-gradient(#00000033_1px,#ffffff_1px)] bg-[size:20px_20px]">
                <Navbar04Page />
                <Contact03Page />
                <Footer05Page />
            </div>
        </>
    )
}

export default ContactPage