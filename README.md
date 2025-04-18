# 📱 Phone Number Lookup App

This is a simple React-based application that allows users to input a phone number and instantly view:

- The **country** the number belongs to  
- The **telco/carrier** associated with the number  
- Whether the number is **possible**  
- Whether the number is **valid**

---

## 🚀 Features

- 📍 Country detection based on the number  
- 🏢 Telco/Carrier lookup  
- ✅ Validity & possibility check  
- 🔍 Instant real-time results as the user types  
- 🎨 Clean UI with Bootstrap styling  

---
## 🧪 Example Input

Input: **+2348021234567**

 **Output**

- Country: **NG**

- Carrier: **MTN Nigeria**

- Possible: **true**

- Valid: **true**

## 🛠️ Tech Stack

- React (with Vite)  
- Bootstrap  
- [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js) for phone number parsing and validation  

---

## 📦 Installation

Clone the repository and run the development server:

```bash
git clone https://github.com/ibnusman/phone-lookup.git
cd phone-lookup-app
npm install
npm run dev
