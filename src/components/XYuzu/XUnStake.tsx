import React, { useCallback, useContext,useRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import CardLock from '../../assets/newUI/cardLock.png'
import CardUnLock from '../../assets/newUI/cardUnLock.png'
import CardClock from '../../assets/newUI/cardClock.png'
import CardOk from '../../assets/newUI/cardOk.png'
import { useXYuzuStakeCallback , useXYuzuCallback } from '../../zooswap-hooks/useXYuzuCallback'
import { useXYuzuOrders, XyuzuOrder } from '../../data/XYuzu'
import { useBlockNumber } from 'state/application/hooks'
import fixFloat, { getTimeStr,  transToThousandth, showAddress} from 'utils/fixFloat'
import { XYUZU_ADDRESS, blockNumPerS, DefaultChainId }  from '../../constants'
import { ButtonUnderLine, ButtonXyuzuPercent, ButtonXyuzuCard, ButtonLight, ButtonPrimary, ButtonConfirmed  } from '../Button'
import {CHAIN_CONFIG} from '../Header'
import { useActiveWeb3React } from '../../hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { useCurrencyBalance ,useCurrencyBalances } from '../../state/wallet/hooks'
import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, StakePool, AttenuationReward, ROUTER_ADDRESS, ZOO_ZAP_ADDRESS, Pair, Currency, WETH } from '@liuxingfeiyu/zoo-sdk'
import Modal from '../Modal'
import LoadingRings from 'components/Loader/rings'
import { ZapTitle, ModalText1 } from './XStake'


enum UnstakeInfo{
    UNSTAKEING,
    WITHDRAW,
    COMPLETED
}



const CardContent = styled.div`
    background: #2C3035;
    border-radius: inherit;
    align-items: center;
`

const CardHeader = styled.div`
    background: #222529;
    border-radius: 8px 8px 0 0;
    display: flex;
    justify-content: space-between;
    height: 44px;
`

const CardRC = styled.div`
    display: flex;
    padding: 20px 10px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
`

const CardWrapper = styled.div`
    margin: 20px 0;
    padding: 1px;
    background: linear-gradient(360deg, rgba(255, 255, 255, 0), rgba(255, 82, 108, 0.6));
    border-radius: 8px;
    overflow: hidden;
`

const Text1 = styled.span`
    color: rgba(255, 255, 255, 0.6);
    font-size: 20px;
    font-weight: 400;
    line-height: 24px;
`

const Text2 = styled.span`
    color: rgba(255, 255, 255, 1);
    font-size: 20px;
    font-weight: 400;
    line-height: 24px;
`
const TextNum = styled.span`
    color: #ED4962;
    font-size: 20px;
    font-weight: bold;
    line-height: 24px;
`

const Address = styled.a`
    font-size: 20px;
    font-weight: 400;
    color: #9DD0FF;
    line-height: 24px;
`

function TimeCount({endAt} : {endAt : number}){
    const TimeBLock = styled.div<{notZero : boolean}>`
    text-align: center;
    display: inline-block;
    background: #222529;
    border-radius: 4px;
    border: 1px solid #F8F8F8;
    font-size: 18px;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 21px;
    color: ${({notZero})=>(notZero ? '#FFFFFF' :  '#D0D0D0')};
    min-width: 20px;
    padding: 5px;
  `
    const now = Math.floor((new Date()).valueOf()/1000)
    const [timestamp,setTimeStamp] = useState(now)
    const [lastBlockAt,setLastBlockAt] = useState(now)
    const blockNumber = useBlockNumber()

    useEffect(()=>{
        const timer = setTimeout(()=>{
          setTimeStamp(Math.floor((new Date()).valueOf()/1000))
        },1000)
        return () =>{
          clearTimeout(timer)
        }
      },[timestamp])

    useEffect(()=> {
        setLastBlockAt(Math.floor((new Date()).valueOf()/1000) )
    },[blockNumber])

    const [day,hour,min,second] = useMemo(()=>{
        let nextBlockTime= 0
        let day,hour,min,second
        if (blockNumber&& blockNumber>0) {
        nextBlockTime = (endAt - (blockNumber?? 0))* 6
        nextBlockTime -= (timestamp-lastBlockAt)
        day = Math.floor(nextBlockTime/86400)
        hour = Math.floor((nextBlockTime-day*86400)/ 3600)
        min = Math.floor((nextBlockTime-day*86400-hour*3600)/60)
        second = Math.floor(nextBlockTime%60)
        }
        if(nextBlockTime < 0){
        return [0,0,0,0]
        }
        return [day,hour,min,second]
    },[lastBlockAt,timestamp])

    let notZero : boolean = true
    if(day == 0 && hour == 0 && min == 0 && second == 0){
    notZero = false
    }
    let dayStr = getTimeStr(day ?? 0)
    let hourStr = getTimeStr(hour ?? 0)
    let minStr = getTimeStr(min ?? 0)
    let secondStr = getTimeStr(second ??0)
    return (
    <>
    <TimeBLock notZero={notZero}>{dayStr}</TimeBLock>{' : '}
    <TimeBLock notZero={notZero}>{hourStr}</TimeBLock>{' : '}
    <TimeBLock notZero={notZero}>{minStr}</TimeBLock>{' : '}
    <TimeBLock notZero={notZero}>{secondStr}</TimeBLock>
    </>
    )
}

