"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Eye, EyeOff, ArrowRight, Lock, Mail, Sparkles } from "lucide-react"
import { authAPI } from "../services/api"

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    try {
      setLoading(true)
      setError("")
      setForgotPasswordMessage(null)
      await login(email, password)
      navigate("/")
    } catch (err: any) {
      setError(err.response?.status === 401 ? "Invalid email or password." : "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    const userEmail = prompt("Enter your email address for a password reset link:")
    if (!userEmail || !userEmail.includes("@")) {
      alert("Please enter a valid email address.")
      return
    }

    setLoading(true)
    setForgotPasswordMessage(null)
    try {
      await authAPI.forgotPassword(userEmail)
      setForgotPasswordMessage("Password reset link sent! Check your email.")
    } catch {
      setForgotPasswordMessage("Error sending reset link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4 overflow-hidden relative"
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
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute -top-1/3 -right-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/30 via-rose-500/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute -bottom-1/3 -left-1/4 w-96 h-96 bg-gradient-to-tr from-indigo-500/30 via-blue-500/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-violet-500/20 via-purple-500/15 to-transparent rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative bg-slate-900/60 backdrop-blur-2xl border border-indigo-500/30 rounded-3xl p-8 shadow-2xl"
        >
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-pink-400" />
              </motion.div>
              <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-indigo-400 to-blue-400 uppercase tracking-widest">
                Welcome
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold bg-gradient-to-r from-pink-300 via-indigo-300 to-blue-300 bg-clip-text text-transparent mb-2"
            >
              Sign In
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-slate-300 text-sm font-light"
            >
              Access your premium workspace
            </motion.p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 group-focus-within:text-pink-400 transition-colors" />
                <input
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 placeholder:text-slate-500 text-white text-sm font-light transition-all duration-300 hover:border-indigo-500/50"
                  placeholder="your@email.com"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 group-focus-within:text-pink-400 transition-colors" />
                <input
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 bg-slate-800/50 border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 placeholder:text-slate-500 text-white text-sm font-light transition-all duration-300 hover:border-indigo-500/50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-pink-400 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-end"
            >
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-xs text-pink-400 hover:text-pink-300 font-light transition-colors"
              >
                Forgot password?
              </button>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-light"
              >
                {error}
              </motion.div>
            )}

            {forgotPasswordMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-pink-500/10 border border-pink-500/30 rounded-lg text-pink-400 text-xs font-light"
              >
                {forgotPasswordMessage}
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-6 bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500 hover:from-pink-600 hover:via-indigo-600 hover:to-blue-600 text-white font-semibold text-sm rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center text-slate-400 text-xs font-light mt-6"
          >
            Don't have an account?{" "}
            <Link to="/register" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginPage
