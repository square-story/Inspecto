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
} from '@/components/ui/input'
import { useNavigate } from "react-router-dom"
import BackButton from "@/components/BackButton"

const formSchema = z.object({
    "Email": z.string(),
    "Password": z.string()
});

function DraftForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    })

    function onSubmit(fields: z.infer<typeof formSchema>) {
        console.log(fields);
    }

    const navigate = useNavigate()
    const handleNav = (path: string) => {
        navigate(path)
    }

    return (
        <div>
            <BackButton />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border">
                    <h1 className="text-3xl font-bold">Inspector Login</h1>
                    <p className="text-base">Please enter details and password.</p>
                    <FormField
                        control={form.control}
                        name="Email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Email</FormLabel> *
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

                    <FormField
                        control={form.control}
                        name="Password"
                        render={({ field }) => (
                            <FormItem className="w-full">




                                <div className="flex items-end">
                                    <FormLabel>Password</FormLabel> *
                                    <a
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline cursor-pointer"
                                        onClick={() => handleNav('/inspector/forget')}
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Password"
                                        type="password"
                                    />

                                </FormControl>


                                <FormMessage />

                            </FormItem>
                        )
                        }
                    />

                    <div className="flex justify-center items-center w-full pt-3">
                        <Button className="rounded-lg w-full" size="sm">
                            Submit
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <a
                            className="underline underline-offset-4 cursor-pointer"
                            onClick={() => handleNav("/inspector/register")}
                        >
                            Sign up
                        </a>
                    </div>
                </form>
            </Form>
        </div>
    )
}


const InspectorLoginPage = () => {
    return (
        <div className="justify-center items-center flex w-full h-screen">
            <DraftForm />
        </div>
    )
}

export default InspectorLoginPage