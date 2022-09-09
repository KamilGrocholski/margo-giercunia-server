import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
    username: string
    password: string
    refreshTokens: string[]
    role: 'user' | 'admin'
    totalStats: {
        monstersKills: number
        itemsByRarity: {
            common: number
            rare: number
            heroic: number
            legendary: number
        }        
    }
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        unique: true,
        index: true
    },
    password: {
        type: String
    },
    refreshTokens: [String],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    totalStats: {
        monstersKills: {
            type: Number,
            default: 0
        },
        itemsByRarity: {
            common: {
                type: Number,
                default: 0
            },
            rare: {
                type: Number,
                default: 0
            },
            heroic: {
                type: Number,
                default: 0
            },
            legendary: {
                type: Number,
                default: 0
            }
        }
    }
})

export default mongoose.model<IUser>('User', userSchema)