function TimeOut({beginAt} : {beginAt : number}){

    const now = Math.floor((new Date()).valueOf()/1000)
    const [timestamp,setTimeStamp] = useState(now)
    const [lastBlockAt,setLastBlockAt] = useState(now)
    const blockNumber = useBlockNumber()
    
    useEffect(()=>{
        const timer = setTimeout(()=>{
          setTimeStamp(Math.floor((new Date()).valueOf()/1000))
        },1000)
        return () =>{
          clearTimeout(timer)
        }
      },[timestamp])

    useEffect(()=> {
        setLastBlockAt(Math.floor((new Date()).valueOf()/1000) )
    },[blockNumber])

    const [day,hour,min,second] = useMemo(()=>{
        let nextBlockTime= 0
        let day,hour,min,second
        if (blockNumber&& blockNumber>0) {
        nextBlockTime = (blockNumber - beginAt)* 6
        nextBlockTime += (timestamp-lastBlockAt)
        day = Math.floor(nextBlockTime/86400)
        hour = Math.floor((nextBlockTime-day*86400)/ 3600)
        min = Math.floor((nextBlockTime-day*86400-hour*3600)/60)
        second = Math.floor(nextBlockTime%60)
        }
        if(nextBlockTime < 0){
        return [0,0,0,0]
        }
        return [day,hour,min,second]
    },[lastBlockAt,timestamp])

    let notZero : boolean = true
    if(day == 0 && hour == 0 && min == 0 && second == 0){
    notZero = false
    }
    let dayStr = getTimeStr(day ?? 0)
    let hourStr = getTimeStr(hour ?? 0)
    let minStr = getTimeStr(min ?? 0)
    let secondStr = getTimeStr(second ??0)
    return (
    <Text2>
        {' '}
        {day != 0 ? dayStr + 'd' : ''}
        {hour != 0 || day != 0 ? hourStr + 'h' : ''}
        {min != 0 || hour != 0 || day != 0 ? minStr + 'm' : ''}
        {second != 0  || min != 0 || hour != 0 || day != 0? secondStr + 's' : ''}
    </Text2>
    )
}


function UnStakeCard( {data} :{data : XyuzuOrder}){
    const blockNumber = useBlockNumber()
    const [unstake, _] = useXYuzuCallback(XYUZU_ADDRESS, data.id)
    return (
        <CardWrapper>
            <CardContent>
                 <CardHeader>
                     <img src={CardLock}/>
                     <div style={{margin:'auto 0'}}>
                         {
                             blockNumber && blockNumber > data.stakeEnd ? 
                             <>
                                <img src={CardClock} height={'20px'} style={{position: 'relative', top:'3px'}}/>
                                <TimeOut beginAt={data.stakeEnd}/>
                                <Text1> Timeout</Text1>
                            </>
                            :
                            null
                         }
                     </div>
                </CardHeader>   
                <CardRC>
                    <span>
                        <TextNum>
                            {transToThousandth(fixFloat(data.amount/ Math.pow(10, 18), 4))}
                        </TextNum>
                        <Text2>
                            YUZU
                        </Text2>
                        <Text1>
                            ({((data.stakeEnd - data.stakeAt)/( 60 * 60 * 24 / blockNumPerS)).toFixed(0)}D)
                        </Text1>
                    </span>
                    <span>
                        <Text1>
                            Stake Time Left:{' '}
                        </Text1>
                        <TimeCount endAt={data.stakeEnd}/>
                    </span>
                    <ButtonXyuzuCard disabled={ !(blockNumber && blockNumber > data.stakeEnd)} onClick={unstake}>
                        Unstake
                    </ButtonXyuzuCard>
                </CardRC>
            </CardContent>
        </CardWrapper>
    )
}

function WithDrawCard({data} :{data : XyuzuOrder}){
    const blockNumber = useBlockNumber()
    const [_, withdraw] = useXYuzuCallback(XYUZU_ADDRESS, data.id)
    return (
        <CardWrapper>
            <CardContent>
                 <CardHeader>
                     <img src={CardUnLock}/>
                </CardHeader> 
                <CardRC>
                    <span>
                        <TextNum>
                            {transToThousandth(fixFloat(data.amount/ Math.pow(10, 18), 4))}
                        </TextNum>
                        <Text2>
                            YUZU
                        </Text2>
                        <Text1>
                            ({((data.stakeEnd - data.stakeAt)/( 60 * 60 * 24 / blockNumPerS)).toFixed(0)}D)
                        </Text1>
                    </span>
                    <span>
                        {
                            blockNumber && blockNumber < data.unstakeEnd ? 
                            <>
                                <Text1>
                                    Withdraw Time Left:
                                </Text1>
                                <TimeCount endAt={data.unstakeEnd}/>
                            </>
                            :null
                        }               
                    </span>
                    <ButtonXyuzuCard disabled={ !(blockNumber && blockNumber > data.unstakeEnd)} onClick={withdraw}>
                        Withdraw
                    </ButtonXyuzuCard>
                </CardRC>  
            </CardContent>
        </CardWrapper>
    )
}

