import React,  { useState} from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ChainId } from '@liuxingfeiyu/zoo-sdk'
import styled from 'styled-components'
import Logo from '../../assets/newUI/introUI/logo.png'
import Bg from '../../assets/newUI/introUI/headerbg.png'
import { NavLink } from 'react-router-dom'

export default function IntroHead() {
    const Header = styled.div`
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: space-between;
    `
    const [Text, SetText] = useState('START TRADING NOW')
    const onOver = ()=>{SetText('COMING SOON')}
    const onOut = ()=>{SetText('START TRADING NOW')}

    return (
        <Header className="s-intro-head-bg">
            <img className="s-intro-head-logo" src={Logo} />
            <div className="s-intro-head-route-list">
                <NavLink className="s-intro-head-normal-link s-intro-head-normal-margin" to={'/intro'}>OVERVIEW</NavLink>
                <NavLink className="s-intro-head-normal-link s-intro-head-normal-margin" to={'/airdrop'}>AIRDROP</NavLink>
                <div className="s-intro-head-special-link">
                    <div className="s-intro-head-normal-link" onMouseOver={onOver} onMouseOut={onOut}>{Text}</div>
                </div>
            </div>
        </Header>
    )
}
