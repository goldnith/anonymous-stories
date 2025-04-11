const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { generateRSSFeed, generateAtomFeed } = require('./generateFeeds');

// Mock data for testing
const MOCK_STORIES = [
  {
    _id: '1',
    title: 'My First Anonymous Story',
    story: 'This is a sample story for testing the feed generation.',
    category: 'Personal',
    createdAt: new Date().toISOString(),
    likeCount: 0
  },
  {
    _id: '2',
    title: 'School Experience',
    story: 'Another sample story for testing feed generation.',
    category: 'School',
    createdAt: new Date().toISOString(),
    likeCount: 5
  }
];

// API configuration
const API_CONFIG = {
  baseURL: 'https://anonymous-app-backend.onrender.com/api',
  endpoints: {
    stories: '/stories'
  },
  useMockData: false // Set to false when API is ready
};

async function fetchStories() {
  try {
    if (API_CONFIG.useMockData) {
      console.log('Using mock data for testing...');
      return MOCK_STORIES;
    }

    const response = await axios.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.stories}`);
    
    // Log raw response for debugging
    console.log('API Response:', JSON.stringify(response.data, null, 2));

    // Handle different response formats
    if (response.data && response.data.stories) {
      return response.data.stories;
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    if (typeof response.data === 'object') {
      return Object.values(response.data);
    }

    throw new Error('Invalid data format received from API');
  } catch (error) {
    console.error('Error fetching stories:', error.message);
    if (API_CONFIG.useMockData) {
      console.log('Falling back to mock data...');
      return MOCK_STORIES;
    }
    throw new Error('Failed to fetch stories from API');
  }
}

async function updateFeeds() {
  try {
    // Fetch stories from actual API
    const stories = await fetchStories();
    
    // Validate stories array
    if (!Array.isArray(stories)) {
      throw new Error('Stories data is not in array format');
    }
    
    if (!stories.length) {
      console.warn('No stories found from API');
      return;
    }

    // Log data structure for debugging
    console.log('Stories data structure:', {
      isArray: Array.isArray(stories),
      length: stories.length,
      sampleItem: stories[0] ? JSON.stringify(stories[0]) : null
    });

    // Generate feeds
    const rssFeed = generateRSSFeed(stories);
    const atomFeed = generateAtomFeed(stories);

    // Write to files in public directory
    const publicDir = path.join(__dirname, '../public');
    await fs.writeFile(path.join(publicDir, 'feed.xml'), rssFeed);
    await fs.writeFile(path.join(publicDir, 'atom.xml'), atomFeed);

    console.log(`Feeds updated successfully with ${stories.length} stories`);
  } catch (error) {
    console.error('Error updating feeds:', error);
    process.exit(1);
  }
}

// If running directly
if (require.main === module) {
  updateFeeds();
}

module.exports = updateFeeds;