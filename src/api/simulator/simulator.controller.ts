import { Response, Request, NextFunction } from 'express'
import { Types } from 'mongoose';
import { IItem } from '../item/item.model';
import Item from '../item/item.model'
import Monster from '../monster/monster.model';
import User from '../user/user.model'

export const getRandomItems = async (req: Request<{}, {}, { username: string }, { monster: string }>, res: Response<((IItem & { _id: Types.ObjectId; }))[] | null>, next: NextFunction) => {
    try {
        const {
            username
        } = req.body

        const foundUser = await User.findOne({ username })
        if (!foundUser) return res.sendStatus(403)

        const {
            monster
        } = req.query

        const getRandomIntInclusive = (min: number, max: number): number => {
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
                if (rand > 251 && rand <= 1000) {
                    const rand2 = getRandomIntInclusive(0, Rlen)
                    result = [...result, foundR[rand2]]
                }
            }

            // result.forEach(item => {
            //     if (item.rarity === 'common') newTotalStats.itemsByRarity.common++
            //     if (item.rarity === 'rare') newTotalStats.itemsByRarity.rare++
            //     if (item.rarity === 'heroic') newTotalStats.itemsByRarity.heroic++
            //     if (item.rarity === 'legendary') newTotalStats.itemsByRarity.legendary++
            // })
            // foundUser.totalStats = newTotalStats
            const newTotalStats = foundUser.totalStats
            newTotalStats.monstersKills = newTotalStats.monstersKills + 1
            result.forEach(item => {
                if (item.rarity === 'common') return newTotalStats.itemsByRarity.common++
                if (item.rarity === 'rare') return newTotalStats.itemsByRarity.rare++
                if (item.rarity === 'heroic') return newTotalStats.itemsByRarity.heroic++
                if (item.rarity === 'legendary') return newTotalStats.itemsByRarity.legendary++
            })

            foundUser.totalStats = newTotalStats
            const saveResult = await foundUser.save() 

            console.log(result)
            console.log(saveResult)
            return res.status(200).json(result)

    } catch (err) {    
        next(err)
    }
}