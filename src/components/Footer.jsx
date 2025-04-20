import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-8">
      <div className="text-center">
        <p className="text-lg mb-2">About this tool</p>
        <div
          style={{
            backgroundColor: '#f1f1f1',
            color: '#333',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '14px',
            marginTop: '20px',
          }}
        >
          This tool helps you Identify telecom providers and the country based on phone numbers and their country codes using prefix-based lookups. Free to use, but carrier information may not be accurate, especially for ported numbers (which require a separate lookup). 
          Telco data last updated: April 2025.


        </div>
      </div>
      <p className="mt-4 text-sm">
        Made by <span className="font-semibold">BA Tech</span>
      </p>
      <div className="mt-2">
        {/* <a href="https://github.com/abubakar-usman" className="text-blue-400 hover:underline">
          GitHub
        </a>{' '} */}
        |{' '}
        <a href="mailto:abucrypto41@gmail.com" className="text-blue-400 hover:underline">
          Contact
        </a>{' '}
        |{' '}
        <a href="https://buymeacoffee.com/batech" className="text-yellow-400 hover:underline">
          Buy Me a Coffee
        </a>
      </div>
    </footer>
  );
};

export default Footer;
