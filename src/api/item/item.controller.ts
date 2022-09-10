import { NextFunction, Request, Response } from "express"
import Monster from "../monster/monster.model"
import Item, { IItem } from "./item.model"
import { Tcreate } from "./item.schema"

export const getAll = async (req: Request, res: Response<Partial<IItem[]>>, next: NextFunction) => {
    try {
        const foundItems = await Item.find()
        console.log(foundItems)
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

export const editItem = async (req: Request<{}, {}, Tcreate, { _id: string }>, res: Response<IItem>, next: NextFunction) => {
    try {
        const {
            _id
        } = req.query

        const {
            name,
            lvl,
            img,
            rarity,
            monster
        } = req.body

        const foundItem = await Item.findByIdAndUpdate()
        if (!foundItem) return res.sendStatus(404)

        foundItem.name = name
        foundItem.lvl = lvl
        foundItem.img = img
        foundItem.rarity = rarity
        const saveResult = await foundItem.save() 
        return res.status(200).json(saveResult)
    } catch (err) {
        next(err)
    }
}