function CompleteCard({data} :{data : XyuzuOrder}){
    const { account, chainId } = useActiveWeb3React()

    return (
        <CardWrapper>
            <CardContent>
                 <CardHeader>
                     <img src={CardOk}/>
                </CardHeader>
                <CardRC>
                    <span>
                        <TextNum>
                            {transToThousandth(fixFloat(data.amount/ Math.pow(10, 18), 4))}
                        </TextNum>
                        <Text2>
                            YUZU
                        </Text2>
                        <Text1>
                            ({((data.stakeEnd - data.stakeAt)/( 60 * 60 * 24 / blockNumPerS)).toFixed(0)}D)
                        </Text1>
                    </span>
                    <span>
                        <Text1>
                            Consumed xYUZU:
                        </Text1>
                        <TextNum>
                            {transToThousandth(fixFloat(data.xamount/ Math.pow(10, 18), 4))}
                        </TextNum>       
                    </span>
                    <span>
                            <Text1>
                                Hash:
                            </Text1>
                            <Address 
                                href={(CHAIN_CONFIG as any)[chainId ?? DefaultChainId].blockExplorerUrl + '/tx/' + data.unstakeHash}
                                target='_blank'
                            >
                                {showAddress(data.unstakeHash)}
                            </Address>
                    </span>
                </CardRC>     
            </CardContent>
        </CardWrapper>
    )
}

function OrderList({status} : {status : UnstakeInfo}){
    const orders = useXYuzuOrders();
    const blockNumber = useBlockNumber()
    return (
        <>
        {orders?.map(
            (order)=>{
                if(status == UnstakeInfo.UNSTAKEING && order.unstakeAt == 0){
                    return <UnStakeCard data={order}/>
                }
                if(status == UnstakeInfo.WITHDRAW && order.unstakeAt != 0 && order.withdrawAt == 0){
                    return <WithDrawCard data={order}/>
                }
                if(status == UnstakeInfo.COMPLETED && order.withdrawAt != 0){
                    return <CompleteCard data={order}/>
                }
                return null
            }
        )}
        </>
    )
}

export function XUnStake(){
    const { account, chainId } = useActiveWeb3React()
    const [unstakeInfo, SetUnstakeInfo] = useState<UnstakeInfo>(UnstakeInfo.UNSTAKEING)
    const xyuzuToken = new Token(
        chainId ?? DefaultChainId,
        XYUZU_ADDRESS,
        18,
        "XYUZU",
        "XYUZU"
    )
    const xyuzuBalance = useCurrencyBalances(account ?? undefined, 
        [xyuzuToken]
    )

    function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
        return b.addedTime - a.addedTime
      }
    const allTransactions = useAllTransactions()
    const sortedRecentTransactions = useMemo(() => {
      const txs = Object.values(allTransactions)
      return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
    }, [allTransactions])
    const pending = sortedRecentTransactions.filter(tx => !tx.receipt && tx.summary && (tx.summary.includes('Xyuzu UnStake') || tx.summary.includes('Xyuzu WithDraw'))).map(tx => tx.hash)
    const hasPendingTransactions = !!pending.length

    return (
        <div>
            <div className="s-xyuzu-header-text1" style={{marginTop:"20px", fontSize:"20px"}}>
                Rules descirption:After the pledge time expirse, you can use xyuzu to redeem yuzu. There will be a certain delay time after redemption, depending on how long after the redemption time is exceeded
            </div>
            <div className="s-xyuzu-unstake-tab" style={{marginTop:"20px"}}>
                <div style={{display:"flex"}}>
                    <ButtonUnderLine active={unstakeInfo == UnstakeInfo.UNSTAKEING} onClick={()=>SetUnstakeInfo(UnstakeInfo.UNSTAKEING)}>Unstaking</ButtonUnderLine>
                    <ButtonUnderLine active={unstakeInfo == UnstakeInfo.WITHDRAW} onClick={()=>SetUnstakeInfo(UnstakeInfo.WITHDRAW)}>Withdraw</ButtonUnderLine>
                    <ButtonUnderLine active={unstakeInfo == UnstakeInfo.COMPLETED} onClick={()=>SetUnstakeInfo(UnstakeInfo.COMPLETED)}>Completed</ButtonUnderLine>
                </div>
                <div className="s-xyuzu-header-text1" style={{fontSize:"24px"}}>
                    xYUZU Balance:
                    <span className="s-xyuzu-header-number" style={{fontSize:"24px"}}>
                     {xyuzuBalance[0]?.toSignificant(6) ?? '0'}
                    </span>
                </div>
            </div>
            <OrderList status={unstakeInfo}/>
            <Modal isOpen={hasPendingTransactions} onDismiss={()=>{}} maxHeight={100}>
                    <div className="s-modal-content">
                        <div className="s-modal-loading">
                            <div className="s-modal-loading-img">
                                <LoadingRings/>
                            </div>
                            <ModalText1>Loading</ModalText1>
                        </div>
                    </div>
            </Modal>
        </div>
    )
}