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
    FormDescription
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"

const formSchema = z.object({
    "Email": z.string(),
    "Password": z.string(),
    "password": z.string(),
    "firstname": z.string(),
    "lastname": z.string(),
    "phone": z.number()
});

export function DraftForm() {

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
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Mobile Number</FormLabel> *
                                <FormControl>
                                    <Input
                                        placeholder="9048834867"
                                        type={"number"}
                                        value={field.value}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            field.onChange(+val);
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>For Notification Purpose</FormDescription>
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