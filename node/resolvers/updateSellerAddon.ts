import type {
  MutationUpdateSellerAddonArgs,
  SellerAddon,
} from 'ssesandbox04.seller-addons'

export const updateSellerAddon = async (
  _: unknown,
  { sellerAddon }: MutationUpdateSellerAddonArgs,
  { clients: { sellerAddonClient } }: Context
) => {
  const { id } = sellerAddon

  const mdDocument = {
    ...sellerAddon,
  } as SellerAddon

  await sellerAddonClient.update(id, mdDocument)

  return sellerAddonClient.get(id, ['_all'])
}
