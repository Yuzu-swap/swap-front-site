import React from 'react'
import styled from 'styled-components'

import { AlertTriangle, X } from 'react-feather'
import { useURLWarningToggle, useURLWarningVisible } from '../../state/user/hooks'
import { isMobile } from 'react-device-detect'
import Modal from 'components/Modal'
import { ButtonPrimary } from 'components/Button'

const PhishAlert = styled.div<{ isActive: any }>`
  width: 100%;
  padding: 6px 6px;
  background-color: ${({ theme }) => theme.blue1};
  color: white;
  font-size: 11px;
  justify-content: space-between;
  align-items: center;
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
`


export const WarningText = styled.div`
    text-align: left;
    font-size: 20px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
    line-height: 24px;
`

export const StyledClose = styled(X)`
  :hover {
    cursor: pointer;
  }
`

export default function URLWarning() {
  const toggleURLWarning = useURLWarningToggle()
  const showURLWarning = useURLWarningVisible()
  console.log('showURLWarning',showURLWarning)

  return <Modal isOpen={showURLWarning} onDismiss={() =>{}} maxHeight={200} minHeight={10} maxWidth={850}>
          <div style={{display:'flex', flexDirection:'column', width:"100%", padding:"20px"}}>
            <div style={{maxHeight:'80vh', overflow:'scroll'}}>
              <WarningText>
              Before you enter...<br/><br/>
              YuzuSwap is a decentralized exchange that people can use to create liquidity and trade tokens in a uncustodial way. YuzuSwap protocol is made up of free, public, and open-source software. Your use of YuzuSwap involves various risks, including, but not limited, to losses while digital assets are being supplied to YuzuSwap pools and losses due to the fluctuation of prices of tokens in a trading pair or liquidity pool, including Impermanence Loss. Before using any pool on YuzuSwap, you should review the relevant documentation to make sure you understand how it works, and the pool you use on YuzuSwap works. Additionally, you can access pools on YuzuSwap through several web or mobile interfaces. You are responsible for doing your own diligence on those interfaces to understand the fees and risks they present.
              <br/>
              <br/>
              THE YUZUSWAP PROTOCOL IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND. Although Yuzuswap Ltd. developed much of the initial code for the YuzuSwap protocol, it does not provide, own, or control the protocol. No developer or entity involved in creating the YuzuSwap protocol will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the protocol, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
              </WarningText>
            </div>
                <ButtonPrimary disabled={false} onClick={()=>{
                    toggleURLWarning()
                }}
                style={{marginTop:"20px"}}
                >
                    I understand and agree with the above statement
                </ButtonPrimary>
          </div>
          </Modal>
}
