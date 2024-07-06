export enum QUERY_KEYS {
  // AUTH KEYS
  CREATE_USER_ACCOUNT = "createUserAccount",

  // USER KEYS
  GET_CURRENT_USER = "getCurrentUser",
  GET_USERS = "getUsers",
  GET_USER_BY_ID = "getUserById",

  // POST KEYS
  GET_POSTS = "getPosts",
  GET_INFINITE_POSTS = "getInfinitePosts",
  GET_RECENT_POSTS = "getRecentPosts",
  GET_POST_BY_ID = "getPostById",
  GET_USER_POSTS = "getUserPosts",
  GET_FILE_PREVIEW = "getFilePreview",

  // SEARCH KEYS
  SEARCH_POSTS = "getSearchPosts",
  SEARCH_USERS = "getSearchUsers",

  // COMMENT KEYS
  GET_COMMENTS_BY_POST = "getCommentsByPost",

  // REPLY KEYS
  GET_REPLIES_BY_COMMENT = "getRepliesByComment",

  // FOLLOWERS & FOLLOWING
  GET_FOLLOWERS = "getFollowers",
  GET_FOLLOWEES = "getFollowees",
  GET_FOLLOWERS_DETAILS = "getFollowersDetails",
  GET_FOLLOWEES_DETAILS = "getFolloweesDetails",

  // FOLLOWED USERS POSTS
  GET_POSTS_FROM_FOLLOWED_USERS = "getPostsFromFollowedUsers",

  // PINNED POST
  GET_PINNED_POST = "getPinnedPost",
}
