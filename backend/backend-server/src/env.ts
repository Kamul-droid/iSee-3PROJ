export const env = () => {
  return {
    mongodb: {
      host: process.env.MONGO_HOST || 'localhost',
      port: process.env.MONGO_PORT || 27017,
      user: process.env.MONGO_USER || 'root',
      pass: process.env.MONGO_PASSWORD || '',
      collection: process.env.MONGO_COLLECTION || 'iseeDB',
    },
    jwtSecret: process.env.BACKEND_JWT_SECRET,
    
  };
};
