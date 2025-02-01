import React from 'react';
import FloatingButton from "../components/FloatingButton";
import StoryCard from '../components/StoryCard.js';

const Explore = () => {
  const stories = [
    { id: 1, title: 'Story 1', content: 'This is the first story.' },
    { id: 2, title: 'Story 2', content: 'This is the second story.' },
    // Add more stories here
  ];

  return (
    <div className="explore-container">
      {stories.map((story) => (
        <StoryCard key={story.id} storyId={story.id} title={story.title} content={story.content} />
      ))}
      <FloatingButton />

    </div>
  );
};

export default Explore;
