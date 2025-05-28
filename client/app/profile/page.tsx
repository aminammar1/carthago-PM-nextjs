'use client'
import React, { useState } from 'react'
import { useAppSelector } from '../redux'
import Image from 'next/image'
import { useUpdateUserMutation } from '@/state/api'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/state/authSlice'

const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user)
  const [editMode, setEditMode] = useState(false)
  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')
  const [updateUser, { isLoading }] = useUpdateUserMutation()
  const dispatch = useDispatch()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    try {
      if (!user) return
      const updated = await updateUser({
        userId: user.userId,
        username,
        email,
      }).unwrap()
      dispatch(setCredentials({ user: updated, token: (user as any).token }))
      setEditMode(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (e: any) {
      setError('Failed to update profile')
      setTimeout(() => setError(''), 2000)
    }
  }
  return (
    <div className="flex flex-col items-start justify-start w-full min-h-screen bg-[#f5f5f5] p-6">
      <div className="w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-start items-center gap-x-4">
          {user?.profilePictureUrl ? (
            <Image
              src={user.profilePictureUrl}
              alt="Profile"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl text-secondary-950">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex flex-col justify-start items-start gap-y-2">
            <h1 className="text-2xl font-bold text-secondary-950">
              {user?.username}
            </h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-col w-1/2 justify-start items-start gap-y-2">
          <h1 className="text-2xl font-bold text-secondary-950 text-left">
            Account Info :
          </h1>
          {success && (
            <div className="text-green-600 bg-green-100 rounded p-2 w-full">
              Profile updated!
            </div>
          )}
          {error && (
            <div className="text-red-600 bg-red-100 rounded p-2 w-full">
              {error}
            </div>
          )}
          <div className="flex justify-between gap-x-6 items-center w-full ">
            <div className="rounded-sm border-gray-500 border-1 p-2 w-full">
              <input
                type="text"
                value={editMode ? username : user?.username}
                onChange={(e) => setUsername(e.target.value)}
                readOnly={!editMode}
                className={`bg-transparent outline-none border-none w-full ${
                  editMode ? 'text-orange-600' : ''
                }`}
              />
            </div>
            <div className="rounded-sm border-gray-500 border-1 p-2 w-full">
              <input
                type="text"
                value={editMode ? username : user?.username}
                onChange={(e) => setUsername(e.target.value)}
                readOnly={!editMode}
                className={`bg-transparent outline-none border-none w-full ${
                  editMode ? 'text-orange-600' : ''
                }`}
              />
            </div>
          </div>
          <div className="rounded-sm border-gray-500 border-1 p-2 w-full">
            <input
              type="text"
              value={editMode ? email : user?.email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!editMode}
              className={`bg-transparent outline-none border-none w-full ${
                editMode ? 'text-orange-600' : ''
              }`}
            />
          </div>
          <div className="flex justify-end gap-x-4 mt-2">
            {editMode ? (
              <button
                className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-md px-6 py-2 rounded-lg font-bold hover:from-orange-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all"
                onClick={handleSave}
                disabled={isLoading}
              >
                Save
              </button>
            ) : null}
            <button
              className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-md px-6 py-2 rounded-lg font-bold hover:from-orange-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all"
              onClick={() => setEditMode((v) => !v)}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
