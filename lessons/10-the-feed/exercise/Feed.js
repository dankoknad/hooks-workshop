import React, { useState, useEffect, useRef } from "react"
import FeedPost from "app/FeedPost"
import { loadFeedPosts, subscribeToNewFeedPosts } from "app/utils"
// import FeedFinal from './Feed.final'
// export default FeedFinal
export default Feed

function Feed() {
  const [posts, setPosts] = useState([])
  const [upcommingPosts, setUpcommingPosts] = useState([])
  let isCanceled = useRef();

  const getPosts = async e => {
    const createdBefore = posts.length
      ? posts[posts.length - 1].createdAt
      : Date.now();

    const newPosts = await loadFeedPosts(createdBefore, 2);
    isCanceled.current || setPosts(posts.concat(newPosts));
  }

  const loadUpcommingPosts = () => {
    setPosts(upcommingPosts.concat(posts));
    setUpcommingPosts([]);
  }

  useEffect(() => {
    getPosts()
    return () => { isCanceled.current = true }
  }, [])

  useEffect(() => {
    const createdAfter = posts.length
      ? posts[0].createdAt
      : Date.now();

    return subscribeToNewFeedPosts(createdAfter, setUpcommingPosts)
  }, [])

  return (
    <div className="Feed">
      {upcommingPosts.length > 0 && <div className="Feed_button_wrapper">
        <button className="Feed_new_posts_button icon_button" onClick={loadUpcommingPosts}>
          View {upcommingPosts.length} New Posts
        </button>
      </div>}

      {posts.map(post => (
        <FeedPost key={post.id} post={post} />
      ))}

      <div className="Feed_button_wrapper">
        <button className="Feed_new_posts_button icon_button" onClick={getPosts}>View More</button>
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

