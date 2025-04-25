import { User } from '../db/models/user.js';
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshSession,
    getUserInfo
} from "../services/auth.js";


//** register user   */
export async function registerController(req, res) {
    const user = await registerUser(req.body);
    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        data: user,
    });
}


//** login user  */
export async function loginController(req, res) {
    await loginUser(req.body.email, req.body.password);

    const session = await loginUser(req.body.email, req.body.password);

    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });
    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });

    const { name, email, balance } = await getUserInfo(session._id, session.refreshToken);
    res.status(200).json({
        status: 200,
        message: "User logged in successfully",
        data: { token: session.accessToken, user: { name, email, balance } },
    },
    );
}



//** logout user  */
export async function logoutController(req, res) {
    const { sessionId, refreshToken } = req.cookies;
    if (typeof sessionId == "string" && typeof refreshToken == "string") {
        await logoutUser(sessionId, refreshToken);
    }
    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");
    res.status(204).end();
};


//** refresh session  */
export async function refreshController(req, res) {
    const { sessionId, refreshToken } = req.cookies;

    const session = await refreshSession(sessionId, refreshToken);

    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });
    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });

    res.status(200).json({
        status: 200,
        message: "Successfully refreshed a session!",
        data: { accessToken: session.accessToken },
    });
}


//** User Info   */
export async function userInfoController(req, res) {
    const { sessionId, refreshToken } = req.cookies;
    const session = await getUserInfo(sessionId, refreshToken);
    const temp = {
        id: session._id,
        name: session.name,
        email: session.email,
        balance: session.balance,
    };

    res.status(200).json({
        status: 200,
        message: "Successfully found user info!",
        data: temp,
    });
};

