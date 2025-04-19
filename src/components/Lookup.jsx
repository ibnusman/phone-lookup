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

  const countryMap = {
    NG: 'Nigeria',
    KE: 'Kenya',
    GH: 'Ghana',
    US: 'USA',
    GB: 'UK',
    ZA: 'SouthAfrica',
    UG: 'Uganda',
    ZM: 'Zambia',
    TZ: 'Tanzania',
  };

  const detectCarrier = (number, country) => {
    const cleaned = number.replace(/\D/g, '');
    let local = cleaned;

    try {
      const phoneInfo = parsePhoneNumber(number, country || 'US');
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

    const telcoCountry = countryMap[country] || country || 'USA';
    const prefixes = telcoPrefixes[telcoCountry];
    // console.log(`Prefixes for ${telcoCountry}:`, prefixes); // Debug log

    if (!prefixes || typeof prefixes !== 'object') {
      console.warn(`Invalid prefixes format for country: ${telcoCountry}`, prefixes);
      return 'Unknown';
    }

    for (const carrier in prefixes) {
      if (!Array.isArray(prefixes[carrier])) {
        console.warn(`Invalid prefix array for carrier ${carrier} in ${telcoCountry}:`, prefixes[carrier]);
        continue;
      }
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
        // console.log('Parsed phone number:', parsed);
        if (parsed) {
          const country = parsed.country || (parsed.countryCallingCode === '1' ? 'NANP' : undefined);
          const telco = detectCarrier(input, parsed.country || (parsed.countryCallingCode === '1' ? 'US' : undefined));
          setPhoneData({
            country,
            number: parsed.number,
            isPossible: parsed.isPossible(),
            isValid: parsed.isValid(),
            telco,
          });
          setError('');
          ReactGA.event({
            category: 'Lookup',
            action: 'Phone Lookup Success',
            label: country || 'Unknown',
          });
        } else {
          console.warn('Parsing failed:', parsed);
          setPhoneData(null);
          setError('Please enter a valid phone number with the country code (e.g., +44701234567)');
          ReactGA.event({
            category: 'Lookup',
            action: 'Phone Lookup Failed',
            label: 'Invalid Number',
          });
        }
      } catch (err) {
        console.error('Error in phone number parsing:', err);
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
    // console.log('Input value:', phone);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      {/* Fallback CSS for placeholder and input text */}
      <style>
        {`
          input::placeholder {
            color: #374151; /* Tailwind gray-700 */
            opacity: 1;
          }
          input::-webkit-input-placeholder {
            color: #374151;
            opacity: 1;
          }
          input::-moz-placeholder {
            color: #374151;
            opacity: 1;
          }
          input:-ms-input-placeholder {
            color: #374151;
            opacity: 1;
          }
          #phone-input {
            color: #111827; /* Tailwind gray-900 */
            opacity: 1 !important;
          }
        `}
      </style>

      {/* Header Section */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          📱 Phone Number Lookup
        </h1>
        {/* <p className="text-gray-600 text-sm max-w-md mx-auto">
          Identify telecom providers and the country based on phone numbers and their country codes. Free to use, but carrier information might not always be accurate. Telco data last updated: April 2025.
        </p> */}
      </header>

      {/* Input Section */}
      <section className="w-full max-w-md mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="phone-input"
            type="text"
            placeholder="e.g. +44701234567"
            value={phone}
            onChange={handleInputChange}
            maxLength="20"
            aria-label="Enter phone number for lookup"
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-700 text-gray-900"
          />
          <button
            onClick={copy}
            aria-label="Copy phone number"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Copy
          </button>
        </div>
        {isLoading && (
          <p role="alert" className="text-gray-500 text-sm mt-2 text-center">
            Processing...
          </p>
        )}
        {error && (
          <p role="alert" className="text-red-500 text-sm mt-2 text-center">
            {error}
          </p>
        )}
      </section>

      {/* Results Section */}
      {phoneData && (
        <section className="w-full max-w-md mb-6">
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">🌍 Country:</span>
              {phoneData.country === 'NANP' ? (
                <span className="text-gray-800">NANP (North America)</span>
              ) : (
                <>
                  <img
                    src={`https://flagcdn.com/w20/${phoneData.country?.toLowerCase()}.png`}
                    alt={`${phoneData.country} flag`}
                    className="w-6 h-4 object-cover rounded"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                  <span className="text-gray-800">{phoneData.country || '🏳️'}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">📞 Number:</span>
              <span className="text-gray-800">{phoneData.number}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">✅ Possible?</span>
              <span className="text-gray-800">{phoneData.isPossible ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">✔️ Valid?</span>
              <span className="text-gray-800">{phoneData.isValid ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">📡 Telco:</span>
              <span className="text-gray-800">
                {phoneData.telco === 'Unknown'
                  ? 'Carrier lookup not available for this country'
                  : phoneData.telco}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Support and Ad Section */}
      {/* <footer className="w-full max-w-md text-center">
        <div className="mb-4">
          <p className="text-gray-600 mb-2">Enjoying this tool? Support us!</p>
          <a
            href="https://buymeacoffee.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
          >
            Buy Me a Coffee ☕
          </a>
        </div>
        <div className="h-20 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg shadow-sm">
          Ad Space (Google AdSense)
        </div>
      </footer> */}

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
