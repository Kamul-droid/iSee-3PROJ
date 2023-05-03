const apiBase = 'http://localhost:4500/';

export default {
  apiBase,
  auth : {
    base     : apiBase + 'auth',
    login    : apiBase + 'auth/login',
    register : apiBase + 'auth/register',
  },
  users : {
    base              : apiBase + 'users',
    setProfilePicture : apiBase + 'users/set-profile-picture',
  },
  videos : {
    base   : apiBase + 'videos',
    from   : apiBase + 'videos/from',
    search : apiBase + 'videos/search',
  },
  thumbnails : {
    base : apiBase + 'thumbnails',
  },
  comments : {
    base      : apiBase + 'comments',
    fromVideo : apiBase + 'comments/from-video',
  },
};
