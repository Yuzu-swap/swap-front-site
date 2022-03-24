import React from 'react'


// import Logo from '../../assets/svg/logo.svg'
// import LogoDark from '../../assets/svg/logo_white.svg'

import { useTranslation } from 'react-i18next'

import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import ClaimModal from '../claim/ClaimModal'
import { useToggleSelfClaimModal, useShowClaimPopup } from '../../state/application/hooks'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import { Dots } from '../swap/styleds'
import Modal from '../Modal'
import usePrevious from '../../hooks/usePrevious'
import '../../assets/o.css';

export default function Header() {
  const { t } = useTranslation();
  return (
    <div className="s-banner">
      <span className="s-banner-title">
        YUZUSWAP
      </span>
      <span className="s-banner-p">
        {t('slogan')}
      </span>
    </div>
  )
}
