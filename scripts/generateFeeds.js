const fs = require('fs');
const path = require('path');

// Constants for feed configuration
const CONFIG = {
  baseUrl: 'https://alien-stories.vercel.app',
  title: 'Alien Stories - Anonymous Story Sharing Platform',
  description: 'Share and discover anonymous stories from around the world',
  language: 'en-US',
  copyright: '© 2024 Alien Stories',
  authorName: 'Alien Stories',
  authorEmail: 'contact@alien-stories.vercel.app'
};

function generateRSSFeed(stories) {
  try {
    const rssItems = stories.map(story => `
      <item>
        <title>${escapeXML(story.title)}</title>
        <link>${CONFIG.baseUrl}/story/${story._id}</link>
        <guid isPermaLink="true">${CONFIG.baseUrl}/story/${story._id}</guid>
        <pubDate>${new Date(story.createdAt).toUTCString()}</pubDate>
        <description><![CDATA[${story.story.substring(0, 150)}...]]></description>
        <content:encoded><![CDATA[${story.story}]]></content:encoded>
        <category>${story.category}</category>
        <dc:creator>${CONFIG.authorName}</dc:creator>
      </item>
    `).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${CONFIG.title}</title>
    <link>${CONFIG.baseUrl}</link>
    <description>${CONFIG.description}</description>
    <language>${CONFIG.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${CONFIG.baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <copyright>${CONFIG.copyright}</copyright>
    <generator>Alien Stories RSS Generator</generator>
    <image>
      <url>${CONFIG.baseUrl}/logo.jpg</url>
      <title>${CONFIG.title}</title>
      <link>${CONFIG.baseUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    throw error;
  }
}

function generateAtomFeed(stories) {
  try {
    const atomEntries = stories.map(story => `
      <entry>
        <title>${escapeXML(story.title)}</title>
        <link href="${CONFIG.baseUrl}/story/${story._id}"/>
        <id>${CONFIG.baseUrl}/story/${story._id}</id>
        <updated>${new Date(story.createdAt).toISOString()}</updated>
        <summary><![CDATA[${story.story.substring(0, 150)}...]]></summary>
        <content type="html"><![CDATA[${story.story}]]></content>
        <category term="${story.category}"/>
        <author>
          <name>${CONFIG.authorName}</name>
          <email>${CONFIG.authorEmail}</email>
        </author>
      </entry>
    `).join('\n');

    return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${CONFIG.title}</title>
  <subtitle>${CONFIG.description}</subtitle>
  <link href="${CONFIG.baseUrl}"/>
  <link rel="self" href="${CONFIG.baseUrl}/atom.xml"/>
  <updated>${new Date().toISOString()}</updated>
  <id>${CONFIG.baseUrl}/</id>
  <author>
    <name>${CONFIG.authorName}</name>
    <email>${CONFIG.authorEmail}</email>
  </author>
  <rights>${CONFIG.copyright}</rights>
  <icon>${CONFIG.baseUrl}/image.ico</icon>
  <logo>${CONFIG.baseUrl}/logo.jpg</logo>
  ${atomEntries}
</feed>`;
  } catch (error) {
    console.error('Error generating Atom feed:', error);
    throw error;
  }
}

function escapeXML(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Export functions
module.exports = {
  generateRSSFeed,
  generateAtomFeed,
  CONFIG // Export config for testing
};