import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Userfetch from './FetchData/User'; // Import Userfetch correctly

interface Users {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  bio: string;
  user_id: number;
}

interface Post {
  post_id: number;
  user: Users;
  body: string;
  comments: Comment[];
  likes: number;
  shares: number;
}

interface Comment {
  id: number;
  body: string;
  like: number;
}

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostMessage, setNewPostMessage] = useState<string>('');
  const [newComment, setNewComment] = useState<string>(''); 
  const [editCommentById, setEditCommentById] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>('');
  const [nextCommentId, setNextCommentId] = useState<number>(1);
  const [currentUser, setCurrentUser] = useState<Users | null>(null);

  useEffect(() => {
    // Fetch current user
    async function fetchCurrentUser() {
      try {
        const currentUserURL = Userfetch.loadLocal(); // Fetch the URL/ID from local
        if (currentUserURL) {
          const response = await axios.get(currentUserURL);
          console.log('Fetched current user:', response.data);
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    }

    // Fetch posts
    async function fetchPosts() {
      try {
        const response = await axios.get('http://localhost:8080/users/posts');
        console.log('Fetched posts:', response.data);
        setPosts(response.data);
      } catch (error) {
        console.error('Fetching posts error:', error);
      }
    }

    fetchCurrentUser();
    fetchPosts();
  }, []);

  // Handle like
  async function handleLike(user_id: number, post_id: number) {
    try {
      await axios.put(`http://localhost:8080/users/posts/${user_id}/${post_id}/like`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === post_id ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  }

  // Handle share
  async function handleShare(user_id: number, post_id: number) {
    try {
      await axios.put(`http://localhost:8080/users/posts/${user_id}/${post_id}/share`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === post_id ? { ...post, shares: post.shares + 1 } : post
        )
      );
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  }

  // Handle new comment
  const handleComment = async (post_id: number) => {
    if (newComment.trim() === '') return;

    try {
      const comment: Comment = {
        id: nextCommentId,
        body: newComment,
        like: 0,
      };

      await axios.post(`http://localhost:8080/users/posts/${post_id}/comment`, comment, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === post_id ? { ...post, comments: [...post.comments, comment] } : post
        )
      );

      setNewComment('');
      setNextCommentId(nextCommentId + 1);
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  // Handle new post
  async function handleNewPost() {
    if (!currentUser) {
      console.error('User not logged in');
      return;
    }

    try {
      const newPost = {
        user: currentUser,
        body: newPostMessage, // Changed from message to body to match interface
        likes: 0,
        shares: 0,
        comments: [],
      };

      const response = await axios.post(`http://localhost:8080/users/posts/${currentUser.user_id}`, newPost);
      setPosts((prevPosts) => [...prevPosts, response.data]);
      setNewPostMessage('');
    } catch (error) {
      console.error('Error creating new post:', error);
    }
  }

  // Handle edit comment
  function handleEditComment(id: number) {
    const comment = posts.flatMap((post) => post.comments).find((comment) => comment.id === id);
    if (comment) {
      setEditCommentById(id);
      setEditCommentText(comment.body);
    }
  }

  // Save edited comment
  const handleSaveEditedComment = () => {
    if (editCommentById !== null) {
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
    }
  };

  // Handle delete comment
  function handleDeleteComment(post_id: number, comment_id: number) {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.post_id === post_id
          ? {
              ...post,
              comments: post.comments.filter((comment) => comment.id !== comment_id),
            }
          : post
      )
    );
  }

  return (
    <div>
      <h1>Create a Post</h1>
      <textarea
        value={newPostMessage}
        onChange={(e) => setNewPostMessage(e.target.value)}
        placeholder="What's on your mind?"
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={handleNewPost}>Post</button>

      <h1>Posts</h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.post_id} className="post">
            <h2>{post.user.username}'s Post</h2>
            <h4>{post.body}</h4>
            <div>
              {post.comments.map((comment) => (
                <div key={comment.id} className="comment-box">
                  {comment.body}
                  <br />
                  <button className="button" onClick={() => handleLike(post.user.user_id, post.post_id)}>Like({post.likes})</button>
                  <button className="button" onClick={() => handleShare(post.user.user_id, post.post_id)}>Share({post.shares})</button>
                  <button className="button" onClick={() => handleEditComment(comment.id)}>Edit</button>
                  <button className="button" onClick={() => handleDeleteComment(post.post_id, comment.id)}>Delete</button>
                </div>
              ))}
              <div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  cols={40}
                />
                <button onClick={() => handleComment(post.post_id)}>Post Comment</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

export default Posts;
