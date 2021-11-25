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
import Oasis from '../../assets/newUI/introUI/oasislogo.png'
import Ngc from '../../assets/newUI/introUI/ngclogo.png'
import Despread from '../../assets/newUI/introUI/despreadlogo.png'
import SnapFinger from '../../assets/newUI/introUI/snapfingerslogo.png'
import Assembly from '../../assets/newUI/introUI/assemblylogo.png'

export default function Intro() {
  const learnmore = ()=>{
    window.location.href= 'https://oasisprotocol.org';
  }
  return (
    <div className="s-intro-body">
        <div className="s-intro-body-big-bg">
            <div className="s-intro-body-dot-bg">
                <div className="s-intro-body-circle-bg"/>
            </div>
            <div className="s-intro-body-picture"/>
            <div className="s-intro-body-slogan"/>
            
            <div className="s-intro-body-arrow"/>
            <div className="s-intro-body-whatsyuzu">
              <div className="s-intro-body-whatsyuzu-title">
                <div className="s-intro-body-whatsyuzu-title-value"/>
              </div>
              <div className="s-intro-body-whatsyuzu-logo" />
              <div className="s-intro-body-whatsyuzu-text">
              YuzuSwap is a decentralized exchange utilizing the high efficiency of Oasis's evm paratime, with incentives like liquidity mining and trade mining. It's developed based on non-custodial, peer-to-peer, automated-market-maker model, aiming to provide a safe, swift, low-cost tool to switch and discover tokens for users on Oasis ecosystem, a fully open platform for developers to launch tokens on, a DAO driven community.
                </div>
            </div>
        </div>
        <div className="s-intro-body-bp">
          <div className="s-intro-body-bp-bg1"/>
          <div className="s-intro-body-bp-bg2"/>
          <div className="s-intro-body-bp-body">
            <div className="s-intro-body-bp-body-logo"/>

            <div className="s-intro-body-bp-body-context">
              <div className="s-intro-body-bp-body-context-logo">
                <img src={P1log1}/>
                <img className="s-intro-body-bp-body-context-logo-title" src={P1log2} />
              </div>
              <div className="s-intro-body-bp-body-context-text">
              No pre-mined tokens. All tokens are mined block by block, since the genesis, including team/foundation/early investors' tokens. The amount of tokens mined in each block will halve every year.
              </div>
            </div>

            <div className="s-intro-body-bp-body-context">
              <div className="s-intro-body-bp-body-context-logo">
                <img src={P2log1}/>
                <img className="s-intro-body-bp-body-context-logo-title" src={P2log2} />
              </div>
              <div className="s-intro-body-bp-body-context-text">
              YuzuSwap's trade mining mechanism is based on a TPST (trading pool share token) design, once users trade in incentivized trading pairs, they will get a balance in TPST, similar to LPT (liquidity provider token) as their evidence of trading, they will receive the trade mining token in each block according to the share of TPST. If the user does not claim the trade mining rewards, TPST balance will always be there and mine in each block, until user chooses to claim the trade mining rewards, the TPST balance will reset to zero.
              </div>
            </div>


            <div className="s-intro-body-bp-body-context">
              <div className="s-intro-body-bp-body-context-logo">
                <img src={P3log1}/>
                <img className="s-intro-body-bp-body-context-logo-title" src={P3log2} />
              </div>
              <div className="s-intro-body-bp-body-context-text">
              YuzuSwap will take a 0.3% transaction fee from all the transactions, 80% the transaction fee will go to a smart contract, this contract will trigger buying YUZU token action if the price of it drops below the 72 hour average. So the more transaction fee accumulated, the healthier YUZU token price will be.
              </div>
            </div>

            <div className="s-intro-body-bp-body-context">
              <div className="s-intro-body-bp-body-context-logo">
                <img src={P4log1}/>
                <img className="s-intro-body-bp-body-context-logo-title" src={P4log2} />
              </div>
              <div className="s-intro-body-bp-body-context-text">
              The usage of the DAO vault will be voted by YUZU token holders.  Possible usage includes to incentivize developers to develop tools for YuzuSwap, co-invest in other projects on Oasis, and purchase insurance for YuzuSwap, etc.
              </div>
            </div>

            <div className="s-intro-body-bp-body-context">
              <div className="s-intro-body-bp-body-context-logo">
                <img src={P5log1}/>
                <img className="s-intro-body-bp-body-context-logo-title" src={P5log2} />
              </div>
              <div className="s-intro-body-bp-body-context-text">
              YuzuSwap is open to composing with any projects on Oasis, for instance: users could collateralize their LPT (liquidity provider token) on the upcoming lending protocol on Oasis and regain their liquidity; on the other hand, they can also borrow LPT from the lending protocol to mine YUZU token without the concern of potential impermanent loss. The DAO vault may opt to purchasing insurance for pools on YuzuSwap, so even if unexpected incidents happen, those pools will be covered by insurance. Promising new projects on Oasis could apply for IDO/IFO on YuzuSwap, and it will be a great way to raise fund for projects from the community. Users with YUZU tokens will vote for which project may go live on the IDO/IFO launchpad, whether or not to allocate mining pool to the new token, and what percentage of the mining pool will be allocate to the new token, etc.
              </div>
            </div>

          </div>
        </div>

        <div className="s-intro-body-blue">
          <div className="s-intro-body-blue-logo"/>
          <div className="s-intro-body-blue-text">
          The Oasis Network is a Layer 1 decentralized blockchain network designed to be uniquely scalable, privacy-first and versatile.
          </div>
          <div className="s-intro-body-blue-button" onClick={learnmore}> 
          Learn More
          <img src={Bluemore}/>
          </div>
        </div>

        <div className="s-intro-body-token">

          <div className="s-intro-body-token-logo"/>
          <div className="s-intro-body-token-bg"/>
          <div className="s-intro-body-token-context">
            <div className="s-intro-body-token-text">
            YUZU token's total supply is capped by 500M, among which 70% will be mined block by block from liquidity mining pool and trade mining pool, 10% will go to the team, 10% will go to the foundation, 10% will go to early stage investors.
            </div>
            <div className="s-intro-body-token-picture"/>
            <div className="s-intro-body-token-list">
              <div className="s-intro-body-token-detail">
                <img src={TokenRed}/>
                <div className="s-intro-body-token-detail-text">
                Mining Pool
                  </div>
                </div>
              <div className="s-intro-body-token-detail">
                <img src={TokenBlue}/>
                <div className="s-intro-body-token-detail-text">
                Team
                  </div>
                </div>
              <div className="s-intro-body-token-detail">
                <img src={TokenOrange}/>
                <div className="s-intro-body-token-detail-text">
                Foundation
                  </div>
                </div>
              <div className="s-intro-body-token-detail">
                <img src={TokenGrey}/>
                <div className="s-intro-body-token-detail-text">
                Investors
                  </div>
                </div>
            </div>
          </div>
        </div>

        <div className="s-intro-body-roadmap">
          <div className="s-intro-body-roadmap-logo"/>
          <div className="s-intro-body-roadmap-gap"/>
          <div className="s-intro-body-roadmap-list">
            <div className="s-intro-body-roadmap-detail">
              <img className="s-intro-body-roadmap-detail-smalllogo" src={Smalllogo}/>
              <img className="s-intro-body-roadmap-detail-q" src={Q1}/>
              <div className="s-intro-body-roadmap-detail-text">
              Launch DEX on Oasis Emerald ParaTime with liquidity mining and trade mining 
              </div>
            </div>
            <div className="s-intro-body-roadmap-detail">
              <img className="s-intro-body-roadmap-detail-smalllogo" src={Smalllogo}/>
              <img className="s-intro-body-roadmap-detail-q" src={Q2}/>
              <div className="s-intro-body-roadmap-detail-text">
              Staking and IDO/IFO 
              </div>
            </div>
            <div className="s-intro-body-roadmap-detail">
              <img className="s-intro-body-roadmap-detail-smalllogo" src={Smalllogo}/>
              <img className="s-intro-body-roadmap-detail-q" src={Q3}/>
              <div className="s-intro-body-roadmap-detail-text">
              Dual Yield, Limited Order
              </div>
            </div>
            <div className="s-intro-body-roadmap-detail">
              <img className="s-intro-body-roadmap-detail-biglogo" src={Biglogo}/>
              <img className="s-intro-body-roadmap-detail-q" src={Q4}/>
              <div className="s-intro-body-roadmap-detail-text">
              DAO
              </div>
            </div>
          </div>
        </div>

        <div className="s-intro-body-partner">
          <div className="s-intro-body-partner-logo"/>
          <div className="s-intro-body-partner-body">
            <img src={Oasis}/>
            <img src={Ngc}/>
            <img src={Despread}/>
            <img src={SnapFinger}/>
            <img src={Assembly}/>
          </div>
        </div>
    </div>
  )
}
