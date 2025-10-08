"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-simple-toast"
import { amapiService } from "@/services/amapi.service"
import { Device } from "@/types"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Smartphone,
  Battery,
  Wifi,
  Shield,
  Monitor,
  Cpu,
  HardDrive,
  MemoryStick,
  Info,
  Settings,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Building,
  Key,
  QrCode
} from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced Device type with all required fields
interface EnhancedDevice extends Device {
  imei?: string
  macId?: string
  ipAddress?: string
  hostName?: string
  groupName?: string
  workProfile?: string
  mode?: "BYOD" | "COBO" | "COPE"
  osName?: string
  kernelVersion?: string
  imageBuildNo?: string
  deviceModel?: string
  processor?: string
  ramTotal?: number
  ramAvailable?: number
  storageFree?: number
  enrollmentToken?: string
  location?: string
  lastLocationUpdate?: Date
  securityPatchLevel?: string
  googlePlayServicesVersion?: string
  installedApps?: number
  complianceStatus?: "compliant" | "non_compliant" | "unknown"
}

export default function DeviceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [device, setDevice] = useState<EnhancedDevice | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock device data
  const mockDevice: EnhancedDevice = {
    id: params.id as string,
    name: "Samsung Galaxy S24",
    model: "SM-S921B",
    serialNumber: "R58M123ABC",
    status: "active",
    osVersion: "Android 14",
    lastSync: new Date("2024-01-15T10:30:00Z"),
    batteryLevel: 85,
    storageUsed: 64,
    storageTotal: 128,
    enterpriseId: "ent-1",
    userId: "user-1",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z"),
    imei: "123456789012345",
    macId: "AA:BB:CC:DD:EE:FF",
    ipAddress: "192.168.1.100",
    hostName: "galaxy-s24-001",
    groupName: "Sales Team",
    workProfile: "Corporate Profile",
    mode: "BYOD",
    osName: "Android 14",
    kernelVersion: "5.15.74-android14-9-gd1b4b4c",
    imageBuildNo: "UP1A.231005.007",
    deviceModel: "Samsung Galaxy S24",
    processor: "Snapdragon 8 Gen 3",
    ramTotal: 8,
    ramAvailable: 3.2,
    storageTotal: 128,
    storageUsed: 64,
    storageFree: 64,
    enrollmentToken: "ENR-ABC123XYZ",
    location: "Seoul, South Korea",
    lastLocationUpdate: new Date("2024-01-15T09:45:00Z"),
    securityPatchLevel: "2024-01-05",
    googlePlayServicesVersion: "24.02.13",
    installedApps: 45,
    complianceStatus: "compliant"
  }

  useEffect(() => {
    fetchDevice()
  }, [params.id])

  const fetchDevice = async () => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setDevice(mockDevice)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch device details.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      toast({
        title: "Device deleted",
        description: "The device has been successfully deleted.",
        variant: "success"
      })
      router.push("/dashboard/devices")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete device.",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800 border-green-200"
      case "non_compliant":
        return "bg-red-100 text-red-800 border-red-200"
      case "unknown":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: Info },
    { id: "hardware", name: "Hardware", icon: Cpu },
    { id: "system", name: "System", icon: Monitor },
    { id: "security", name: "Security", icon: Shield },
    { id: "apps", name: "Applications", icon: Smartphone },
    { id: "location", name: "Location", icon: MapPin }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!device) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Device not found</h2>
        <p className="text-slate-600 mb-4">The device you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/dashboard/devices")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Devices
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/devices")}
            className="hover:bg-primary-50 hover:text-primary-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Devices
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {device.name}
            </h1>
            <p className="text-slate-600 mt-1">
              {device.model} • {device.serialNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowEditModal(true)}
            className="hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Device
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowDeleteModal(true)}
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Device
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium border",
              getStatusColor(device.status)
            )}>
              {device.status}
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 mb-1">Online</p>
            <p className="text-sm text-slate-600">Device Status</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-blue-100">
              <Battery className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-slate-500">
              {device.batteryLevel}%
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{device.batteryLevel}%</p>
            <p className="text-sm text-slate-600">Battery Level</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-purple-100">
              <HardDrive className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-slate-500">
              {device.storageUsed}GB / {device.storageTotal}GB
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 mb-1">
              {Math.round((device.storageUsed / device.storageTotal) * 100)}%
            </p>
            <p className="text-sm text-slate-600">Storage Used</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-orange-100">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium border",
              getComplianceColor(device.complianceStatus || "unknown")
            )}>
              {device.complianceStatus || "unknown"}
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 mb-1">Secure</p>
            <p className="text-sm text-slate-600">Compliance</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Device Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Device Name:</span>
                      <span className="font-medium text-slate-800">{device.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Model:</span>
                      <span className="font-medium text-slate-800">{device.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Serial Number:</span>
                      <span className="font-medium font-mono text-slate-800">{device.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">IMEI:</span>
                      <span className="font-medium font-mono text-slate-800">{device.imei}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">MAC ID:</span>
                      <span className="font-medium font-mono text-slate-800">{device.macId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">IP Address:</span>
                      <span className="font-medium font-mono text-slate-800">{device.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Host Name:</span>
                      <span className="font-medium text-slate-800">{device.hostName}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Management</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Group:</span>
                      <span className="font-medium text-slate-800">{device.groupName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Work Profile:</span>
                      <span className="font-medium text-slate-800">{device.workProfile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Mode:</span>
                      <span className="font-medium text-slate-800">{device.mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Enrollment Token:</span>
                      <span className="font-medium font-mono text-slate-800 text-xs">{device.enrollmentToken}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Connectivity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wifi className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-600">WiFi Connection</span>
                      </div>
                      <span className="text-green-600 font-medium">Connected</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-slate-600">Mobile Data</span>
                      </div>
                      <span className="text-blue-600 font-medium">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-slate-600">VPN</span>
                      </div>
                      <span className="text-purple-600 font-medium">Connected</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Last Activity</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Sync:</span>
                      <span className="font-medium text-slate-800">
                        {device.lastSync ? new Date(device.lastSync).toLocaleString() : "Never"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Location Update:</span>
                      <span className="font-medium text-slate-800">
                        {device.lastLocationUpdate ? new Date(device.lastLocationUpdate).toLocaleString() : "Never"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Registered:</span>
                      <span className="font-medium text-slate-800">
                        {new Date(device.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hardware Tab */}
          {activeTab === "hardware" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    Processor
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-900">{device.processor}</p>
                    <p className="text-sm text-slate-600 mt-1">8-core processor with AI acceleration</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <MemoryStick className="w-5 h-5" />
                    Memory
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Total RAM:</span>
                      <span className="font-medium text-slate-800">{device.ramTotal}GB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Available RAM:</span>
                      <span className="font-medium text-slate-800">{device.ramAvailable?.toFixed(1)}GB</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${((device.ramTotal - (device.ramAvailable || 0)) / device.ramTotal) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <HardDrive className="w-5 h-5" />
                    Storage
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Total Storage:</span>
                      <span className="font-medium text-slate-800">{device.storageTotal}GB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Used Storage:</span>
                      <span className="font-medium text-slate-800">{device.storageUsed}GB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Free Storage:</span>
                      <span className="font-medium text-slate-800">{device.storageFree}GB</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(device.storageUsed / device.storageTotal) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Battery</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Battery Level:</span>
                      <span className="font-medium text-slate-800">{device.batteryLevel}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className={cn(
                          "h-3 rounded-full transition-all duration-300",
                          (device.batteryLevel || 0) > 50 ? "bg-green-500" : 
                          (device.batteryLevel || 0) > 20 ? "bg-yellow-500" : "bg-red-500"
                        )}
                        style={{ width: `${device.batteryLevel || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-slate-600">
                      {(device.batteryLevel || 0) > 50 ? "Good battery health" : 
                       (device.batteryLevel || 0) > 20 ? "Low battery" : "Critical battery level"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === "system" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Operating System</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">OS Name:</span>
                      <span className="font-medium text-slate-800">{device.osName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">OS Version:</span>
                      <span className="font-medium text-slate-800">{device.osVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Kernel Version:</span>
                      <span className="font-medium font-mono text-slate-800 text-xs">{device.kernelVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Build Number:</span>
                      <span className="font-medium font-mono text-slate-800 text-xs">{device.imageBuildNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Security Patch:</span>
                      <span className="font-medium text-slate-800">{device.securityPatchLevel}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Google Services</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Play Services:</span>
                      <span className="font-medium text-slate-800">{device.googlePlayServicesVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Installed Apps:</span>
                      <span className="font-medium text-slate-800">{device.installedApps}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">System Health</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium">System Updates</span>
                      </div>
                      <span className="text-green-600 font-medium">Up to date</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Security Patches</span>
                      </div>
                      <span className="text-green-600 font-medium">Current</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium">Storage Warning</span>
                      </div>
                      <span className="text-yellow-600 font-medium">50% used</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-600">Screen Lock</span>
                      </div>
                      <span className="text-green-600 font-medium">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-600">Device Encryption</span>
                      </div>
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-600">Unknown Sources</span>
                      </div>
                      <span className="text-green-600 font-medium">Blocked</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium text-yellow-600">Developer Options</span>
                      </div>
                      <span className="text-yellow-600 font-medium">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Compliance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Compliance Status:</span>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium border",
                        getComplianceColor(device.complianceStatus || "unknown")
                      )}>
                        {device.complianceStatus || "unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Check:</span>
                      <span className="font-medium text-slate-800">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Policy Violations:</span>
                      <span className="font-medium text-green-600">0</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Device
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Download Logs
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Remote Configuration
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === "apps" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Installed Applications</h3>
                <span className="text-sm text-slate-600">{device.installedApps} apps installed</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Gmail", version: "2024.01.15", size: "45.2 MB", status: "Work Profile" },
                  { name: "Chrome", version: "120.0.6099.210", size: "234.1 MB", status: "Personal" },
                  { name: "Slack", version: "23.12.25", size: "89.3 MB", status: "Work Profile" },
                  { name: "Teams", version: "1416/1.0.0", size: "156.7 MB", status: "Work Profile" },
                  { name: "Photos", version: "6.1.0", size: "67.8 MB", status: "System" },
                  { name: "Camera", version: "13.0.00.45", size: "23.4 MB", status: "System" }
                ].map((app, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{app.name}</h4>
                        <p className="text-sm text-slate-600">{app.version}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Size:</span>
                      <span className="font-medium text-slate-800">{app.size}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-slate-600">Profile:</span>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        app.status === "Work Profile" ? "bg-primary-100 text-primary-800" :
                        app.status === "Personal" ? "bg-blue-100 text-blue-800" :
                        "bg-slate-100 text-slate-800"
                      )}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Tab */}
          {activeTab === "location" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Location</h3>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-slate-900">{device.location}</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Last updated: {device.lastLocationUpdate ? new Date(device.lastLocationUpdate).toLocaleString() : "Never"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Location History</h3>
                <div className="space-y-3">
                  {[
                    { location: "Seoul, South Korea", time: "2024-01-15 09:45:00", accuracy: "5m" },
                    { location: "Seoul, South Korea", time: "2024-01-15 08:30:00", accuracy: "3m" },
                    { location: "Seoul, South Korea", time: "2024-01-14 18:20:00", accuracy: "8m" }
                  ].map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">{entry.location}</p>
                          <p className="text-sm text-slate-600">{entry.time}</p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-500">±{entry.accuracy}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Device Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Edit Device</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditModal(false)}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Device Name</label>
                   <Input defaultValue={device.name} className="bg-white" />
                 </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Group</label>
                  <select className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option>Sales Team</option>
                    <option>Engineering Team</option>
                    <option>Marketing Team</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Work Profile</label>
                  <select className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option>Corporate Profile</option>
                    <option>Development Profile</option>
                    <option>Sales Profile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mode</label>
                  <select className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option value="BYOD">BYOD</option>
                    <option value="COBO">COBO</option>
                    <option value="COPE">COPE</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Device updated",
                      description: "Device information has been successfully updated.",
                      variant: "success"
                    })
                    setShowEditModal(false)
                  }}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Device Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Device</h2>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete <strong>{device.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Device
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
