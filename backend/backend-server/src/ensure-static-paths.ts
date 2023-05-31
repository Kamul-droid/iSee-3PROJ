import * as fs from 'fs';

export const STATIC_PATH_BASE = '/usr/src/static';
export const STATIC_PATH_VIDEOS = `${STATIC_PATH_BASE}/videos`;
export const STATIC_PATH_THUMBNAILS = `${STATIC_PATH_BASE}/thumbnails`;
export const STATIC_PATH_PROFILE_PICTURES = `${STATIC_PATH_BASE}/profile-pictures`;

export const ensureStaticPaths = () => {
  [
    STATIC_PATH_VIDEOS,
    STATIC_PATH_THUMBNAILS,
    STATIC_PATH_PROFILE_PICTURES,
  ].forEach((path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  });
};
