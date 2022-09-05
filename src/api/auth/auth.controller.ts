import { Response, Request, NextFunction } from 'express'
import User from '../user/user.model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Tlogin, Tregistration } from './auth.schema'

export const createUser = async (req: Request<{}, {}, Tregistration>, res: Response, next: NextFunction) => {
    try {
        const {
            username,
            email,
            password
        } = req.body
    
        const foundUsername = await User.findOne({ username })
        const foundEmail = await User.findOne({ email })
        if (foundUsername || foundEmail) return res.status(409)

        const newUser = await User.create({
            username,
            email,
            password: await bcrypt.hash(password, 10)
        })

        console.log(newUser)
        
        return res.status(201).json({ msg: 'Pomyślnie utworzono użytkownka.' })
    } catch (err) {
        next(err)
    }
}

export const loginUser = async (req: Request<{}, {}, Tlogin>, res: Response, next: NextFunction) => {
    try {
        const cookies = req.cookies
        const {
            username,
            password
        } = req.body

        const foundUser = await User.findOne({ username })
        if (!foundUser) return res.status(404)

        const match = await bcrypt.compare(password, foundUser.password)
        if (!match) return res.status(401)

        const accessToken = jwt.sign(
            { username: foundUser.username },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: '1h' }  
        )
        const newRefreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '1d' } 
        )
        let newRefreshTokenArr = 
            !cookies?.jwt
                ? foundUser.refreshTokens
                : foundUser.refreshTokens.filter(rt => rt !== cookies.jwt)

        if (cookies?.jwt) {

            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();
        
            if (!foundToken) {
                newRefreshTokenArr = [];
            }
        
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        }
        
        foundUser.refreshTokens = [...newRefreshTokenArr, newRefreshToken];
        const result = await foundUser.save();

        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        return res.json({ accessToken });        

    } catch (err) {
        next(err)
    }
}
