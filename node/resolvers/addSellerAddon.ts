import type {
  MutationAddSellerAddonArgs,
  SellerAddon,
} from 'ssesandbox04.seller-addons'

export const addSellerAddon = async (
  _: unknown,
  { sellerAddon }: MutationAddSellerAddonArgs,
  { clients: { sellerAddonClient } }: Context
) => {
  const mdDocument = {
    ...sellerAddon,
  } as SellerAddon

  const { DocumentId } = await sellerAddonClient.save(mdDocument)

  const savedDocument = await sellerAddonClient.get(DocumentId, ['_all'])

  return savedDocument
}
