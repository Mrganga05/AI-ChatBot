// src/contexts/ChatContext.tsx

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
// Assuming conversationAPI and chatAPI from '../services/api' are configured to talk to your backend
import { conversationAPI, chatAPI } from '../services/api'; 

// --- Interface Definitions (Keep as is) ---
interface Message {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
  last_message?: string;
}

// --- ChatContextType ---
interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  
  activeChatId: number | string | null; 

  loadConversations: () => Promise<void>;
  loadConversation: (id: number) => Promise<void>;
  createConversation: (title?: string) => Promise<number | undefined>; // Updated return type for consistency
  sendMessage: (message: string, conversationId?: number) => Promise<void>;
  deleteConversation: (id: number) => Promise<void>;
  updateConversationTitle: (id: number, title: string) => Promise<void>;
  clearCurrentConversation: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // --- API Functions (Using useCallback is ideal here) ---

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await conversationAPI.getAll();
      setConversations(data.conversations ?? data); 
    } catch (e) { 
        console.error("Error loading conversations:", e); 
    } finally {
      setLoading(false);
    }
  }, []);

  const loadConversation = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await conversationAPI.getById(id);
      // Assuming data contains { conversation: Conversation, messages: Message[] }
      setCurrentConversation(data.conversation ?? data); 
      setMessages(data.messages ?? []);
    } catch (e) { 
        console.error(`Error loading conversation ${id}:`, e); 
    } finally {
      setLoading(false);
    }
  }, []);

  // 🚨 REFINED: Now returns number | undefined for error handling in ChatLayout
  const createConversation = useCallback(async (title = "New chat") => {
    try {
      const data = await conversationAPI.create(title);
      const conv: Conversation = data.conversation ?? data;
      setConversations(prev => [conv, ...prev]);
      setCurrentConversation(conv);
      setMessages([]); // Clear messages for a truly new chat
      return conv.id;
    } catch (e) {
      console.error("Error creating new conversation:", e);
      return undefined;
    }
  }, []);

  // 🚀 CORE GROQ API CONNECTION LOGIC via chatAPI.sendMessage
  const sendMessage = useCallback(async (message: string, conversationId?: number) => {
    // 1. Optimistic Update: Add user message and start loading
    const userMsg: Message = { 
        role: "user", 
        content: message, 
        created_at: new Date().toISOString() 
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true); // 🚨 START LOADING SPINNER

    try {
        // 2. Call the backend API (which integrates with Groq)
        // res will contain { message: string, conversationId?: number } (from backend)
        const res = await chatAPI.sendMessage(message, conversationId);
        
        // 3. Update state with AI message
        const aiMsg: Message = { 
            role: "assistant", 
            content: res.message ?? res.reply ?? res.data ?? "", // Adjust based on your backend structure
            created_at: new Date().toISOString() 
        };
        setMessages(prev => [...prev, aiMsg]);
      
        // 4. Handle New Conversation Flow (Only on first message)
        if (!conversationId && res.conversationId) {
            // Fetch the full new conversation object from the backend 
            // (needed for title/metadata)
            const data = await conversationAPI.getById(res.conversationId);
            const conv: Conversation = data.conversation ?? data;
            
            // Set the current conversation and refresh the sidebar list
            setCurrentConversation(conv);
            await loadConversations(); // Updates the left sidebar with the new chat
        }

    } catch (e) {
        console.error("Error sending message to Groq API via backend:", e);
        // Remove the user message added in step 1 on error
        setMessages(prev => prev.filter(msg => msg !== userMsg)); 
    } finally {
        setLoading(false); // 🚨 STOP LOADING SPINNER
    }
  }, [loadConversations]);

  const deleteConversation = useCallback(async (id: number) => {
    try {
      await conversationAPI.delete(id);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (currentConversation?.id === id) { setCurrentConversation(null); setMessages([]); }
    } catch (e) { console.error("Error deleting conversation:", e); }
  }, [currentConversation?.id]);

  const updateConversationTitle = useCallback(async (id: number, title: string) => {
    try {
      await conversationAPI.updateTitle(id, title);
      setConversations(prev => prev.map(c => (c.id === id ? { ...c, title } : c)));
      if (currentConversation?.id === id) setCurrentConversation({ ...currentConversation, title } as Conversation);
    } catch (e) { console.error("Error updating title:", e); }
  }, [currentConversation]);

  const clearCurrentConversation = useCallback(() => { setCurrentConversation(null); setMessages([]); }, []);

  // --- Context Value ---
  const value: ChatContextType = {
    conversations, 
    currentConversation, 
    messages, 
    loading,
    activeChatId: currentConversation?.id ?? null, 

    loadConversations, 
    loadConversation, 
    createConversation, 
    sendMessage, 
    deleteConversation,
    updateConversationTitle, 
    clearCurrentConversation
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};