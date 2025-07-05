import React, { useEffect, useState } from 'react';
import { FaFileAlt, FaUser, FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import apiBaseUrl from '../api/apiConfig';
import './PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [username, setUsername] = useState('You');
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '/default-profile.png');

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token'); // check login

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);

    fetch(`${apiBaseUrl}/api/posts/`)
      .then(res => res.json())
      .then(data => {
        if (data.posts) {
          setPosts(data.posts);
        } else {
          setMsg(data.error || 'Failed to load posts');
        }
      })
      .catch(() => setMsg('Error occurred while fetching posts'));
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!isLoggedIn) {
      setMsg('⚠️ You must be logged in to create a post');
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/create-post/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newPost)
      });

      const data = await response.json();

      if (!response.ok) {
        setMsg(data.error || 'Failed to create post');
        return;
      }

      setPosts(prev => [{
        id: data.post_id,
        title: newPost.title,
        content: newPost.content,
        author: username,
        created_at: new Date().toISOString()
      }, ...prev]);

      setMsg('✅ Post created successfully');
      setShowModal(false);
      setNewPost({ title: '', content: '' });

    } catch {
      setMsg('Error occurred while creating post');
    }
  };

  const myPostsCount = posts.filter(post => post.author === username).length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <input className="search-bar" placeholder="Search..." />
        <div className="profile-section" onClick={() => navigate('/profile')}>
          <img src={profilePic} alt="Profile" className="profile-image" />
          <span className="profile-name">{username}</span>
        </div>
      </header>

      <div className="dashboard-heading">
        <h2>Dashboard Overview</h2>
      </div>

      <div className="dashboard-overview">
        <div className="overview-card">
          <div className="icon-wrapper"><FaFileAlt size={24} /></div>
          <div className="card-text">
            <h4>Total Posts</h4>
            <p>{posts.length}</p>
          </div>
        </div>
        <div className="overview-card">
          <div className="icon-wrapper"><FaUser size={24} /></div>
          <div className="card-text">
            <h4>My Posts</h4>
            <p>{myPostsCount}</p>
          </div>
        </div>
        <div className="overview-card">
          <div className="icon-wrapper"><FaComments size={24} /></div>
          <div className="card-text">
            <h4>Comments</h4>
            <p>0</p>
          </div>
        </div>
      </div>

      <div className="postlist-header">
        <h2>Posts</h2>
        <button 
          className="create-post-btn" 
          onClick={() => {
            if (isLoggedIn) {
              setShowModal(true);
            } else {
              setMsg('⚠️ Please log in to create a post');
            }
          }}
        >
          + Create Post
        </button>
      </div>

      {msg && <p className="postlist-msg">{msg}</p>}

      <div className="post-cards-container">
        {posts.map(post => (
          <div 
            key={post.id} 
            className="post-card"
            onClick={() => navigate(`/post/${post.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <h3>{post.title}</h3>
            <p className="post-meta">by {post.author} | {new Date(post.created_at).toLocaleString()}</p>
            <p>{post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Create New Post</h3>
            <form onSubmit={handleCreatePost}>
              <input
                className="modal-input"
                placeholder="Title"
                value={newPost.title}
                onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
              <textarea
                className="modal-textarea"
                placeholder="Content"
                value={newPost.content}
                onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                required
              />
              <button type="submit" className="modal-submit">Submit</button>
              <button type="button" className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostList;
