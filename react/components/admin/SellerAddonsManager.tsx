import {
  Box,
  Button,
  Flex,
  Label,
  Select,
  Skeleton,
  TextArea,
  TextInput,
  useToast,
} from '@vtex/admin-ui'
import type { ApolloError } from 'apollo-client'
import React, { useRef, useState } from 'react'
import type { QueryHookOptions } from 'react-apollo'
import { useMutation, useQuery } from 'react-apollo'
import { useIntl } from 'react-intl'
import type {
  Mutation as MutationSellerAddon,
  Query as QuerySellerAddon,
} from 'ssesandbox04.seller-addons'
import {
  ButtonWithIcon,
  IconDelete,
  IconImage,
  ModalDialog,
} from 'vtex.styleguide'

import ADD_SELLER_ADDON from '../../graphql/addSellerAddon.graphql'
import DELETE_SELLER_ADDON from '../../graphql/deleteSellerAddon.graphql'
import GET_SELLER_ADDON from '../../graphql/getSellerAddon.graphql'
import UPDATE_SELLER_ADDON from '../../graphql/updateSellerAddon.graphql'
import UPLOAD_FILE from '../../graphql/uploadFile.graphql'
import { messages } from '../../utils/messages'

interface MutationUploadFile {
  uploadFile: { fileUrl: string }
}

