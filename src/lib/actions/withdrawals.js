'use server'
import { serverMutation } from "@/lib/core/server";
import { revalidatePath } from "next/cache";

export const createWithdrawal = async (data) => {
    const result = await serverMutation('/api/withdrawals', data);
    revalidatePath('/dashboard/creator/withdrawals');
    revalidatePath('/dashboard/creator/payment-history');
    return result;
}

// Admin: "Payment Success" button
export const approveWithdrawal = async (id) => {
    const result = await serverMutation(`/api/withdrawals/${id}/approve`, {}, 'PATCH');
    revalidatePath('/dashboard/admin/withdrawals');
    return result;
}
