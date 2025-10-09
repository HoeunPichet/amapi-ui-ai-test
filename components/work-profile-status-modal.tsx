"use client"

import { useState } from "react"
import { Button } from "@/ui/button"
import { WorkProfile } from "@/types"
import { 
  AlertCircle, 
  CheckCircle, 
  X, 
  Zap, 
  Shield,
  UserCheck,
  UserX,
  Sparkles
} from "lucide-react"

interface WorkProfileStatusModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  workProfile: WorkProfile | null
  action: "enable" | "disable"
  isLoading?: boolean
}

export function WorkProfileStatusModal({
  isOpen,
  onClose,
  onConfirm,
  workProfile,
  action,
  isLoading = false
}: WorkProfileStatusModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  if (!isOpen || !workProfile) return null

  const isEnable = action === "enable"
  const isDisable = action === "disable"

  const handleConfirm = async () => {
    setIsAnimating(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setIsAnimating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/50 w-full max-w-md animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors group"
          >
            <X className="w-5 h-5 text-slate-500 group-hover:text-slate-700" />
          </button>
          
          {/* Icon and Title */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              isEnable 
                ? "bg-gradient-to-br from-green-100 to-emerald-100" 
                : "bg-gradient-to-br from-orange-100 to-red-100"
            }`}>
              {isEnable ? (
                <UserCheck className="w-8 h-8 text-green-600" />
              ) : (
                <UserX className="w-8 h-8 text-orange-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {isEnable ? "Activate Profile" : "Deactivate Profile"}
              </h2>
              <p className="text-sm text-slate-600">
                {isEnable ? "Ready to bring them back?" : "Taking a break?"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Profile Info */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <span className="text-sm font-bold text-primary-600">
                  {workProfile.firstName.charAt(0)}{workProfile.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  {workProfile.firstName} {workProfile.lastName}
                </p>
                <p className="text-sm text-slate-600">@{workProfile.username}</p>
              </div>
            </div>
          </div>

          {/* Action Description */}
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border-2 ${
              isEnable 
                ? "bg-green-50 border-green-200" 
                : "bg-orange-50 border-orange-200"
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${
                  isEnable ? "bg-green-100" : "bg-orange-100"
                }`}>
                  {isEnable ? (
                    <Zap className="w-5 h-5 text-green-600" />
                  ) : (
                    <Shield className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-1">
                    {isEnable ? "Profile will be activated" : "Profile will be deactivated"}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {isEnable 
                      ? "They'll regain access to all work resources and be able to use their profile normally."
                      : "They'll lose access to work resources but their data will be safely preserved."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Gen Z Elements */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Sparkles className="w-4 h-4" />
              <span>
                {isEnable 
                  ? "This action is reversible - no worries! ✨" 
                  : "Don't worry, this is totally reversible! 🔄"
                }
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading || isAnimating}
              className="flex-1 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            >
              Nevermind
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading || isAnimating}
              className={`flex-1 text-white font-semibold ${
                isEnable 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" 
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              } ${isAnimating ? "animate-pulse" : ""}`}
            >
              {isLoading || isAnimating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isEnable ? "Activating..." : "Deactivating..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isEnable ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Let's Go!
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Deactivate
                    </>
                  )}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