const SellerAddonsManager = () => {
  const intl = useIntl()
  const showToast = useToast()
  const showError = (error: ApolloError | Record<string, string>) => {
    console.error('Seller Addons Error: ', JSON.stringify(error, null, 2))
    showToast({
      tone: 'critical',
      dismissible: true,
      message: error.message,
    })
  }

  const commonQueryOptions: QueryHookOptions = {
    onError: showError,
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  }

  const {
    loading: loadingSellerAddon,
    data: dataSellerAddon,
    refetch: refetchSellerAddon,
  } = useQuery<QuerySellerAddon>(GET_SELLER_ADDON, {
    ...commonQueryOptions,
    variables: {
      id: localStorage.getItem('sellerAddonId'),
    },
  })

  const [uploadFile, { loading: loadingUpload }] =
    useMutation<MutationUploadFile>(UPLOAD_FILE, commonQueryOptions)

  const [addSellerAddon, { loading: loadingAddSellerAddon }] =
    useMutation<MutationSellerAddon>(ADD_SELLER_ADDON, commonQueryOptions)

  const [updateSellerAddon, { loading: loadingUpdateSellerAddon }] =
    useMutation<MutationSellerAddon>(UPDATE_SELLER_ADDON, commonQueryOptions)

  const [deleteSellerAddon, { loading: loadingDeleteSellerAddon }] =
    useMutation<MutationSellerAddon>(DELETE_SELLER_ADDON, commonQueryOptions)

  const sellerAddon = dataSellerAddon?.getSellerAddon
  const [selectedBannerFile, setSelectedBannerFile] = useState<File>()
  const [formDescription, setFormDescription] = useState<string | undefined>()
  const [formBannerUrl, setFormBannerUrl] = useState<string | undefined>()
  const [formOrderByField, setFormOrderByField] = useState<string | undefined>()
  const [formDeliveryPolicy, setFormDeliveryPolicy] = useState<
    string | undefined
  >()

  const [formExchangeReturnPolicy, setFormExchangeReturnPolicy] = useState<
    string | undefined
  >()

  const [formSecurityPrivacyPolicy, setFormSecurityPrivacyPolicy] = useState<
    string | undefined
  >()

  const [showModalDelete, setShowModalDelete] = useState(false)
  const [preview, setPreview] = useState('')
  const [discardBanner, setDiscardBanner] = useState(false)

  const fieldsChanged =
    !!selectedBannerFile ||
    discardBanner ||
    (formDescription !== undefined &&
      formDescription !== sellerAddon?.description) ||
    (formBannerUrl !== undefined && formBannerUrl !== sellerAddon?.bannerUrl) ||
    (formOrderByField !== undefined &&
      formOrderByField !== sellerAddon?.orderByField) ||
    (formDeliveryPolicy !== undefined &&
      formDeliveryPolicy !== sellerAddon?.deliveryPolicy) ||
    (formExchangeReturnPolicy !== undefined &&
      formExchangeReturnPolicy !== sellerAddon?.exchangeReturnPolicy) ||
    (formSecurityPrivacyPolicy !== undefined &&
      formSecurityPrivacyPolicy !== sellerAddon?.securityPrivacyPolicy)

  const handleChangeUploadInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0]

    if (!file) {
      return
    }

    setSelectedBannerFile(file)
    setPreview(URL.createObjectURL(file))
    setDiscardBanner(false)
  }

  const clearSelectedBannerFile = () => {
    URL.revokeObjectURL(preview)
    setSelectedBannerFile(undefined)
    setPreview('')
  }

  const handleDeleteBanner = () => {
    clearSelectedBannerFile()
    setDiscardBanner(true)
  }

  const formSellerAddonsReset = (form?: HTMLFormElement | null) => {
    form?.reset()
    clearSelectedBannerFile()
    setDiscardBanner(false)
    setFormDescription(undefined)
    setFormBannerUrl(undefined)
    setFormOrderByField(undefined)
    setFormDeliveryPolicy(undefined)
    setFormExchangeReturnPolicy(undefined)
    setFormSecurityPrivacyPolicy(undefined)
  }

  const handleAddOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget

    e.preventDefault()

    let banner = discardBanner ? '' : undefined

    if (selectedBannerFile) {
      const { data: dataUploadFile, errors: errorsUpload } = await uploadFile({
        variables: { file: selectedBannerFile },
      })

      if (!errorsUpload?.length && dataUploadFile?.uploadFile) {
        banner = dataUploadFile.uploadFile.fileUrl
      }
    }

    const formValues = {
      banner,
      bannerUrl: formBannerUrl?.trim(),
      orderByField: formOrderByField?.trim(),
      description: formDescription?.trim(),
      deliveryPolicy: formDeliveryPolicy?.trim(),
      exchangeReturnPolicy: formExchangeReturnPolicy?.trim(),
      securityPrivacyPolicy: formSecurityPrivacyPolicy?.trim(),
      id: sellerAddon?.id,
    }

    const { data: savedSellerAddon, errors: errorsSave } = sellerAddon?.id
      ? await updateSellerAddon({ variables: formValues })
      : await addSellerAddon({ variables: formValues })

    if (!errorsSave?.length && savedSellerAddon) {
      showToast({
        tone: 'positive',
        dismissible: true,
        message: intl.formatMessage(messages.editSellerAddonSuccessMessage),
      })

      const id =
        savedSellerAddon.addSellerAddon?.id ??
        savedSellerAddon.updateSellerAddon?.id

      localStorage.setItem('sellerAddonId', id ?? '')
      await refetchSellerAddon({ id })
    }

    formSellerAddonsReset(form)
    window.scrollTo(0, 0)
  }

  const handleDelete = async () => {
    await deleteSellerAddon({
      variables: { id: sellerAddon?.id },
    })

    localStorage.removeItem('sellerAddonId')
    setShowModalDelete(false)
    document.documentElement.setAttribute('style', '')

    showToast({
      tone: 'positive',
      dismissible: true,
      message: intl.formatMessage(messages.deleteSellerAddonSuccessMessage),
    })

    await refetchSellerAddon()
  }

  const orderByOptions: Array<keyof typeof messages> = [
    'OrderByScoreDESC',
    'OrderByTopSaleDESC',
    'OrderByReleaseDateDESC',
    'OrderByBestDiscountDESC',
    'OrderByPriceDESC',
    'OrderByPriceASC',
    'OrderByNameASC',
    'OrderByNameDESC',
  ]

  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <Box>
      {loadingSellerAddon ? (
        <Skeleton csx={{ height: '75vh' }} />
      ) : (
        <>
          <h2 className="c-action-primary mb4">
            {sellerAddon?.id
              ? intl.formatMessage(messages.updateSellerAddonTitle)
              : intl.formatMessage(messages.registrationSellerAddonTitle)}
          </h2>
          <form onSubmit={handleAddOrUpdate} encType="multipart/form-data">
            <Flex direction="column">
              <Label className="c-muted-1" htmlFor="banner">
                Banner:
              </Label>
              <div className="w-auto">
                <ButtonWithIcon
                  icon={<IconImage />}
                  variation="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="ml4"
                >
                  {intl.formatMessage(messages.uploadBannerLabel)}
                </ButtonWithIcon>
                <input
                  ref={fileInputRef}
                  id="banner"
                  onChange={handleChangeUploadInput}
                  type="file"
                  className="dn"
                />
              </div>
            </Flex>
            {(!!preview || sellerAddon?.banner) && !discardBanner && (
              <Flex csx={{ gap: 4, marginTop: 16 }} align="center">
                <img
                  style={{ maxHeight: 480, maxWidth: '90%' }}
                  src={(preview || sellerAddon?.banner) ?? undefined}
                  alt="Banner"
                />
                <ButtonWithIcon
                  variation="danger"
                  size="small"
                  onClick={handleDeleteBanner}
                  icon={<IconDelete />}
                />
              </Flex>
            )}
            <Flex csx={{ marginTop: 16 }} direction="column">
              <Label className="c-muted-1" htmlFor="bannerUrl">
                {intl.formatMessage(messages.bannerUrlLabel)}:
              </Label>
              <TextInput
                id="bannerUrl"
                name="bannerUrl"
                onChange={(e) => setFormBannerUrl(e.target.value)}
                value={formBannerUrl ?? sellerAddon?.bannerUrl ?? ''}
              />
            </Flex>
            <Flex csx={{ marginTop: 16 }} direction="column">
              <Label className="c-muted-1" htmlFor="orderByField">
                {intl.formatMessage(messages.orderByFieldLabel)}:
              </Label>
              <Select
                id="orderByField"
                name="orderByField"
                value={
                  formOrderByField ?? sellerAddon?.orderByField ?? undefined
                }
                onChange={(e) => setFormOrderByField(e.target.value)}
              >
                {orderByOptions.map((option) => (
                  <option key={option} value={option}>
                    {intl.formatMessage(messages[option])}
                  </option>
                ))}
              </Select>
            </Flex>
            <Flex csx={{ marginTop: 16 }} direction="column">
              <Label className="c-muted-1" htmlFor="description">
                {intl.formatMessage(messages.sellerDescription)}:
              </Label>
              <TextArea
                id="description"
                name="description"
                style={{ height: 150 }}
                onChange={(e) => setFormDescription(e.target.value)}
                value={formDescription ?? sellerAddon?.description ?? ''}
              />
            </Flex>
            <Flex csx={{ marginTop: 16 }} direction="column">
              <Label className="c-muted-1" htmlFor="deliveryPolicy">
                {intl.formatMessage(messages.sellerDeliveryPolicy)}:
              </Label>
              <TextArea
                id="deliveryPolicy"
                name="deliveryPolicy"
                style={{ height: 150 }}
                onChange={(e) => setFormDeliveryPolicy(e.target.value)}
                value={formDeliveryPolicy ?? sellerAddon?.deliveryPolicy ?? ''}
              />
            </Flex>
            <Flex csx={{ marginTop: 16 }} direction="column">
              <Label className="c-muted-1" htmlFor="exchangeReturnPolicy">
                {intl.formatMessage(messages.sellerExchangeReturnPolicy)}:
              </Label>
              <TextArea
                id="exchangeReturnPolicy"
                name="exchangeReturnPolicy"
                style={{ height: 150 }}
                onChange={(e) => setFormExchangeReturnPolicy(e.target.value)}
                value={
                  formExchangeReturnPolicy ??
                  sellerAddon?.exchangeReturnPolicy ??
                  ''
                }
              />
            </Flex>
            <Flex csx={{ marginTop: 16 }} direction="column">
              <Label className="c-muted-1" htmlFor="securityPrivacyPolicy">
                {intl.formatMessage(messages.sellerSecurityPrivacyPolicy)}:
              </Label>
              <TextArea
                id="securityPrivacyPolicy"
                name="securityPrivacyPolicy"
                style={{ height: 150 }}
                onChange={(e) => setFormSecurityPrivacyPolicy(e.target.value)}
                value={
                  formSecurityPrivacyPolicy ??
                  sellerAddon?.securityPrivacyPolicy ??
                  ''
                }
              />
            </Flex>
            <Flex csx={{ marginTop: 16, gap: 4 }}>
              <Flex csx={{ gap: 4, width: '50%' }}>
                <Button
                  size="large"
                  loading={
                    loadingUpload ||
                    loadingAddSellerAddon ||
                    loadingUpdateSellerAddon
                  }
                  type="submit"
                >
                  {intl.formatMessage(messages.saveLabel)}
                </Button>
                {fieldsChanged && (
                  <Button
                    size="large"
                    variant="criticalSecondary"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      formSellerAddonsReset(e.currentTarget.form)
                    }}
                  >
                    {intl.formatMessage(messages.discardLabel)}
                  </Button>
                )}
              </Flex>
              {sellerAddon?.id && (
                <Flex csx={{ justifyContent: 'end', width: '50%' }}>
                  <Button
                    size="large"
                    variant="critical"
                    onClick={() => setShowModalDelete(true)}
                  >
                    {intl.formatMessage(messages.deleteSellerAddonLabel)}
                  </Button>
                  <ModalDialog
                    centered
                    loading={loadingDeleteSellerAddon}
                    confirmation={{
                      onClick: handleDelete,
                      label: intl.formatMessage(
                        messages.deleteSellerAddonConfirmation
                      ),
                      isDangerous: true,
                    }}
                    cancelation={{
                      onClick: () => setShowModalDelete(false),
                      label: intl.formatMessage(messages.cancelLabel),
                    }}
                    isOpen={showModalDelete}
                    onClose={() => setShowModalDelete(false)}
                  >
                    <p className="f3 c-muted-1">
                      {intl.formatMessage(messages.deleteSellerAddonQuestion)}
                    </p>
                  </ModalDialog>
                </Flex>
              )}
            </Flex>
          </form>
        </>
      )}
    </Box>
  )
}

export default SellerAddonsManager
