import { useState, useEffect, useCallback } from 'react';
import type { Message } from '../types/message';
import type { Member } from '../types/room';
import { getRoomMembers, getMessages } from '../services/roomService';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';

export const useChat = (roomId: string | undefined, isMember: boolean | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const { user } = useAuth();
  const { 
    joinRoom: socketJoinRoom, 
    leaveRoom: socketLeaveRoom,
    sendMessage: socketSendMessage, 
    onMessage 
  } = useSocket();

  const fetchMembers = useCallback(async (id: string) => {
    try {
      const data = await getRoomMembers(id);
      setMembers(data);
    } catch (err) {
      console.error('Failed to load members:', err);
    }
  }, []);

  const fetchMessages = useCallback(async (id: string) => {
    setIsLoadingMessages(true);
    try {
      const data = await getMessages(id);
      // getMessages now returns the array directly
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (roomId && isMember) {
      fetchMembers(roomId);
      fetchMessages(roomId);
      socketJoinRoom(roomId);
      
      return () => {
        socketLeaveRoom(roomId);
      };
    } else {
      setMembers([]);
      setMessages([]);
    }
  }, [roomId, isMember, fetchMembers, fetchMessages, socketJoinRoom, socketLeaveRoom]);

  useEffect(() => {
    const unsubscribe = onMessage((newMessage) => {
      if (newMessage.room_id === roomId) {
        setMessages(prev => {
          // Check for existing message by ID (handles both normal sync and deduplicating optimistic updates)
          const exists = prev.some(m => m.id === newMessage.id);
          if (exists) return prev;
          
          // Remove any temporary optimistic messages that match the content and user
          // This ensures that when the server broadcast arrives, it "replaces" the temporary one
          const filtered = prev.filter(m => 
            !(m.id.startsWith('temp-') && m.content === newMessage.content && m.username === newMessage.username)
          );

          return [...filtered, {
            ...newMessage,
            id: newMessage.id || Date.now().toString(),
            created_at: newMessage.created_at || new Date().toISOString()
          }];
        });
      }
    });
    return unsubscribe;
  }, [onMessage, roomId]);

  const sendMessage = useCallback((content: string) => {
    if (roomId && isMember) {
      socketSendMessage({ room_id: roomId, content });
      
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const newMessage: Message = {
        id: tempId,
        room_id: roomId,
        username: user?.email.split('@')[0] || 'Me',
        content,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMessage]);
    }
  }, [roomId, isMember, socketSendMessage, user]);

  return {
    messages,
    members,
    isLoadingMessages,
    sendMessage,
    fetchMembers,
    fetchMessages
  };
};
