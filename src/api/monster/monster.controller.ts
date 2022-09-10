import { NextFunction, Request, Response } from "express"
import Monster, { IMonster } from "./monster.model"
import { Tcreate } from "./monster.schema"

export const getAll = async (req: Request, res: Response<Partial<IMonster[]>>, next: NextFunction) => {
    try {
        const foundMonsters = await Monster.find().populate('items').sort({ 'lvl': 1 })
        if(!foundMonsters) return res.sendStatus(404)
        return res.status(200).json(foundMonsters)
    } catch(err) { 
        next(err)
    }
}

export const createMonster = async (req: Request<{}, {}, Tcreate>, res: Response<IMonster>, next: NextFunction) => {
    try {
        const {
            name,
            lvl,
            img,
            type
        } = req.body

        const foundMonster = await Monster.findOne({ name })
        if (foundMonster) return res.sendStatus(401)

        const newMonster = await Monster.create({
            name,
            lvl,
            img,
            type
        })
        console.log(newMonster)

        return res.status(200).json(newMonster)

    } catch (err) {
        next(err)
    }
}

export const getMonsterByName = async (req: Request<{}, {}, {}, { name: string }>, res: Response<IMonster>, next: NextFunction) => {
    try {
        const {
            name
        } = req.query

        const foundMonster = await Monster.findOne({ name })
        if (!foundMonster) return res.sendStatus(404)

        return res.status(200).json(foundMonster)
    } catch (err) {
        next(err)
    }
}

export const editMonster = async (req: Request<{}, {}, Tcreate, { _id: string }>, res: Response<IMonster>, next: NextFunction) => {
    try {
        const {
            _id
        } = req.query

        const foundMonster = await Monster.findOne({ _id })
        if (!foundMonster) return res.sendStatus(404)

        const {
            name: newName,
            lvl: newLvl,
            type: newType,
            img: newImg
        } = req.body

        foundMonster.name = newName,
        foundMonster.lvl = newLvl,
        foundMonster.type = newType,
        foundMonster.img = newImg

        const saveResult = await foundMonster.save()

        console.log(saveResult)
        return res.status(200).json(saveResult)
    } catch (err) {
        next(err)
    }
}