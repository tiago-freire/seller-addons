import type { Maybe } from '@vtex/api'
import type { MasterDataEntity } from '@vtex/clients'

export const getLastDocument = async <T extends Record<string, unknown>>(
  client: MasterDataEntity<T>,
  id?: Maybe<string>
) => {
  if (id) {
    return client.get(id, ['_all'])
  }

  const searchResult = await client.search(
    {
      page: 1,
      pageSize: 1,
    },
    ['_all'],
    'updatedIn desc'
  )

  return searchResult?.[0]
}
