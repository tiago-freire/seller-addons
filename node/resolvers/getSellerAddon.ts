import type {
  QueryGetSellerAddonArgs,
  SellerAddon,
} from 'ssesandbox04.seller-addons'

import { getLastDocument } from '../utils/masterdata'

export const getSellerAddon = async (
  _: unknown,
  { id }: QueryGetSellerAddonArgs,
  { clients: { sellerAddonClient } }: Context
) => {
  const sellerAddon = await getLastDocument<SellerAddon>(sellerAddonClient, id)

  return sellerAddon
}
