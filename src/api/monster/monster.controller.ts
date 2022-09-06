import { NextFunction, Request, Response } from "express"
import Monster, { IMonster } from "./monster.model"
import { Tcreate } from "./monster.schema"

export const getAll = async (req: Request, res: Response<Partial<IMonster[]>>, next: NextFunction) => {
    try {
        const foundMonsters = await Monster.find().populate('items')
        if(!foundMonsters) return res.status(404)
        return res.status(200).json(foundMonsters)
    } catch(err) {
        next(err)
    }
}

export const createMonster = async (req: Request<{}, {}, Tcreate>, res: Response, next: NextFunction) => {
    try {
        const {
            name,
            lvl,
            img,
            type
        } = req.body

        const foundMonster = await Monster.findOne({ name })
        if (foundMonster) return res.status(401)

        const newMonster = await Monster.create({
            name,
            lvl,
            img,
            type
        })
        console.log(newMonster)

        res.status(200)

    } catch (err) {
        next(err)
    }
}