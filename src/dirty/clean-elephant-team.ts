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

async function cleanup(useApi = false) {
  console.log('load apikey', apikey)

  if (useApi) {
    const { data: instances } = await api.get<ElephantListInstance[]>('/instances')
    for (const instance of instances) {
      //await api.delete(`/instances/${instance.id}`)
      console.log(instance.name, true)
    }
  }
  if (!useApi) {
    const instances = await provider.listInstances()
    for (const instance of instances) {
      await provider.deleteInstance(instance.id)
      console.log(instance.name, true)
    }
  }
}

cleanup()
