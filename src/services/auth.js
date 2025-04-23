import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import createHttpError from 'http-errors';

//** register user   */
export async function registerUser(payload) {
    const user = await User.findOne({ email: payload.email });
    if (user) {
        throw new createHttpError(409, 'Email in use');
    }
    payload.password = await bcrypt.hash(payload.password, 10);

    return User.create(payload);
}

//** login user  */
export async function loginUser(email, password) {
    const user = await User.findOne({ email });
    if (user === null) {
        throw createHttpError.Unauthorized('Email or password is incorrect');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch !== true) {
        throw createHttpError.Unauthorized('Email or password is incorrect');
    }
    await Session.deleteOne({ userId: user._id });

    return Session.create({
        userId: user._id,
        // accessToken: "accessToken",
        accessToken: crypto.randomBytes(30).toString('base64'),
        // refreshToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: "refreshToken",
        accessTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 15 хвилин
        refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 днів
    });
}

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
        // accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 min
        accessTokenValidUntil: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
        refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
}
//** User info service */
export async function getUserInfo(sessionId, refreshToken) {
    const currentSession = await Session.findOne({ _id: sessionId, refreshToken });

    if (currentSession === null) {
        throw createHttpError.Unauthorized('Session not found');
    }
    if (currentSession.refreshTokenValidUntil < new Date()) {
        throw createHttpError.Unauthorized('Access token expired');
    }
    const user = await User.findOne();
    return user;
};

