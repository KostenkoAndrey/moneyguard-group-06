import {
    registerUser,
    loginUser,
    logoutUser,
    refreshSession
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

    res.status(200).json({
        status: 200,
        message: "User logged in successfully",
        data: { accessToken: session.accessToken },
    });
}

//** logout user  */
export async function logoutController(req, res) {
    // console.log(req.cookies);

    const { sessionId, refreshToken } = req.cookies;
    if (typeof sessionId == "string" && typeof refreshToken == "string") {
        await logoutUser(sessionId, refreshToken);
    }
    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");
    res.status(204).end();

    // res.send();
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