import { MailIcon, MapPinIcon, MessageCircle, PhoneIcon } from "lucide-react";


const Contact03Page = () => (
    <div className="min-h-screen flex items-center justify-center pt-60 md:pt-60 pb-16">
        <div className="w-full max-w-screen-xl mx-auto px-6 xl:px-0">
            <b className="text-primary">Contact Us</b>
            <h2 className="mt-3 text-2xl md:text-4xl font-black tracking-tight">
                We&apos;d love to hear from you
            </h2>
            <p className="mt-4 text-base sm:text-lg">
                Our friendly team is always here to chat.
            </p>
            <div className="mt-14 md:mt-24 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <div className="bg-secondary/10 p-6 pb-10 rounded-lg">
                    <div className="h-12 w-12 flex items-center justify-center bg-secondary text-secondary-foreground rounded-full">
                        <MailIcon />
                    </div>
                    <h3 className="mt-8 font-bold text-xl">Email</h3>
                    <p className="mt-2.5 mb-4 text-muted-primary">
                        Our friendly team is here to help.
                    </p>
                    <a
                        className="font-bold text-primary tracking-tight"
                        href="mailto:akashmoradiya3444@gmail.com"
                    >
                        akashmoradiya3444@gmail.com
                    </a>
                </div>
                <div className="bg-secondary/10 p-6 pb-10 rounded-lg">
                    <div className="h-12 w-12 flex items-center justify-center bg-secondary text-secondary-foreground rounded-full">
                        <MessageCircle />
                    </div>
                    <h3 className="mt-8 font-bold text-xl">Live chat</h3>
                    <p className="mt-2.5 mb-4 text-muted-primary">
                        Our friendly team is here to help.
                    </p>
                    <a className="font-bold text-primary tracking-tight" href="#">
                        Start new chat
                    </a>
                </div>
                <div className="bg-secondary/10 p-6 pb-10 rounded-lg">
                    <div className="h-12 w-12 flex items-center justify-center bg-secondary text-secondary-foreground rounded-full">
                        <MapPinIcon />
                    </div>
                    <h3 className="mt-8 font-bold text-xl">Office</h3>
                    <p className="mt-2.5 mb-4 text-muted-primary">
                        Come say hello at our office HQ.
                    </p>
                    <a
                        className="font-bold text-primary tracking-tight"
                        href="https://map.google.com"
                        target="_blank"
                    >
                        100 Smith Street Collingwood <br /> VIC 3066 AU
                    </a>
                </div>
                <div className="bg-secondary/10 p-6 pb-10 rounded-lg">
                    <div className="h-12 w-12 flex items-center justify-center bg-secondary text-secondary-foreground rounded-full">
                        <PhoneIcon />
                    </div>
                    <h3 className="mt-8 font-bold text-xl">Phone</h3>
                    <p className="mt-2.5 mb-4 text-muted-primary">
                        Mon-Fri from 8am to 5pm.
                    </p>
                    <a
                        className="font-bold text-primary tracking-tight"
                        href="tel:akashmoradiya3444@gmail.com"
                    >
                        +1 (555) 000-0000
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default Contact03Page;
