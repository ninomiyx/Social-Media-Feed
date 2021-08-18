// Create the React components to show the data,
// which stores in Redux store, on the page.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { client } from '../../api/client'

// the Redux store loads this ⬇️ when the app starts up
const initialState = {
  posts: [],
  status: 'idle',
  error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.posts
})

export const addNewPost = createAsyncThunk(
  'post/addNewPost',
  // initialPost, receives `{title, content, user}` object
  async initialPost => {
    // send this post to the fake API server
    const response = await client.post('/fakeApi/posts', { post: initialPost })
    // receive this post(packed, like initialize reactions) from API
    return response.post
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    
    postUpdated(state, action) {
      const {id, title, content} = action.payload
      const existingPost = state.posts.find(post => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    }    
  },

  extraReducers: {
    [fetchPosts.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchPosts.fulfilled]: (state, action) => {
      // change state.status and add fetched posts
      state.status = 'succeeded'
      state.posts = state.posts.concat(action.payload)
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    [addNewPost.fulfilled]: (state, action) => {
      // use `push` is safe, as React converts this mutation into
      // immutable update by using Immer library
      state.posts.push(action.payload)
      // add new post object to current posts array
    }
  }
})


/**
 * postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
            reactions: {
              thumbsUp: 0,
              hooray: 0,
              heart: 0,
              rocket: 0,
              eyes: 0
            } 
          }
        }
      }
    },
 */



export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) => 
  state.posts.posts.find(post => post.id === postId)


// Every time we create a new slice,
// we need to add its reducer function to the Redux store.