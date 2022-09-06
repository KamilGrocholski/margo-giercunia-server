import { Response, Request, NextFunction } from 'express'
import User, { IUser } from './user.model'
import { TgetOneByName } from './user.schema'

export const getAll = async (req: Request, res: Response<Partial<IUser[]>>, next: NextFunction) => {
    try {
        const foundUsers = await User.find().select('role exp username avatar itemsOwned _id')
        return res.status(200).json(foundUsers) 
    } catch (err) {
        next(err)
    }
}

export const getOneByName = async (req: Request<TgetOneByName>, res: Response<Partial<IUser>>, next: NextFunction) => {
    try {
        const { username } = req.params
        const foundUser = await User.findOne({ username }).select('role exp username avatar itemsOwned _id')
        if (!foundUser) return res.status(404)
        return res.status(200).json(foundUser)
    } catch (err) {
        next(err)
    }
}