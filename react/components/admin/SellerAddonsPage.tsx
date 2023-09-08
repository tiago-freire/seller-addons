import {
  createSystem,
  Page,
  PageContent,
  PageHeader,
  PageHeaderTitle,
  PageHeaderTop,
  ToastProvider,
} from '@vtex/admin-ui'
import React from 'react'
import { useIntl } from 'react-intl'
import { DemoWarning } from 'ssesandbox04.demo-warning'

import { messages } from '../../utils/messages'
import SellerAddonsManager from './SellerAddonsManager'

const SellerAddonsPage = () => {
  const [ThemeProvider] = createSystem()
  const intl = useIntl()

  return (
    <ThemeProvider>
      <ToastProvider>
        <Page>
          <DemoWarning message={intl.formatMessage(messages.demoWarning)} />
          <PageHeader>
            <PageHeaderTop>
              <PageHeaderTitle>
                {intl.formatMessage(messages.sellerAddonsPageHeaderTitle)}
              </PageHeaderTitle>
            </PageHeaderTop>
          </PageHeader>
          <PageContent>
            <SellerAddonsManager />
          </PageContent>
        </Page>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default SellerAddonsPage
