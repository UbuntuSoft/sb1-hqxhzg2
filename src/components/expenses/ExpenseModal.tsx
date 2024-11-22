import React from 'react';
import { X, Upload } from 'lucide-react';
import { useExpenseStore } from '../../store/expenseStore';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpenseModal({ isOpen, onClose }: ExpenseModalProps) {
  const createExpense = useExpenseStore(state => state.createExpense);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      await createExpense({
        date: formData.get('date') as string,
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        amount: Number(formData.get('amount')),
        payment_method: formData.get('paymentMethod') as string,
        reference: formData.get('reference') as string,
        status: 'pending',
        user_id: 'current-user-id' // This should come from auth context
      });
      onClose();
    } catch (error) {
      console.error('Failed to create expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-card">
          <h2 className="text-xl font-semibold text-white">Record New Expense</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                required
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Category
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary"
              >
                <option value="">Select category</option>
                <option value="Inventory">Inventory</option>
                <option value="Marketing">Marketing</option>
                <option value="Utilities">Utilities</option>
                <option value="Rent">Rent</option>
                <option value="Delivery">Delivery</option>
                <option value="Salaries">Salaries</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Amount (KES)
              </label>
              <input
                type="number"
                name="amount"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                required
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary"
              >
                <option value="">Select payment method</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Reference Number
              </label>
              <input
                type="text"
                name="reference"
                required
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                placeholder="Enter reference number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Description
            </label>
            <textarea
              name="description"
              required
              className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary h-24 resize-none"
              placeholder="Enter expense description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-800 rounded-lg p-4 text-center">
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-text-secondary mb-2" />
                <p className="text-sm text-text-secondary">
                  Drag and drop files here, or click to select files
                </p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept="image/*,.pdf"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-white border border-gray-800 rounded-lg hover:bg-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Recording...' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}