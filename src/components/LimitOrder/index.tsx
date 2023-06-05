import { Currency, CurrencyAmount, Fraction, JSBI, Pair, Percent, Token, Trade } from '@liuxingfeiyu/zoo-sdk'
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import useTheme from '../../hooks/useTheme'
import LORefreshPng from '../../assets/newUI/limitOrderRefresh.png'
import { useExpertModeManager, useUserSlippageTolerance, useUserSingleHopOnly } from '../../state/user/hooks'
import { BIPS_BASE, DefaultChainId, ETHFakeAddress, INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import { SingleOrder, useLimitOrdersData } from 'data/LimitOrder'
import { useToken } from 'hooks/Tokens'
import { tryParseAmount } from 'state/swap/hooks'
import WebLinkPng from '../../assets/images/web-link.png'
import CancelPng from '../../assets/newUI/limitOrderCancel.png'
import { CHAIN_CONFIG } from 'components/Header'
import { useLimitOrderCancelTaskCallback } from 'zooswap-hooks/useLimitOrderCalback'

const OLUnit = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const OLUnitUp = styled.div`
    background: #1F2125;
    color: #6C7284;
    font-size: 28px
    padding: 10px 20px 10px 20px;
`

const OLUnitDown = styled.div`
    background: RGBA(32, 36, 42, 0.4);
    color: #FFFFFF;
    font-size: 28px;
    padding: 10px 20px 10px 20px;
    height: 100px;
    display: table; 
`

export function ShowSingleOrder({data}:{data: SingleOrder} ){
    const {account, chainId} = useActiveWeb3React()
    const tokenList : (Currency | undefined) [] = [undefined, undefined]
    tokenList[0] =  useToken(data.inToken) as any as Currency 
    tokenList[1] =  useToken(data.outToken) as any as Currency 
    const [ created, symbol, inputStr, price, total, hash] : string[] = useMemo(
        ()=>{
            let date = new Date((data.deadline - 60 * 60 * 24 * 90) * 1000)
            const created = `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`
            let symbol: string = ''
            let inputStr: string = ''
            let price: string = ''
            let total: string = ''
            const hash = data.status == 0 ? data.createHash : data.status == 1? data.execHash : data.cancelHash
            let inToken:Currency| undefined , outToken:Currency| undefined;
            if(data.inToken == ETHFakeAddress){
                inToken = Currency.getNativeCurrency(chainId ?? DefaultChainId)
            }
            else{
                inToken = tokenList[0]
            }
            if(data.outToken == ETHFakeAddress){
                outToken = Currency.getNativeCurrency(chainId ?? DefaultChainId)
            }
            else{
                outToken = tokenList[1]
            }
            if( inToken && outToken ){
                symbol = inToken.getSymbol() + "/" + outToken.getSymbol()
                let inTokenAmount =  new CurrencyAmount(inToken, data.inNum)
                let outTokenAmount = new CurrencyAmount(outToken, data.outNum)
                if(inTokenAmount && outTokenAmount){
                    inputStr = inTokenAmount.toSignificant(6) + ' ' + inToken.getSymbol()
                    total = outTokenAmount.toSignificant(6) + ' ' + outToken.getSymbol()
                    price = outTokenAmount.divide(inTokenAmount).toSignificant(6) + ' ' + outToken.getSymbol()
                }
            }
            return [created, symbol, inputStr, price, total, hash]

        },
        [data, tokenList]
    )

    const cancelTask = useLimitOrderCancelTaskCallback(data.orderId)


    return(
        <>
        <div className='s-limitorder-card'>
            <OLUnit>
                <OLUnitUp>
                    Created
                </OLUnitUp>
                <OLUnitDown>
                    <div className='s-limitorder-text'> {created}</div>
                </OLUnitDown>
            </OLUnit>
            <OLUnit>
                <OLUnitUp>
                    Symbol
                </OLUnitUp>
                <OLUnitDown>
                    <div className='s-limitorder-text'>{symbol}</div>
                </OLUnitDown>
            </OLUnit>
            <OLUnit>
                <OLUnitUp>
                    Input
                </OLUnitUp>
                <OLUnitDown>
                    <div className='s-limitorder-text'>{inputStr}</div>
                </OLUnitDown>
            </OLUnit>
            <OLUnit>
                <OLUnitUp>
                    Price
                </OLUnitUp>
                <OLUnitDown>
                    <div className='s-limitorder-text'>{price}</div>
                </OLUnitDown>
            </OLUnit>
            <OLUnit>
                <OLUnitUp>
                    Total
                </OLUnitUp>
                <OLUnitDown>
                    <div className='s-limitorder-text'>{total}</div>
                </OLUnitDown>
            </OLUnit>
            <OLUnit>
                <OLUnitUp>
                    &nbsp;
                </OLUnitUp>
                <OLUnitDown>
                    <div className='s-limitorder-red-text'>View on explorer</div>
                    <div className='s-limitorder-red-other'>
                        <img className='s-limitorder-red-img' 
                        src={WebLinkPng}
                        onClick={()=>{window.open((CHAIN_CONFIG as any)[chainId??DefaultChainId].blockExplorerUrl +'tx/' + hash 
                        )}}
                        />
                    </div>
                </OLUnitDown>
            </OLUnit>
            <OLUnit>
                <OLUnitUp>
                    &nbsp;
                </OLUnitUp>
                <OLUnitDown>
                    {
                        data.status == 0 ?
                        (
                            <div className='s-limitorder-red-text'>
                                <div className='s-limitorder-red-cancel-bg'
                                    onClick={()=>cancelTask()}
                                >
                                    <img className='s-limitorder-red-cancel-img' src={CancelPng} />
                                </div>
                            </div>
                        ):
                        data.status == 1 ?
                        (
                            <div className='s-limitorder-text'> Success </div>
                        )
                        :
                        (
                            <div className='s-limitorder-text'> Canceled </div>
                        )
                    }
                    
                </OLUnitDown>
            </OLUnit>
        </div>
        </>
    )
}

export function  ShowLimitOrders( ){
    const datas = useLimitOrdersData()
    return(
        <>
            <div className='s-limitorder-title'> Open Orders </div>
            {
                datas?.map((data)=>{
                    return(
                        <ShowSingleOrder
                            data={data}
                        />
                    )
                })
            }
        </>
    )
}