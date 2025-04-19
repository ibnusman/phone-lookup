# 📱 Phone Number Lookup

This tool helps you identify telecom providers and the country based on phone numbers and their country codes. It’s free to use, but please note that carrier information might not always be accurate. Telco data last updated: April 2025.

---

## Features
- Look up the country using the phone number's country code (e.g., `+254` for Kenya).
- Identify the telecom provider (carrier) for supported countries.
- Validate phone numbers (check if possible and valid).
- Copy the phone number with a single click.
- Free to use globally.

## Deployment
The app is deployed on Vercel: [https://phone-lookup-one.vercel.app](https://phone-lookup-one.vercel.app)

---

## 🧪 Example Input

Input a phone number into Phone Number Lookup:

**Input**: `+233244XXXXXXX`

**Output**:

- Country: **NG**

- Telco: **MTN Ghana**

- Possible: **true**

- Valid: **true**


## 🛠️ Tech Stack

- React (with Vite)  
- Tailwind CSS 
- [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js) for phone number parsing and validation  
- `react-toastify` for notifications  
- `lodash/debounce` for input debouncing  
- `react-ga4` for analytics (Google Analytics 4)

---

## 📦 Installation

To run the app locally, you’ll need Node.js installed. Then, clone the repository and start the development server:

```bash
git clone https://github.com/ibnusman/phone-lookup.git
cd phone-lookup
npm install
npm run dev
