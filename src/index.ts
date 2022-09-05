import app from './app'
import client from './db/client'

client()

const port = process.env.PORT || 5000
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`)
  /* eslint-enable no-console */
})


