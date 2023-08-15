import type { SellerAddon } from 'ssesandbox04.seller-addons'

import { getLastDocument } from '../utils/masterdata'

const getAddons = async (context: Context): Promise<void> => {
  const {
    clients: { sellerAddonClient },
  } = context

  const sellerAddon = await getLastDocument<SellerAddon>(sellerAddonClient)

  context.set('Access-Control-Allow-Origin', '*')
  context.set('Access-Control-Allow-Headers', '*')
  context.set('Access-Control-Allow-Credentials', 'true')
  context.set('Access-Control-Allow-Methods', '*')
  context.set('Content-Type', 'application/json')
  context.status = 200
  context.body = sellerAddon ?? {}
}

export default getAddons
