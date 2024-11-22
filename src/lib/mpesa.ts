import axios from 'axios';

// Constants
const SANDBOX_BASE_URL = 'https://sandbox.safaricom.co.ke';
const CONSUMER_KEY = 'A7wwluAr8TjdiEiUQBUB44JY8EWQUeeLrAU543SyVOBYezU9';
const CONSUMER_SECRET = 'HO4dAF8DIEQpZoRDlHAGKqFj62c6AyCLeQ3DEAPbYD5wboeGq2H0Xr5D3lAa8KyL';
const BUSINESS_SHORT_CODE = '174379'; // Sandbox shortcode
const PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'; // Sandbox passkey

// Helper function to encode base64 in browser
const btoa = (str: string) => window.btoa(str);

// Helper function to generate the auth token
export const getAccessToken = async () => {
  try {
    const auth = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
    const response = await axios.get(
      `${SANDBOX_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.access_token;
  } catch (error: any) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw new Error('Failed to get access token');
  }
};

// Helper function to generate the password
const generatePassword = (timestamp: string) => {
  const str = `${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`;
  return btoa(str);
};

// Helper function to format phone number
const formatPhoneNumber = (phoneNumber: string) => {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Add country code if not present
  if (cleaned.startsWith('0')) {
    return `254${cleaned.slice(1)}`;
  }
  if (!cleaned.startsWith('254')) {
    return `254${cleaned}`;
  }
  return cleaned;
};

// Function to initiate STK Push
export const initiateSTKPush = async ({
  phoneNumber,
  amount,
  accountReference,
  transactionDesc,
}: {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}) => {
  try {
    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = generatePassword(timestamp);
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const response = await axios.post(
      `${SANDBOX_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount), // M-Pesa only accepts whole numbers
        PartyA: formattedPhone,
        PartyB: BUSINESS_SHORT_CODE,
        PhoneNumber: formattedPhone,
        CallBackURL: `${window.location.origin}/api/mpesa/callback`,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error initiating STK push:', error.response?.data || error.message);
    throw new Error('Failed to initiate payment');
  }
};

// Function to check transaction status
export const checkTransactionStatus = async (checkoutRequestId: string) => {
  try {
    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = generatePassword(timestamp);

    const response = await axios.post(
      `${SANDBOX_BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error checking transaction status:', error.response?.data || error.message);
    throw new Error('Failed to check transaction status');
  }
};

// Function to generate payment link
export const generatePaymentLink = async ({
  amount,
  accountReference,
  transactionDesc,
}: {
  amount: number;
  accountReference: string;
  transactionDesc: string;
}) => {
  try {
    // Generate a unique transaction ID
    const transactionId = crypto.randomUUID();
    
    // For sandbox testing, we'll return a mock payment link
    // In production, this would integrate with your payment gateway
    const paymentLink = `${window.location.origin}/pay/${transactionId}`;

    return {
      paymentLink,
      transactionId,
      amount,
      accountReference,
      transactionDesc,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiry
    };
  } catch (error: any) {
    console.error('Error generating payment link:', error);
    throw new Error('Failed to generate payment link');
  }
};