import { z } from 'zod'

export const liferayAuthSchema = z.object({
    LIFERAY_CLIENT_ID: z.string().optional(),
    LIFERAY_CLIENT_SECRET: z.string().optional(),
    LIFERAY_HOST: z.string(),
    LIFERAY_PASSWORD: z.string().optional(),
    LIFERAY_USERNAME: z.string().optional(),
});