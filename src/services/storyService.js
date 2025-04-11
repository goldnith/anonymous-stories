const axios = require('axios');

// Function to get stories from your MongoDB database or API
async function getStories() {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get('https://alien-stories.vercel.app/api/stories');
    return response.data;
  } catch (error) {
    console.error('Error fetching stories:', error);
    return []; // Return empty array if fetch fails
  }
}

// If you're using local data for testing:
const mockStories = [
  {
    _id: '1',
    title: 'My First Anonymous Story',
    story: 'This is a sample story for testing the feed generation.',
    category: 'Personal',
    createdAt: new Date(),
    likeCount: 0,
    commentCount: 0
  },
  // Add more mock stories as needed
];

// Export both real and mock functions
module.exports = {
  getStories,
  getMockStories: () => mockStories
};