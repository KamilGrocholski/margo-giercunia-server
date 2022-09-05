import mongoose from 'mongoose'

const client = async () => { 
    await mongoose
        .connect(process.env.DATABASE_URL as string)
        .then(() => console.log('>> Połączono z bazą danych'))
        .catch(err => console.log(err))
}

export default client