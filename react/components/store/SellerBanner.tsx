import React from 'react'
import { useQuery } from 'react-apollo'
import type { Query } from 'ssesandbox04.seller-addons'
import { useRuntime } from 'vtex.render-runtime'

import GET_SELLER_ADDON from '../../graphql/getSellerAddon.graphql'

const SellerBanner = () => {
  const { account } = useRuntime()

  const { data } = useQuery<Query>(GET_SELLER_ADDON, {
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  })

  const banner = data?.getSellerAddon?.banner

  if (banner) {
    return <img src={banner} alt={account} />
  }

  return null
}

export default SellerBanner
