"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-simple-toast"
import { amapiService } from "@/services/amapi.service"
import { Device, PaginatedResponse } from "@/types"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Smartphone,
  Battery,
  Wifi,
  Shield,
  QrCode,
  Key,
  Monitor,
  Cpu,
  HardDrive,
  MemoryStick,
  Info,
  Eye,
  EyeOff,
  X,
  Check,
  AlertCircle
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
  storageTotal?: number
  storageUsed?: number
  storageFree?: number
  enrollmentToken?: string
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<EnhancedDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [editingDevice, setEditingDevice] = useState<EnhancedDevice | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<EnhancedDevice | null>(null)
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({})
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const { toast } = useToast()

  // Mock data with enhanced device information
  const mockDevices: EnhancedDevice[] = [
    {
      id: "1",
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
      storageFree: 64,
      enrollmentToken: "ENR-ABC123XYZ"
    },
    {
      id: "2",
      name: "Google Pixel 8 Pro",
      model: "G1MNW",
      serialNumber: "1A2B3C4D5E",
      status: "inactive",
      osVersion: "Android 14",
      lastSync: new Date("2024-01-10T15:45:00Z"),
      batteryLevel: 42,
      storageUsed: 89,
      storageTotal: 256,
      enterpriseId: "ent-1",
      userId: "user-2",
      createdAt: new Date("2024-01-05T00:00:00Z"),
      updatedAt: new Date("2024-01-10T15:45:00Z"),
      imei: "987654321098765",
      macId: "11:22:33:44:55:66",
      ipAddress: "192.168.1.101",
      hostName: "pixel-8-pro-002",
      groupName: "Engineering Team",
      workProfile: "Development Profile",
      mode: "COPE",
      osName: "Android 14",
      kernelVersion: "5.15.74-android14-9-gd1b4b4c",
      imageBuildNo: "UP1A.231005.007",
      deviceModel: "Google Pixel 8 Pro",
      processor: "Google Tensor G3",
      ramTotal: 12,
      ramAvailable: 5.8,
      // storageTotal: 256,
      // storageUsed: 89,
      storageFree: 167,
      enrollmentToken: "ENR-DEF456UVW"
    }
  ]

  useEffect(() => {
    fetchDevices()
  }, [pagination.page, searchTerm])

  const fetchDevices = async () => {
    setLoading(true)
    try {
      // Use mock data for now
      await new Promise(resolve => setTimeout(resolve, 500))
      let filteredDevices = mockDevices
      
      if (searchTerm) {
        filteredDevices = mockDevices.filter(d => 
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.imei?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.hostName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      setDevices(filteredDevices)
      setPagination(prev => ({
        ...prev,
        total: filteredDevices.length,
        totalPages: Math.ceil(filteredDevices.length / prev.limit)
      }))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch devices. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (deviceId: string) => {
    if (!confirm("Are you sure you want to delete this device?")) {
      return
    }

    try {
      // Mock delete operation
      await new Promise(resolve => setTimeout(resolve, 500))
      setDevices(prev => prev.filter(d => d.id !== deviceId))
      toast({
        title: "Device deleted",
        description: "The device has been successfully deleted.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete device.",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: Device["status"]) => {
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

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "BYOD":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "COBO":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "COPE":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const toggleDeviceDetails = (deviceId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [deviceId]: !prev[deviceId]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Device Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage Android devices, enrollment tokens, and device policies
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowQRModal(true)}
            className="hover:bg-green-50 hover:text-green-600 hover:border-green-200"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Scan QR
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Register Device
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search by name, model, IMEI, or hostname..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Devices List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-slate-600 mt-2">Loading devices...</p>
          </div>
        ) : devices.length === 0 ? (
          <div className="p-8 text-center">
            <Smartphone className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No devices found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm ? "No devices match your search criteria." : "Get started by registering your first device."}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Register Device
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {devices.map((device) => (
              <div key={device.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <button
                        onClick={() => window.open(`/dashboard/devices/${device.id}`, '_blank')}
                        className="text-lg font-semibold text-slate-900 hover:text-primary-600 transition-colors text-left"
                      >
                        {device.name}
                      </button>
                      <p className="text-sm text-slate-600">{device.model} • {device.serialNumber}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium border",
                          getStatusColor(device.status)
                        )}>
                          {device.status}
                        </span>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium border",
                          getModeColor(device.mode || "BYOD")
                        )}>
                          {device.mode || "BYOD"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Battery</p>
                      <div className="flex items-center gap-2">
                        <Battery className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">
                          {device.batteryLevel || 0}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Last Sync</p>
                      <p className="text-sm font-medium text-slate-900">
                        {device.lastSync 
                          ? new Date(device.lastSync).toLocaleDateString()
                          : "Never"
                        }
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/dashboard/devices/${device.id}`, '_blank')}
                      className="hover:bg-primary-50 hover:text-primary-600"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingDevice(device)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(device.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Detailed Information */}
                {showDetails[device.id] && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-slate-50/50 rounded-xl">
                    {/* Device Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Device Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">IMEI:</span>
                          <span className="font-medium">{device.imei}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">MAC ID:</span>
                          <span className="font-medium">{device.macId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">IP Address:</span>
                          <span className="font-medium">{device.ipAddress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Host Name:</span>
                          <span className="font-medium">{device.hostName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Group:</span>
                          <span className="font-medium">{device.groupName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Work Profile:</span>
                          <span className="font-medium">{device.workProfile}</span>
                        </div>
                      </div>
                    </div>

                    {/* System Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        System Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">OS Name:</span>
                          <span className="font-medium">{device.osName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Kernel Version:</span>
                          <span className="font-medium font-mono text-xs">{device.kernelVersion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Build No:</span>
                          <span className="font-medium font-mono text-xs">{device.imageBuildNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Connectivity:</span>
                          <div className="flex items-center gap-1">
                            <Wifi className="w-3 h-3 text-green-500" />
                            <span className="font-medium text-green-600">Connected</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hardware Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        Hardware Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Processor:</span>
                          <span className="font-medium">{device.processor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">RAM:</span>
                          <span className="font-medium">
                            {device.ramAvailable?.toFixed(1)}GB / {device.ramTotal}GB
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Storage:</span>
                          <span className="font-medium">
                            {device.storageUsed}GB / {device.storageTotal}GB
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Free Space:</span>
                          <span className="font-medium">{device.storageFree}GB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Enrollment Token:</span>
                          <span className="font-medium font-mono text-xs">{device.enrollmentToken}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Register Device Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Register New Device</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateModal(false)}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Device Name</label>
                    <Input placeholder="Enter device name" className="bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Model</label>
                    <Input placeholder="Enter device model" className="bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Serial Number</label>
                    <Input placeholder="Enter serial number" className="bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">IMEI</label>
                    <Input placeholder="Enter IMEI number" className="bg-white" />
                  </div>
                </div>
              </div>

              {/* Work Profile & Mode */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Work Profile & Mode</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Work Profile</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option>Corporate Profile</option>
                      <option>Development Profile</option>
                      <option>Sales Profile</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mode</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="BYOD">BYOD (Bring Your Own Device)</option>
                      <option value="COBO">COBO (Corporate Owned, Business Only)</option>
                      <option value="COPE">COPE (Corporate Owned, Personally Enabled)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Enrollment Token */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Enrollment Token</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="flex-1">
                      <QrCode className="w-4 h-4 mr-2" />
                      Scan QR Code
                    </Button>
                    <span className="text-slate-500">or</span>
                    <Button variant="outline" className="flex-1">
                      <Key className="w-4 h-4 mr-2" />
                      Input Token
                    </Button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Enrollment Token</label>
                    <Input placeholder="Enter enrollment token" className="bg-white" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Device registered",
                      description: "Device has been successfully registered.",
                      variant: "success"
                    })
                    setShowCreateModal(false)
                  }}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Register Device
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Scanner Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Scan QR Code</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQRModal(false)}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-64 h-64 bg-slate-100 rounded-xl flex items-center justify-center mx-auto">
                <QrCode className="w-16 h-16 text-slate-400" />
              </div>
              <p className="text-slate-600">Position the QR code within the frame</p>
              <Button
                onClick={() => {
                  toast({
                    title: "QR Code scanned",
                    description: "Device enrollment token has been captured.",
                    variant: "success"
                  })
                  setShowQRModal(false)
                }}
                className="w-full"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm Scan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}