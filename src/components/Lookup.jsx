import React, { useState } from 'react'
import parsePhoneNumber from 'libphonenumber-js'

const Lookup = () => {
  const [phone, setPhone] = useState("")
  const [phoneData, setPhoneData] = useState(null)
  const [error, setError] = useState("")

  const handleInputChange = (e) => {
    const input = e.target.value
    setPhone(input)
    setError("")

    try {
      const checkNumber = parsePhoneNumber(input)
      if (checkNumber) {
        setPhoneData({
          country: checkNumber.country || "Unknown",
          number: checkNumber.number || "",
          isPossible: checkNumber.isPossible(),
          isValid: checkNumber.isValid()
        })
      } else {
        setPhoneData(null)
      }
    } catch (err) {
      setPhoneData(null)
      setError("Invalid phone number format")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📱 Phone Number Lookup</h1>

      <input
        type="text"
        placeholder="e.g. +2348123456789"
        value={phone}
        onChange={handleInputChange}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      {phoneData && (
        <div className="bg-white shadow-md rounded-xl p-6 mt-4 w-full max-w-md border border-gray-200 space-y-2">
          <p><span className="font-semibold">🌍 Country:</span> {phoneData.country}</p>
          <p><span className="font-semibold">📞 Number:</span> {phoneData.number}</p>
          <p><span className="font-semibold">✅ Possible?</span> {phoneData.isPossible ? "Yes" : "No"}</p>
          <p><span className="font-semibold">✔️ Valid?</span> {phoneData.isValid ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  )
}

export default Lookup
