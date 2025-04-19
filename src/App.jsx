import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './pages/Landing'
import initializeAnalytics from './analytics';
import React, { useEffect } from 'react';
function App() {
useEffect(() => {
    initializeAnalytics();
  }, []);

  return (
    <>
    
     <Landing/>
    </>
  )
}

export default App
