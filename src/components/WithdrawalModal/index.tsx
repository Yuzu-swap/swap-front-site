import React, { useState, useContext } from 'react'
import { useActiveWeb3React } from '../../hooks'

import Modal from '../Modal'
import styled from 'styled-components'
import { AutoRow } from '../Row'
import { TYPE, CustomLightSpinner } from '../../theme'
import { ButtonPrimary } from '../Button'
import { ApplicationModal } from '../../state/application/actions'
import { useWithdrawalRewardModal } from '../../state/application/hooks'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import useTheme from 'hooks/useTheme'

import WithdrawalItem from 'components/Withdrawal'
import { useTranslation } from 'react-i18next'

interface WithdrawalModalProps {
  isOpen: boolean,
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
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const ButtonError = styled(ButtonPrimary)`
background: ${({ theme }) => theme.red1} !important;
border-radius: 8px;
height: 60px;
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 428px;
`
const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  padding: 0.5rem 2rem 2rem 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

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
  color: ${({ theme }) => theme.red1}
  :hover {
    cursor: pointer;
  }
`

export default function WithdrawalRewardModal({ isOpen }: WithdrawalModalProps) {
  const { chainId } = useActiveWeb3React()
  const toggleWithdrawalRewardModal = useWithdrawalRewardModal()
  const theme = useTheme()
  const [confirmed, setConfirmed] = useState(false)
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onDismiss={toggleWithdrawalRewardModal} minHeight={false} maxHeight={90}>
      <Wrapper>
        <UpperSection>
          <CloseIcon onClick={toggleWithdrawalRewardModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>
            <HoverText>{t('warn')}</HoverText>
          </HeaderRow>
          <ContentWrapper>
            <TYPE.body fontWeight={500} color={theme.red1}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad magni, praesentium distinctio cumque recusandae rerum omnis? Architecto dolorum,
            </TYPE.body>

            <TYPE.body fontWeight={500} color={theme.red1}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad magni, praesentium distinctio cumque recusandae rerum omnis? Architecto dolorum,
            </TYPE.body>

            <div className="s-withdrawal-list">
              <WithdrawalItem />
              <WithdrawalItem />
            </div>

            <AutoRow justify="left" style={{ cursor: 'pointer' }} onClick={() => setConfirmed(!confirmed)}>
              <Checkbox
                name="confirmed"
                type="checkbox"
                checked={confirmed}
                onChange={() => setConfirmed(!confirmed)}
              />
              <TYPE.body m="10px" fontSize="16px" color={theme.red1} fontWeight={500}>
                I understand
              </TYPE.body>
            </AutoRow>

            <ButtonError
              disabled={!confirmed}
              altDisabledStyle={true}
              borderRadius="20px"
              backgroundColor={theme.red1}
              padding="10px 1rem"
              onClick={toggleWithdrawalRewardModal}
            >
              Continue
          </ButtonError>
          </ContentWrapper>
        </UpperSection>
      </Wrapper>
    </Modal>
  )
}
