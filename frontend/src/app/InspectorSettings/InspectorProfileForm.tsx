import LoadingSpinner from '@/components/LoadingSpinner'
import ProfileDrop from '@/components/ProfileDrop'
import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { setInspector } from '@/features/inspector/inspectorSlice'
import { useInspectorDetails } from '@/hooks/useInspectorDetails'
import { inspectorService } from '@/services/inspector.service'
import { AppDispatch } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { useDispatch } from 'react-redux'
import { Form } from '@/components/ui/form'
import { toast } from 'sonner'
import { z } from 'zod'
import SvgText from '@/components/SvgText'
import { useEffect } from 'react'

const profileFormSchema = z.object({
    firstName: z
        .string()
        .min(2, { message: 'First name must be at least 2 characters.' })
        .max(20, { message: 'First name must not be longer than 20 characters.' }),
    lastName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters." })
        .max(20, { message: 'Last name must not be longer than 20 characters.' }),
    email: z
        .string()
        .email({ message: "Please Enter Valid Email" }),
    phone: z
        .string()
        .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    signature: z.string().url().optional(),
    profile_image: z.string().url().optional()
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function InspectorProfileForm() {
    const { inspector, loading } = useInspectorDetails()
    const dispatch = useDispatch<AppDispatch>()
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            profile_image: '',
            signature: ''
        },
        mode: 'onChange'
    })

    useEffect(() => {
        if (inspector) {
            form.reset({
                firstName: inspector.firstName || '',
                lastName: inspector.lastName || '',
                email: inspector.email || '',
                phone: inspector.phone || '',
                profile_image: inspector.profile_image || '',
                signature: inspector.signature || ''
            })
        }
    }, [inspector, form])

    async function onSubmit(data: ProfileFormValues) {
        try {
            const updatedInspector = await inspectorService.updateInspector(data);
            dispatch(setInspector(updatedInspector.data.inspector))
            toast.success('Profile updated successfully!');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to update profile")
        }
    }

    const handleImageUpload = (url: string | null) => {
        form.setValue("profile_image", url || inspector?.profile_image);
    };

    const handleSignature = (url: string | null) => {
        form.setValue("signature", url || inspector?.signature)
    }

    if (loading) return (<LoadingSpinner />)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <div className='relative'>
                    <ProfileDrop headerTitle='Profile Picture' onImageUpload={handleImageUpload} defaultImage={inspector?.profile_image} />
                    <div className="absolute -bottom-10 left-44 ">
                        <SvgText />
                    </div>
                </div>
                <FormField
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter Your first Name' {...field} />
                            </FormControl>
                            <FormDescription>
                                something
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
                                <Input placeholder='Enter Your lastName' {...field} />
                            </FormControl>
                            <FormDescription>
                                something
                            </FormDescription>
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
                                <Input placeholder='Enter Your Updated Email Address' {...field} />
                            </FormControl>
                            <FormDescription>
                                Email Want to verify
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                        <FormItem className='grid gap-2'>
                            <FormLabel htmlFor='phone'>Phone Number</FormLabel>
                            <FormControl>
                                <PhoneInput {...field} defaultCountry='IN' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='relative'>
                    <ProfileDrop headerTitle='Signature' onImageUpload={handleSignature} defaultImage={inspector?.signature} />
                    <div className="absolute -bottom-10 left-44 ">
                        <SvgText text='To Upload Signature' />
                    </div>
                </div>
                <Button type='submit'>Update profile</Button>
            </form>
        </Form>
    )
}