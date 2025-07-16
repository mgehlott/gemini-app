export const fetchCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag,flags');
    const countries = await response.json();
    
    return countries
      .filter(country => country.idd?.root && country.idd?.suffixes?.length > 0)
      .sort((a, b) => a.name.common.localeCompare(b.name.common));
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return [];
  }
};

export const simulateOTPSend = (phone) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

export const simulateOTPVerification = (otp) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(otp.length >= 4 && otp.length <= 6 && /^\d+$/.test(otp));
    }, 1000);
  });
};