import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://customer.elephantsql.com/api'
})

export type Instance = {
  id: number
  name: string
  url: string
  plan: string
  region: string
  apikey: string
  providerid: string
}

export type CreateInstanceParams = {
  name: string,
  plan: 'turtle' | string,
  region: 'amazon-web-services::us-east-1' | string
}

export type ElephantInstanceDetail = {
  id: number
  name: string
  plan: "turtle" | string
  region: "amazon-web-services::us-east-1" | string
  tags: []
  providerid: string
  url: string
  apikey: string
  ready: boolean
}

export type ElephantListInstance = {
  id: number
  name: string
  plan: string
  region: string
  tags: string[]
  providerid: string
}

export type ElephantCreateInstanceResponse = {
  id: number
  apiKey: string
  url: string
}

export class ElephantSQLInstanceProvider {
  public readonly docs: string = 'https://docs.elephantsql.com'

  public constructor(private readonly apikey: string) {
    api.interceptors.request.use(configs => {
      configs.auth = {
        username: null,
        password: this.apikey
      }
      return configs
    })
  }

  public async listInstance(instanceName: string): Promise<Instance> {
    try {
      const id = await this.findInstanceId(instanceName)

      if (id) {
        const { data: instance } = await api.get<Instance>(`/instances/${id}`)

        return instance
      }

      return null
    } catch (e) {
      console.log(e)
    }
  }

  public async verifyInstanceExists(instanceName: string) {
    const instanceRemote = await this.listInstance(instanceName)

    if (instanceRemote) {
      return true
    }

    return false
  }

  public async listInstances(): Promise<Instance[]> {
    try {
      const { data } = await api.get<ElephantListInstance[]>('/instances')

      const instances: Instance[] = []
      for (const elephantInstance of data) {
        const { data: instanceDetail } = await api.get<ElephantInstanceDetail>(`/instances/${elephantInstance.id}`)

        const { ready, tags, ...instance } = instanceDetail

        instances.push(instance)
      }

      return instances
    } catch (e) {
      console.log(e.message)
    }
  }

  public async createInstance({ name, plan, region }: CreateInstanceParams): Promise<Instance> {
    const instanceAlreadyExists = await this.verifyInstanceExists(name)

    if (instanceAlreadyExists) {
      throw new Error(`Instance with name "${name} already exists"`)
    }

    const { data } = await api.post('/instances', {
      name,
      plan,
      region
    })

    const instanceCreated = <ElephantCreateInstanceResponse>(data as unknown)

    const { data: instanceDetail } = await api.get<ElephantInstanceDetail>(`/instances/${instanceCreated.id}`)

    const { ready, tags, ...instance } = instanceDetail

    return instance
  }

  public async deleteInstance(instanceName: string): Promise<boolean> {
    try {
      const instanceId = await this.findInstanceId(instanceName)
      await api.delete(`/instances/${instanceId}`)
      return true
    } catch (e) {
      return false
    }
  }

  public async findInstanceId(instanceName: string): Promise<number | null> {
    const instances = await this.listInstances()
    const instance = instances.find(({ name }) => instanceName === name)

    return instance
      ? instance.id
      : null
  }
}
