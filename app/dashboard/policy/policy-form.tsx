"use client"

import { useEffect, useMemo, useState } from "react"
import { amapiService } from "@/services/amapi.service"
import { Policy, PolicyRule } from "@/types"
import { useToast } from "@/hooks/use-simple-toast"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { ChevronDown, ChevronUp, Shield } from "lucide-react"

type Mode = "create" | "edit"

export default function PoliciesForm({ mode, policyId }: { mode: Mode; policyId?: string }) {
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formActive, setFormActive] = useState(true)

  const [appControl, setAppControl] = useState({
    whitelistEnabled: false,
    whitelist: "",
    blacklistEnabled: false,
    blacklist: "",
    forceInstallEnabled: false,
    forceInstallApps: "",
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
    biometrics: { fingerprint: false, facial: false, voice: false, iris: false },
  })
  const [networkSettings, setNetworkSettings] = useState({
    wifiProfiles: "",
    restrictMobileData: false,
    requireVPN: false,
    apn: "",
  })
  const [inactivityLock, setInactivityLock] = useState({ autoLockEnabled: false, inactivityMinutes: 0 })

  // hydrate for edit
  useEffect(() => {
    const load = async () => {
      if (mode === "edit" && policyId) {
        const res = await amapiService.getPolicyById(policyId)
        if (res.success && res.data) {
          const p = res.data
          setFormName(p.name)
          setFormDescription(p.description)
          setFormActive(p.isActive)
          p.rules.forEach((r) => {
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
        }
      }
    }
    load()
  }, [mode, policyId])

  const buildRules = useMemo<PolicyRule[]>(() => {
    const rules: PolicyRule[] = []
    if (appControl.whitelistEnabled) rules.push({ id: "rule-whitelist", name: "App Whitelist", type: "app_whitelist", value: appControl.whitelist.split(/\s*,\s*/).filter(Boolean), description: "Only allow specific apps" })
    if (appControl.blacklistEnabled) rules.push({ id: "rule-blacklist", name: "App Blacklist", type: "app_blacklist", value: appControl.blacklist.split(/\s*,\s*/).filter(Boolean), description: "Block unwanted apps" })
    if (appControl.forceInstallEnabled) rules.push({ id: "rule-force-install", name: "Force Install", type: "force_install", value: appControl.forceInstallApps.split(/\s*,\s*/).filter(Boolean), description: "Push required apps" })
    if (appControl.forceUninstallEnabled) rules.push({ id: "rule-force-uninstall", name: "Force Uninstall", type: "force_uninstall", value: appControl.forceUninstallApps.split(/\s*,\s*/).filter(Boolean), description: "Remove non-compliant apps" })
    if (featureRestrictions.controlHardware) rules.push({ id: "rule-control-hw", name: "Control Hardware", type: "control_hardware", value: true, description: "Control device hardware and features" })
    if (featureRestrictions.disableCamera) rules.push({ id: "rule-camera", name: "Disable Camera", type: "disable_camera", value: true, description: "Disable camera" })
    if (featureRestrictions.disableBluetooth) rules.push({ id: "rule-bluetooth", name: "Disable Bluetooth", type: "disable_bluetooth", value: true, description: "Disable Bluetooth" })
    if (featureRestrictions.disableUSB) rules.push({ id: "rule-usb", name: "Disable USB", type: "disable_usb", value: true, description: "Disable USB" })
    if (featureRestrictions.disableScreenCapture) rules.push({ id: "rule-screencap", name: "Disable Screen Capture", type: "disable_screen_capture", value: true, description: "Disable screen capture or printing" })
    if (securityPolicies.requirePassword) rules.push({ id: "rule-password", name: "Password Policy", type: "password_policy", value: { minLength: securityPolicies.minLength, requireSpecial: securityPolicies.requireSpecial, expirationDays: securityPolicies.expirationDays }, description: "Password complexity" })
    if (securityPolicies.screenLockTimeoutMinutes > 0) rules.push({ id: "rule-screenlock", name: "Screen Lock Timeout", type: "screen_lock_timeout", value: securityPolicies.screenLockTimeoutMinutes, description: "Auto screen lock" })
    if (securityPolicies.requireEncryption) rules.push({ id: "rule-encryption", name: "Storage Encryption", type: "require_encryption", value: true, description: "Require device storage encryption" })
    const bio = securityPolicies.biometrics
    if (bio.fingerprint || bio.facial || bio.voice || bio.iris) rules.push({ id: "rule-biometrics", name: "Biometric Auth", type: "biometric_methods", value: Object.entries(bio).filter(([, v]) => v).map(([k]) => k), description: "Required biometric methods" })
    if (networkSettings.wifiProfiles.trim()) rules.push({ id: "rule-wifi", name: "Wi‑Fi Profiles", type: "wifi_profiles", value: networkSettings.wifiProfiles.split(/\n+/).map((l) => l.trim()).filter(Boolean), description: "Pre-configured Wi‑Fi profiles" })
    if (networkSettings.restrictMobileData) rules.push({ id: "rule-mobile-data", name: "Restrict Mobile Data", type: "restrict_mobile_data", value: true, description: "Restrict mobile data usage" })
    if (networkSettings.requireVPN) rules.push({ id: "rule-vpn", name: "Require VPN", type: "require_vpn", value: true, description: "Force use of corporate VPN" })
    if (networkSettings.apn.trim()) rules.push({ id: "rule-apn", name: "APN Settings", type: "apn_settings", value: networkSettings.apn.trim(), description: "APN config" })
    if (inactivityLock.autoLockEnabled) rules.push({ id: "rule-inactivity", name: "Inactivity Lock", type: "inactivity_lock", value: inactivityLock.inactivityMinutes, description: "Auto-lock after inactivity" })
    return rules
  }, [appControl, featureRestrictions, securityPolicies, networkSettings, inactivityLock])

  const handleSubmit = async () => {
    if (!formName.trim()) {
      toast({ title: "Name required", description: "Please enter a policy name.", variant: "destructive" })
      return
    }
    setLoading(true)
    const payload = {
      name: formName.trim(),
      description: formDescription.trim(),
      type: "security" as Policy["type"],
      isActive: formActive,
      rules: buildRules,
      appliedDevices: [],
    }
    const res = mode === "edit" && policyId
      ? await amapiService.updatePolicy(policyId, payload)
      : await amapiService.createPolicy(payload)
    setLoading(false)
    if (res.success) {
      toast({ title: mode === "edit" ? "Policy updated" : "Policy created", description: "Policy saved successfully", variant: "success" })
    } else {
      toast({ title: "Error", description: res.error || "Failed to save policy", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary-600" />
            {mode === "edit" ? "Edit Policy" : "Create Policy"}
          </h1>
          <p className="text-secondary-600 mt-1">Define device policy configuration</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : (mode === "edit" ? "Update" : "Create")}</Button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-secondary-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-secondary-700">Policy Name <span className="text-red-500">*</span></label>
            <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g., Corporate Security Baseline" />
          </div>
          <div className="flex items-center gap-3 mt-6 md:mt-0">
            <input id="active" type="checkbox" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} className="h-4 w-4" />
            <label htmlFor="active" className="text-sm text-secondary-700">Active</label>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-secondary-700">Description</label>
            <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Short description" />
          </div>
        </div>
      </div>

      <Section title="App Control">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleRow label="Whitelist" checked={appControl.whitelistEnabled} onChange={(v) => setAppControl(s => ({ ...s, whitelistEnabled: v }))}>
            <Input placeholder="com.company.app, com.vpn.client" value={appControl.whitelist} onChange={(e) => setAppControl(s => ({ ...s, whitelist: e.target.value }))} />
          </ToggleRow>
          <ToggleRow label="Blacklist" checked={appControl.blacklistEnabled} onChange={(v) => setAppControl(s => ({ ...s, blacklistEnabled: v }))}>
            <Input placeholder="com.games.blocked, com.social.app" value={appControl.blacklist} onChange={(e) => setAppControl(s => ({ ...s, blacklist: e.target.value }))} />
          </ToggleRow>
          <ToggleRow label="Force Install" checked={appControl.forceInstallEnabled} onChange={(v) => setAppControl(s => ({ ...s, forceInstallEnabled: v }))}>
            <Input placeholder="email, vpn, crm (package names)" value={appControl.forceInstallApps} onChange={(e) => setAppControl(s => ({ ...s, forceInstallApps: e.target.value }))} />
          </ToggleRow>
          <ToggleRow label="Force Uninstall" checked={appControl.forceUninstallEnabled} onChange={(v) => setAppControl(s => ({ ...s, forceUninstallEnabled: v }))}>
            <Input placeholder="malware.app, noncompliant.app" value={appControl.forceUninstallApps} onChange={(e) => setAppControl(s => ({ ...s, forceUninstallApps: e.target.value }))} />
          </ToggleRow>
        </div>
      </Section>

      <Section title="Feature Restrictions">
        <CheckboxGrid items={[
          { label: "Control device hardware and features", checked: featureRestrictions.controlHardware, onChange: (v: boolean) => setFeatureRestrictions(s => ({ ...s, controlHardware: v })) },
          { label: "Disable camera (for high-security sites)", checked: featureRestrictions.disableCamera, onChange: (v: boolean) => setFeatureRestrictions(s => ({ ...s, disableCamera: v })) },
          { label: "Disable Bluetooth (to prevent data leaks)", checked: featureRestrictions.disableBluetooth, onChange: (v: boolean) => setFeatureRestrictions(s => ({ ...s, disableBluetooth: v })) },
          { label: "Disable USB (to stop data transfer)", checked: featureRestrictions.disableUSB, onChange: (v: boolean) => setFeatureRestrictions(s => ({ ...s, disableUSB: v })) },
          { label: "Disable screen capture or printing", checked: featureRestrictions.disableScreenCapture, onChange: (v: boolean) => setFeatureRestrictions(s => ({ ...s, disableScreenCapture: v })) },
        ]} />
      </Section>

      <Section title="Security Policies">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input id="requirePassword" type="checkbox" checked={securityPolicies.requirePassword} onChange={(e) => setSecurityPolicies(s => ({ ...s, requirePassword: e.target.checked }))} className="h-4 w-4" />
            <label htmlFor="requirePassword" className="text-sm text-secondary-700">Enforce password/PIN complexity</label>
          </div>
          {securityPolicies.requirePassword && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-secondary-700">Min length</label>
                <Input type="number" min={4} value={securityPolicies.minLength} onChange={(e) => setSecurityPolicies(s => ({ ...s, minLength: Number(e.target.value) }))} />
              </div>
              <div className="flex items-center gap-3 mt-6 md:mt-0">
                <input id="requireSpecial" type="checkbox" checked={securityPolicies.requireSpecial} onChange={(e) => setSecurityPolicies(s => ({ ...s, requireSpecial: e.target.checked }))} className="h-4 w-4" />
                <label htmlFor="requireSpecial" className="text-sm text-secondary-700">Require special characters</label>
              </div>
              <div>
                <label className="text-sm font-medium text-secondary-700">Expiration (days)</label>
                <Input type="number" min={0} value={securityPolicies.expirationDays} onChange={(e) => setSecurityPolicies(s => ({ ...s, expirationDays: Number(e.target.value) }))} />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-secondary-700">Screen lock timeout (minutes)</label>
            <Input type="number" min={0} value={securityPolicies.screenLockTimeoutMinutes} onChange={(e) => setSecurityPolicies(s => ({ ...s, screenLockTimeoutMinutes: Number(e.target.value) }))} />
          </div>

          <div className="flex items-center gap-3">
            <input id="requireEncryption" type="checkbox" checked={securityPolicies.requireEncryption} onChange={(e) => setSecurityPolicies(s => ({ ...s, requireEncryption: e.target.checked }))} className="h-4 w-4" />
            <label htmlFor="requireEncryption" className="text-sm text-secondary-700">Require encryption for device storage</label>
          </div>

          <div>
            <p className="text-sm font-medium text-secondary-700 mb-2">Mandate biometric authentication methods</p>
            <CheckboxGrid items={[
              { label: "fingerprint", checked: securityPolicies.biometrics.fingerprint, onChange: (v: boolean) => setSecurityPolicies(s => ({ ...s, biometrics: { ...s.biometrics, fingerprint: v } })) },
              { label: "facial recognition", checked: securityPolicies.biometrics.facial, onChange: (v: boolean) => setSecurityPolicies(s => ({ ...s, biometrics: { ...s.biometrics, facial: v } })) },
              { label: "voice recognition", checked: securityPolicies.biometrics.voice, onChange: (v: boolean) => setSecurityPolicies(s => ({ ...s, biometrics: { ...s.biometrics, voice: v } })) },
              { label: "iris scan", checked: securityPolicies.biometrics.iris, onChange: (v: boolean) => setSecurityPolicies(s => ({ ...s, biometrics: { ...s.biometrics, iris: v } })) },
            ]} />
          </div>
        </div>
      </Section>

      <Section title="Network Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-secondary-700">Wi‑Fi profiles (one per line as SSID:password)</label>
            <textarea className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-800" rows={4} value={networkSettings.wifiProfiles} onChange={(e) => setNetworkSettings(s => ({ ...s, wifiProfiles: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium text-secondary-700">APN settings</label>
            <Input placeholder="apn=user, mmsc=..., proxy=..." value={networkSettings.apn} onChange={(e) => setNetworkSettings(s => ({ ...s, apn: e.target.value }))} />
          </div>
          <div className="flex items-center gap-3">
            <input id="restrictMobileData" type="checkbox" checked={networkSettings.restrictMobileData} onChange={(e) => setNetworkSettings(s => ({ ...s, restrictMobileData: e.target.checked }))} className="h-4 w-4" />
            <label htmlFor="restrictMobileData" className="text-sm text-secondary-700">Restrict mobile data usage</label>
          </div>
          <div className="flex items-center gap-3">
            <input id="requireVPN" type="checkbox" checked={networkSettings.requireVPN} onChange={(e) => setNetworkSettings(s => ({ ...s, requireVPN: e.target.checked }))} className="h-4 w-4" />
            <label htmlFor="requireVPN" className="text-sm text-secondary-700">Force use of corporate VPN</label>
          </div>
        </div>
      </Section>

      <Section title="Inactivity Lock">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <input id="autoLockEnabled" type="checkbox" checked={inactivityLock.autoLockEnabled} onChange={(e) => setInactivityLock(s => ({ ...s, autoLockEnabled: e.target.checked }))} className="h-4 w-4" />
            <label htmlFor="autoLockEnabled" className="text-sm text-secondary-700">Enable inactivity auto‑lock</label>
          </div>
          <div>
            <label className="text-sm font-medium text-secondary-700">Inactivity minutes</label>
            <Input type="number" min={0} value={inactivityLock.inactivityMinutes} onChange={(e) => setInactivityLock(s => ({ ...s, inactivityMinutes: Number(e.target.value) }))} />
          </div>
        </div>
        <p className="text-xs text-secondary-500 mt-2">Reduces risk if the device is left unattended.</p>
      </Section>

      <div className="flex items-center justify-end gap-3">
        <Button onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : (mode === "edit" ? "Update Policy" : "Create Policy")}</Button>
      </div>
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


