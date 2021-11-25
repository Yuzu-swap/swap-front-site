import React,  { useState} from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ChainId } from '@liuxingfeiyu/zoo-sdk'
import styled from 'styled-components'
import Bg from '../../assets/newUI/introUI/headerbg.png'
import { NavLink } from 'react-router-dom'
import Logo from '../../assets/newUI/newIntroUI/bannerLogo.png'


const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
    font-family: Sul Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 1.25rem;
    line-height: 1.5625rem;
    color: #959595;
    cursor: pointer;
	outline: none;
	text-decoration: none;

  &.${activeClassName} {
    color: #ED4962;
  }
`

export default function NewIntroHead() {
    const [Text, SetText] = useState('Start Trading')
    const onOver = ()=>{SetText('Coming Soon')}
    const onOut = ()=>{SetText('Start Trading')}

    return (
        <div className="s-newintro-head">
            <img className="s-newintro-head-logo" src={Logo}/>
            <div className="s-newintro-head-right">
                <StyledNavLink className="s-newintro-head-NavLink" to={"/introhome"}>
                Overview
                </StyledNavLink>
                <StyledNavLink className="s-newintro-head-NavLink" to={"/newairdrop"}>
                Airdrop
                </StyledNavLink>
                <div className="s-newintro-head-button" onMouseOver={onOver} onMouseOut={onOut}>
                {Text}
                </div>
            </div>
        </div>
    )
}
