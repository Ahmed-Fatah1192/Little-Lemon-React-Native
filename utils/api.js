// utils/api.js
const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

export const fetchMenuItems = async () => {
  try {
    console.log('Fetching menu from:', API_URL);
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received data structure:', Object.keys(data));
    
    // Check if the data has a menu property
    if (!data.menu) {
      console.error('Data does not contain menu property:', data);
      return [];
    }
    
    // Log the first menu item to verify structure
    if (data.menu.length > 0) {
      console.log('First menu item example:', JSON.stringify(data.menu[0]));
    }
    
    return data.menu;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return []; // Return empty array instead of throwing to prevent app crash
  }
};

export const getImageUrl = (imageName) => {
  if (!imageName) {
    console.error('Image name is null or undefined');
    return 'https://via.placeholder.com/100?text=No+Image';
  }
  
  // Construct the correct URL based on the instructions
  const url = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageName}?raw=true`;
  console.log('Image URL:', url);
  return url;
};