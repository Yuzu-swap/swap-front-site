import React, { Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ChainId } from '@liuxingfeiyu/zoo-sdk'
import { useActiveWeb3React } from '../hooks/index'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'

import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { ApplicationModal } from '../state/application/actions'
import { useModalOpen, useToggleModal } from '../state/application/hooks'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import SingleCurrencySelect from 'components/SingleCurrencies/select'
import BoardroomSelect from 'components/Boardrooms/select'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
//import Earn from './Earn'
//import Manage from './Earn/Manage'
//import MigrateV1 from './MigrateV1'
//import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Swap from './Swap'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap,RedirectToSwap2 } from './Swap/redirects'
import Homepage from './Homepage'
import TradingMining from './TradingMining'
import LiquidityMining from './Boardroom'
import SingleCurrency from './SingleCurrency'
import Intro  from './Introduce'
import IntroFoot from './Introduce/foot'
import NormalHeader from './HeaderBanner'
import IntroHead from './HeaderBanner/introhead'
import Airdrop from './Introduce/airdrop'
import Coming from './Introduce/coming'
import NewIntroHead from './HeaderBanner/newIntrohead'
import NewIntroBody from './Introduce/newIntrobody'
import { Bridge } from './Bridge'

//import Vote from './Vote'
//import VotePage from './Vote/VotePage'

import SushiBar from './SushiBar'


import '../assets/o.css';
import '../assets/mobile.css';

// Additional Tools
import Tools from './Tools'
import Saave from './Saave'

import ComingSoonModal from '../components/ComingSoonModal'
import { Zap } from './Zap'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  position: relative;
`


const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  flex: 1;
  z-index: 10;
  min-height: 100vh;


  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 0rem;
  `};

  z-index: 1;
`


const Marginer = styled.div`
  margin-top: 5rem;
`



export default function App() {
  const { chainId } = useActiveWeb3React()
  console.log(document.domain)
  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper className="s-app-wrapper">
        <BodyWrapper className="s-body-wrapper">
          <Switch>
            <Route exact path="/intro" component={IntroHead}/>
            <Route exact path="/airdrop" component={IntroHead}/>
            <Route exact path="/coming" component={()=>{
              return(<div/>)
            }}/>
            <Route exact path="/introhome" component={NewIntroHead}/>
            <Route component={NormalHeader} />
          </Switch>
          <Popups />
          <Polling />
          <Polling />
          <Web3ReactManager>
            <Switch>
              {/* Tools */}
              <Route exact strict path="/tools" component={Tools} />
              <Route exact strict path="/saave" component={Saave} />
              {/* Pages */}
              {chainId === ChainId.MAINNET && <Route exact strict path="/stake" component={SushiBar} />}
              <Route exact path="/sushibar" render={() => <Redirect to="/stake" />} />
              {/* Pages */}
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/swap/:inputCurrency/:outputCurrency" component={RedirectToSwap2} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/pool" component={Pool} />
              {/* <Route exact strict path="/sushi" component={Earn} /> */}
              {/* <Route exact strict path="/vote" component={Vote} /> */}
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/liquiditymining/select/:pid/extselect/:extpid" component={BoardroomSelect} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/create" component={AddLiquidity} />
              <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
              {/* <Route exact strict path="/migrate/v1" component={MigrateV1} /> */}
              {/* <Route exact strict path="/migrate/v1/:address" component={MigrateV1Exchange} /> */}
              {/* <Route exact strict path="/uni/:currencyIdA/:currencyIdB" component={Manage} /> */}
              {/* <Route exact strict path="/vote/:id" component={VotePage} /> */}
              <Route exact strict path="/tradingmining" component={TradingMining} />
              <Route exact strict path="/liquiditymining" component={ LiquidityMining } />
              <Route exact strict path="/singlecurrency" component={ SingleCurrency } />
              <Route exact path="/singlecurrency/select/:pid" component={SingleCurrencySelect} />
              <Route exact path="/bridge" component={Bridge} />
              <Route exact path="/zap" component={Zap} />
              <Route exact path="/intro" component={Intro} />
              <Route exact path="/airdrop" component={Airdrop} />
              <Route exact path="/coming" component={Coming}/>
              <Route exact path="/introhome" component={NewIntroBody}/>
              
              <Route component={Homepage} />
            </Switch>
          </Web3ReactManager>
          <Marginer />
        </BodyWrapper>
        <Switch>
            <Route exact path="/intro" component={IntroFoot}/>
            <Route exact path="/airdrop" component={IntroFoot}/>
            <Route exact path="/coming" component={()=>{
              return(<div/>)
            }}/>
            <Route exact path="/introhome" component={()=>{
              return(<div/>)
            }}/>
            <Route component={()=>{
              return(
                <div className= "s-banner-bg-youzi1"></div>
              )
            }} />
          </Switch>
        
      </AppWrapper>
    </Suspense>
  )
}
