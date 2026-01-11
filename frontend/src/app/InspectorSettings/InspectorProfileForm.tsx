import LoadingSpinner from '@/components/LoadingSpinner'
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
import { useEffect, useRef, useState } from 'react'
import { SimpleSignature, SimpleSignatureRef } from '@/components/ui/react-signature'
import CropImage from '@/components/ui/cropper-image'

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
    signature: z.string().min(1, "Signature is required"),
    profile_image: z.string().optional()
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function InspectorProfileForm() {
    const { inspector, loading } = useInspectorDetails()
    const [isSignatureValid, setIsSignatureValid] = useState(false);
    const dispatch = useDispatch<AppDispatch>()
    const signatureRef = useRef<SimpleSignatureRef>(null);
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

            // Set signature validity based on existing signature
            const hasExistingSignature = !!(inspector.signature && inspector.signature.trim());
            setIsSignatureValid(hasExistingSignature);
        }
    }, [inspector, form])

    async function onSubmit(data: ProfileFormValues) {
        try {
            const currentSignature = data.signature || signatureRef.current?.getSignature();
            const isEmpty = signatureRef.current?.isEmpty() ?? true;

            if (!isSignatureValid || (!currentSignature && isEmpty)) {
                toast.error("Please provide your signature");
                return;
            }

            // Use current signature from component if it's been updated, otherwise use form data
            const signatureToSubmit = signatureRef.current?.getSignature() || data.signature;

            const submitData = {
                ...data,
                signature: signatureToSubmit
            };

            const updatedInspector = await inspectorService.updateInspector(submitData);
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

    const handleSignatureChange = (signature: string | null) => {
        const isEmpty = signatureRef.current?.isEmpty() ?? true;
        setIsSignatureValid(!!signature && !isEmpty);

        const hasNewSignature = !!signature && !isEmpty;
        const hasExistingSignature = !signature && isEmpty && !!(inspector?.signature?.trim());
        setIsSignatureValid(hasNewSignature || hasExistingSignature);

        // Update form value - use new signature or keep existing one
        const signatureValue = signature || (hasExistingSignature ? inspector?.signature || '' : '');
        form.setValue('signature', signatureValue, { shouldValidate: true });
    };

    if (loading) return (<LoadingSpinner />)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <CropImage onImageUpload={handleImageUpload} defaultImage={inspector?.profile_image} />
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
                                <Input disabled placeholder='Enter Your Updated Email Address' {...field} />
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
                <FormField
                    control={form.control}
                    name="signature"
                    render={({ fieldState: { error } }) => (
                        <FormItem>
                            <FormLabel>Digital Signature *</FormLabel>
                            <FormControl>
                                <div className="space-y-2">
                                    <SimpleSignature
                                        value={inspector?.signature} // Pass existing signature
                                        ref={signatureRef}
                                        onSignatureChange={handleSignatureChange}
                                        placeholder="Please sign here"
                                        width={400}
                                        height={150}
                                    />
                                </div>
                            </FormControl>
                            <FormDescription>
                                {inspector?.signature
                                    ? "Your existing signature is displayed. You can draw over it to update or keep the current one."
                                    : "Draw your signature in the box above"
                                }
                            </FormDescription>
                            <FormMessage>{error && error.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <Button type='submit'>Update profile</Button>
            </form>
        </Form>
    )
}