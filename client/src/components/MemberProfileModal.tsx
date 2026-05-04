import React, { useState } from 'react';
import Modal from './Modal';
import AsyncButton from './AsyncButton';
import { useToast } from '../hooks/useToast';

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
  } | null;
}

export default function MemberProfileModal({ isOpen, onClose, user }: MemberProfileModalProps) {
  const { addToast } = useToast();
  // Mock friend state since there's no backend for friends yet
  const [isFriend, setIsFriend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleToggleFriend = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (isFriend) {
      setIsFriend(false);
      addToast(`Removed ${user.username} from your friends`, 'info');
    } else {
      setIsFriend(true);
      addToast(`Added ${user.username} as a friend!`, 'success');
    }
    
    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile"
      maxWidth="max-w-sm"
    >
      <div className="flex flex-col items-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-blue-500/20 overflow-hidden shrink-0">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            <span>{user.username.substring(0, 1).toUpperCase()}</span>
          )}
        </div>
        
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{user.username}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">ID: {user.id.substring(0, 8)}...</p>
        </div>

        <AsyncButton
          onClick={handleToggleFriend}
          isLoading={isLoading}
          className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all duration-300 ${
            isFriend 
              ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-none' 
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/30'
          }`}
        >
          {isFriend ? 'Unfriend' : 'Add Friend'}
        </AsyncButton>
      </div>
    </Modal>
  );
}
