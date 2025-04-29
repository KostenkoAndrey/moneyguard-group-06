import { updateUser, userGetInfo } from '../services/user.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';


export async function getUserController(req, res, next) {

  const user = await userGetInfo(req.user.id);

if(!user) {
  next(createHttpError(404, 'User not found'));
  return;
}

  res.status(200).json({
    status: 200,
    message: 'Successfully found user info!',
    data: user,
  });
}

export async function patchUserController(req, res, next) {
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const result = await updateUser(req.user.id, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'User not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated a user!',
    data: { result },
  });
}
