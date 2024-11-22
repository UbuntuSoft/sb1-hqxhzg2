import React from 'react';
import { X } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerModal({ isOpen, onClose }: CustomerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Add New Customer</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Status
              </label>
              <select className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Notes
            </label>
            <textarea
              className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary h-24 resize-none"
              placeholder="Add any additional notes about the customer..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-white border border-gray-800 rounded-lg hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
            >
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}