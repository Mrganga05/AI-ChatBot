"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Menu,
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  Lightbulb,
  PenTool,
  Zap,
  Search,
  BookOpen,
  History,
  Star,
  HelpCircle,
  X,
  Loader2,
  Trash2,
  Send,
  Sparkles,
  AlertCircle,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { useChat } from "../contexts/ChatContext"
import { useAuth } from "../contexts/AuthContext"
import { StreamingMessage } from "../components/streaming-message"
import { MarkdownRenderer } from "../components/markdown-renderer"

export default function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const {
    conversations,
    activeChatId,
    messages,
    createConversation,
    clearCurrentConversation,
    loading: chatLoading,
    loadConversation,
    loadConversations,
    sendMessage,
    deleteConversation,
  } = useChat()

  const { user, logout } = useAuth()

  const [messageInput, setMessageInput] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, chatLoading])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const handleNewChat = async () => {
    await createConversation()
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }

  const handleSelectChat = (id: number) => {
    loadConversation(id)
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }

  const handleHome = () => {
    clearCurrentConversation()
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }

  const handleLogout = () => {
    logout()
  }

  const handleDeleteChat = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setDeleteConfirmId(id)
  }

  const confirmDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await deleteConversation(id)
      await loadConversations()
      if (activeChatId === id) {
        handleHome()
      }
      setDeleteConfirmId(null)
    } catch (error) {
      console.error("Error deleting conversation:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || chatLoading) return

    const messageToSend = messageInput.trim()
    setMessageInput("")

    const conversationId = activeChatId ? Number(activeChatId) : undefined
    await sendMessage(messageToSend, conversationId)
  }

  const actionCards = [
    {
      icon: PenTool,
      label: "Write",
      description: "Craft compelling content",
      color: "from-pink-500/30 via-rose-500/20 to-rose-600/10",
    },
    {
      icon: Zap,
      label: "Build",
      description: "Code faster and smarter",
      color: "from-indigo-500/30 via-purple-500/20 to-purple-600/10",
    },
    {
      icon: Search,
      label: "Deep Research",
      description: "Explore in depth",
      color: "from-blue-500/30 via-cyan-500/20 to-cyan-600/10",
    },
    {
      icon: BookOpen,
      label: "Learn",
      description: "Expand your knowledge",
      color: "from-violet-500/30 via-indigo-500/20 to-indigo-600/10",
    },
  ]

  const currentChatId = activeChatId ? activeChatId.toString() : null

  return (
    <div
      className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-foreground overflow-hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        ::-webkit-scrollbar {
          display: none;
        }
        html, body {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        *::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-24"
        } bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-xl border-r border-slate-800/50 transition-all duration-300 flex flex-col shadow-2xl`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-800/30 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <span className="text-lg font-bold text-white">J</span>
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-bold text-white text-sm">Jalebi AI</p>
                <p className="text-xs text-slate-400">Your AI Assistant</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            className={`w-full bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300 ${chatLoading ? "opacity-70" : ""}`}
            onClick={handleNewChat}
            disabled={chatLoading}
          >
            {chatLoading && !currentChatId ? <Loader2 size={20} className="animate-spin mr-2" /> : <Plus size={20} />}
            {sidebarOpen && "New Chat"}
          </Button>
        </div>

        {/* Navigation Section */}
        {sidebarOpen && (
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 px-2">Navigation</p>
            <div className="space-y-2">
              <button
                onClick={handleHome}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium 
                  ${!currentChatId ? "bg-slate-800/40 text-slate-200" : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"}`}
              >
                <History size={18} className="text-pink-400" />
                <span>Home</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/40 transition-colors text-sm font-medium text-slate-400 hover:text-slate-200">
                <HelpCircle size={18} />
                <span>Help & Support</span>
              </button>
            </div>
          </div>
        )}

        {/* Recent Chats Section */}
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto px-4 py-3" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 px-2">Recent Chats</p>
            <div className="space-y-2">
              {conversations.length === 0 && chatLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-slate-400" size={20} />
                </div>
              ) : (
                conversations.map((chat) => {
                  const Icon = chat.message_count ? History : Star
                  return (
                    <div key={chat.id} className="group relative">
                      <button
                        onClick={() => handleSelectChat(chat.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 text-sm ${
                          currentChatId === chat.id.toString()
                            ? "bg-gradient-to-r from-pink-500/30 to-indigo-500/20 border border-pink-500/50 text-white shadow-lg shadow-pink-500/10"
                            : "hover:bg-slate-800/40 text-slate-300 hover:text-white"
                        }`}
                      >
                        <div className="font-medium truncate flex items-center gap-2">
                          <Icon size={16} className="flex-shrink-0" />
                          {chat.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {new Date(chat.updated_at).toLocaleDateString()}
                        </div>
                      </button>
                      <button
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                        disabled={deletingId === chat.id}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500/20 text-red-400 hover:text-red-300 disabled:opacity-50"
                        title="Delete chat"
                      >
                        {deletingId === chat.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>

                      {deleteConfirmId === chat.id && (
                        <div className="absolute right-0 top-full mt-2 bg-slate-900 border border-red-500/50 rounded-lg shadow-2xl p-3 z-50 w-48">
                          <div className="flex items-start gap-2 mb-3">
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-200">Delete this chat?</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => confirmDelete(chat.id)}
                              className="flex-1 px-3 py-2 bg-red-500/80 hover:bg-red-600 text-white text-xs font-semibold rounded transition-colors"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Footer Section */}
        <div className="p-4 border-t border-slate-800/30 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/40 transition-colors text-sm font-medium text-slate-400 hover:text-slate-200">
            <Settings size={18} />
            {sidebarOpen && "Settings"}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors text-sm font-medium text-red-400 hover:text-red-300"
          >
            <LogOut size={18} />
            {sidebarOpen && "Logout"}
          </button>
        </div>

        {/* Collapse Button */}
        {!sidebarOpen && (
          <div className="p-4 border-t border-slate-800/30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <Menu size={20} />
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-slate-800/50 bg-gradient-to-r from-slate-900/50 to-slate-950/50 backdrop-blur-xl px-8 py-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-indigo-500/20 border border-pink-500/30">
              <MessageSquare size={20} className="text-pink-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                {activeChatId
                  ? conversations.find((c) => c.id.toString() === currentChatId)?.title || "Chat"
                  : "New Chat"}
              </h1>
              <p className="text-xs text-slate-400">Powered by Jalebi AI</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-slate-300">{user?.username ?? "Guest"}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700/50 hover:bg-slate-800/50 text-slate-300 hover:text-white bg-transparent"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div
          className="flex-1 overflow-y-auto flex flex-col items-center justify-start px-8 py-16"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="max-w-5xl w-full">
            {messages.length > 0 || chatLoading ? (
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex flex-col gap-2 max-w-4xl ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-700/50 backdrop-blur-sm">
                        <div
                          className={`w-2 h-2 rounded-full ${msg.role === "user" ? "bg-pink-500" : "bg-indigo-500"}`}
                        ></div>
                        <span
                          className={`text-xs font-semibold uppercase tracking-wider ${msg.role === "user" ? "text-pink-400" : "text-indigo-400"}`}
                        >
                          {msg.role === "user" ? "You" : "Jalebi AI"}
                        </span>
                      </div>
                      <div
                        className={`p-5 rounded-2xl shadow-xl backdrop-blur-sm transition-all duration-300 ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-pink-600/80 to-indigo-600/70 text-white rounded-br-none border border-pink-500/30 shadow-pink-500/20"
                            : "bg-gradient-to-br from-slate-800/80 to-slate-900/70 text-slate-100 rounded-tl-none border border-indigo-500/30 shadow-indigo-500/10"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <StreamingMessage
                            text={msg.content}
                            isComplete={index < messages.length - 1 || !chatLoading}
                          />
                        ) : (
                          <MarkdownRenderer content={msg.content} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="flex flex-col gap-2 max-w-4xl items-start">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-700/50 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                          Jalebi AI
                        </span>
                      </div>
                      <div className="p-5 rounded-2xl shadow-xl backdrop-blur-sm bg-gradient-to-br from-slate-800/80 to-slate-900/70 text-slate-100 rounded-tl-none border border-indigo-500/30 shadow-indigo-500/10 flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-sm">Jalebi AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            ) : (
              <>
                <div className="mb-16 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/20 via-indigo-500/20 to-blue-500/20 border border-pink-500/30 shadow-2xl shadow-pink-500/20">
                      <Sparkles size={40} className="text-pink-400" />
                    </div>
                  </div>
                  <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                    Hello, {user?.username ?? "User"}
                  </h2>
                  <p className="text-lg text-slate-400">What would you like to create today?</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                  {actionCards.map((card) => {
                    const Icon = card.icon
                    return (
                      <button
                        key={card.label}
                        className={`group relative p-6 rounded-2xl bg-gradient-to-br ${card.color} border border-slate-700/50 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex flex-col items-center gap-4 h-full">
                          <div className="p-4 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all duration-300 shadow-lg">
                            <Icon size={28} className="text-pink-400 group-hover:text-pink-300 transition-colors" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{card.label}</p>
                            <p className="text-xs text-slate-400 mt-1">{card.description}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {/* Info Section */}
                <div className="bg-gradient-to-r from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex-shrink-0">
                      <Lightbulb size={20} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">
                        <span className="text-white font-semibold">Note:</span> Jalebi AI can make mistakes, so always
                        double-check important information before using it.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Input Footer */}
        <div className="border-t border-slate-800/50 bg-gradient-to-t from-slate-950/90 to-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
          <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-indigo-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-2xl px-6 py-4 focus-within:border-pink-500/80 focus-within:shadow-2xl focus-within:shadow-pink-500/30 transition-all duration-300 hover:border-slate-600/70 backdrop-blur-sm">
                  <Sparkles
                    size={20}
                    className="text-indigo-400 flex-shrink-0 group-focus-within:text-pink-400 transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Ask Jalebi AI anything..."
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500 text-white font-medium"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={chatLoading}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-600 hover:from-pink-600 hover:via-indigo-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 font-semibold flex items-center gap-2"
                size="sm"
                disabled={!messageInput.trim() || chatLoading}
              >
                {chatLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}