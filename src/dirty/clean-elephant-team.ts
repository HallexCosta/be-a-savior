import { ElephantSQLInstanceProvider } from '@providers/elephant/ElephantSQLInstanceProvider'

const apikey = process.env.ELEPHANT_API_KEY
const provider = new ElephantSQLInstanceProvider(apikey)

async function load() {
  console.log('load apikey', apikey)

  const instances = await provider.listInstances()
  for (const instance of instances) {
    const deleted = await provider.deleteInstance(instance.name)
    console.log(instance.name, deleted)
  }
}

load()
