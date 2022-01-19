import React from 'react'
import styled from 'styled-components'
import AppBody from '../AppBody'
import { isMobile } from 'react-device-detect'
import { useEffect } from 'react'

export function Bridge(){
    const  BridgeIframe  = styled.iframe`
        width: 100%;
        height: 100vh;
        margin-top: 136px;
        position: relative;
    `
    useEffect(
        ()=>{
            window.location.href = "https://wormholebridge.com/#/transfer"
        }
        ,[]
    )
    return (
        // !isMobile ?
        // <BridgeIframe src="https://wormholebridge.com/#/transfer">
        // </BridgeIframe>
        // :
        <></>     
    )
}