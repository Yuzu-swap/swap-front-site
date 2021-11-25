import React, { Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ChainId } from '@liuxingfeiyu/zoo-sdk'
import styled from 'styled-components'
import Header from '../../components/Header'

export default function NormalHeader() {

    const BannerWrapper = styled.div`
    height: 400px;
    width: 100%;
    position: absolute;
  `
  
  const HeaderWrapper = styled.div`
    ${({ theme }) => theme.flexRowNoWrap}
    width: 100%;
    justify-content: space-between;
  `
  return (
    <BannerWrapper className="s-banner-wrapper">
        <HeaderWrapper className="s-header-wrapper">
            <Header />
        </HeaderWrapper>
        <div className="s-banner-bg s-banner-bg-line">
            
            <div className="s-banner-bg s-banner-bg-dot "/>
            <div className="s-banner-bg s-banner-bg-halfcircle "/>
            <div className="s-banner-bg s-banner-bg-youzi "/>
        </div> 
    </BannerWrapper>
  )
}
