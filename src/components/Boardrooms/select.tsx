import React, { useState, useMemo, useRef, useEffect, MutableRefObject } from 'react'
import { Settings, X } from 'react-feather'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import { Box } from 'rebass/styled-components'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import YuzuSwapLogo from '../../assets/svg/yuzusinglelogo.svg'
import Sloganer from 'components/Sloganer'
import LoadingRings from 'components/Loader/rings'
import BoardroomLP from './lp'

import { AutoColumn } from '../Column'
import Modal from '../Modal'
import { RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'
import { ButtonPrimary, ButtonPrimaryNormal, ButtonGray } from '../Button'
import { useSelector } from 'react-redux'
import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, StakePool, Currency } from '@liuxingfeiyu/zoo-sdk'
import { AppState } from 'state'
import { DefaultChainId, ZOO_PARK_ADDRESS, ZOO_PARK_EXT_ADDRESS } from '../../constants'
import { useActiveWeb3React } from 'hooks'
import { useApproveCallback, ApprovalState } from 'hooks/useApproveCallback'
import { useStakingContract,useTokenWrapper } from 'hooks/useContract'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import useZooParkCallback from 'zooswap-hooks/useZooPark'
import { tokenAmountForshow, numberToString } from 'utils/ZoosSwap'
import { TokenReward, useMyAllStakePoolList, useMyAllYuzuParkExtList, ZooParkExt, useWTokenBalanceList} from 'data/ZooPark'
import { useTranslation } from 'react-i18next'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { fixFloatFloor } from 'utils/fixFloat'
import Decimal from 'decimal.js'
import CurrencyLogo from 'components/CurrencyLogo'
import QuestionHelper, {AddQuestionHelper, AddQuestionNoCHelper} from 'components/QuestionHelper'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { useCallback } from 'hoist-non-react-statics/node_modules/@types/react'
import { configureScope } from '@sentry/minimal'
import { Contract } from '@ethersproject/contracts'
import { useWTokenUnWrapCallback } from 'hooks/useWTokenUnWrapCallback'
//import { useEffect } from 'hoist-non-react-statics/node_modules/@types/react'

const StyledCloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`
const ModalContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 8px;
  width: 100%;
`

