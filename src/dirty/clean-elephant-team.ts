import { ElephantSQLInstanceProvider, ElephantListInstance } from '@providers/elephant/ElephantSQLInstanceProvider'
import axios from 'axios'

const apikey = process.env.ELEPHANT_API_KEY
const provider = new ElephantSQLInstanceProvider(apikey)

export const api = axios.create({
  baseURL: 'https://customer.elephantsql.com/api'
})
api.interceptors.request.use(configs => {
  configs.auth = {
    username: null,
    password: apikey
  }
  return configs
})
async function load() {
  console.log('load apikey', apikey)

  //const instances = await provider.listInstances()
  const { data: instances } = await api.get<ElephantListInstance[]>('/instances')
  //console.log(instances)
  for (const instance of instances) {
    await api.delete(`/instances/${instance.id}`)
    console.log(instance.name, true)
  }
}

load()
