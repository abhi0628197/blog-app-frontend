import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiBaseUrl from '../api/apiConfig';
import Sidebar from './Sidebar';
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [msg, setMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/post/${id}/`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setMsg(data.error);
        } else {
          setPost(data);
        }
      })
      .catch(() => setMsg('Error loading post details'));
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/post/${id}/comment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: commentText })
      });

      const data = await response.json();

      if (!response.ok) {
        setMsg(data.error || 'Failed to add comment');
        return;
      }

      setPost(prev => ({
        ...prev,
        comments: [{
          id: Math.random(),
          user: localStorage.getItem('username') || 'You',
          text: commentText,
          created_at: new Date().toISOString()
        }, ...prev.comments]
      }));

      setCommentText('');
      setMsg('✅ Comment added successfully');

      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('Error adding comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const toggleComments = () => {
    setShowComments(prev => !prev);
  };

  if (!post) {
    return (
      <div className="post-detail-layout">
        <Sidebar />
        <main className="post-detail-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">{msg || 'Loading post...'}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="post-detail-layout">
      <Sidebar />
      <main className="post-detail-container">
        <div className="post-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Clickable Post */}
        <div onClick={toggleComments} className="post-content" style={{ cursor: 'pointer' }}>
          <header className="post-title-section">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <div className="author-info">
                <div className="author-avatar">
                  {getInitials(post.author)}
                </div>
                <div className="author-details">
                  <span className="author-name">{post.author}</span>
                  <span className="post-date">{formatDate(post.created_at)}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="post-body">
            <p className="post-text">{post.content}</p>
          </div>

          {/* Instruction Message */}
          <p style={{ color: '#00212C', fontWeight: '500', marginTop: '8px' }}>
            {showComments ? 'Click to hide comments' : 'Click to view comments'}
          </p>
        </div>

        {/* Comments Section - Toggled */}
        {showComments && (
          <section className="comments-section">
            <div className="comments-header">
              <h3 className="comments-title">
                Comments ({post.comments.length})
              </h3>
            </div>

            <form className="comment-form" onSubmit={handleAddComment}>
              <div className="comment-input-wrapper">
                <textarea
                  className="comment-input"
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  required
                  rows="3"
                />
                <button
                  type="submit"
                  className="comment-submit-btn"
                  disabled={isSubmitting || !commentText.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="btn-spinner"></div>
                      Posting...
                    </>
                  ) : (
                    'Post Comment'
                  )}
                </button>
              </div>
            </form>

            {msg && (
              <div className={`message ${msg.includes('✅') ? 'success' : 'error'}`}>
                {msg}
              </div>
            )}

            <div className="comments-list">
              {post.comments.length === 0 ? (
                <div className="no-comments">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                post.comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      {getInitials(comment.user)}
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{comment.user}</span>
                        <span className="comment-date">{formatDate(comment.created_at)}</span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default PostDetail;
