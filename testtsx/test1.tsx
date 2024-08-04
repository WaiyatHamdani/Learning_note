import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Userfetch from './FetchData/User';

interface User {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  bio: string;
  user_id: number;
}

interface Comment {
  id: number;
  body: string;
}

interface Post {
  post_id: number;
  user: User;
  message: string;
  comments: Comment[];
  likes: number;
  shares: number;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostMessage, setNewPostMessage] = useState<string>('');
  const [newComment, setNewComment] = useState<string>(''); 
  const [editCommentById, setEditCommentById] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const currentUserURL = Userfetch.loadLocal(); // Fetch the URL/ID from local storage
        if (currentUserURL) {
          const response = await axios.get(currentUserURL);
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        setError('Failed to fetch current user.');
      }
    }

    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/posts', {
          withCredentials: true,
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts.');
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentUser();
    fetchPosts();
  }, []);

  // Handle new post
  const handleNewPost = async () => {
    if (!currentUser) {
      console.error('User not logged in');
      setError('User not logged in');
      return;
    }
    try {
      const newPost = {
        user: currentUser,
        message: newPostMessage,
        likes: 0,
        shares: 0,
        comments: [],
      };

      const response = await axios.post(`http://localhost:8080/posts`, newPost);
      setPosts((prevPosts) => [...prevPosts, response.data]);
      setNewPostMessage('');
    } catch (error) {
      console.error('Error creating new post:', error);
      setError('Failed to create new post.');
    }
  };

  // Handle like
  const handleLike = async (post_id: number) => {
    try {
      await axios.put(`http://localhost:8080/posts/${post_id}/like`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === post_id ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Handle new comment
  const handleComment = async (post_id: number) => {
    if (newComment.trim() === '') return;

    try {
      await axios.post(`http://localhost:8080/posts/${post_id}/comment`, { body: newComment });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === post_id ? { ...post, comments: [...post.comments, { id: post.comments.length, body: newComment }] } : post
        )
      );
      setNewComment('');
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  // Handle edit comment
  const handleEditComment = (id: number) => {
    const comment = posts.flatMap((post) => post.comments).find((comment) => comment.id === id);
    if (comment) {
      setEditCommentById(id);
      setEditCommentText(comment.body);
    }
  };

  // Save edited comment
  const handleSaveEditedComment = async () => {
    if (editCommentById === null) return;

    try {
      await axios.put(`http://localhost:8080/comments/${editCommentById}`, { body: editCommentText });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.comments.some((comment) => comment.id === editCommentById)
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment.id === editCommentById ? { ...comment, body: editCommentText } : comment
                ),
              }
            : post
        )
      );
      setEditCommentById(null);
      setEditCommentText('');
    } catch (error) {
      console.error('Error saving edited comment:', error);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (post_id: number, comment_id: number) => {
    try {
      await axios.delete(`http://localhost:8080/comments/${comment_id}`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === post_id
            ? { ...post, comments: post.comments.filter((comment) => comment.id !== comment_id) }
            : post
        )
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="posts-container">
      <div className="create-post">
        <h2>Create a Post</h2>
        <textarea
          value={newPostMessage}
          onChange={(e) => setNewPostMessage(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          cols={50}
        />
        <button onClick={handleNewPost}>Post</button>
      </div>

      <div className="posts-list">
        <h2>Posts</h2>
        {loading && <p>Loading posts...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && posts.length === 0 && <p>No posts available.</p>}
        {!loading && !error && posts.length > 0 && (
          posts.map((post) => (
            <div key={post.post_id} className="post-item">
              <h3>{post.user?.username || 'Unknown User'}</h3>
              <p>{post.message}</p>
              <div className="post-actions">
                <span>Likes: {post.likes}</span>
                <button onClick={() => handleLike(post.post_id)}>Like</button>
              </div>
              <div className="comments-section">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <p>{comment.body}</p>
                    <button onClick={() => handleEditComment(comment.id)}>Edit</button>
                    <button onClick={() => handleDeleteComment(post.post_id, comment.id)}>Delete</button>
                  </div>
                ))}
              </div>
              <div className="add-comment">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  cols={40}
                />
                <button onClick={() => handleComment(post.post_id)}>Post Comment</button>
              </div>
              {editCommentById && (
                <div className="edit-comment">
                  <textarea
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    placeholder="Edit comment..."
                    rows={2}
                    cols={40}
                  />
                  <button onClick={handleSaveEditedComment}>Save changes</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;


{post.comments.map((comment) => (
  <div key={comment.post_post_id} className="comment-box">
    {comment.message} 
    <br />
    <span>Likes: {comment.likes}</span> 
    <button className="button" onClick={() => handleEditComment(comment.post_post_id)}>Edit</button>
    <button className="button" onClick={() => handleDeleteComment(comment.post_post_id)}>Delete</button>
  </div>
))}