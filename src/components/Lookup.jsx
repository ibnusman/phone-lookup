import React, { useState, useCallback } from 'react';
import parsePhoneNumber from 'libphonenumber-js';
import debounce from 'lodash/debounce';
import telcoPrefixes from './data/telcos.js';

const Lookup = () => {
  const [phone, setPhone] = useState('');
  const [phoneData, setPhoneData] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const detectCarrier = (number, country) => {
    // console.log('detectCarrier input:', { number, country }); // Debug log
    const cleaned = number.replace(/\D/g, '');
    let local = cleaned;

    try {
      const phoneInfo = parsePhoneNumber(number, country);
      // console.log('phoneInfo:', phoneInfo); // Debug log
      if (!phoneInfo || !phoneInfo.countryCallingCode) {
        console.warn('Invalid phone number or country code missing');
        return 'Unknown';
      }

      const countryCode = phoneInfo.countryCallingCode; // e.g., "234"
      if (countryCode && cleaned.startsWith(countryCode)) {
        local = '0' + cleaned.slice(countryCode.length); // Localize the number
      } else {
        console.warn(`Country code ${countryCode} does not match the cleaned number`);
      }
    } catch (err) {
      console.warn('Phone parsing failed', err);
      return 'Unknown';
    }

    // console.log('Localized number:', local); // Debug log

    // Map country codes to telcoPrefixes keys
    const countryMap = {
      NG: 'Nigeria',
      KE: 'Kenya',
      GH: 'Ghana',
    };
    const telcoCountry = countryMap[country] || country;
    // console.log('Telco country:', telcoCountry); // Debug log

    const prefixes = telcoPrefixes[telcoCountry];
    if (!prefixes) {
      console.warn(`No prefixes found for country: ${telcoCountry}`);
      return 'Unknown';
    }

    for (const carrier in prefixes) {
      if (prefixes[carrier].some((prefix) => local.startsWith(prefix))) {
        // console.log('Matched carrier:', carrier); // Debug log
        return carrier;
      }
    }

    console.warn('No carrier matched for number:', local); // Debug log
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
        } else {
          setPhoneData(null);
          setError('Please enter a valid phone number with the country code (e.g., +254701234567)');
        }
      } catch (err) {
        setPhoneData(null);
        setError('Invalid phone number format');
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
    return;
  }
  setPhone(input);
  setError('');
  setToast('');
  debouncedHandleInputChange(input);
};
  const copy = () => {
    if (phoneData?.number) {
      navigator.clipboard
        .writeText(phoneData.number)
        .then(() => {
          setToast('Number copied!');
          setTimeout(() => setToast(''), 3000);
        })
        .catch(() => {
          setToast('Failed to copy');
          setTimeout(() => setToast(''), 3000);
        });
    } else {
      setToast('No number to copy');
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📱 Phone Number Lookup</h1>

      <input
        type="text"
        placeholder="e.g. +254701234567"
        value={phone}
        onChange={handleInputChange}
        aria-label="Enter phone number for lookup"
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <button
        onClick={copy}
        aria-label="Copy phone number"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Copy
      </button>

      {isLoading && <p className="text-gray-500 text-sm mt-2">Processing...</p>}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {toast && <p className="text-green-500 text-sm mt-2">{toast}</p>}

      {phoneData && (
        <div className="bg-white shadow-md rounded-xl p-6 mt-4 w-full max-w-md border border-gray-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">🌍 Country:</span>
            <img
              src={`https://flagcdn.com/w20/${phoneData.country.toLowerCase()}.png`}
              alt={`${phoneData.country} flag`}
              className="w-6 h-4 object-cover rounded"
              onError={(e) => (e.target.src = '/fallback-flag.png')}
            />
            <span>{phoneData.country}</span>
          </div>
          <p>
            <span className="font-semibold">📞 Number:</span> {phoneData.number}
          </p>
          <p>
            <span className="font-semibold">✅ Possible?</span> {phoneData.isPossible ? 'Yes' : 'No'}
          </p>
          <p>
            <span className="font-semibold">✔️ Valid?</span> {phoneData.isValid ? 'Yes' : 'No'}
          </p>
          <p>
            <span className="font-semibold">📡 Telco:</span>{' '}
            {phoneData.telco === 'Unknown'
              ? 'Carrier lookup not available for this country'
              : phoneData.telco}
          </p>
        </div>
      )}
    </div>
  );
};

export default Lookup;
