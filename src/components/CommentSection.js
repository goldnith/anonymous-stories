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
      const response = await axios.get(`${API_URL}/api/comments/${storyId}`);
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
      await axios.post(`${API_URL}/api/comments/${storyId}`, {
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

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await axios.delete(`${API_URL}/api/comments/${commentId}`, {
        data: { userId }
      });
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="comment-section">
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
      <div className="comments-list">
      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          <div className="comment-header">
            <div className="avatar">
              👽
            </div>
            <div className="user-info">
              <span className="user-id">Anonymous {comment.userId.slice(-4)}</span>
              <small className="comment-date">
                {new Date(comment.createdAt).toLocaleDateString()}
              </small>
            </div>
            {comment.userId === userId && (
                <button 
                  className="delete-comment"
                  onClick={() => handleDelete(comment._id)}
                  aria-label="Delete comment"
                >
                  ❌
                </button>
              )}
          </div>
          <p className="comment-text">{comment.content}</p>
        </div>
      ))}
    </div>
      
    </div>
  );
};

export default CommentSection;