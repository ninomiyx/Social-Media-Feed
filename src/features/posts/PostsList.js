// a React component that show the list of posts

import React from 'react';
// React component read data from the Redux store using 
// the `useSelector` hook.
// Selector will re-run whenever the Redux store is updated
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

import { PostAuthor } from './postAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactionButtons';

export const PostsList = () => {
  const posts = useSelector(state => state.posts)

  // make a copy of posts and sort the copy
  const orderedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date))

  const renderedPosts = orderedPosts.map(post => (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
      <ReactionButtons post={post}/>
    </article>
  ))

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}
