// a React component that show the list of posts

import React, { useEffect } from 'react';
// React component read data from the Redux store using 
// the `useSelector` hook.
// Selector will re-run whenever the Redux store is updated
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'

import { PostAuthor } from './postAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactionButtons';

import { selectAllPosts, fetchPosts, selectPostById } from './postsSlice';

let PostExcerpt = ({ postId }) => {
  const post = useSelector((state) => selectPostById(state, postId))

  return (
    <article className="post-excerpt" key={post.id}>
    <h3>{post.title}</h3>
    <div>
      <PostAuthor userId={post.user} />
      <TimeAgo timestamp={post.date} />
    </div>
    <p className="post-content">{post.content.substring(0, 100)}</p>
    <ReactionButtons post={post}/>
    <Link to={`/posts/${post.id}`} className="button muted-button">
      View Post
    </Link>
  </article>
  )
}

export const PostsList = () => {
  const dispatch = useDispatch()
  const posts = useSelector(selectAllPosts)

  const postStatus = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  // When fetch data, use useEffect hook
  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  let content

  if (postStatus === 'loading') {
    content = <div className="loader">Loading...</div>
  } else if (postStatus === 'succeeded') {
    // make a copy of posts(.slice()) 
    // and sort the copy in reverse chronological order
    const orderedPosts = posts
      .slice()
      .sort((a,b) => b.date.localeCompare(a.date))
    
    content = orderedPosts.map(post => (
      <PostExcerpt key={post.id} postId={post.id} />
    ))
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
