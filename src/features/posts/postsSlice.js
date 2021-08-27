// Create the React components to show the data,
// which stores in Redux store, on the page.

import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { client } from '../../api/client'

// createEntityAdapter
// provide a standardized way to store data
// {ids: [], entities: {}}
const postsAdapter = createEntityAdapter({
  // sort the ids
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

// the Redux store loads this ⬇ when the app starts up
const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null
})
// ⬆ getInitialState, return {ids: [], entities: {}} 
// now posts are in entities

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
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    
    postUpdated(state, action) {
      const {id, title, content} = action.payload
      const existingPost = state.entities[id]
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
      // Add fetched posts to the array
      // Use the `upsertMany` reducer as a mutating update utility
      postsAdapter.upsertMany(state, action.payload)
      // if items in action.payload already existing
      // `upsertMany` will merge them base on matching IDs
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    // Use the `addOne` reducer for the fulfilled case
    [addNewPost.fulfilled]: postsAdapter.addOne
  }
})

export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts)

// createSelector
// will create a memoized selector function
// means it will save previous inputs and calculated result
// if current inputs are the same
// this function will return previous result instead of calculating it again
export const selectPostByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
)
// ⬆only calculate when posts OR userId have changed


// Every time we create a new slice,
// we need to add its reducer function to the Redux store.