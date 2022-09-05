import mongoose from 'mongoose'

export interface IMonster extends mongoose.Document {
    name: string
    lvl: number
    img: string
    type: 'T' | 'K'
    items: typeof mongoose.Types.ObjectId[]
}

const monsterSchema = new mongoose.Schema<IMonster>({
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
    type: {
        type: String,
        required: true
    },
    items: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Item'
        }
    ]
})

export default mongoose.model<IMonster>('Monster', monsterSchema)