// Create the React components to show the data,
// which stores in Redux store, on the page.

import { createSlice, nanoid } from "@reduxjs/toolkit";

import { sub } from 'date-fns'

// the Redux store loads this ⬇️ when the app starts up
const initialState = [
  { 
    id: '1', 
    date: sub(new Date(), { minutes: 10 }).toISOString(), 
    title: 'First Post', 
    content: 'Hello', 
    user: '1',
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0,
      eyes: 0
    }
  },
  { 
    id: '2', 
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    title: 'Second Post', 
    content: 'More text', 
    user: '0',
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0,
      eyes: 0
    } 
  }
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    postAdded: {
      reducer(state, action) {
        //use `push` is safe, as React converts this mutation into
        //immutable update by using Immer library
        state.push(action.payload)
        // change current state
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
    postUpdated(state, action) {
      const {id, title, content} = action.payload
      const existingPost = state.find(post => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    }
  }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

// export whole postsSlice or just reducers ?
export default postsSlice.reducer
// when export two things, how to figure out which is imported
// like in store.js


// Every time we create a new slice,
// we need to add its reducer function to the Redux store.