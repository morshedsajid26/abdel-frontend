import React, { useState, useRef, useEffect } from 'react'
import { Mail, Lock, Camera, Loader2 } from 'lucide-react'
import InputField from '../../../components/Inputfield'
import Password from '../../../components/Password'

import useAuth from '../../../hooks/useAuth'
import toast from 'react-hot-toast'
// Fetch Profile data (mock moved outside to prevent infinite loops)
const profileResponse = {
  data: {
    firstName: 'Mock',
    lastName: 'User',
    email: 'mock@example.com',
    avatar: null
  }
};

const ProfileSettings = () => {

  const { setUser } = useAuth()

  const [isProfileEditing, setIsProfileEditing] = useState(false)
  const [isPasswordEditing, setIsPasswordEditing] = useState(false)
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/32.jpg')
  const [selectedFile, setSelectedFile] = useState(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const fileInputRef = useRef(null)

  // Fetch Profile data
  const isLoading = false;
  const refetch = () => {};

  // Helper to get full avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return 'https://randomuser.me/api/portraits/men/32.jpg'
    if (avatarPath.startsWith('http') || avatarPath.startsWith('blob:')) return avatarPath
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const baseUrl = apiBaseUrl.replace(/\/api\/?$/, '')
    return `${baseUrl}/${avatarPath.replace(/^\//, '')}`
  }

  // Sync profile data to state
  useEffect(() => {
    if (profileResponse?.data && !isProfileEditing) {
      setFirstName(profileResponse.data.firstName || '')
      setLastName(profileResponse.data.lastName || '')
      setEmail(profileResponse.data.email || '')
      setProfileImage(getAvatarUrl(profileResponse.data.avatar))
      setSelectedFile(null)
    }
  }, [profileResponse, isProfileEditing])

  const handleImageClick = () => {
    if (isProfileEditing && !updateMutation.isPending) {
      fileInputRef.current?.click()
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setProfileImage(url)
    }
  }

  // Mutation for updating profile
  const updateMutation = {
    mutate: (data) => {
      setTimeout(() => {
        toast.success('Profile updated successfully');
        setIsProfileEditing(false);
      }, 500);
    },
    isPending: false
  };

  const handleSaveProfile = () => {
    if (!firstName || !lastName || !email) {
      toast.error('First Name, Last Name, and Email are required')
      return
    }
    updateMutation.mutate({ firstName, lastName, email })
  }

  // Mutation for changing password
  const changePasswordMutation = {
    mutate: (payload) => {
      setTimeout(() => {
        toast.success('Password changed successfully');
        handleCancelPassword();
      }, 500);
    },
    isPending: false
  };

  const handleCancelPassword = () => {
    setIsPasswordEditing(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
      confirmPassword
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#205943] w-10 h-10" />
      </div>
    )
  }

  const isProfilePending = updateMutation.isPending
  const isPasswordPending = changePasswordMutation.isPending

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-semibold text-[#0e1217] mb-1">Profile Settings</h2>
      <p className="text-sm text-[#9fa5ac] mb-8">Update your personal information</p>

      <div className="bg-[#ffffff] p-6 rounded-xl border border-[#cccccc] mb-8">
        {/* Profile Image */}
        <div className="relative w-20 h-20 mb-8">
          <img 
            src={profileImage} 
            alt="Profile" 
            className="w-full h-full rounded-full object-cover border-2 border-[#e6e4df]"
          />
          {isProfileEditing && (
            <button 
              onClick={handleImageClick}
              disabled={isProfilePending}
              className="absolute bottom-0 right-0 bg-[#ffffff] p-1.5 rounded-full border border-[#e6e4df] hover:bg-[#ffffff]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-3 h-3 text-[#0e1217]" />
            </button>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <InputField 
            label="First Name"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            readOnly={!isProfileEditing || isProfilePending}
            labelClass="!text-sm !font-medium !text-[#0e1217]"
            inputClass={`!bg-[#ffffff] !border-[#cccccc] !rounded-full !px-5 !py-3.5 !text-sm ${(!isProfileEditing || isProfilePending) ? '!text-[#9fa5ac] cursor-default' : '!text-[#0e1217]'} placeholder:!text-[#9fa5ac] focus:!outline-none focus:!border-blue-500/50`}
          />
          <InputField 
            label="Last Name"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            readOnly={!isProfileEditing || isProfilePending}
            labelClass="!text-sm !font-medium !text-[#0e1217]"
            inputClass={`!bg-[#ffffff] !border-[#cccccc] !rounded-full !px-5 !py-3.5 !text-sm ${(!isProfileEditing || isProfilePending) ? '!text-[#9fa5ac] cursor-default' : '!text-[#0e1217]'} placeholder:!text-[#9fa5ac] focus:!outline-none focus:!border-blue-500/50`}
          />
        </div>

        <div className="mb-8">
          <InputField 
            label="Email"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!isProfileEditing || isProfilePending}
            leftIcon={<Mail className="w-4 h-4" />}
            labelClass="!text-sm !font-medium !text-[#0e1217]"
            inputClass={`!bg-[#ffffff] !border-[#cccccc] !rounded-full !pl-12 !pr-5 !py-3.5 !text-sm ${(!isProfileEditing || isProfilePending) ? '!text-[#9fa5ac] cursor-default' : '!text-[#0e1217]'} placeholder:!text-[#9fa5ac] focus:!outline-none focus:!border-blue-500/50`}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          {!isProfileEditing ? (
            <button 
              onClick={() => setIsProfileEditing(true)}
              className="px-10 py-2.5 rounded-full border border-[#419977] bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-sm text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all cursor-pointer"
            >
              Edit
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsProfileEditing(false)}
                disabled={isProfilePending}
                className="px-8 py-2.5 rounded-full border border-[#e6e4df] text-sm font-medium text-[#0e1217] hover:bg-[#ffffff]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={isProfilePending}
                className="px-8 py-2.5 rounded-full border border-[#419977] bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-sm text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isProfilePending && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Change Password */}
      <h2 className="text-xl font-semibold text-[#0e1217] mb-1">Change Password</h2>
      <p className="text-sm text-[#9fa5ac] mb-8">Update your password regularly to keep your account secure.</p>

      <div className="bg-[#ffffff] p-6 rounded-xl border border-[#cccccc] mb-8">
        <div className="mb-6">
          <Password 
            label="Current Password"
            placeholder="Enter Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            readOnly={!isPasswordEditing || isPasswordPending}
            leftIcon={<Lock className="w-4 h-4" />}
            labelClass="!text-sm !font-medium !text-[#0e1217]"
            inputClass={`!bg-[#ffffff] !border-[#cccccc] !rounded-full !pl-12 !pr-5 !py-3.5 !text-sm ${(!isPasswordEditing || isPasswordPending) ? '!text-[#9fa5ac] cursor-default' : '!text-[#0e1217]'} placeholder:!text-[#9fa5ac] focus:!outline-none focus:!border-blue-500/50`}
            icon="!text-gray-400 hover:!text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Password 
            label="New Password"
            placeholder="Enter Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            readOnly={!isPasswordEditing || isPasswordPending}
            leftIcon={<Lock className="w-4 h-4" />}
            labelClass="!text-sm !font-medium !text-[#0e1217]"
            inputClass={`!bg-[#ffffff] !border-[#cccccc] !rounded-full !pl-12 !pr-5 !py-3.5 !text-sm ${(!isPasswordEditing || isPasswordPending) ? '!text-[#9fa5ac] cursor-default' : '!text-[#0e1217]'} placeholder:!text-[#9fa5ac] focus:!outline-none focus:!border-blue-500/50`}
            icon="!text-gray-400 hover:!text-white"
          />
          <Password 
            label="Confirm New Password"
            placeholder="Enter Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            readOnly={!isPasswordEditing || isPasswordPending}
            leftIcon={<Lock className="w-4 h-4" />}
            labelClass="!text-sm !font-medium !text-[#0e1217]"
            inputClass={`!bg-[#ffffff] !border-[#cccccc] !rounded-full !pl-12 !pr-5 !py-3.5 !text-sm ${(!isPasswordEditing || isPasswordPending) ? '!text-[#9fa5ac] cursor-default' : '!text-[#0e1217]'} placeholder:!text-[#9fa5ac] focus:!outline-none focus:!border-blue-500/50`}
            icon="!text-gray-400 hover:!text-white"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          {!isPasswordEditing ? (
            <button 
              onClick={() => setIsPasswordEditing(true)}
              className="px-10 py-2.5 rounded-full border border-[#419977] bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-sm text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all cursor-pointer"
            >
              Edit
            </button>
          ) : (
            <>
              <button 
                onClick={handleCancelPassword}
                disabled={isPasswordPending}
                className="px-8 py-2.5 rounded-full border border-[#e6e4df] text-sm font-medium text-[#0e1217] hover:bg-[#ffffff]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSavePassword}
                disabled={isPasswordPending}
                className="px-8 py-2.5 rounded-full border border-[#419977] bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-sm text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPasswordPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Save new password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
