"use client"

import { useEffect, useMemo, useState } from "react"
import { amapiService } from "@/services/amapi.service"
import { Policy, PolicyRule } from "@/types"
import { useToast } from "@/hooks/use-simple-toast"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Shield, Plus, Search, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)

  // Form state for create/edit
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formActive, setFormActive] = useState(true)

  // Sections state
  const [appControl, setAppControl] = useState({
    whitelistEnabled: false,
    whitelist: "",
    blacklistEnabled: false,
    blacklist: "",
    forceInstallEnabled: false,
    forceInstallApps: "", // comma separated package names
    forceUninstallEnabled: false,
    forceUninstallApps: "",
  })

  const [featureRestrictions, setFeatureRestrictions] = useState({
    controlHardware: false,
    disableCamera: false,
    disableBluetooth: false,
    disableUSB: false,
    disableScreenCapture: false,
  })

  const [securityPolicies, setSecurityPolicies] = useState({
    requirePassword: false,
    minLength: 6,
    requireSpecial: false,
    expirationDays: 0,
    screenLockTimeoutMinutes: 0,
    requireEncryption: false,
    biometrics: {
      fingerprint: false,
      facial: false,
      voice: false,
      iris: false,
    },
  })

  const [networkSettings, setNetworkSettings] = useState({
    wifiProfiles: "", // lines of SSID:password
    restrictMobileData: false,
    requireVPN: false,
    apn: "", // simple text
  })

  const [inactivityLock, setInactivityLock] = useState({
    autoLockEnabled: false,
    inactivityMinutes: 0,
  })

  const resetForm = () => {
    setFormName("")
    setFormDescription("")
    setFormActive(true)
    setAppControl({
      whitelistEnabled: false,
      whitelist: "",
      blacklistEnabled: false,
      blacklist: "",
      forceInstallEnabled: false,
      forceInstallApps: "",
      forceUninstallEnabled: false,
      forceUninstallApps: "",
    })
    setFeatureRestrictions({
      controlHardware: false,
      disableCamera: false,
      disableBluetooth: false,
      disableUSB: false,
      disableScreenCapture: false,
    })
    setSecurityPolicies({
      requirePassword: false,
      minLength: 6,
      requireSpecial: false,
      expirationDays: 0,
      screenLockTimeoutMinutes: 0,
      requireEncryption: false,
      biometrics: { fingerprint: false, facial: false, voice: false, iris: false },
    })
    setNetworkSettings({ wifiProfiles: "", restrictMobileData: false, requireVPN: false, apn: "" })
    setInactivityLock({ autoLockEnabled: false, inactivityMinutes: 0 })
    setEditingPolicy(null)
  }

  const buildRules = useMemo<PolicyRule[]>(() => {
    const rules: PolicyRule[] = []
    // App Control
    if (appControl.whitelistEnabled)
      rules.push({ id: "rule-whitelist", name: "App Whitelist", type: "app_whitelist", value: appControl.whitelist.split(/\s*,\s*/).filter(Boolean), description: "Only allow specific apps" })
    if (appControl.blacklistEnabled)
      rules.push({ id: "rule-blacklist", name: "App Blacklist", type: "app_blacklist", value: appControl.blacklist.split(/\s*,\s*/).filter(Boolean), description: "Block unwanted apps" })
    if (appControl.forceInstallEnabled)
      rules.push({ id: "rule-force-install", name: "Force Install", type: "force_install", value: appControl.forceInstallApps.split(/\s*,\s*/).filter(Boolean), description: "Push required apps" })
    if (appControl.forceUninstallEnabled)
      rules.push({ id: "rule-force-uninstall", name: "Force Uninstall", type: "force_uninstall", value: appControl.forceUninstallApps.split(/\s*,\s*/).filter(Boolean), description: "Remove non-compliant apps" })

    // Feature Restrictions
    if (featureRestrictions.controlHardware)
      rules.push({ id: "rule-control-hw", name: "Control Hardware", type: "control_hardware", value: true, description: "Control device hardware and features" })
    if (featureRestrictions.disableCamera)
      rules.push({ id: "rule-camera", name: "Disable Camera", type: "disable_camera", value: true, description: "Disable camera" })
    if (featureRestrictions.disableBluetooth)
      rules.push({ id: "rule-bluetooth", name: "Disable Bluetooth", type: "disable_bluetooth", value: true, description: "Disable Bluetooth" })
    if (featureRestrictions.disableUSB)
      rules.push({ id: "rule-usb", name: "Disable USB", type: "disable_usb", value: true, description: "Disable USB" })
    if (featureRestrictions.disableScreenCapture)
      rules.push({ id: "rule-screencap", name: "Disable Screen Capture", type: "disable_screen_capture", value: true, description: "Disable screen capture or printing" })

    // Security Policies
    if (securityPolicies.requirePassword)
      rules.push({ id: "rule-password", name: "Password Policy", type: "password_policy", value: { minLength: securityPolicies.minLength, requireSpecial: securityPolicies.requireSpecial, expirationDays: securityPolicies.expirationDays }, description: "Password complexity" })
    if (securityPolicies.screenLockTimeoutMinutes > 0)
      rules.push({ id: "rule-screenlock", name: "Screen Lock Timeout", type: "screen_lock_timeout", value: securityPolicies.screenLockTimeoutMinutes, description: "Auto screen lock" })
    if (securityPolicies.requireEncryption)
      rules.push({ id: "rule-encryption", name: "Storage Encryption", type: "require_encryption", value: true, description: "Require device storage encryption" })
    const bio = securityPolicies.biometrics
    if (bio.fingerprint || bio.facial || bio.voice || bio.iris)
      rules.push({ id: "rule-biometrics", name: "Biometric Auth", type: "biometric_methods", value: Object.entries(bio).filter(([, v]) => v).map(([k]) => k), description: "Required biometric methods" })

    // Network
    if (networkSettings.wifiProfiles.trim())
      rules.push({ id: "rule-wifi", name: "Wi-Fi Profiles", type: "wifi_profiles", value: networkSettings.wifiProfiles.split(/\n+/).map((l) => l.trim()).filter(Boolean), description: "Pre-configured Wi-Fi profiles" })
    if (networkSettings.restrictMobileData)
      rules.push({ id: "rule-mobile-data", name: "Restrict Mobile Data", type: "restrict_mobile_data", value: true, description: "Restrict mobile data usage" })
    if (networkSettings.requireVPN)
      rules.push({ id: "rule-vpn", name: "Require VPN", type: "require_vpn", value: true, description: "Force use of corporate VPN" })
    if (networkSettings.apn.trim())
      rules.push({ id: "rule-apn", name: "APN Settings", type: "apn_settings", value: networkSettings.apn.trim(), description: "APN config" })

    // Inactivity Lock
    if (inactivityLock.autoLockEnabled)
      rules.push({ id: "rule-inactivity", name: "Inactivity Lock", type: "inactivity_lock", value: inactivityLock.inactivityMinutes, description: "Auto-lock after inactivity" })

    return rules
  }, [appControl, featureRestrictions, securityPolicies, networkSettings, inactivityLock])

  const openCreate = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEdit = (policy: Policy) => {
    resetForm()
    setEditingPolicy(policy)
    setFormName(policy.name)
    setFormDescription(policy.description)
    setFormActive(policy.isActive)
    // Best-effort hydrate from rules
    policy.rules.forEach((r) => {
      switch (r.type) {
        case "app_whitelist": setAppControl((s) => ({ ...s, whitelistEnabled: true, whitelist: (r.value || []).join(", ") })); break
        case "app_blacklist": setAppControl((s) => ({ ...s, blacklistEnabled: true, blacklist: (r.value || []).join(", ") })); break
        case "force_install": setAppControl((s) => ({ ...s, forceInstallEnabled: true, forceInstallApps: (r.value || []).join(", ") })); break
        case "force_uninstall": setAppControl((s) => ({ ...s, forceUninstallEnabled: true, forceUninstallApps: (r.value || []).join(", ") })); break
        case "control_hardware": setFeatureRestrictions((s) => ({ ...s, controlHardware: !!r.value })); break
        case "disable_camera": setFeatureRestrictions((s) => ({ ...s, disableCamera: !!r.value })); break
        case "disable_bluetooth": setFeatureRestrictions((s) => ({ ...s, disableBluetooth: !!r.value })); break
        case "disable_usb": setFeatureRestrictions((s) => ({ ...s, disableUSB: !!r.value })); break
        case "disable_screen_capture": setFeatureRestrictions((s) => ({ ...s, disableScreenCapture: !!r.value })); break
        case "password_policy": setSecurityPolicies((s) => ({ ...s, requirePassword: true, minLength: r.value?.minLength ?? s.minLength, requireSpecial: !!r.value?.requireSpecial, expirationDays: r.value?.expirationDays ?? 0 })); break
        case "screen_lock_timeout": setSecurityPolicies((s) => ({ ...s, screenLockTimeoutMinutes: Number(r.value) || 0 })); break
        case "require_encryption": setSecurityPolicies((s) => ({ ...s, requireEncryption: !!r.value })); break
        case "biometric_methods": {
          const arr: string[] = Array.isArray(r.value) ? r.value : []
          setSecurityPolicies((s) => ({ ...s, biometrics: { fingerprint: arr.includes("fingerprint"), facial: arr.includes("facial"), voice: arr.includes("voice"), iris: arr.includes("iris") } }))
          break
        }
        case "wifi_profiles": setNetworkSettings((s) => ({ ...s, wifiProfiles: (r.value || []).join("\n") })); break
        case "restrict_mobile_data": setNetworkSettings((s) => ({ ...s, restrictMobileData: !!r.value })); break
        case "require_vpn": setNetworkSettings((s) => ({ ...s, requireVPN: !!r.value })); break
        case "apn_settings": setNetworkSettings((s) => ({ ...s, apn: String(r.value || "") })); break
        case "inactivity_lock": setInactivityLock((s) => ({ ...s, autoLockEnabled: true, inactivityMinutes: Number(r.value) || 0 })); break
        default: break
      }
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!formName.trim()) {
      toast({ title: "Name required", description: "Please enter a policy name.", variant: "destructive" })
      return
    }
    const payload = {
      name: formName.trim(),
      description: formDescription.trim(),
      type: "security" as Policy["type"],
      isActive: formActive,
      rules: buildRules,
      appliedDevices: [],
    }
    const res = editingPolicy
      ? await amapiService.updatePolicy(editingPolicy.id, payload)
      : await amapiService.createPolicy(payload)
    if (res.success) {
      toast({ title: editingPolicy ? "Policy updated" : "Policy created", description: "Policy saved successfully", variant: "success" })
      // Refresh list
      const list = await amapiService.getPolicies({ page: 1, limit: 10, search: searchTerm || undefined })
      if (list.success && list.data) setPolicies(list.data.data)
      setIsModalOpen(false)
      resetForm()
    } else {
      toast({ title: "Error", description: res.error || "Failed to save policy", variant: "destructive" })
    }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await amapiService.getPolicies({ page: 1, limit: 10, search: searchTerm || undefined })
      if (res.success && res.data) setPolicies(res.data.data)
      setLoading(false)
    }
    load()
  }, [searchTerm])

  const handleDelete = async (id: string) => {
    const res = await amapiService.deletePolicy(id)
    if (res.success) {
      toast({ title: "Policy deleted", description: "Policy removed successfully", variant: "success" })
      setPolicies(prev => prev.filter(p => p.id !== id))
    } else {
      toast({ title: "Error", description: res.error || "Failed to delete policy", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Policies</h1>
          <p className="text-secondary-600 mt-1">Create and manage device policies</p>
        </div>
        <Link href="/dashboard/policies/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> New Policy
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
        <Input placeholder="Search policies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-secondary-200 animate-pulse h-36" />
          ))
        ) : policies.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-white border border-secondary-200 rounded-xl">
            <Shield className="w-10 h-10 text-secondary-400 mx-auto mb-3" />
            <p className="text-secondary-600">No policies found.</p>
          </div>
        ) : (
          policies.map((policy) => (
            <div key={policy.id} className="bg-white rounded-xl p-6 border border-secondary-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">{policy.name}</h3>
                  <p className="text-sm text-secondary-600 mt-1 line-clamp-2">{policy.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${policy.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-secondary-100 text-secondary-800 border-secondary-200'}`}>
                  {policy.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Link href={`/dashboard/policies/${policy.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-accent-600 hover:text-accent-700 hover:bg-accent-50" onClick={() => handleDelete(policy.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* No modal; creation and editing moved to dedicated pages */}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="bg-white rounded-xl border border-secondary-200">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3">
        <p className="text-sm font-semibold text-secondary-900">{title}</p>
        {open ? <ChevronUp className="w-4 h-4 text-secondary-500" /> : <ChevronDown className="w-4 h-4 text-secondary-500" />}
      </button>
      {open && <div className="p-4 border-t border-secondary-200">{children}</div>}
    </div>
  )
}

function ToggleRow({ label, checked, onChange, children }: { label: string; checked: boolean; onChange: (v: boolean) => void; children?: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <input id={label} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
        <label htmlFor={label} className="text-sm text-secondary-700">{label}</label>
      </div>
      {checked && children}
    </div>
  )
}

function CheckboxGrid({ items }: { items: { label: string; checked: boolean; onChange: (v: boolean) => void }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((it) => (
        <label key={it.label} className="flex items-center gap-3 text-sm text-secondary-700">
          <input type="checkbox" checked={it.checked} onChange={(e) => it.onChange(e.target.checked)} className="h-4 w-4" />
          {it.label}
        </label>
      ))}
    </div>
  )
}

