/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import InputDemo from './InputDemo'
import { useUserDetails } from '@/hooks/useUserDetails'
import { useDispatch } from 'react-redux'
import { userService } from '@/services/user.service'
import { updateUser } from '@/features/user/userSlice'
import React from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'



const profileFormSchema = z.object({
    firstName: z
        .string()
        .min(2, { message: 'First name must be at least 2 characters.' })
        .max(30, { message: 'First name must not be longer than 30 characters.' }),
    lastName: z
        .string()
        .min(2, { message: 'Last name must be at least 2 characters.' })
        .max(30, { message: 'Last name must not be longer than 30 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    address: z.string().optional(),
    profile_image: z.string().url().optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>


export default function ProfileForm() {
    const { user, loading } = useUserDetails();
    const dispatch = useDispatch()
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            address: user?.address || '',
            profile_image: user?.profile_image || ''
        },
        mode: "onChange"
    })

    // const { fields, append } = useFieldArray({
    //     name: 'urls',
    //     control: form.control,
    // })
    React.useEffect(() => {
        if (user) {
            form.reset({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                address: user.address || "",
                profile_image: user.profile_image || "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleImageUpload = (url: string | null) => {
        form.setValue("profile_image", url || user?.profile_image);
    };

    async function onSubmit(data: ProfileFormValues) {
        try {
            console.log('the Data is:', data)
            const updatedUser = await userService.updateUser(data);

            console.log('updates:', updateUser)
            // Dispatch updated user data to Redux
            dispatch(updateUser(updatedUser.data));
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile.');
        }
    }

    if (loading) return (<LoadingSpinner />)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <InputDemo onImageUpload={handleImageUpload} defaultImage={user?.profile_image} />
                <FormField
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your first name" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name. It can be your real name or a
                                pseudonym. You can only change this once every 30 days.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='lastName'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Your last Name'  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='address'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Your Address'  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit'>Update profile</Button>
            </form>
        </Form>
    )
}
