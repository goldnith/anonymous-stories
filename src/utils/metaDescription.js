export const updateMetaDescription = (stories) => {
    if (!stories.length) return;
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    const preview = randomStory.story.substring(0, 100) + '...';
    document.getElementById('dynamic-description').content = 
      `Read stories like: "${preview}" and many more anonymous experiences.`;
  };