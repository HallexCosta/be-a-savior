import { ConnectionOptions, createConnection } from 'typeorm'

import ormconfig from '@root/ormconfig'

createConnection(ormconfig as ConnectionOptions)
