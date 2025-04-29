import crypto, { randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import createHttpError from 'http-errors';
import { sendEmail } from '../utils/sendEmail.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import path from 'node:path';
import handlebars from 'handlebars';
import { THIRTY_DAY, ONE_DAY } from '../constants/index.js';

const RESET_PWD_TEMPLATE = fs.readFileSync(path.resolve('src/templates/reset-password.hbs'), 'utf-8');


export const registerUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });
    if (user) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    return await User.create({
      ...payload,
      password: encryptedPassword,
    });
  };


  export const loginUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    const isEqual = await bcrypt.compare(payload.password, user.password);

    if (!isEqual) {
      throw createHttpError(401, 'Unauthorized');
    }

    await Session.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + ONE_DAY),
      refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
    });
  };


//** register user   */
// export async function registerUser(payload) {
//     const user = await User.findOne({ email: payload.email });
//     if (user) {
//         throw new createHttpError(409, 'Email in use');
//     }
//     payload.password = await bcrypt.hash(payload.password, 10);

//     return User.create(payload);
// }

//** login user  */
// export async function loginUser(email, password) {
//     const user = await User.findOne({ email });
//     if (user === null) {
//         throw createHttpError.Unauthorized('Email or password is incorrect');
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (isMatch !== true) {
//         throw createHttpError.Unauthorized('Email or password is incorrect');
//     }
//     await Session.deleteOne({ userId: user._id });

//     return Session.create({
//         userId: user._id,
//         accessToken: crypto.randomBytes(30).toString('base64'),
//         refreshToken: crypto.randomBytes(30).toString('base64'),
//         accessTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 15 хвилин
//         refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 днів
//     });
// }

//** logout user  */
export async function logoutUser(sessionId, refreshToken) {
    await Session.deleteOne({ _id: sessionId, refreshToken });
    return undefined;
}

//** refresh session  */
export async function refreshSession(sessionId, refreshToken) {
    const currentSession = await Session.findOne({ _id: sessionId, refreshToken });
    if (currentSession === null) {
        throw createHttpError.Unauthorized('Session not found');
    }
    if (currentSession.refreshTokenValidUntil < new Date()) {
        throw createHttpError.Unauthorized('Access token expired');
    }

    await Session.deleteOne({
        _id: currentSession._id,
        refreshToken: currentSession.refreshToken,
    });

    return Session.create({
        userId: currentSession.userId,
        accessToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
        refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
}
//** User info service */
export async function getUserInfo(sessionId, refreshToken,) {
    const currentSession = await Session.findOne({ _id: sessionId, refreshToken });
    if (currentSession === null) {
        throw createHttpError.Unauthorized('Session not found');
    }
    if (currentSession.refreshTokenValidUntil < new Date()) {
        throw createHttpError.Unauthorized('Access token expired');
    }
    const user = await User.findOne({ _id: currentSession.userId });
    return user;
};



//** request password reset  **/
export async function requestPasswordReset(email) {
    const user = await User.findOne({ email });
    if (user === null) {
        throw createHttpError.NotFound('User not found');
    }
    const token = jwt.sign(
        {
            sub: user._id,
            name: user.name
        },
        getEnvVar('JWT_SECRET'),
        { expiresIn: '5m' });

    const template = handlebars.compile(RESET_PWD_TEMPLATE);
    await sendEmail(
        email,
        'Reset your password',
        template({ token }),
    );
}


//** reset password  **/
export async function resetPassword(token, password) {

    try {
        const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));
        const user = await User.findById(decoded.sub);

        if (user === null) {
            throw createHttpError.NotFound('User not found!');
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw createHttpError.Unauthorized('Token is expired or invalid.');
        }
        if (error.name === 'TokenExpiredError') {
            throw createHttpError.Unauthorized('Token is expired or invalid.');
        }
        throw error;
    }
}

//**          UPDATE-CONTACTS:ID          ***//
export async function updateContact(userId, contact) {
    return User.findOneAndUpdate({ _id: userId }, contact, {
        new: true
    });
}

