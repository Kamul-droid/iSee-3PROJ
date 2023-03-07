const apiBase = 'http://localhost:80/';

export default {
  auth : {
    base  : apiBase + "auth",
    login : apiBase + "auth/login",
  },
  users : {
    base     : apiBase + "users",
    register : apiBase + "users/register",
  }
};
