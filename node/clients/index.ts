import { IOClients } from '@vtex/api'
import { masterDataFor } from '@vtex/clients'
import type { SellerAddon } from 'ssesandbox04.seller-addons'

export class Clients extends IOClients {
  public get sellerAddonClient() {
    return this.getOrSet(
      'sellerAddonClient',
      masterDataFor<SellerAddon>('sellerAddon')
    )
  }
}
