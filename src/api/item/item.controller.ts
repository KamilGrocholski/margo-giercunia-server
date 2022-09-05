import { NextFunction, Request, Response } from "express"
import Monster from "../monster/monster.model"
import Item, { IItem } from "./item.model"
import { Tcreate } from "./item.schema"

export const getAll = async (req: Request, res: Response<{ items: Partial<IItem[]> }>, next: NextFunction) => {
    try {
        const foundItems = await Item.find()
        if (!foundItems) return res.status(404)
        return res.status(200).json({ items: foundItems })
    } catch (err) {
        next(err)
    }
}

export const createItem = async (req: Request<{}, {}, Tcreate>, res: Response, next: NextFunction) => {
    try {
        const {
            name,
            lvl,
            img,
            rarity,
            monster
        } = req.body
        const foundName = await Item.findOne({ name })
        const foundImg = await Item.findOne({ img })
        if (foundName || foundImg) return res.status(401)

        const foundMonster = await Monster.findOne({ name: monster })
        if (!foundMonster) return res.status(404)

        const newItem = await Item.create({
            name,
            lvl,
            img,
            rarity,
            monster: foundMonster._id
        })
        console.log(newItem)

        return res.status(200)

    } catch (err) {
        next(err)
    }
}