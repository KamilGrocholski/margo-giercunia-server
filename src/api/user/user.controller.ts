import { Request, Response, NextFunction } from 'express'
import User from "./user.model"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req: Request<{}, {}, { username: string, password: string }>, res: Response, next: NextFunction) => {
    try {
        const {
            username,
            password
        } = req.body

        if (!(username || password)) return res.status(400)
        
        const foundUser = await User.findOne({ username })
        if (foundUser) return res.status(401)
    
        const newUser = await User.create({
            username,
            password: await bcrypt.hash(password, 10)
        })
    
        console.log(newUser)
        return res.status(200)
    } catch (err) {
        next(err)
    } 
}

export const login = async (req: Request<{}, {}, { username: string, password: string }>, res: Response<{ accessToken: string }>, next: NextFunction) => {
    try {
        const cookies = req.cookies
        const cookiesRefreshToken = cookies.refreshToken
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' })
        console.log(cookiesRefreshToken)
        const {
            username,
            password
        } = req.body

        if (!(username || password)) return res.sendStatus(400)
        
        const foundUser = await User.findOne({ username })
        if (!foundUser) return res.sendStatus(403)

        const isMatch = bcrypt.compare(password, foundUser.password)
        if (!isMatch) return res.sendStatus(403)

        const accessToken = jwt.sign(
            { username: foundUser.username },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: '15m' }
        )
        const newRefreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '30d' }
        )

        let newRefreshTokenArray = 
            cookiesRefreshToken 
                ? foundUser.refreshTokens.filter(rf => rf !== cookiesRefreshToken)
                : foundUser.refreshTokens

        newRefreshTokenArray = [...newRefreshTokenArray, newRefreshToken]
        foundUser.refreshTokens = newRefreshTokenArray
        const saveResult = await foundUser.save()  
        console.log(saveResult)

        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, secure: true, sameSite: 'none' })
        return res.status(200).json({ accessToken })
    } catch (err) {
        next(err)
    }
}

export const refresh = async (req: Request, res: Response<{ accessToken: string, role: string }>, next: NextFunction) => {
    try {
        const cookies = req.cookies
        if (!cookies?.refreshToken) return res.sendStatus(403)
        const cookiesRefreshToken = cookies.refreshToken
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' })
        console.log(cookiesRefreshToken)


        const foundUserByToken = await User.find({ cookiesRefreshToken })
        console.log(foundUserByToken)
        if (!foundUserByToken) return res.sendStatus(403)

        const decoded = jwt.verify(
            cookiesRefreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        ) as { username: string }

        if (!decoded?.username) return res.sendStatus(403)

        const foundUser = await User.findOne({ username: decoded.username })
        if (!foundUser) return res.sendStatus(403)

        const accessToken = jwt.sign(
            { username: foundUser.username },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: '15m' }
        )
        const newRefreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '30d' }
        )

        let newRefreshTokenArray = 
            cookiesRefreshToken 
                ? foundUser.refreshTokens.filter(rf => rf !== cookiesRefreshToken)
                : foundUser.refreshTokens

        newRefreshTokenArray = [...newRefreshTokenArray, newRefreshToken]
        foundUser.refreshTokens = newRefreshTokenArray
        const saveResult = await foundUser.save()  
        console.log(saveResult)

        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, secure: true, sameSite: 'none' })

        return res.status(200).json({ accessToken, role: foundUser.role })
    } catch (err) {
        next(err)
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = req.cookies
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' })
        const cookiesRefreshToken = cookies?.refreshToken

        const foundUser = await User.findOne({ cookiesRefreshToken })
        if (!foundUser) {
            return res.sendStatus(403)
        }
        let newRefreshTokenArray = foundUser.refreshTokens.filter(rf => rf !== cookiesRefreshToken)

        foundUser.refreshTokens = newRefreshTokenArray
        const saveResult = await foundUser.save()  
        console.log(saveResult)

        return res.sendStatus(200)
    } catch (err) {
        next(err)
    }
}

export const getUsersByMonstersKills = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const foundUsers = await User.aggregate([
            { $sort: { 'totalStats.monstersKills': -1 } },
            { $project: { 'password': 0, 'refreshTokens': 0, '_id': 0, '__v': 0 } }
        ])
        return res.status(200).json(foundUsers)
    } catch (err) {
        next(err)
    }
}