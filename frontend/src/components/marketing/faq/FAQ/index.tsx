import {
    BadgeDollarSign,
    Route,
    ShieldCheck,
    Truck,
    Undo2,
    UserRoundCheck,
} from "lucide-react";

const faq = [
    {
        icon: ShieldCheck,
        question: "Is the platform secure?",
        answer:
            "Yes, we use advanced encryption and secure authentication methods to ensure your data is safe and protected.",
    },
    {
        icon: Truck,
        question: "How do I book an inspection?",
        answer:
            "You can book an inspection by logging into your account, selecting your vehicle, and choosing an available time slot.",
    },
    {
        icon: BadgeDollarSign,
        question: "What are the payment options?",
        answer:
            "We accept credit/debit cards, PayPal, and wallet balance for seamless and secure transactions.",
    },
    {
        icon: Route,
        question: "Can I track the inspector's location?",
        answer:
            "Yes, you can track the inspector's location in real-time once the inspection is confirmed.",
    },
    {
        icon: Undo2,
        question: "What is the cancellation policy?",
        answer:
            "You can cancel your booking up to 24 hours before the scheduled inspection time for a full refund.",
    },
    {
        icon: UserRoundCheck,
        question: "How do I contact support?",
        answer:
            "You can contact our support team via email at support@inspecto.com or call us at 1-800-INSPECT for assistance.",
    },
];

const FAQ04 = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-60">
            <div className="max-w-screen-lg">
                <h2 className="text-4xl md:text-5xl !leading-[1.15] font-black tracking-tighter text-center">
                    Frequently Asked Questions
                </h2>
                <p className="mt-3 text-lg text-center text-muted-foreground">
                    Quick answers to common questions about our products and services.
                </p>

                <div className="mt-12 grid md:grid-cols-2 rounded-xl gap-4">
                    {faq.map(({ question, answer, icon: Icon }) => (
                        <div key={question} className="border p-6 rounded-xl">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-accent">
                                <Icon />
                            </div>
                            <div className="mt-3 mb-2 flex items-start gap-2 text-2xl font-bold tracking-tighter">
                                <span>{question}</span>
                            </div>
                            <p>{answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ04;
