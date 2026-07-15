'use server'
import { serverMutation } from "@/lib/core/server";
import { revalidatePath } from "next/cache";

export const createContribution = async (data) => {
    const result = await serverMutation('/api/contributions', data);
    revalidatePath('/dashboard/supporter');
    return result;
}

// Creator approves/rejects a pending contribution
export const updateContributionStatus = async (id, status) => {
    const result = await serverMutation(`/api/contributions/${id}`, { status }, 'PATCH');
    revalidatePath('/dashboard/creator');
    revalidatePath('/dashboard/supporter/my-contributions');
    return result;
};
