import React, { Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ChainId } from '@liuxingfeiyu/zoo-sdk'
import styled from 'styled-components'
import P1log1 from '../../assets/newUI/introUI/bpp1logo1.png'
import P1log2 from '../../assets/newUI/introUI/bpp1logo2.png'
import P2log1 from '../../assets/newUI/introUI/bpp2logo1.png'
import P2log2 from '../../assets/newUI/introUI/bpp2logo2.png'
import P3log1 from '../../assets/newUI/introUI/bpp3logo1.png'
import P3log2 from '../../assets/newUI/introUI/bpp3logo2.png'
import P4log1 from '../../assets/newUI/introUI/bpp4logo1.png'
import P4log2 from '../../assets/newUI/introUI/bpp4logo2.png'
import P5log1 from '../../assets/newUI/introUI/bpp5logo1.png'
import P5log2 from '../../assets/newUI/introUI/bpp5logo2.png'
import Bluemore from '../../assets/newUI/introUI/bluemore.png'
import TokenBlue from '../../assets/newUI/introUI/tokenblue.png'
import TokenOrange from '../../assets/newUI/introUI/tokenorange.png'
import TokenRed from '../../assets/newUI/introUI/tokenred.png'
import TokenGrey from '../../assets/newUI/introUI/tokengrey.png'
import Smalllogo from '../../assets/newUI/introUI/roadmapslogo.png'
import Biglogo from '../../assets/newUI/introUI/roadmapblogo.png'
import Q1 from '../../assets/newUI/introUI/2021Q4.png'
import Q2 from '../../assets/newUI/introUI/2022Q1.png'
import Q3 from '../../assets/newUI/introUI/2022Q2.png'
import Q4 from '../../assets/newUI/introUI/2022Q3.png'

export default function Airdrop() {
  const learnmore = ()=>{
    window.location.href= 'https://oasisprotocol.org';
  }
  return (
    <div className="s-airdrop-body">
        <div className="s-airdrop-body-big-bg">
        </div>
        <div className="s-intro-body-dot-bg">
                <div className="s-intro-body-circle-bg"/>
        </div>
        <div className="s-airdrop-body-bg"/>
        <div className="s-airdrop-body-context">
          <div className="s-airdrop-body-context-logo"/>
          <div className="s-airdrop-body-context-title"/>
          <div className="s-airdrop-body-context-p1">
          
            <div className="s-airdrop-body-context-p1-text">
            To celebrate the launch of YuzuSwap, the first Decentralized Exchange (DEX) built on Oasis’s Emerald, the EVM Compatible ParaTime, we are running the first ever DEX-token Airdrop.
            </div>
            <div className="s-airdrop-body-context-p1-text">
            YUZU’s total token supply is capped at 500M and there is 50K YUZU up for grabs in that Airdrop which will run from 16 November 2021 till the Genesis starts (around early December). The Airdrop is designed to help users get a grip on the features of the DEX and to reward the Oasis Community for their continued support. 
            </div>
          
          </div>

          <div className="s-airdrop-body-context-p2">
            <div className="s-airdrop-body-context-p2-picture">
              <div className="s-airdrop-body-context-p2-title"/>
            </div>
            <div className="s-airdrop-body-context-p2-text">
            Oasis is the leading privacy-enabled, layer-1 blockchain network, ideal for DeFi due to its instant finality, 99% lower gas fees versus Ethereum, high throughput and privacy protection.
            </div>
          </div>

          <div className="s-airdrop-body-context-p3">
            <div className="s-airdrop-body-context-p3-list">
              <div className="s-airdrop-body-context-p3-picture"/>
              <div className="s-airdrop-body-context-p3-title"/>
            </div>
            <div className="s-airdrop-body-context-p3-text">
            If you want to take part in the YUZU Airdrop, the rules are simple. To qualify, users must complete a series of missions, as described below. The first of which is to hold ROSE in your own Oasis wallet. The Airdrop tokens will be unlocked one week after Genesis (early December).
            </div>
          </div>

          <div className="s-airdrop-body-context-p4">
            <div className="s-airdrop-body-context-p4-picture">
              <div className="s-airdrop-body-context-p4-title"/>
            </div>
            <div className="s-airdrop-body-context-p4-text">
            1. Fill out the Airtable <a href="https://airtable.com/shrVEg7DZEkCelNSP">form</a> here — with your Twitter and Telegram handles and your Oasis wallet address to claim testnet rose.*<br/>
            2. Open an Oasis Wallet and fund with ROSE tokens.**<br/>
            3. Follow @Yuzu_Swap on <a href="https://twitter.com/Yuzu_Swap">Twitter</a>.<br/>
            4. Like & Quote Tweet YuzuSwap’s Pinned Tweet + tag (@) 3 of your friends!<br/>
            5. Join the YuzuSwap <a href="https://t.me/yuzuswap_on_oasis">Telegram</a> group.<br/>
            6. Follow @OasisProtocol on Twitter and Telegram.<br/>
            7. Like & Quote Tweet @OasisProtocol’s Pinned Tweet describing what excites you most about YuzuSwap.<br/>
            8. Swap YUZU with ROSE on YuzuSwap testnet.<br/>
            9. Provide liquidity to the ROSE-YUZU pool.<br/>
            10. Stake the LPT and start liquidity mining.<br/>
            11. Claim your trade and liquidity mining rewards.<br/>
            12. Unstake your LPT and remove liquidity from the pool.<br/>
            </div>
          </div>

          <div className="s-airdrop-body-context-p5">
            <div className="s-airdrop-body-context-p5-text">
            * ROSE Test Tokens will be sent in batches once a day at 12pm UTC starting the 19th November.<br/>
            ** A snapshot of ALL Oasis Accounts will be taken on 30 November 2021. All accounts that have a balance of ROSE ({'>'} 1 ROSE) at this time will complete the first mission.<br/>
            You can register for the Airdrop and begin your missions <a href="https://airtable.com/shrVEg7DZEkCelNSP">here</a>.
            </div>
          </div>
        </div>
        
    </div>
  )
}
