import { NextFunction, Request, Response } from "express"
import Monster from "../monster/monster.model"
import Item, { IItem } from "./item.model"
import { Tcreate } from "./item.schema"
import { Types } from "mongoose"
import monsterModel from "../monster/monster.model"

export const getAll = async (req: Request, res: Response<Partial<IItem[]>>, next: NextFunction) => {
    try {
        const foundItems = await Item.find()
        if (!foundItems) return res.status(404)
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
        if (foundName || foundImg) return res.status(401)

        const foundMonster = await Monster.findOne({ name: monster })
        if (!foundMonster) return res.status(404)

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

export const getRandomItems = async (req: Request<{}, {}, {}, { monster: string }>, res: Response<((IItem & { _id: Types.ObjectId; }))[] | null>, next: NextFunction) => {
    try {
        const {
            monster
        } = req.query

        const getRandomIntInclusive = (min: number, max: number) => {
            min = Math.ceil(min)
            max = Math.floor(max)
            return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
        }

        const foundMonster = await Monster.findOne({ name: monster })
        if (!foundMonster) return res.status(404)


            const foundL = await Item.find({ monster: foundMonster._id, rarity: 'legendary' })
            const Llen = foundL.length - 1
            const foundH = await Item.find({ monster: foundMonster._id, rarity: 'heroic' })
            const Hlen = foundH.length - 1
            const foundR = await Item.find({ monster: foundMonster._id, rarity: 'rare' })
            const Rlen = foundR.length - 1

            console.log(foundL)
            console.log(foundH)
            console.log(foundR)
            let result: (IItem & { _id: Types.ObjectId; })[] | null = []
            for (let i = 0; i < 10; i++) {
                const rand = getRandomIntInclusive(1, 1000)
                if (rand === 1) {
                    const rand2 = getRandomIntInclusive(0, Llen)
                    result = [...result, foundL[rand2]]
                }
                if (rand >= 2 && rand <= 251) {
                    const rand2 = getRandomIntInclusive(0, Hlen)
                    result = [...result, foundH[rand2]]
                }
                if (rand >= 251 && rand <= 1000) {
                    const rand2 = getRandomIntInclusive(0, Rlen)
                    result = [...result, foundR[rand2]]
                }
            }

            console.log(result)
        return res.status(200).json(result)

    } catch (err) {    
        next(err)
    }
}