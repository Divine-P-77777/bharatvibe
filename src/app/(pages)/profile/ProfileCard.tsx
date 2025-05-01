// file: components/ProfileCard.tsx
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Share2, Pencil } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { containsAbuseWords } from '@/lib/content-filter';
import Popup from '@/components/ui/Popup';
import { motion } from 'framer-motion';

interface ProfileCardProps {
  user: any;
  isOwnProfile: boolean;
  onEditClick?: () => void;
  onUploadAvatar?: (file: File) => void;
  onShareProfile?: () => void;
}

export default function ProfileCard({
  user,
  isOwnProfile,
  onEditClick,
  onUploadAvatar,
  onShareProfile,
}: ProfileCardProps) {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  // Dynamically Update URL
  useEffect(() => {
    if (!editing && username) {
      const newUrl = `/profile/${username}`;
      if (window.location.pathname !== newUrl) {
        window.history.pushState({}, '', newUrl);
      }
    }
  }, [editing, username]);

  
  useEffect(() => {
    setUsername(user?.username || '');
    setAvatarUrl(user?.avatar_url || '');
  }, [user]);

  const isValidUsername = (name: string): boolean => {
    const regex = /^[a-zA-Z0-9._]{3,}$/;
    return regex.test(name) && !containsAbuseWords(name);
  };

  useEffect(() => {
    if (!editing && username) {
      const newUrl = `/profile/${username}`;
      if (window.location.pathname !== newUrl) {
        window.history.pushState({}, '', newUrl);
      }
    }
  }, [editing, username]);


  
  const updateProfile = async () => {
    if (!isValidUsername(username)) {
      toast({ title: 'Invalid Username', description: 'Username must be at least 3 characters, no spaces, no abuse.' });
      return;
    }

    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user.id);

    if (existing && existing.length > 0) {
      toast({ title: 'Username Taken', description: 'Please choose another unique username' });
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ username, avatar_url: avatarUrl })
      .eq('id', user.id);

    if (!error) {
      toast({ title: 'Profile Updated', description: 'Your profile has been updated successfully' });
      setEditing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if ((!file.type.startsWith('image/') && !file.type.includes('gif')) || file.size > 7 * 1024 * 1024) {
      toast({ title: 'Invalid Image', description: 'Only images/gifs up to 7MB are allowed' });
      return;
    }

    const mediaUrl = await uploadToCloudinary(file, 'image');
    if (!mediaUrl) {
      toast({ title: 'Failed to upload image', description: 'Please try again.' });
      return;
    }
    setAvatarUrl(mediaUrl);
  };

  const handleShare = () => {
    if (!username) {
      toast({ title: 'Missing username', description: 'Set a username first in profile' });
      return;
    }
    const profileUrl = `${window.location.origin}/profile/${username}`;
    if (navigator.share) {
      navigator.share({ title: 'View My Profile', url: profileUrl });
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast({ title: 'Copied to clipboard', description: profileUrl });
    }
  };

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl shadow p-6 ${editing ? 'border border-dashed border-primary' : ''} ${isDarkMode ? 'bg-white/30' : 'bg-white'}`}>
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            {isOwnProfile && editing && (
              <label className="absolute -bottom-2 -right-2 cursor-pointer bg-gray-200 p-1 rounded-full">
                <Pencil className="w-4 h-4" />
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{username || 'User'}</h2>
            {user?.email && <p className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-black'}`}>{user.email}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          {isOwnProfile && !editing && (
            <Button onClick={() => setEditing(true)} className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
              Edit Profile
            </Button>
          )}
          {isOwnProfile && editing && (
            <Button onClick={() => setShowConfirmPopup(true)} className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
              Save
            </Button>
          )}
          <Button onClick={handleShare} variant="outline">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </div>

      {editing && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" maxLength={20} />
        </div>
      )}

      <Popup isOpen={showConfirmPopup} onClose={() => setShowConfirmPopup(false)}>
        <h3 className="text-lg font-bold mb-4">Confirm Profile Update</h3>
        <p className="mb-6">Are you sure you want to update your profile? This will permanently change your public username and avatar.</p>
        <div className="flex justify-end gap-4">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowConfirmPopup(false)}>Cancel</button>
          <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={() => { updateProfile(); setShowConfirmPopup(false); }}>Update</button>
        </div>
      </Popup>
    </motion.div>
  );
}