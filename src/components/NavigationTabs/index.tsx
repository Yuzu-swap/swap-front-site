import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { NavLink, Link as HistoryLink } from 'react-router-dom'

import { ArrowLeft } from 'react-feather'
import Row, { RowBetween } from '../Row'
// import QuestionHelper from '../QuestionHelper'
import Settings from '../Settings'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { resetMintState } from 'state/mint/actions'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: inherit;
  justify-content: space-evenly;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;

  &.${activeClassName} {
    border-radius: ${({ theme }) => theme.borderRadius};
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
  color: #FFF;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: #FFF;
`

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' | 'homepage' | 'tradingmining' | 'boardroom' }) {
  const { t } = useTranslation()
  return (
    <Tabs style={{display: 'none' }}>
      <StyledNavLink id={`homepage-nav-link`} to={'/homepage'} isActive={() => active === 'homepage'}>
        {t('homepage')}
      </StyledNavLink>
      <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
        {t('swap')}
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
        {t('pool')}
      </StyledNavLink>
      <StyledNavLink id={`tradingmining-nav-link`} to={'/tradingmining'} isActive={() => active === 'tradingmining'}>
        {t('pool')}
      </StyledNavLink>
      <StyledNavLink id={`boardroom-nav-link`} to={'/boardroom'} isActive={() => active === 'boardroom'}>
        {t('pool')}
      </StyledNavLink>
    </Tabs>
  )
}

export function FindPoolTabs() {
  return (
    <Tabs style={{borderBottom:' 1px solid rgba(255, 255, 255, 0.2)'
      , borderBottomLeftRadius:' 0px', borderBottomRightRadius:' 0px', paddingBottom:'10px'
      , background: '#2C3035'}}>
      <Row  justify='space-around' style={{ padding: '1rem 1rem 0 1rem' , position: 'relative'}} className="s-header-create">
        <HistoryLink to="/pool"
          style={{position: 'absolute', left:'15px'}}
        >
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText className="s-header-create-title">Import Pool</ActiveText>
      </Row>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding, creating }: { adding: boolean; creating: boolean }) {
  // reset states on back
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation();
  
  return (
    <Tabs style={{borderBottom:' 1px solid rgba(255, 255, 255, 0.2)', borderBottomLeftRadius:' 0px', borderBottomRightRadius:' 0px', paddingBottom:'10px'}}>
      <Row  justify='space-around' style={{ padding: '1rem 1rem 0 1rem' , position: 'relative'}} className="s-header-create">
        <HistoryLink
          to="/pool"
          onClick={() => {
            adding && dispatch(resetMintState())
          }}
          style={{position: 'absolute', left:'15px'}}
        >
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText className="s-header-create-title">{creating ? t('createFlowPool'): adding ? t('addPoolLiquidity') : t('removePoolLiquidity')}</ActiveText>
      </Row>
    </Tabs>
  )
}
