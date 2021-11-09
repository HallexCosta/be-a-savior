import { ElephantSQLInstanceProvider } from '@providers/elephant/ElephantSQLInstanceProvider'
import { connection } from 'typeorm'

const apikey = process.env.ELEPHANT_API_KEY
const provider = new ElephantSQLInstanceProvider(apikey)

async function load() {
  const entities = getConnection().entityMetadatas

  for (const entity of entities) {
    const queryRunner = connection.createQueryRunner()
  }
}

load()
