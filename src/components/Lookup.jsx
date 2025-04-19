import React, { useState, useCallback } from 'react';
import parsePhoneNumber from 'libphonenumber-js/min';
import debounce from 'lodash/debounce';
import telcoPrefixes from './data/telcos.js';
import { ToastContainer, toast } from 'react-toastify';
import ReactGA from 'react-ga4';
import 'react-toastify/dist/ReactToastify.css';

const Lookup = () => {
  const [phone, setPhone] = useState('');
  const [phoneData, setPhoneData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const detectCarrier = (number, country) => {
    const cleaned = number.replace(/\D/g, '');
    let local = cleaned;

    try {
      const phoneInfo = parsePhoneNumber(number, country);
      if (!phoneInfo || !phoneInfo.countryCallingCode) {
        console.warn('Invalid phone number or country code missing');
        return 'Unknown';
      }

      const countryCode = phoneInfo.countryCallingCode;
      if (countryCode && cleaned.startsWith(countryCode)) {
        local = '0' + cleaned.slice(countryCode.length);
      } else {
        console.warn(`Country code ${countryCode} does not match the cleaned number`);
      }
    } catch (err) {
      console.warn('Phone parsing failed', err);
      return 'Unknown';
    }

    const countryMap = {
      NG: 'Nigeria',
      KE: 'Kenya',
      GH: 'Ghana',
    };
    const telcoCountry = countryMap[country] || country;

    const prefixes = telcoPrefixes[telcoCountry];
    if (!prefixes) {
      console.warn(`No prefixes found for country: ${telcoCountry}`);
      return 'Unknown';
    }

    for (const carrier in prefixes) {
      if (prefixes[carrier].some((prefix) => local.startsWith(prefix))) {
        return carrier;
      }
    }

    console.warn('No carrier matched for number:', local);
    return 'Unknown';
  };

  const debouncedHandleInputChange = useCallback(
    debounce((input) => {
      setIsLoading(true);
      try {
        const parsed = parsePhoneNumber(input);
        if (parsed) {
          const country = parsed.country;
          const telco = detectCarrier(input, country);

          setPhoneData({
            country,
            number: parsed.number,
            isPossible: parsed.isPossible(),
            isValid: parsed.isValid(),
            telco,
          });
          setError('');

          // Track successful lookup event
          ReactGA.event({
            category: 'Lookup',
            action: 'Phone Lookup Success',
            label: country,
          });
        } else {
          setPhoneData(null);
          setError('Please enter a valid phone number with the country code (e.g., +44701234567)');
          // Track failed lookup event
          ReactGA.event({
            category: 'Lookup',
            action: 'Phone Lookup Failed',
            label: 'Invalid Number',
          });
        }
      } catch (err) {
        setPhoneData(null);
        setError('Invalid phone number format');
        ReactGA.event({
          category: 'Lookup',
          action: 'Phone Lookup Error',
          label: 'Format Error',
        });
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const input = e.target.value;
    if (!/^[+\d\s]*$/.test(input)) {
      setError('Only numbers, "+", and spaces are allowed');
      ReactGA.event({
        category: 'Input',
        action: 'Invalid Input',
        label: input,
      });
      return;
    }
    setPhone(input);
    setError('');
    debouncedHandleInputChange(input);
  };

  const copy = () => {
    if (phoneData?.number) {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(phoneData.number)
          .then(() => {
            toast.success('Number copied!', { autoClose: 3000 });
            ReactGA.event({
              category: 'Action',
              action: 'Copy Number',
              label: phoneData.number,
            });
          })
          .catch(() => {
            toast.error('Failed to copy', { autoClose: 3000 });
            ReactGA.event({
              category: 'Action',
              action: 'Copy Failed',
              label: phoneData.number,
            });
          });
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = phoneData.number;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          toast.success('Number copied!', { autoClose: 3000 });
          ReactGA.event({
            category: 'Action',
            action: 'Copy Number (Fallback)',
            label: phoneData.number,
          });
        } catch (err) {
          toast.error('Failed to copy', { autoClose: 3000 });
          ReactGA.event({
            category: 'Action',
            action: 'Copy Failed (Fallback)',
            label: phoneData.number,
          });
        }
        document.body.removeChild(textarea);
      }
    } else {
      toast.warn('No number to copy', { autoClose: 3000 });
      ReactGA.event({
        category: 'Action',
        action: 'Copy Attempt - No Number',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📱 Phone Number Lookup</h1>

      {/* <label htmlFor="phone-input" className="sr-only">
        Enter phone number for lookup
      </label> */}
      <input
        id="phone-input"
        type="text"
        placeholder="e.g. +44701234567"
        value={phone}
        onChange={handleInputChange}
        maxLength="20"
        aria-label="Enter phone number for lookup"
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />
        <span>            </span>
      <button
        onClick={copy}
        aria-label="Copy phone number"
        className="px-4 py-2 bg-blue-500 text-black rounded-lg shadow-md hover:bg-blue-600 transition mb-4"
      >
        Copy
      </button>

      {isLoading && (
        <p role="alert" className="text-gray-500 text-sm mt-2">
          Processing...
        </p>
      )}
      {error && (
        <p role="alert" className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}

      {phoneData && (
        <div className="bg-white shadow-md rounded-xl p-6 mt-4 w-full max-w-md border border-gray-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">🌍 Country:</span>
            <img
              src={`https://flagcdn.com/w20/${phoneData.country.toLowerCase()}.png`}
              alt={`${phoneData.country} flag`}
              className="w-6 h-4 object-cover rounded"
              onError={(e) => (e.target.style.display = 'none')} // Hide broken image
            />
            <span className="text-gray-800">{phoneData.country || '🏳️'}</span>
          </div>
          <p className="text-gray-800">
            <span className="font-semibold">📞 Number:</span> {phoneData.number}
          </p>
          <p className="text-gray-800">
            <span className="font-semibold">✅ Possible?</span> {phoneData.isPossible ? 'Yes' : 'No'}
          </p>
          <p className="text-gray-800">
            <span className="font-semibold">✔️ Valid?</span> {phoneData.isValid ? 'Yes' : 'No'}
          </p>
          <p className="text-gray-800">
            <span className="font-semibold">📡 Telco:</span>{' '}
            {phoneData.telco === 'Unknown'
              ? 'Carrier lookup not available for this country'
              : phoneData.telco}
          </p>
        </div>
      )}


{/* 
      <div className="mt-4 w-full max-w-md">
        <div className="h-20 bg-gray-200 flex items-center justify-center text-gray-500">
          Ad Space (Google AdSense)
        </div>
      </div> */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Lookup;
