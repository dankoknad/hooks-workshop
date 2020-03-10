import React, { useState, useEffect, useReducer } from "react"
import FeedPost from "app/FeedPost"
import { loadFeedPosts, subscribeToNewFeedPosts } from "app/utils"
// import FeedFinal from './Feed.final'
// export default FeedFinal
export default Feed

const initialState = {
  fetching: false,
  posts: [],
  newPosts: [],
  time: Date.now(),
  limit: 1
}

const postsReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_POSTS":
      return { ...state, fetching: true }
    case "FETCH_POSTS_SUCCEEDED":
      return { ...state, fetching: false, posts: action.posts }
    case "NEW_POSTS":
      return { ...state, newPosts: action.newPosts }
    case "NEW_TIME":
      return { ...state, time: action.time }
    case "NEW_LIMIT":
      return { ...state, limit: action.limit }
    default:
      return state
  }
}

function Feed() {
  const [{ posts, newPosts, time, limit }, dispatch] = useReducer(
    postsReducer,
    initialState
  )

  useEffect(() => {
    return subscribeToNewFeedPosts(time, newPosts => {
      dispatch({ type: "NEW_POSTS", newPosts })
    })
  }, [time])

  useEffect(() => {
    let isCurrent = true

    isCurrent && dispatch({ type: "FETCH_POSTS" })

    loadFeedPosts(time, limit).then(posts => {
      if (isCurrent) dispatch({ type: "FETCH_POSTS_SUCCEEDED", posts })
    })

    return () => {
      isCurrent = false
    }
  }, [time, limit])

  return (
    <div className="Feed">
      {newPosts.length > 0 && (
        <div className="Feed_button_wrapper">
          <button
            className="Feed_new_posts_button icon_button"
            onClick={() => {
              dispatch({ type: "NEW_TIME", time: Date.now() })
              dispatch({ type: "NEW_LIMIT", limit: limit + newPosts.length })
            }}
          >
            View {newPosts.length} New Posts
          </button>
        </div>
      )}
      {posts.map(post => (
        <FeedPost key={post.id} post={post} />
      ))}
      <div className="Feed_button_wrapper">
        <button
          className="Feed_new_posts_button icon_button"
          onClick={() => {
            dispatch({ type: "NEW_LIMIT", limit: limit + 1 })
          }}
        >
          View More
        </button>
      </div>
    </div>
  )
}

// you can delete this
const fakePost = {
  createdAt: Date.now() - 10000,
  date: "2019-03-30",
  message: "Went for a run",
  minutes: 45,
  uid: "0BrC0fB6r2Rb5MNxyQxu5EnYacf2"
}
