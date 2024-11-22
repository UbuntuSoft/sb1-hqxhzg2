import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import FormInput from '../../components/auth/FormInput';

export default function Register() {
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    password: '',
    businessName: '',
    phone: '',
  });
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      if (!formData.fullName || !formData.email || !formData.password || !formData.businessName || !formData.phone) {
        throw new Error('All fields are required');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      const { requiresEmailConfirmation } = await signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.fullName,
          business_name: formData.businessName,
          phone: formData.phone
        }
      );

      if (requiresEmailConfirmation) {
        setSuccess(true);
      }
    } catch (err: any) {
      console.error('Error signing up:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  if (success) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="Please check your email to confirm your account"
      >
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success mb-4" />
          <p className="text-text-secondary mb-6">
            We've sent a confirmation link to <strong>{formData.email}</strong>. 
            Please click the link to activate your account.
          </p>
          <Link
            to="/login"
            className="text-primary hover:text-primary/90 font-medium"
          >
            Return to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your business today"
    >
      {error && (
        <div className="mb-4 p-3 rounded bg-red-900/30 border border-red-900 text-red-300 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          label="Full Name"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          required
          autoComplete="name"
          placeholder="Enter your full name"
        />

        <FormInput
          label="Business Name"
          name="businessName"
          type="text"
          value={formData.businessName}
          onChange={handleChange}
          required
          placeholder="Enter your business name"
        />

        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          autoComplete="tel"
          placeholder="+254712345678"
        />

        <FormInput
          label="Email address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          placeholder="you@example.com"
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          minLength={6}
          placeholder="At least 6 characters"
        />

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </div>

        <div className="text-center">
          <span className="text-text-secondary text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/90 font-medium">
              Sign in
            </Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  );
}