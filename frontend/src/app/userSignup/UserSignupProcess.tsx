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
import BackButton from "@/components/BackButton"

const formSchema = z.object({
    "Email": z.string(),
    "Password": z.string(),
    "password": z.string(),
    "firstname": z.string(),
    "lastname": z.string(),
    "phone": z.number()
});

export function SignUp() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    })

    function onSubmit(fields: z.infer<typeof formSchema>) {
        console.log(fields);
    }

    return (
        <div>
            <BackButton />
            <Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border">
                    <h1 className="text-3xl font-bold">User Creation</h1>
                    <p className="text-base">Sign up to create an account</p>
                    <FormField
                        control={form.control}
                        name="Email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Enter Your email</FormLabel> *
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

                    <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">

                        <FormField
                            control={form.control}
                            name="Password"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Password</FormLabel> *
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

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Re-enter Password</FormLabel> *
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter your password"
                                            type="password"
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )
                            }
                        />

                    </div>
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>First Name</FormLabel> *
                                <FormControl>
                                    <Input
                                        placeholder="eg:John"
                                        type={"text"}
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
                        name="lastname"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Last Name</FormLabel> *
                                <FormControl>
                                    <Input
                                        placeholder="eg:Wick"
                                        type={"text"}
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
                    <div className="flex flex-col justify-between items-center w-full pt-3 gap-2">
                        <Button className="rounded-lg w-full" size="sm" type="submit">
                            Submit
                        </Button>
                        <Button variant="outline" className="flex items-center justify-center w-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className="h-5 w-5 mr-2"
                            >
                                <path
                                    fill="#EA4335"
                                    d="M24 9.5c3.15 0 5.7 1.05 7.8 3.15l5.85-5.85C33.9 3.6 29.4 1.5 24 1.5 14.7 1.5 7.2 7.95 4.35 16.2l6.75 5.25C12.9 14.1 17.85 9.5 24 9.5z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M46.5 24c0-1.5-.15-3-.45-4.5H24v9h12.75c-.6 3-2.4 5.4-4.95 7.05l6.75 5.25C42.75 37.5 46.5 31.2 46.5 24z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M11.1 28.2c-1.05-3-1.05-6.3 0-9.3l-6.75-5.25c-3 6-3 13.8 0 19.8l6.75-5.25z"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M24 46.5c5.4 0 10.2-1.8 13.8-4.95l-6.75-5.25c-2.1 1.35-4.8 2.1-7.05 2.1-6.15 0-11.1-4.65-12.75-10.65l-6.75 5.25C7.2 40.05 14.7 46.5 24 46.5z"
                                />
                            </svg>
                            Sign With Google
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}