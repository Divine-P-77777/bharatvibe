
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/Button';

interface ProfileCardProps {
  user: any;
  isOwnProfile: boolean;
  onEditClick?: () => void;
}

const ProfileCard = ({ user, isOwnProfile, onEditClick }: ProfileCardProps) => {
  const getAvatarFallback = () => {
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-full">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gradient-sunset rounded-full flex items-center justify-center mb-4">
          {user ? (
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="text-white text-3xl font-bold">
                {getAvatarFallback()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <span className="text-white text-3xl font-bold">U</span>
          )}
        </div>
        
        <h3 className="text-xl font-bold mb-1">
          {user ? (user.user_metadata?.full_name || user.email) : 'User Profile'}
        </h3>
        
        {user ? (
          <p className="text-gray-500 text-sm mb-4">{user.email}</p>
        ) : (
          <p className="text-gray-500 text-sm mb-4">Join to unlock your profile</p>
        )}
        
        {isOwnProfile && user ? (
          <Button 
            onClick={onEditClick}
            className="w-full bg-gradient-sunset hover:opacity-90 transition-opacity"
          >
            Edit Profile
          </Button>
        ) : !user ? (
          <Link to="/auth">
            <Button 
              className="w-full bg-gradient-sunset hover:opacity-90 transition-opacity"
            >
              Sign Up Now
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default ProfileCard;