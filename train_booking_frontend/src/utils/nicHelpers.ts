export const validateNIC = (nic: string): boolean => {
  // Old NIC format: 9 digits + V/X
  const oldFormat = /^[0-9]{9}[vVxX]$/;
  // New NIC format: 12 digits
  const newFormat = /^[0-9]{12}$/;
  
  return oldFormat.test(nic) || newFormat.test(nic);
};

export const extractBirthYearFromNIC = (nic: string): number | null => {
  if (!validateNIC(nic)) return null;
  
  if (nic.length === 10) {
    // Old format: First 2 digits represent year (e.g., 90 = 1990)
    const yearPart = parseInt(nic.substring(0, 2), 10);
    return yearPart > 50 ? 1900 + yearPart : 2000 + yearPart;
  } else if (nic.length === 12) {
    // New format: First 4 digits are the year
    return parseInt(nic.substring(0, 4), 10);
  }
  
  return null;
};

export const extractGenderFromNIC = (nic: string): 'male' | 'female' | null => {
  if (!validateNIC(nic)) return null;
  
  let dayCode: number;
  
  if (nic.length === 10) {
    dayCode = parseInt(nic.substring(2, 5), 10);
  } else if (nic.length === 12) {
    dayCode = parseInt(nic.substring(4, 7), 10);
  } else {
    return null;
  }
  
  // Female NICs have 500 added to day code
  return dayCode > 500 ? 'female' : 'male';
};

export const formatNIC = (nic: string): string => {
  // Remove any non-alphanumeric characters
  return nic.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
};

export const getNICInfo = (nic: string): { 
  isValid: boolean; 
  birthYear: number | null; 
  gender: 'male' | 'female' | null;
} => {
  return {
    isValid: validateNIC(nic),
    birthYear: extractBirthYearFromNIC(nic),
    gender: extractGenderFromNIC(nic),
  };
};
