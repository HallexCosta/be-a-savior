import { classToClass } from 'class-transformer'

export declare type SwitchParams = {
  entry: string
  cases: {
    [k: string]: Function
  }
}

export type Case = {
  name: string
  then: Function
}

export default class Util {
  static classesToClasses<T>(datas: T[]) {
    return datas.map((data) => classToClass<T>(data))
  }

  static isUUID(uuid: string) {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return regex.test(uuid)
  }

  static delay(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  static switch({ entry, cases }: SwitchParams) {
    const treatment = cases[entry]
    try {
      treatment()
    } catch(e) {}
  }
}
