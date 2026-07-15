'use server'
import { serverMutation } from "@/lib/core/server";
import { revalidatePath } from "next/cache";

export const recordCreditPurchase = async (data) => {
    const result = await serverMutation('/api/payments', data);
    revalidatePath('/dashboard/supporter');
    revalidatePath('/dashboard/supporter/payment-history');
    return result;
}