export default function BoardroomSelected(props: RouteComponentProps<{ pid: string , extpid: string}>) {
  const {
    location: { search },
    match: {
      params: { pid , extpid }
    }
  } = props
  const pindex = parseInt(pid)
  const extpindex = parseInt(extpid)
  const isExt = pindex == -1 ? true: false
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pledgeValue, setPledgeValue] = useState('0')
  const [isHarvest, setHarvest] = useState(false) //提现对话框
  const [isApprove, setApprove] = useState(false)
  const [status, setStatus] = useState({ type: 'init', tips: '' })

  const [poolList, statics] = useMyAllStakePoolList()
  const [poolExtList,extStatics] = useMyAllYuzuParkExtList()


  const winLabals = {
    coin : 'YUZU',
    lp : 'YuzuSwap LP'
  }

  const winOpts = {
    deposite : 'Deposite',
    withdraw : 'Withdraw',
    unwrap : 'Unwrap'
  }

  const { t } = useTranslation();
  // tododo：页面刷新时无数据来源
  const pool : any = useMemo(
    ()=>{
      let re : any
      if(pindex != -1){
        for(let i = 0; i < poolList.length; i++){
          if(poolList[i].pid == pindex){
            re = poolList[i]
          }
        }
      }
      else{
        for(let i = 0; i < poolExtList.length; i++){
          if(poolExtList[i].pid == extpindex){
            re = poolExtList[i]
          }
        }
      }
      return re 
    }
    ,[pindex, poolList, poolExtList]
  )
  const tokenRewards = isExt? pool?.tokenRewards : null

  const wrappedTokenRewards : any[]= useMemo(
    ()=>{
      let re : any []= []
      if(!tokenRewards){
        return re
      }
      for(let i = 0; i < tokenRewards.length; i++){
        if(tokenRewards[i]?.wrapped){
          re.push(tokenRewards[i])
        }
      }
      return re
    },
    [tokenRewards]
  ) 
  const wtokenAddresses:string[] = useMemo( ()=> wrappedTokenRewards.map( (p,e)=>p.token.address )  ,[wrappedTokenRewards])
  console.log("wrapped token addrss", wtokenAddresses)
  
  const WrapperBalance = useWTokenBalanceList(wtokenAddresses)

  const [wtoken, setWtoken] = useState<Token>()
  const [wamount, setWamount] = useState<JSBI>(JSBI.BigInt(0))
  const unwrap = useWTokenUnWrapCallback(wamount, wtoken)
  const onUnwrap = (i:number)=>{
    if(wrappedTokenRewards && wrappedTokenRewards.length >= i +1){
      setWinValue(fixFloatFloor(tokenAmountForshow(WrapperBalance[i], wrappedTokenRewards[i].token.decimals),6));
      setWinLabel(wrappedTokenRewards[i].token.symbol);
      setWinOpt(winOpts.unwrap);
      setWtoken(wrappedTokenRewards[i].token)
      setWamount(WrapperBalance[i])
      unwrap()
    }
  }


  const ZERO = JSBI.BigInt(0)
  // 个人质押总额
  const myStaked = pool ? tokenAmountForshow(pool.myCurrentLp) : ZERO
  // 个人未领取奖励
  const myReward = pool ? tokenAmountForshow(pool.myReward) : 0
  // 个人lp 余额
  const myLpBalance = pool ? fixFloatFloor(JSBI.toNumber(pool.myLpBalance) / 1e18, 8) : ZERO

  const myStakedPoolShareRatio =  pool && JSBI.greaterThan(pool.myCurrentLp,ZERO) ?   (new Decimal(pool.myCurrentLp.toString() ).div( new Decimal(pool.totalLp.toString())).toNumber()):0


  const poolId = pool && pool.pid

  const [WinValue, setWinValue] = useState<String>('')
  const [WinLabel, setWinLabel] = useState('')
  const [WinOpt, setWinOpt] = useState('')
  const [winExtInfo, setWinExtInfo] = useState<string[]>([])

  const { chainId, account } = useActiveWeb3React()

  function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
    return b.addedTime - a.addedTime
  }
  // 是否已授权 ，授权操作函数

  const ParkAdderess = isExt ? ZOO_PARK_EXT_ADDRESS[chainId ?? DefaultChainId] : ZOO_PARK_ADDRESS[chainId ?? DefaultChainId]

  const [approval, approveCallback] = useApproveCallback(pool ? new TokenAmount(new Token(chainId ?? DefaultChainId, pool.lpAddress, 18,"YuzuSwap LP Token"), pool.myLpBalance) : undefined, ParkAdderess)
  // 质押和解除质押函数 ， 提取奖励操作使用解除质押来实现（amount参数为0)
  const { deposit, withdraw } = useZooParkCallback(isExt)

  const lastAp = useRef(approval);

  useEffect(
    ()=>{
      if(lastAp.current == ApprovalState.PENDING && approval == ApprovalState.APPROVED){
        setStatus({
          type: 'success',
          tips: t('operateSuccess')
        });
      }
      if(approval == ApprovalState.PENDING || approval == ApprovalState.APPROVED){
        lastAp.current = approval
      }    
    }
    ,
    [approval]
  )
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])
  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const hasPendingTransactions = !!pending.length

  const extWithDrawInfo = useMemo(
    ()=>{
      let re :string[] = []
      if(!tokenRewards){
        return re
      }
      for(let i = 0; i < tokenRewards.length; i++){
        re.push(fixFloatFloor(tokenAmountForshow(tokenRewards[i].MyPendingAmount, tokenRewards[i].token.decimals),8) + " " + tokenRewards[i].token.symbol)
      }
      return re
    }

    ,[tokenRewards]
  )


  const onHarvest = async () => {
    try {
      let amount = 0
      setWinValue(myReward.toString());
      setWinLabel(winLabals.coin);
      setWinOpt(winOpts.withdraw);
      setWinExtInfo(extWithDrawInfo);
      await withdraw(poolId, amount.toString(10), () => {
        let data = {
          type: 'success',
          tips: t('operateSuccess')
        };
        // setStatus(data);
      })
    } catch (err) {
      console.log("withdraw err is ", err)
      let data = {
        type: 'failed',
        tips: t('operateFailed')
      };
      setStatus(data);
    }
  }
  const onWithdraw = async () => {
    try {
      setWinValue(myStaked.toString(10));
      setWinLabel(winLabals.lp)
      setWinOpt(winOpts.withdraw);
      setWinExtInfo([])
      await withdraw(poolId, pool.myCurrentLp.toString(10), () => {
        let data = {
          type: 'success',
          tips: t('operateSuccess')
        };
        // setStatus(data);
      })
    } catch (err) {
      console.log("withdraw err is ", err)
      let data = {
        type: 'failed',
        tips: t('operateFailed')
      };
      setStatus(data);
    }
  }
  const onDeposit = async () => {
    try {
      const amount = pledgeValue.indexOf(".") == -1 ? JSBI.multiply(JSBI.BigInt(pledgeValue), JSBI.BigInt(1e18)).toString(10) : new Decimal(parseFloat(pledgeValue) * 1e18).toFixed(0)
      setWinValue(pledgeValue);
      setWinLabel(winLabals.lp)
      setWinOpt(winOpts.deposite);
      setWinExtInfo([])
      await deposit(poolId, amount, () => {
        // let data = {
        //   type: 'success',
        //   tips: t('operateSuccess')
        // };
        // setStatus(data);
      })
      setShowConfirmation(false)
    } catch (err) {
      setHarvest(false);
      console.log("deposit err is ", err)
      let data = {
        type: 'failed',
        tips: t('operateFailed')
      };
      setStatus(data);
    }
  }


  

  async function addCurrency(token : Token) {
    const eRequest = window.ethereum?.request
    if(eRequest && token){
      await eRequest({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
        },
      },
      })
      .then((success: any) => {
        if (success) {
          console.log('successfully added to wallet!')
        } else {
          throw new Error('Something went wrong.')
        }
      })
      .catch(console.error)

    }
  }

  let btn = (
    <div className="s-boardroom-select s-boardroom-stake-button" onClick={
      async () => {
        if (approval != ApprovalState.APPROVED) {
          await approveCallback(() => {
            setWinValue("");
            setWinLabel("")
            setWinOpt("");
            setWinExtInfo([])
          })
        }
      }
    }>{t('authorization')}</div>);

  if (approval == ApprovalState.APPROVED) {
    btn = (<div className="s-boardroom-stake-inline">
      <div className="s-boardroom-select s-boardroom-stake-button" onClick={async () => { setShowConfirmation(true); }}>{t('pledge')} LP <QuestionHelper text={t('pledgeTip')} /></div>
      <div className="s-boardroom-select s-boardroom-stake-button" onClick={onWithdraw}  >{t('cancelPledge')}<QuestionHelper text={t('cancelPledgeTip')} /></div></div>
    );
  }
  console.log("approve is ", approval)

  function onDismiss(){
    // let data = {
    //   type: 'success',
    //   tips: t('operateSuccess')
    // };
    // setStatus(data);
  }
  return (
    <>
      <Sloganer />
      <div className="s-boardroom-selected">
        <div className="s-boardroom-account">
          <div className="s-boardroom-information">
            {
              isExt? <p style={{margin: '10px auto'}}>{t('myReward')}
              <QuestionHelper text={
                t('doublegetRewardHint')
              } /></p> 
              : <p>{t('myReward')}</p>
            }
            <p className="s-boardroom-balance">
              <img src={YuzuSwapLogo}/>
              {fixFloatFloor(myReward, 8)}
            </p>
            {
              isExt && tokenRewards?
              tokenRewards.map(
                (value: TokenReward)=>{
                  return (
                    <p className="s-boardroom-balance">
                      <CurrencyLogo style={{display: 'inline-block', verticalAlign: 'middle'}} currency={value.token} />
                      {fixFloatFloor(tokenAmountForshow(value.MyPendingAmount, value.token.decimals), 8)}
                      <AddQuestionNoCHelper text={'Add to Wallet'} onClick={()=>addCurrency(value.token)}/>
                    </p>
                  )
                }
              )
              : null
            }
          </div>
          <div className="s-boardroom-select s-boardroom-tokens" onClick={async () => { await onHarvest() }}>{t('withdrawal')}</div>
          {
              isExt && wrappedTokenRewards?
              wrappedTokenRewards.map(
                (value: TokenReward, i : number)=>{
                  return (
                    <div className="s-boardroom-unwrap">
                      <span>{value.token.symbol}</span>
                      <span>{fixFloatFloor(tokenAmountForshow(WrapperBalance[i], value.token.decimals),6)}</span>
                      <div className="s-boardroom-unwrap-button " onClick={()=>{onUnwrap(i)}}>Unwrap <QuestionHelper text={t('unwrapExtRewardHint')} /></div>
                    </div>
                  )
                }
              )
              : null
            }
        </div>
        <div className="s-boardroom-stake">
          <div className="s-boardroom-information-no-drak">
            <div>{pool? (pool.token0.symbol + '/' + pool.token1.symbol) : ''} LP Staked</div>
            <div className="s-boardroom-balance">{myStaked} </div>
          </div>
          <div className="s-boardroom-information-no-drak">
            <div style={{fontSize: "12px"}}>Corresponding num of tokens<br/>
            {pool? pool.token0.symbol + ' ' +  fixFloatFloor(tokenAmountForshow(pool.token0Balance, pool.token0.decimals)* myStakedPoolShareRatio , 4) :''}<br/>
            {pool? pool.token1.symbol + ' ' +  fixFloatFloor(tokenAmountForshow(pool.token1Balance, pool.token1.decimals)* myStakedPoolShareRatio , 4) :''}</div>
          </div>
          {btn}
        </div>
      </div>
      <div className="s-boardroom-lp-wrapper">
        {pool && (<BoardroomLP zoopark={pool} />)}
      </div>

      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxHeight={100}>
        <div className="s-modal-content">
          <ModalContentWrapper className="s-ModalContentWrapper">
            <RowBetween style={{ padding: '0.8rem' }}>
              <div style={{ textAlign: 'center', display: 'inline-block', width: '80%', paddingLeft: '2rem' }}>
                <Text fontWeight={500} fontSize={20}>
                {t('pledge')}
              </Text>
              </div>
              <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
            </RowBetween>
          </ModalContentWrapper>
          <div className="s-modal-main">
            <div className="s-boardroom-max">
              <h2>{pool? (pool.token0.symbol + '/' + pool.token1.symbol) : ''} LP</h2>
              <div className="s-modal-number">
                <input type="number" value={pledgeValue} onChange={(e) => { setPledgeValue(e.target.value) }} />
                <em onClick={() => setPledgeValue(myLpBalance.toString(10))}>MAX</em>
              </div>
            </div>
            <p className="s-boardroom-available">{myLpBalance.toString(10)} available</p>
          </div>
          <div className="s-modal-btns">
            <ButtonGray padding="8px 16px" mt="0.5rem" onClick={() => setShowConfirmation(false)}>
            {t('cancel')}
          </ButtonGray>
            <ButtonPrimary padding="8px 16px" mt="0.5rem" onClick={onDeposit}>
            {t('confirm')}
          </ButtonPrimary>
          </div>
        </div>
      </Modal>

      <Modal isOpen={hasPendingTransactions} onDismiss={onDismiss} maxHeight={100}>
        <div className="s-modal-content">
          <div className="s-modal-loading">
            <div className="s-modal-loading-img">
              <LoadingRings />
            </div>
            <h2>{t('loading')}</h2>
          </div>
          <p className="s-boardroom-available">{WinOpt} {WinValue} {WinLabel} 
            {
              winExtInfo.map((value)=>{
                return<p> {value} </p>
              }
              )
            }
          </p>
        </div>
      </Modal>

      <Modal isOpen={status.type != 'init'} onDismiss={() => setStatus({ type: 'init', tips: '' })} maxHeight={100}>
        <div className="s-modal-content">
          <div className={status.type != 'failed' ? 's-modal-loading s-modal-success' : 's-modal-loading s-modal-fail'}>
            <h2>{status.tips}</h2>
          </div>
        </div>
      </Modal>
    </>
  )
}

