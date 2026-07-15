'use server'
import { serverMutation } from "@/lib/core/server";
import { revalidatePath } from "next/cache";

export const createCampaign = async (data) => {
    return serverMutation('/api/campaigns', data);
}

// Per doc: creator can only edit campaign_title, campaign_story, reward_info
export const updateCampaign = async (id, data) => {
    const result = await serverMutation(`/api/campaigns/${id}`, data, 'PATCH');
    revalidatePath('/dashboard/creator/my-campaigns');
    return result;
}

export const deleteCampaign = async (id) => {
    const result = await serverMutation(`/api/campaigns/${id}`, {}, 'DELETE');
    revalidatePath('/dashboard/creator/my-campaigns');
    return result;
}

// Admin: approve/reject a submitted campaign
export const setCampaignStatus = async (id, status) => {
    const result = await serverMutation(`/api/campaigns/${id}/status`, { status }, 'PATCH');
    revalidatePath('/dashboard/admin/campaigns');
    return result;
}

// Admin: remove a campaign entirely (Manage Campaigns)
export const adminDeleteCampaign = async (id) => {
    const result = await serverMutation(`/api/admin/campaigns/${id}`, {}, 'DELETE');
    revalidatePath('/dashboard/admin/campaigns');
    return result;
}
