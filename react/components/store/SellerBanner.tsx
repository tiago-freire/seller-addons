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

  const bannerUrl = data?.getSellerAddon?.bannerUrl
  const banner = data?.getSellerAddon?.banner
  const imageBanner = banner && <img src={banner} alt={account} />

  if (bannerUrl && imageBanner) {
    return <a href={bannerUrl}>{imageBanner}</a>
  }

  return imageBanner
}

export default SellerBanner
