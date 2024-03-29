import { EntityRepository, Repository } from 'typeorm'

import { User } from '@entities/User'
import { Ong } from '@entities/Ong'
import { Donor } from '@entities/Donor'

@EntityRepository(User)
export class UsersRepository extends Repository<Ong | Donor> {
  async findById(id: string): Promise<Ong | Donor> {
    return await this.findOne({
      where: {
        id
      }
    })
  }

  async findByEmail(email: string): Promise<Ong | Donor> {
    return await this.findOne({
      email
    })
  }

  async findByPhone(phone: string): Promise<Ong | Donor> {
    return await this.findOne({
      where: {
        phone
      }
    })
  }

  async findOwnerById(id: string, owner: string): Promise<Ong | Donor> {
    return await this.findOne({
      where: {
        id,
        owner
      }
    })
  }

  async findByOwner(owner: string): Promise<Ong[] | Donor[]> {
    return await this.find({
      where: {
        owner
      },
      relations: ['donations']
    })
  }
}
