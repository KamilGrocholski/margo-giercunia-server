import mongoose from 'mongoose'

export interface IItem extends mongoose.Document {
    name: string
    lvl: number
    img: string
    rarity: 'common' | 'rare' | 'heroic' | 'legendary',
    monster: typeof mongoose.Types.ObjectId
} 

const itemSchema = new mongoose.Schema<IItem>({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    lvl: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true,
        unique: true
    },
    rarity: {
        type: String,
        required: true,
        index: true
    },
    monster: {
        type: mongoose.Types.ObjectId,
        ref: 'Monster'
    }
})

export default mongoose.model<IItem>('Item', itemSchema)