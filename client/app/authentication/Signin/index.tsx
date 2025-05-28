'use client'
import { useAppDispatch } from '@/app/redux'
import { ApiError } from '@/app/types/types'
import { useLoginMutation } from '@/state/api'
import { setCredentials } from '@/state/authSlice'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

type Props = {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>
}
export const SignIn = ({ setLogin }: Props) => {
  const dispatch = useAppDispatch()
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [login] = useLoginMutation()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const result = await login({ email, password }).unwrap()
      dispatch(setCredentials({ user: result.user, token: result.token }))

      toast.success('Successfully signed in!')
      router.push('/dashboard')
    } catch (error: unknown) {
      const err = error as ApiError
      const errorMessage =
        err.data?.error || err.error || 'Signin failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-white">
      <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-xl border border-orange-100 flex flex-col items-center">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-md mb-4">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="white" />
              <path
                d="M6 10.5L9 13.5L14 8.5"
                stroke="#fb923c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-orange-600 tracking-tight">
            Sign in to chartagoPM
          </h2>
          <p className="text-gray-500 mt-2 text-base">
            Welcome back! Please enter your details.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors bg-orange-50/40"
              placeholder="Enter your email"
              disabled={loading}
              autoComplete="email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors bg-orange-50/40"
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 text-base font-bold text-white bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg hover:from-orange-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Spinner size="sm" className="text-white" />}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg w-full">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}
        <div className="text-center mt-8 text-gray-600 w-full">
          <span>Don't have an account? </span>
          <span
            className="text-orange-500 font-semibold cursor-pointer hover:text-orange-600 transition-colors"
            onClick={() => setLogin(false)}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  )
}
