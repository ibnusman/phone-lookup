import ReactGA from 'react-ga4';

const initializeAnalytics = () => {
  ReactGA.initialize('G-6PWL9BLJ8G'); // Replace with your GA4 Measurement ID
  // Manually track the page view
  ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
};

export default initializeAnalytics;
