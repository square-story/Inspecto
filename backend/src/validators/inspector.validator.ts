import { z } from 'zod';

/**
 * Inspector Validation Schemas
 */

export const completeProfileSchema = z.object({
    body: z.object({
        longitude: z.string().min(1, 'Longitude is required'),
        latitude: z.string().min(1, 'Latitude is required'),
        // Add other profile fields as needed
    }).passthrough() // Allow additional fields
});

export const updateInspectorSchema = z.object({
    body: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        // Add other updatable fields
    }).passthrough() // Allow additional fields
        .refine((data) => Object.keys(data).length > 0, {
            message: 'At least one field must be provided for update'
        })
});

export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(6, 'New password must be at least 6 characters')
    })
});

export const inspectorIdParamSchema = z.object({
    params: z.object({
        inspectorId: z.string().min(1, 'Inspector ID is required')
    })
});

export const denyInspectorSchema = z.object({
    params: z.object({
        inspectorId: z.string().min(1, 'Inspector ID is required')
    }),
    body: z.object({
        reason: z.string().min(1, 'Denial reason is required')
    })
});

export const getNearbyInspectorsSchema = z.object({
    query: z.object({
        latitude: z.string().min(1, 'Latitude is required'),
        longitude: z.string().min(1, 'Longitude is required')
    })
});
