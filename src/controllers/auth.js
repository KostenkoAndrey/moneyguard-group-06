import {
  logoutUser,
  refreshSession,
  requestPasswordReset,
  resetPassword,
} from '../services/auth.js';
import { registerUser, loginUser } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';
import { User } from '../db/models/user.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};


export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  const user = await User.findOne({ email: req.body.email });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      token: session.accessToken,
      user
    },
  });
};


//** register user   */
// export async function registerController(req, res) {
//   let photo = null;

//   if (req.file) {
//     if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
//       const result = await uploadToCloudinary(req.file.path);
//       photo = result.secure_url;
//     } else {
//       await fs.rename(
//         req.file.path,
//         path.resolve('src', 'uploads', req.file.filename),
//       );
//       photo = `http://localhost:3000/uploads/${req.file.filename}`;
//     }
//   }

//   const tempData = {
//     ...req.body,
//     photo,
//   };

//   const user = await registerUser(tempData);
//   res.status(201).json({
//     status: 201,
//     message: 'Successfully registered a user!',
//     data: user,
//   });
// }

//** login user  */
// export async function loginController(req, res) {
//   await loginUser(req.body.email, req.body.password);
//   const session = await loginUser(req.body.email, req.body.password);

//   res.cookie('sessionId', session._id, {
//     httpOnly: true,
//     expire: session.refreshTokenValidUntil,
//   });
//   res.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     expire: session.refreshTokenValidUntil,
//   });

//   const { name, email, balance } = await getUserInfo(
//     session._id,
//     session.refreshToken,
//   );

//   res.status(200).json({
//     status: 200,
//     message: 'User logged in successfully',
//     data: { token: session.accessToken, user: { name, email, balance } },
//   });
// }

//** logout user  */
export async function logoutController(req, res) {
  const { sessionId, refreshToken } = req.cookies;
  if (typeof sessionId == 'string' && typeof refreshToken == 'string') {
    await logoutUser(sessionId, refreshToken);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).end();
}

//** refresh session  */
export async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshSession(sessionId, refreshToken);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
}


//** request password reset   */
export async function requestPasswordResetController(req, res) {
  const { email } = req.body;
  await requestPasswordReset(email);
  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
}

//** reset password   */
export async function resetPasswordController(req, res) {
  const { token, password } = req.body;
  await resetPassword(token, password);
  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}

