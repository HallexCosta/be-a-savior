import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://customer.elephantsql.com/api'
})

api.interceptors.request.use(configs => {
  configs.auth = {
    username: null,
    password: process.env.ELEPHANT_API_KEY
  }
  return configs
})

export type Instance = {
  id: number
  name: string
  plan: string
  region: string
  tags: string[]
  providerid: string
}

export type CreateInstanceParams = {
  name: string,
  plan: 'turtle' | string,
  region: 'amazon-web-services::us-east-1' | string
}

export type DeleteInstanceParams = {
  instanceId: number,
}

export type CreateInstanceResponse = {
  id: number
  message: string
  apiKey: string
  url: string
}

export class ElephantSQLInstanceProvider {
  public readonly docs: string = 'https://docs.elephantsql.com'
  public static lastCreatedInstance: CreateInstanceResponse
  public instances: Map<string, Instance> = new Map()

  public async load() {
    for (const instance of await this.listInstances()) {
      this.instances.set(instance.name, instance)
    }
  }

  public findInMemory(instanceName: string): Instance | undefined {
    return [...this.instances.values()].find(instance => instance.name === instanceName)
  }

  public async findInRemote(instanceName: string): Promise<Instance | undefined> {
    const instances = await this.listInstances()
    return instances.find(instance => instance.name === instanceName)
  }

  public async verifyInstanceExists(instanceName: string) {
    const instanceMemory = this.findInMemory(instanceName)
    const instanceRemote = await this.findInRemote(instanceName)

    if (instanceMemory || instanceRemote) {
      return true
    }

    return false
  }

  public async listInstances(): Promise<Instance[]> {
    try {
      const { data } = await api.get<Instance[]>('/instances')
      return data
    } catch (e) {
      console.log(e.message)
    }
  }

  public async createInstance({ name, plan, region }: CreateInstanceParams): Promise<CreateInstanceResponse> {
    const instanceAlreadyExists = await this.verifyInstanceExists(name)

    if (instanceAlreadyExists) {
      throw new Error(`Instance with name "${name} already exists"`)
    }

    const { data } = await api.post('/instances', {
      name,
      plan,
      region
    })

    const elephantInstance = <CreateInstanceResponse>(data as unknown)

    return elephantInstance
  }

  public async deleteInstance(instanceName: string): Promise<boolean> {
    try {
      const instanceId = await this.findInstanceId(instanceName)
      await api.delete(`/instances/${instanceId}`)
      this.instances.delete(instanceName)
      return true
    } catch (e) {
      return false
    }
  }

  public async findInstanceId(instanceName: string): Promise<number | null> {
    const findInstanceIdInMemory = this.findInMemory(instanceName)
    const findInstanceIdInRemote = await this.findInRemote(instanceName)
    return findInstanceIdInMemory
      ? findInstanceIdInMemory.id
      : findInstanceIdInRemote
        ? findInstanceIdInRemote.id
        : null
  }
}
