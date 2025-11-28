'use client';

import { useState, useEffect } from 'react';
import { 
  Tablet, Plus, Trash2, Copy, Check, RefreshCw, 
  AlertCircle, Clock, User, Wifi, WifiOff 
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  childId: string;
  childName: string;
  lastUsed: string | null;
  createdAt: string;
  tokenPreview: string;
}

interface Child {
  id: string;
  name: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    childId: '',
    name: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch devices
      const devicesRes = await fetch('/api/device/register');
      if (devicesRes.ok) {
        const data = await devicesRes.json();
        setDevices(data.devices || []);
      }

      // Fetch children for the dropdown
      const childrenRes = await fetch('/api/children'); // You may need to create this endpoint
      if (childrenRes.ok) {
        const data = await childrenRes.json();
        setChildren(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.childId || !formData.name) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/device/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setNewToken(data.token);
        fetchData();
        setFormData({ childId: '', name: '' });
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to register device');
      }
    } catch (error) {
      alert('Failed to register device');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm('Are you sure? This device will no longer be able to track reading.')) return;

    try {
      const res = await fetch(`/api/device/register?id=${deviceId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to revoke device');
      }
    } catch (error) {
      alert('Failed to revoke device');
    }
  };

  const copyToken = async (token: string) => {
    await navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const isRecentlyActive = (lastUsed: string | null) => {
    if (!lastUsed) return false;
    const lastUsedDate = new Date(lastUsed);
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return lastUsedDate > hourAgo;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Tablet className="w-8 h-8 text-purple-500" />
            Device Management
          </h1>
          <p className="text-gray-600 mt-1">
            Connect reMarkable tablets and other e-readers to track reading automatically
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Add Device
        </button>
      </div>

      {/* New Token Display */}
      {newToken && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-emerald-900 text-lg">Device Registered!</h3>
              <p className="text-emerald-700 text-sm mb-4">
                Copy this token and paste it into your reMarkable script. 
                <strong> This is the only time you'll see the full token!</strong>
              </p>
              
              <div className="bg-white border border-emerald-200 rounded-xl p-4">
                <label className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2 block">
                  Device Token
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-50 px-4 py-3 rounded-lg text-sm font-mono text-gray-900 break-all">
                    {newToken}
                  </code>
                  <button
                    onClick={() => copyToken(newToken)}
                    className="p-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex-shrink-0"
                  >
                    {copiedToken ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setNewToken(null)}
                className="mt-4 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                I've saved the token - close this
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Device Form */}
      {showAddForm && !newToken && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Register New Device</h2>
          <form onSubmit={handleAddDevice} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Child
              </label>
              <select
                value={formData.childId}
                onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose a child...</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Device Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Sarah's reMarkable"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? 'Registering...' : 'Register Device'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Devices List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading devices...</p>
        </div>
      ) : devices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isRecentlyActive(device.lastUsed)
                      ? 'bg-emerald-100'
                      : 'bg-gray-100'
                  }`}>
                    <Tablet className={`w-6 h-6 ${
                      isRecentlyActive(device.lastUsed)
                        ? 'text-emerald-600'
                        : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{device.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {device.childName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteDevice(device.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="flex items-center gap-1">
                    {isRecentlyActive(device.lastUsed) ? (
                      <Wifi className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <WifiOff className="w-4 h-4" />
                    )}
                    Last active
                  </span>
                  <span className={isRecentlyActive(device.lastUsed) ? 'text-emerald-600 font-medium' : ''}>
                    {formatDate(device.lastUsed)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>Token</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {device.tokenPreview}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tablet className="w-10 h-10 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Devices Connected</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Connect your child's reMarkable tablet to automatically track their reading sessions and award points.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add First Device
          </button>
        </div>
      )}

      {/* Setup Instructions */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100/50">
        <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-purple-500" />
          How to Set Up Your reMarkable
        </h3>
        <ol className="space-y-3 text-sm text-purple-800">
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
            <span>Register the device above to get a unique token</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
            <span>SSH into your reMarkable: <code className="bg-white/50 px-2 py-0.5 rounded">ssh root@remarkable</code></span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
            <span>Download and install the BookHoot script (see documentation)</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">4</span>
            <span>Paste your device token into the script configuration</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">5</span>
            <span>Reading sessions will now be tracked automatically! 🎉</span>
          </li>
        </ol>
        
        <a
          href="/docs/remarkable-setup"
          className="inline-flex items-center gap-2 mt-4 text-purple-600 hover:text-purple-700 font-medium text-sm"
        >
          View Full Setup Guide →
        </a>
      </div>
    </div>
  );
}