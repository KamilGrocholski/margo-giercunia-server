import { NextFunction, Request, Response } from "express"
import Monster from "../monster/monster.model"
import Item, { IItem } from "./item.model"
import { Tcreate } from "./item.schema"
import { Types } from "mongoose"
import monsterModel from "../monster/monster.model"

export const getAll = async (req: Request, res: Response<Partial<IItem[]>>, next: NextFunction) => {
    try {
        const foundItems = await Item.find()
        if (!foundItems) return res.sendStatus(404)
        return res.status(200).json(foundItems)
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
        if (foundName || foundImg) return res.sendStatus(401)

        const foundMonster = await Monster.findOne({ name: monster })
        if (!foundMonster) return res.sendStatus(404)

        console.log(foundMonster)
        const newItem = await Item.create({
            name,
            lvl,
            img,
            rarity,
            monster: foundMonster._id
        })

        const updatedMonster = await Monster.findByIdAndUpdate(
            foundMonster._id,
            {
                $push: {
                    items: newItem._id
                }
            },
            {
                new: true
            }
        )

        console.log(newItem)
        console.log(updatedMonster)

        return res.status(200).json({ newItem })
    } catch (err) {
        next(err)
    }
}
