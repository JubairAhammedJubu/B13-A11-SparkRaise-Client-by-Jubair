'use server'
import { serverMutation } from "@/lib/core/server";
import { revalidatePath } from "next/cache";

export const updateUserRole = async (userId, role) => {
    const result = await serverMutation(`/api/users/${userId}/role`, { role }, 'PATCH');
    revalidatePath('/dashboard/admin/users');
    return result;
};

export const deleteUser = async (userId) => {
    const result = await serverMutation(`/api/users/${userId}`, {}, 'DELETE');
    revalidatePath('/dashboard/admin/users');
    return result;
};
