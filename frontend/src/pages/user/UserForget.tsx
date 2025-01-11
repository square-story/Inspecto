"use client"
import * as z from "zod"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import {
    Button
} from "@/components/ui/button"
import {
    useForm
} from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"

const formSchema = z.object({
    "email": z.string()
});

export function ForgetPassword() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    })

    function onSubmit(fields: z.infer<typeof formSchema>) {
        console.log(fields);
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border">
                    <h1 className="text-3xl font-bold">Forget password</h1>
                    <p className="text-base">it will create a link for send to your email</p>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Enter Existing email</FormLabel> *
                                <FormControl>
                                    <Input
                                        placeholder="Enter your Email"
                                        type={"email"}
                                        value={field.value}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            field.onChange(val);
                                        }}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )
                        }
                    />
                    <div className="flex justify-end items-center w-full pt-3">
                        <Button className="rounded-lg" size="sm">
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}



const UserForget = () => {
    return (
        <div className="flex justify-center items-center w-full h-screen">
            <ForgetPassword />
        </div>
    )
}

export default UserForget