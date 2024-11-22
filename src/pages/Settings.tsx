import React from 'react';
import { Store, Bell, Lock, CreditCard, Globe } from 'lucide-react';

export default function Settings() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-text-secondary">Manage your account and application preferences</p>
      </div>

      <div className="space-y-6">
        {/* Business Profile */}
        <div className="bg-card rounded-xl border border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Store className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-white">Business Profile</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Business Name
              </label>
              <input
                type="text"
                defaultValue="Luxury Perfumes Kenya"
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Business Email
              </label>
              <input
                type="email"
                defaultValue="contact@luxuryperfumes.co.ke"
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue="+254712345678"
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Business Address
              </label>
              <input
                type="text"
                defaultValue="Westlands, Nairobi"
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-xl border border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Order Notifications</p>
                <p className="text-sm text-text-secondary">Receive notifications for new orders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Low Stock Alerts</p>
                <p className="text-sm text-text-secondary">Get notified when products are running low</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card rounded-xl border border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-white">Security</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                placeholder="Enter new password"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-card rounded-xl border border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-white">Payment Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                M-Pesa Till Number
              </label>
              <input
                type="text"
                defaultValue="123456"
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* System Preferences */}
        <div className="bg-card rounded-xl border border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-white">System Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Time Zone
              </label>
              <select className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary">
                <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Currency
              </label>
              <select className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary">
                <option value="KES">Kenyan Shilling (KES)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}