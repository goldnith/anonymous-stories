import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';
import useUniqueId from '../hooks/useUniqueId';

const CommentSection = ({ storyId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userId = useUniqueId();

  useEffect(() => {
    fetchComments();
  }, [storyId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stories/${storyId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/stories/${storyId}/comments`, {
        userId,
        content: newComment
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="comment-section">
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p className="comment-text">{comment.content}</p>
            <small className="comment-date">
              {new Date(comment.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows="3"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;