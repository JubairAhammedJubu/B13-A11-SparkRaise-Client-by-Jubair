'use server'
import { serverMutation } from "@/lib/core/server";
import { revalidatePath } from "next/cache";

export const resolveReport = async (id, action) => {
    const result = await serverMutation(`/api/reports/${id}`, { action }, 'PATCH');
    revalidatePath('/dashboard/admin/reports');
    revalidatePath('/dashboard/admin/campaigns');
    return result;
};
