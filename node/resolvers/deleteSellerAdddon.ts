import type { MutationDeleteSellerAddonArgs } from 'ssesandbox04.seller-addons'

export const deleteSellerAddon = async (
  _: unknown,
  { id }: MutationDeleteSellerAddonArgs,
  { clients: { sellerAddonClient } }: Context
) => {
  await sellerAddonClient.delete(id)

  return id
}
