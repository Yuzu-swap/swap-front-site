import React, { Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ChainId } from '@liuxingfeiyu/zoo-sdk'
import styled from 'styled-components'
import Twitter from '../../assets/newUI/introUI/foottwitter.png'
import Telegram from '../../assets/newUI/introUI/foottelegram.png'

export default function IntroFoot() {
  const gotwitter = ()=>{
    window.location.href= 'https://twitter.com/Yuzu_Swap';
  }
  const gotelegram = ()=>{
    window.location.href= 'https://t.me/yuzuswap_on_oasis';
  }
  return (
   <div className="s-intro-foot">
       <div className="s-intro-foot-list">
           <div className="s-intro-foot-detail">
               <img className="s-intro-foot-detail-logo" src={Twitter} onClick={gotwitter}/>
               <div className="s-intro-foot-detail-text">
                   Twitter
                </div>
            </div>
            <div className="s-intro-foot-detail">
                <img className="s-intro-foot-detail-logo" src={Telegram} onClick={gotelegram}/>
                <div className="s-intro-foot-detail-text">
                   Telegram
                </div>
            </div>
        </div>
    </div>
  )
}
