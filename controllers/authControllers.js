import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import { createRegisterSchema } from "../schemas/authSchemas.js";
import User from "../models/authModel.js"
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

export const register = async (req, res) => {
    const { email, password } = req.body;

    const { error } = createRegisterSchema.validate(req.body);

    if (error) {
        return res.status(400).send({ message: HttpError(400).message });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // add avatar

    const avatarURL = gravatar.url(email, { s: 250, d: "identicon" }, true);
    console.log(avatarURL);

    const user = {
        email,
        password: passwordHash,
        avatarURL,
    }

    try {
        const newUser = await User.create(user);
        res.status(201).send({ user: { email: newUser.email, subscription: newUser.subscription } });
    } catch (err) {
        res.status(409).send({ message: HttpError(409).message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    const { error } = createRegisterSchema.validate(req.body);

    if (error) {
        return res.status(400).send({ message: HttpError(400).message });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send({ message: HttpError(401, "Email or password is wrong").message });
        }

        const isRegistered = await bcrypt.compare(password, user.password);

        if (!isRegistered) {
            return res.status(401).send({ message: HttpError(401, "Email or password is wrong").message });
        }

        // create token

        const payload = {
            email,
            password: user.password,
            id: user._id
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

        const newUser = await User.findByIdAndUpdate({ _id: user._id }, { token });

        res.status(200).send({ user: { email: newUser.email, subscription: newUser.subscription }, token });
    } catch (err) {
        res.status(401).send({ message: HttpError(401).message });
    }
}

export const logout = async (req, res) => {
    // errors are catching in authMiddleware.js
    const authorizationHeader = req.headers.authorization.split(" ");
    const token = authorizationHeader[1];

    const data = jwt.decode(token);

    await User.findByIdAndUpdate(data.id, { token: null });

    res.status(204).end()
}

export const current = async (req, res) => {
    // errors are catching in authMiddleware.js

    const authorizationHeader = req.headers.authorization.split(" ");
    const token = authorizationHeader[1];

    const data = jwt.decode(token);

    const result = await User.findById(data.id);

    res.status(200).send({ email: result.email });
}