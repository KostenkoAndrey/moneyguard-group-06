import createHttpError from "http-errors";
import { Session } from "../db/models/session.js";
import { User } from "../db/models/user.js";


export async function authenticate(req, res, next) {
    // console.log(req.headers);
    const { authorization } = req.headers;
    if (typeof authorization !== 'string') {
        return next(createHttpError(401, 'Access token expired'));
    }
    console.log("Authorization header:", authorization);

    const [bearer, accessToken] = authorization.split(' ', 2);
    if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
        return next(createHttpError(401, 'Access token expired'));
    }
    console.log("Bearer:", bearer);
    console.log("Access Token:", accessToken);

    //** Who(user) owns this access token? **/
    const session = await Session.findOne({ accessToken });

    if (session === null) {
        return next(createHttpError(401, 'Access not found'));
    }
    if (session.accessTokenValidUntil < new Date()) {
        return next(createHttpError(401, 'Access token expired'));
    }

    //Tx to server - Who from the users made the request?/
    const user = await User.findById(session.userId);
    if (user === null) {
        return next(createHttpError(401, 'User not found'));
    }
    req.user = {
        id: user._id,
        name: user.name
    };
    next();
}
