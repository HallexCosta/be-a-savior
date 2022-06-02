import { ConnectionOptions, createConnection } from 'typeorm'

import ormConfig from '@common/configs/typeorm'

createConnection(ormConfig as ConnectionOptions)
