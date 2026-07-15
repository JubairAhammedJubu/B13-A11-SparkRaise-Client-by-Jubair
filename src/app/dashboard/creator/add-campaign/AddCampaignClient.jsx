'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone, Target, Coins, Calendar,
  Gift, Upload, Loader2, CheckCircle,
  X, Link as LinkIcon, Tag, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createCampaign } from '@/lib/actions/campaigns';

// Assumption: the doc didn't enumerate a fixed category list, so this is a reasonable
// generic set for a crowdfunding platform — adjust if you had specific categories in mind.
const CATEGORIES = [
  'Technology', 'Art & Design', 'Music', 'Film & Video',
  'Games', 'Food & Craft', 'Fashion', 'Publishing',
  'Community', 'Charity',
];

const getMinDeadline = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
};

export default function AddCampaignClient({ user }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageTab, setImageTab] = useState('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [pendingImage, setPendingImage] = useState(null);

  const [form, setForm] = useState({
    campaign_title: '',
    campaign_story: '',
    category: '',
    funding_goal: '',
    minimum_Contribution: '',
    deadline: '',
    reward_info: '',
    campaign_image_url: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategory = (value) => {
    setForm((prev) => ({ ...prev, category: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Only image files allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setIsUploadLoading(true);
    try {
      toast.loading('Uploading image...', { id: 'img' });
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      const url = data.data.url;
      setPendingImage(url);
      setImagePreview(url);
      toast.success('Image ready! Click Save to apply.', { id: 'img' });
    } catch {
      toast.error('Image upload failed', { id: 'img' });
    } finally {
      setIsUploadLoading(false);
    }
  };

  const handleLinkPreview = () => {
    if (!imageUrl.trim()) { toast.error('Please enter an image URL'); return; }
    setPendingImage(imageUrl.trim());
    setImagePreview(imageUrl.trim());
    toast.success('Image preview ready!');
  };

  const handleSaveImage = () => {
    if (!pendingImage) { toast.error('Please upload or preview an image first'); return; }
    setForm((prev) => ({ ...prev, campaign_image_url: pendingImage }));
    toast.success('Image saved!');
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setPendingImage(null);
    setImageUrl('');
    setForm((prev) => ({ ...prev, campaign_image_url: '' }));
  };

  const handleSubmit = async () => {
    if (!form.campaign_title.trim()) return toast.error('Campaign title is required');
    if (!form.campaign_story.trim()) return toast.error('Campaign story is required');
    if (!form.category) return toast.error('Please select a category');
    if (!form.funding_goal || isNaN(form.funding_goal) || form.funding_goal <= 0) return toast.error('Valid funding goal is required');
    if (!form.minimum_Contribution || isNaN(form.minimum_Contribution) || form.minimum_Contribution <= 0) return toast.error('Valid minimum contribution is required');
    if (Number(form.minimum_Contribution) > Number(form.funding_goal)) return toast.error('Minimum contribution cannot exceed the funding goal');
    if (!form.deadline) return toast.error('Deadline is required');
    if (!form.campaign_image_url) return toast.error('Please save a campaign image first');

    setIsLoading(true);
    try {
      const campaignData = {
        ...form,
        funding_goal: parseFloat(form.funding_goal),
        minimum_Contribution: parseFloat(form.minimum_Contribution),
      };

      const result = await createCampaign(campaignData);

      if (result?.insertedId) {
        toast.success('Campaign submitted for approval!');
        router.push('/dashboard/creator/my-campaigns');
      } else {
        toast.error(result?.message || 'Failed to add campaign');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const minDeadline = getMinDeadline();

  return (
    <div className="p-6 pt-8 max-w-3xl mx-auto space-y-6 mt-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add New Campaign</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Fill in the details below. Your campaign will be reviewed by admin before going live.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-6"
      >
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Campaign Title</label>
          <div className="relative">
            <Megaphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="campaign_title"
              value={form.campaign_title}
              onChange={handleChange}
              placeholder="e.g. Solar-Powered Water Purifier for Rural Villages"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Campaign Story</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              name="campaign_story"
              value={form.campaign_story}
              onChange={handleChange}
              rows={5}
              placeholder="Tell supporters what you're building and why it matters..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all resize-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${form.category === cat
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-emerald-300'
                  }`}
              >
                <Tag className="w-3 h-3" />
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Funding Goal (credits)</label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="funding_goal"
                value={form.funding_goal}
                onChange={handleChange}
                placeholder="e.g. 5000"
                min="1"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Minimum Contribution (credits)</label>
            <div className="relative">
              <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="minimum_Contribution"
                value={form.minimum_Contribution}
                onChange={handleChange}
                placeholder="e.g. 10"
                min="1"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Deadline</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              min={minDeadline}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Must be at least 7 days from today</p>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Reward Info (optional)</label>
          <div className="relative">
            <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="reward_info"
              value={form.reward_info}
              onChange={handleChange}
              placeholder="e.g. Early backers get a signed thank-you card"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Campaign Image</label>

          {imagePreview && (
            <div className="mb-3 flex flex-col items-center gap-2">
              <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {!form.campaign_image_url && (
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xs text-amber-500 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg border border-amber-100 dark:border-amber-800 flex-1 text-center">
                    Preview only — click Save Image to apply
                  </span>
                  <button
                    onClick={handleSaveImage}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold"
                  >
                    Save Image
                  </button>
                </div>
              )}
              {form.campaign_image_url && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800 w-full text-center">
                  ✓ Image saved
                </span>
              )}
            </div>
          )}

          {!imagePreview && (
            <>
              <div className="flex gap-2 mb-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <button
                  onClick={() => setImageTab('upload')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${imageTab === 'upload'
                    ? 'bg-white dark:bg-[#1a1d24] text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </button>
                <button
                  onClick={() => setImageTab('link')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${imageTab === 'link'
                    ? 'bg-white dark:bg-[#1a1d24] text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  Image Link
                </button>
              </div>

              {imageTab === 'upload' ? (
                <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-xl p-8 cursor-pointer transition-all group">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  {isUploadLoading
                    ? <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    : <Upload className="w-8 h-8 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  }
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 transition-colors">
                      {isUploadLoading ? 'Uploading...' : 'Click to upload image'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </label>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleLinkPreview}
                    className="w-full py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    Preview Image
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Creator Name</label>
            <input
              type="text"
              value={user?.name || ''}
              readOnly
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Creator Email</label>
            <input
              type="text"
              value={user?.email || ''}
              readOnly
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || isUploadLoading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</>
          ) : (
            <><Megaphone className="w-4 h-4" />Add Campaign</>
          )}
        </button>
      </motion.div>
    </div>
  );
}
