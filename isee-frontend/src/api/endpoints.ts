const apiBase = 'http://localhost:4500/';

export default {
  apiBase,
  auth : {
    base  : apiBase + "auth",
    login : apiBase + "auth/login",
  },
  users : {
    base     : apiBase + "users",
    register : apiBase + "users/register",
  },
  videos : {
    base   : apiBase + "videos",
    from   : apiBase + "videos/from",
    search : apiBase + "videos/search",
  },
  thumbnails : {
    base : apiBase + "thumbnails"
  }
};
