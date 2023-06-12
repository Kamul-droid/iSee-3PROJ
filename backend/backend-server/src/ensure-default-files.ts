import * as fs from 'fs';
import {
  STATIC_PATH_PROFILE_PICTURES,
  STATIC_PATH_THUMBNAILS,
  STATIC_PATH_VIDEOS,
} from './ensure-static-paths';

export const DEFAULT_VIDEO = 'default-video.source';
export const DEFAULT_THUMBNAIL = 'default-thumbnail.jpg';
export const DEFAULT_AVATAR = 'default-avatar.jpg';

export const ensureDefaultFiles = () => {
  try {
    [
      `${STATIC_PATH_VIDEOS}/${DEFAULT_VIDEO}`,
      `${STATIC_PATH_THUMBNAILS}/${DEFAULT_THUMBNAIL}`,
      `${STATIC_PATH_PROFILE_PICTURES}/${DEFAULT_AVATAR}`,
    ].forEach((path) => {
      if (!fs.existsSync(path)) {
        const fileName = path.split('/').pop();
        console.log(`Copying /${fileName} to ${path}`);
        fs.copyFileSync(`/${fileName}`, path);
      }
    });
  } catch (error) {
    console.error(
      `Failed to find default files, 
please make sure the following are present at the root of your container: 
"${DEFAULT_VIDEO}", "${DEFAULT_THUMBNAIL}" and ${DEFAULT_AVATAR}. 
error: ${error}`,
    );
    console.info(
      'Some default files are missing, the website will work but default avatars may not appear in production',
    );
  }
};
