import React from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';

interface PaymentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  total: number;
}

export default function PaymentVerificationModal({
  isOpen,
  onClose,
  orderId,
  total
}: PaymentVerificationModalProps) {
  const { verifyPayment, loading } = useOrderStore();
  const [mpesaCode, setMpesaCode] = React.useState('');
  const [error, setError] = React.useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate M-Pesa code format (e.g., QWE123456)
    const mpesaCodeRegex = /^[A-Z]{3}\d{6,}$/;
    if (!mpesaCodeRegex.test(mpesaCode)) {
      setError('Invalid M-Pesa code format. Example: QWE123456');
      return;
    }

    try {
      await verifyPayment(orderId, mpesaCode);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to verify payment');
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setMpesaCode('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Verify Payment</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleVerify} className="p-6 space-y-6">
          <div>
            <p className="text-text-secondary mb-4">
              Please enter the M-Pesa transaction code to verify payment for order {orderId}.
            </p>
            <p className="text-white mb-4">
              Amount: <span className="font-semibold">KES {total.toLocaleString()}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              M-Pesa Transaction Code
            </label>
            <input
              type="text"
              value={mpesaCode}
              onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
              placeholder="Enter M-Pesa code (e.g., QWE123456)"
              pattern="[A-Z]{3}[0-9]{6,}"
              title="Please enter a valid M-Pesa code (e.g., QWE123456)"
              required
              maxLength={10}
            />
            {error && (
              <p className="mt-2 text-sm text-error">{error}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-white border border-gray-800 rounded-lg hover:bg-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center"
              disabled={!mpesaCode || loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Verifying...' : 'Verify Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}