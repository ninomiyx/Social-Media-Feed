import { configureStore } from '@reduxjs/toolkit'

import postsReducer from '../features/posts/postsSlice'
import usersReducer from '../features/users/usersSlice'

export default configureStore({
  reducer: {
    // All the data for `state.posts` will be updated by
    // the `postsReducer` function when actions are dispatched.
    posts: postsReducer,
    users: usersReducer
  }
})
