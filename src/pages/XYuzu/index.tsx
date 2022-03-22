import React, { useCallback, useContext,useRef, useEffect, useMemo, useState } from 'react'
import { ButtonLRTab, ButtonUnderLine } from 'components/Button'
import { XStake } from 'components/XYuzu/XStake'
import { XUnStake } from 'components/XYuzu/XUnStake'
import { ReactChild, ReactNode } from 'hoist-non-react-statics/node_modules/@types/react'
import { useCurrencyBalance ,useCurrencyBalances } from '../../state/wallet/hooks'
import { XYUZU_LIST, blockNumPerS }  from '../../constants'
import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, StakePool, AttenuationReward, ROUTER_ADDRESS, ZOO_ZAP_ADDRESS, Pair, Currency, WETH } from '@liuxingfeiyu/zoo-sdk'
import { DefaultChainId } from '../../constants/index'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens, useToken, useIsUserAddedToken, useFoundOnInactiveList } from '../../hooks/Tokens'
import fixFloat,{getTimeStr, transToThousandth} from 'utils/fixFloat'

type Props = {
    show : boolean;
};

const Wrapper : React.FC<Props> = ({show , children})=>(
    
    show?
    <div className="s-xyuzu-tab-wrapper" style={{width:"100%"}}>
        {children}
    </div>
    :
    <div style={{width:"100%"}}>
        {children}
    </div>
    
)

export function XYuzu(){
    const { account, chainId } = useActiveWeb3React()

    const tokenlist = useAllTokens()
    const [left , SetLeft] = useState<boolean>(true)
    const [yuzuToken, xyuzuToken] : (Token | undefined) [] = useMemo(
        ()=>{
            let re = undefined
            let re1 = XYUZU_LIST[chainId ?? DefaultChainId]
            for(let item of Object.values(tokenlist)){
                if(item.symbol == 'YUZU'){
                    re = item
                }
            }
            return [re, re1]
        }
        ,
        [tokenlist]
    )

    const yuzuBalances = useCurrencyBalances(xyuzuToken?.address ?? undefined, 
        [yuzuToken]
    )


    return(
        <div className="s-xyuzu-body">
            <div className="s-xyuzu-header">
                <div>
                    <span className="s-xyuzu-header-banner" >Maximize yield by staking </span>
                    <span className="s-banner-title">YUZU for xYUZU</span>
                </div>
                <div className="s-xyuzu-header-text1" style={{marginTop:"20px"}}>
                xyuzu can be used to participate in liquidity mining as an lp token to obtain high retums
                </div>
                <div style={{marginTop:"20px"}}>
                    <span className="s-xyuzu-header-text2">
                        YUZU TVL:
                    </span>
                    <span className="s-xyuzu-header-number">
                        ${transToThousandth(yuzuBalances[0]?.toSignificant(6) ?? '0')}
                    </span>
                    <span className="s-xyuzu-header-text2" style={{marginLeft:"80px"}}>
                        xYUZU Circulation:
                    </span>
                    <span className="s-xyuzu-header-number">
                        $123
                    </span>
                </div>
            </div>
            <div className="s-xyuzu-tab" style={{marginTop:"40px"}}>
                <Wrapper show={left} >
                    <ButtonLRTab  disabled={left} onClick={()=>SetLeft(true)}>STAKE YUZU FOR XYUZU</ButtonLRTab>
                </Wrapper>
                <Wrapper show={!left}>
                    <ButtonLRTab  disabled={!left} onClick={()=>SetLeft(false)}>PARTNERS</ButtonLRTab>
                </Wrapper>
            </div>
            {
                left ?
                <XStake/> : <XUnStake/>
            }
            <div></div>
        </div>
    )
}