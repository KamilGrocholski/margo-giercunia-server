import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  username: string
  email: string
  password: string
  avatar?: string
  role: 'USER' | 'EDITOR' | 'ADMIN'
  refreshTokens: string[]
  itemsOwned: {
    n: number
    item: typeof mongoose.Types.ObjectId
  }[],
  monstersKills: {
    n: number
    itemsByRarity: {
      'common': number
      'rare': number
      'heroic': number
      'legendary': number
    }
    monster: typeof mongoose.Types.ObjectId
  }[],
  exp: number
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'defaultAvatar'  
  },
  role: {
    type: String,
    required: true,
    default: 'USER',
    index: true
  },
  refreshTokens: [String],
  itemsOwned: [
    {
      n: {
        type: Number,
        required: true,
        default: 0
      },
      item: {
        type: mongoose.Types.ObjectId,
        ref: 'Item'
      }
    }
  ],
  monstersKills: [
    {
      n: {
        type: Number,
        required: true,
        default: 0
      },
      itemsByRarity: {
        'common': {
          type: Number,
          required: true,
          default: 0
        },
        'rare': {
          type: Number,
          required: true,
          default: 0
        },
        'heroic': {
          type: Number,
          required: true,
          default: 0
        },
        'legendary': {
          type: Number,
          required: true,
          default: 0
        }
      },
      monster: mongoose.Types.ObjectId
    }
  ],
  exp: {
    type: Number,
    required: true,
    default: 0
  }
})

export default mongoose.model<IUser>('User', userSchema)