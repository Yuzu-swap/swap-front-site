import { Currency, Token } from '@liuxingfeiyu/zoo-sdk'
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import useLast from '../../hooks/useLast'
import Modal from '../Modal'
import { CurrencySearch } from './CurrencySearch'
import { ImportToken } from './ImportToken'
import usePrevious from 'hooks/usePrevious'
import Manage from './Manage'
import { TokenList } from '@uniswap/token-lists'
import { ImportList } from './ImportList'
import Column from '../Column'
import styled from 'styled-components'
import CurrencyList from './CurrencyList'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useAllTokens, useToken, useIsUserAddedToken, useFoundOnInactiveList } from '../../hooks/Tokens'
import { filterTokens, useSortedTokensByQuery } from './filtering'
import { useTokenComparator } from './sorting'
import useToggle from 'hooks/useToggle'
import { FixedSizeList } from 'react-window'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import Row, { RowBetween, RowFixed } from '../Row'
import { CloseIcon, TYPE, ButtonText, IconWrapper } from '../../theme'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
`

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
}


export default function CurrencyListModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = false
}: CurrencySearchModalProps) {

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  // used for import token flow
  const [importToken, setImportToken] = useState<Token | undefined>()

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>()
  const [listURL, setListUrl] = useState<string | undefined>()

  // change min height if not searching
  const minHeight = 80

  const {t} = useTranslation()

  // menu ui
  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, open ? toggle : undefined)

  const allTokens = useAllTokens()
  const [invertSearchOrder] = useState<boolean>(false)
  const tokenComparator = useTokenComparator(invertSearchOrder)
 
  const allArrayTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), "")
  }, [allTokens])

  const sortedTokens: Token[] = useMemo(() => {
    return allArrayTokens.sort(tokenComparator)
  }, [allArrayTokens, tokenComparator])

  const fixedList = useRef<FixedSizeList>()

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={minHeight}>
      <ContentWrapper>
        <RowBetween style={{padding: "10px 20px"}}>
          <Text fontWeight={500} fontSize={16}>
            {t('selectToken')}
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
          <div style={{ flex: '1' }}>
              <AutoSizer disableWidth>
              {({ height }) => (
                  <CurrencyList
                      height={height}
                      showETH={true}
                      currencies={allArrayTokens}
                      breakIndex={undefined}
                      onCurrencySelect={handleCurrencySelect}
                      otherCurrency={otherSelectedCurrency}
                      selectedCurrency={selectedCurrency}
                      fixedListRef={fixedList}
                      showImportView={()=>{}}
                      setImportToken={setImportToken}
                  />
                  )}
              </AutoSizer>
          </div>
      </ContentWrapper>
      
    </Modal>
  )
}
