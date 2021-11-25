import React,  { useState} from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ChainId } from '@liuxingfeiyu/zoo-sdk'
import styled from 'styled-components'
import Bg from '../../assets/newUI/introUI/headerbg.png'
import { NavLink } from 'react-router-dom'
import Logo from '../../assets/newUI/newIntroUI/bannerLogo.png'
import P1log1 from '../../assets/newUI/introUI/bpp1logo1.png'
import P2log1 from '../../assets/newUI/introUI/bpp2logo1.png'
import P3log1 from '../../assets/newUI/introUI/bpp3logo1.png'
import P4log1 from '../../assets/newUI/introUI/bpp4logo1.png'
import P5log1 from '../../assets/newUI/introUI/bpp5logo1.png'
import Oasis from '../../assets/newUI/newIntroUI/oasisLogo.png'
import LearnMore from '../../assets/newUI/newIntroUI/learnmore.png'
import Icon from '../../assets/newUI/newIntroUI/icon.png'

export default function NewIntroBody() {
    const [change, SetChange] = useState(false)
    const onChange = ()=>{SetChange(false)}
    console.log(change)
    const learnmore = ()=>{
        window.location.href= 'https://oasisprotocol.org';
      }


    function Qtext( text:string , isRight: boolean) {
        return (
            isRight ?
            <div className="s-newintro-roadmap-list-d-2r">
                <div className="s-newintro-roadmap-list-d-2-b"/>
                <div className="s-newintro-roadmap-list-d-2-t">
                    {text}
                </div>
            </div>
            :
            <div className="s-newintro-roadmap-list-d-2">
                <div className="s-newintro-roadmap-list-d-2-b"/>
                <div className="s-newintro-roadmap-list-d-2-t">
                     {text}
                </div>
            </div>

        )
    }
    return (
        change ?
        <div className="s-newintro-body">
            <div className="s-newintro-body-left">
                <div className="s-newintro-body-left-big">
                YuzuSwap
                </div>
                <div className="s-newintro-body-left-small">
                An open, safe, fair dex ecosystem with<br/> High composability built on Oasis 
                </div>
                <div className="s-newintro-body-left-button" onClick={onChange}>
                What is YUZU?
                </div>
            </div>
        </div>
        :
        <div className="s-newintro-detail">
            <div className="s-newintro-detail-wsy">
                <div className="s-newintro-contain">
                    <div className="s-newintro-detail-wsy-c">
                        <div className="s-newintro-detail-wsy-c-big">
                        What is YUZU?
                        </div>
                        <div className="s-newintro-detail-wsy-c-small">
                        YuzuSwap is a decentralized exchange utilizing the high efficiency of Oasis's evm paratime, with incentives like liquidity mining and trade mining. It's developed based on non-custodial, peer-to-peer, automated-market-maker model, aiming to provide a safe, swift, low-cost tool to switch and discover tokens for users on Oasis ecosystem, a fully open platform for developers to launch tokens on, a DAO driven community.
                        </div>
                        <div className="s-newintro-detail-wsy-c-cf">
                        Core Features
                        </div>
                        <div className="s-newintro-detail-wsy-t">
                            <div className="s-newintro-detail-wsy-d">
                                <img className="s-newintro-detail-wsy-d-img" src={P1log1}/>
                                <div className="s-newintro-detail-wsy-d-big">
                                Fair Launch
                                </div>
                                <div className="s-newintro-detail-wsy-d-small">
                                No pre-mined tokens. All tokens are mined block by block, since the genesis, including team/foundation/early investors' tokens. The amount of tokens mined in each block will halve every year.
                                </div>
                            </div>
                            <div className="s-newintro-detail-wsy-d">
                                <img className="s-newintro-detail-wsy-d-img" src={P2log1}/>
                                <div className="s-newintro-detail-wsy-d-big">
                                Trade Mining
                                </div>
                                <div className="s-newintro-detail-wsy-d-small">
                                YuzuSwap's trade mining mechanism is based on a TPST (trading pool share token) design, once users trade in incentivized trading pairs, they will get a balance in TPST, similar to LPT (liquidity provider token) as their evidence of trading, they will receive the trade mining token in each block according to the share of TPST. If the user does not claim the trade mining rewards, TPST balance will always be there and mine in each block, until user chooses to claim the trade mining rewards, the TPST balance will reset to zero.
                                </div>
                            </div>
                            <div className="s-newintro-detail-wsy-d">
                                <img className="s-newintro-detail-wsy-d-img" src={P3log1}/>
                                <div className="s-newintro-detail-wsy-d-big">
                                Buyback
                                </div>
                                <div className="s-newintro-detail-wsy-d-small">
                                YuzuSwap will take a 0.3% transaction fee from all the transactions, 80% the transaction fee will go to a smart contract, this contract will trigger buying YUZU token action if the price of it drops below the 72 hour average. So the more transaction fee accumulated, the healthier YUZU token price will be.
                                </div>
                            </div>
                            <div className="s-newintro-detail-wsy-d">
                                <img className="s-newintro-detail-wsy-d-img" src={P4log1}/>
                                <div className="s-newintro-detail-wsy-d-big">
                                Vault
                                </div>
                                <div className="s-newintro-detail-wsy-d-small">
                                The usage of the DAO vault will be voted by YUZU token holders.  Possible usage includes to incentivize developers to develop tools for YuzuSwap, co-invest in other projects on Oasis, and purchase insurance for YuzuSwap, etc.
                                </div>
                            </div>
                            <div className="s-newintro-detail-wsy-d">
                                <img className="s-newintro-detail-wsy-d-img" src={P5log1}/>
                                <div className="s-newintro-detail-wsy-d-big">
                                Composability
                                </div>
                                <div className="s-newintro-detail-wsy-d-small">
                                YuzuSwap is open to composing with any projects on Oasis, for instance: users could collateralize their LPT (liquidity provider token) on the upcoming lending protocol on Oasis and regain their liquidity; on the other hand, they can also borrow LPT from the lending protocol to mine YUZU token without the concern of potential impermanent loss. The DAO vault may opt to purchasing insurance for pools on YuzuSwap, so even if unexpected incidents happen, those pools will be covered by insurance. Promising new projects on Oasis could apply for IDO/IFO on YuzuSwap, and it will be a great way to raise fund for projects from the community. Users with YUZU tokens will vote for which project may go live on the IDO/IFO launchpad, whether or not to allocate mining pool to the new token, and what percentage of the mining pool will be allocate to the new token, etc.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="s-newintro-detail-wso">
                <div className="s-newintro-contain">
                <img className="s-newintro-detail-wso-title" src={Oasis}/>
                <div className="s-newintro-detail-wso-big">
                What is Oasis?
                </div>
                <div className="s-newintro-detail-wso-small">
                The Oasis Network is a Layer 1 decentralized blockchain network designed to be uniquely scalable, privacy-first and versatile.
                </div>
                <div className="s-newintro-learnmore" onClick={learnmore}>
                    <img src={LearnMore}/>
                </div>
                </div>
            </div>
            <div className="s-newintro-detail-token">
                <div className="s-newintro-contain">
                <div className="s-newintro-detail-token-big">
                Tokenomics
                </div>
                <div className="s-newintro-detail-token-small">
                YUZU token's total supply is capped by 500M, among which 70% will be mined block by block from liquidity mining pool and trade mining pool, 10% will go to the team, 10% will go to the foundation, 10% will go to early stage investors.
                </div>
                </div>
            </div>
            <div className="s-newintro-roadmap">
                <div className="s-newintro-contain">
                    <div className="s-newintro-roadmap-big">
                    ROAD MAP 
                    </div>
                    <div className="s-newintro-roadmap-list">
                        <div className="s-newintro-roadmap-list-banner"/>
                        <div className="s-newintro-roadmap-list-d">
                            <div className="s-newintro-roadmap-list-d-1">
                                2021 Q4
                            </div>
                            <img className="s-newintro-roadmap-list-d-m" src={Icon} />
                            {Qtext("Launch DEX on Oasis Emerald ParaTime with liquidity mining and trade mining" , false)}
                        </div>
                        <div className="s-newintro-roadmap-list-d">
                            <div className="s-newintro-roadmap-list-d-1">
                                2022 Q1
                            </div>
                            <img className="s-newintro-roadmap-list-d-m" src={Icon} />
                            {Qtext("Staking and IDO/IFO" , false)}
                        </div>
                        <div className="s-newintro-roadmap-list-d">
                            <div className="s-newintro-roadmap-list-d-1">
                                2022 Q2
                            </div>
                            <img className="s-newintro-roadmap-list-d-m" src={Icon} />
                            {Qtext("Dual Yield,  Limited Order" , false)}
                        </div>
                        <div className="s-newintro-roadmap-list-d">
                            <div className="s-newintro-roadmap-list-d-1">
                                2022 Q3
                            </div>
                            <img className="s-newintro-roadmap-list-d-m" src={Icon} />
                            {Qtext("DAO" , true)}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        
    )
}
