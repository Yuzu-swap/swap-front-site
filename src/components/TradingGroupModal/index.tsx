import React, { useState, useContext } from 'react'
import { useActiveWeb3React } from '../../hooks'

import Modal from '../Modal'
import styled from 'styled-components'
import { AutoRow } from '../Row'
import { TYPE, CustomLightSpinner } from '../../theme'
import { ButtonPrimary } from '../Button'
import { ApplicationModal } from '../../state/application/actions'
import { useTradingGroupModal } from '../../state/application/hooks'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import useTheme from 'hooks/useTheme'


import WithdrawalItem from 'components/Withdrawal'

interface TradingGroupModalProps {
  isOpen: boolean,
  handleCurrencySelect: Function
}


const Checkbox = styled.input`
  border: 1px solid ${({ theme }) => theme.red3};
  height: 20px;
  margin: 0;
`
const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  color: ${({ theme }) => theme.text2};
  path {
    stroke: ${({ theme }) => theme.text2};
  }
`

const ButtonError = styled(ButtonPrimary)`
background: ${({ theme }) => theme.red1} !important;
border-radius: 8px;
height: 46px;
margin-top: 30px;
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 428px;
`
const HeaderRow = styled.div`
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg9};
  padding: 0.5rem 2rem 2rem 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  div{
    margin: 30px 0 0 0;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const Blurb = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 1rem;
    font-size: 12px;
  `};
`

const HoverText = styled.div`
  color: ${({ theme }) => theme.text2};
  text-align: center;
  width: 100%;
  :hover {
    cursor: pointer;
  }
`

export default function TradingGroupModal({ isOpen, handleCurrencySelect }: TradingGroupModalProps) {
  const { chainId } = useActiveWeb3React()
  const toggleTradingGroupModal = useTradingGroupModal()
  const theme = useTheme()
  const [confirmed, setConfirmed] = useState(false)
  
  return (
    <Modal isOpen={isOpen} onDismiss={toggleTradingGroupModal} minHeight={false} maxHeight={90}>
      <Wrapper>
        <UpperSection>
          <CloseIcon onClick={toggleTradingGroupModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>
            <HoverText>Trade at your own risk!</HoverText>
          </HeaderRow>
          <ContentWrapper>
            <TYPE.body fontWeight={400} color="#FFF">
              Anyone can create a token, including creating fake versions of existing tokens that claim to represent
              projects.
            </TYPE.body>
            <TYPE.body fontWeight={600} color="#FFF">
              If you purchase this token, you may not be able to sell it back.
            </TYPE.body>

            {/* <div className="s-withdrawal-list">
              <WithdrawalItem />
              <WithdrawalItem />
            </div> */}

            {/* <AutoRow justify="left" style={{ cursor: 'pointer' }} onClick={() => setConfirmed(!confirmed)}>
              <Checkbox
                name="confirmed"
                type="checkbox"
                checked={confirmed}
                onChange={() => setConfirmed(!confirmed)}
              />
              <TYPE.body m="10px" fontSize="16px" color={theme.red1} fontWeight={500}>
                I understand
              </TYPE.body>
            </AutoRow> */}

            <ButtonError
              // disabled={!confirmed}
              altDisabledStyle={true}
              borderRadius="20px"
              backgroundColor={theme.red1}
              padding="10px 1rem"
              onClick={() => {
                toggleTradingGroupModal()
                handleCurrencySelect();
              }}
            >
              I understand
          </ButtonError>
          </ContentWrapper>
        </UpperSection>
      </Wrapper>
    </Modal>
  )
}
