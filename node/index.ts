import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { Service } from '@vtex/api'

import { Clients } from './clients'
import getAddons from './middlewares/getAddons'
import { addSellerAddon } from './resolvers/addSellerAddon'
import { deleteSellerAddon } from './resolvers/deleteSellerAdddon'
import { getSellerAddon } from './resolvers/getSellerAddon'
import { updateSellerAddon } from './resolvers/updateSellerAddon'

const TIMEOUT_MS = 1000

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 3,
      timeout: TIMEOUT_MS,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients>
}

export default new Service({
  clients,
  routes: {
    getAddons,
  },
  graphql: {
    resolvers: {
      Query: {
        getSellerAddon,
      },
      Mutation: {
        addSellerAddon,
        updateSellerAddon,
        deleteSellerAddon,
      },
    },
  },
})
