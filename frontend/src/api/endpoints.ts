// const apiBase = 'http://localhost:4500'; // Déploiement avec Docker Compose
const apiBase = 'http://localhost:30080'; // Déploiement avec Kubernetes

export default {
  apiBase,
  auth: {
    base: apiBase + '/auth',
    login: apiBase + '/auth/login',
    register: apiBase + '/auth/register',
  },
  users: {
    base: apiBase + '/users',
    setProfilePicture: apiBase + '/users/set-profile-picture',
    validateMail: apiBase + '/users/validate-email',
    sendValidationEmail: apiBase + '/users/send-validation-email',
  },
  videos: {
    base: apiBase + '/videos',
    from: apiBase + '/videos/from',
    search: apiBase + '/videos/search',
  },
  thumbnails: {
    base: apiBase + '/thumbnails',
  },
  comments: {
    base: apiBase + '/comments',
    fromVideo: apiBase + '/comments/from-video',
  },
  adminDashboard: {
    base: apiBase + '/admin-dashboard',
  },
};
