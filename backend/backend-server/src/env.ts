export const env = () => {
  return {
    urls: {
      nginx: process.env.ISEE_NGINX_SERVICE_SERVICE_HOST || 'http://localhost',
    },
    mongodb: {
      host: process.env.MONGO_HOST || 'localhost',
      port: process.env.MONGO_PORT || 27017,
      user: process.env.MONGO_USER || 'root',
      pass: process.env.MONGO_PASSWORD || '',
      collection: process.env.MONGO_COLLECTION || 'iseeDB',
    },
    jwtSecret: process.env.BACKEND_JWT_SECRET,
    mailer: {
      email: process.env.BACKEND_MAILER_EMAIL || 'isee.webservice@gmail.com',
      password: process.env.BACKEND_MAILER_PASSWORD,
      service: process.env.BACKEND_MAILER_SERVICE || 'gmail',
    },
  };
};
