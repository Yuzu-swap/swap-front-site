import React, { useCallback, useContext,useRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { AutoRow, RowBetween } from '../Row'
import Loader from '../Loader'
import { darken } from 'polished'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import ArrowDownImg from '../../assets/newUI/arrowDown.png'
import { Input as NumericalInput } from '../NumericalInput'
import { ButtonLRTab, ButtonXyuzuPercent, ButtonError, ButtonLight, ButtonPrimary, ButtonConfirmed  } from '../Button'
import { TokenAddressMap, useDefaultTokenList, useUnsupportedTokenList } from '../../state/lists/hooks'
import { useAllTokens, useToken, useIsUserAddedToken, useFoundOnInactiveList } from '../../hooks/Tokens'
import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, StakePool, AttenuationReward, ROUTER_ADDRESS, ZOO_ZAP_ADDRESS, Pair, Currency, WETH } from '@liuxingfeiyu/zoo-sdk'
import Decimal from 'decimal.js'
import { useApproveCallback,ApprovalState } from 'hooks/useApproveCallback'
import { DefaultChainId } from '../../constants/index'
import { useActiveWeb3React } from '../../hooks'
import Modal from '../Modal'
import LockImg from '../../assets/newUI/lock.png'
import CloseImg from '../../assets/newUI/xclose.png'
import {useXYuzuConfig} from '../../data/XYuzu'
import { useCurrencyBalance ,useCurrencyBalances } from '../../state/wallet/hooks'
import { XYUZU_LIST, blockNumPerS }  from '../../constants'
import LoadingRings from 'components/Loader/rings'
import { useTranslation } from 'react-i18next'
import fixFloat, {fixFloatFloor} from 'utils/fixFloat'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import { useXYuzuStakeCallback } from '../../zooswap-hooks/useXYuzuCallback'
import QuestionHelper, {AddQuestionHelper, AddQuestionNoCHelper} from 'components/QuestionHelper'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'

import { CloseIcon, CustomLightSpinner } from '../../theme/components'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import { clearAllTransactions } from '../../state/transactions/actions'

type Props = {
    show : boolean;
};
export const Wrapper : React.FC<Props> = ({show , children})=>(
    
    show?
    <div className="s-xyuzu-tab-wrapper" style={{width : "fit-content", marginRight : '20px'}}>
        {children}
    </div>
    :
    <div style={{width : "fit-content", padding: "1px", marginRight : '20px'}}>
        {children}
    </div>
    
)


export const ZapTitle = styled.div`
    text-align: left;
    font-size: 20px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
    line-height: 24px;
`

export const ModalText1 = styled.span`
    font-size: 18px;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 21px;
`

export function XStake(){
    const StyledBalanceMax = styled.button`
        height: 28px;
        padding-right: 8px;
        padding-left: 8px;
        background-color: ${({ theme }) => theme.primary5};
        border: 1px solid ${({ theme }) => theme.primary5};
        font-size: 0.8rem;

        width: 44px;
        height: 24px;
        background:  ${({ theme }) => theme.bg7};
        border-radius: 4px;
        border: 1px solid #ED4962;

        font-weight: 500;
        cursor: pointer;
        margin-right: 0.5rem;
        color: ${({ theme }) => theme.primaryText1};
        :hover {
            border: 1px solid ${({ theme }) => theme.primary1};
        }
        :focus {
            border: 1px solid ${({ theme }) => theme.primary1};
            outline: none;
        }

        ${({ theme }) => theme.mediaWidth.upToExtraSmall`
            margin-right: 0.5rem;
        `};
    `
    
    const SmallText = styled.div`
        font-size: 14px;
        margin-bottom: 20px;
    `

    const BalanceValue = styled.span`
        color: rgba(255, 255, 255, 1);
    `

    const Arrowline = styled.div`
        font-weight: 500;
        color: #fffff
        margin: 15px auto;
    `
    const Line = styled.div`
        display: flex;
        justify-content: space-between;
    `

    const Text1 = styled.div`
        font-size: 14px;
        font-weight: 500;
        color: #666666;
        line-height: 20px;
    `

    const Text2 = styled.div`
        font-size: 24px;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 28px;
        text-overflow: ellipsis;
        flex: 1 1 auto;
        text-align: left;
        display: inline-block;
        width: 0;
        overflow: hidden;
    `
    const Aligner = styled.span`
        display: flex;
        align-items: center;
        justify-content: space-between;
    `

    const CurrencySelect = styled.button<{ selected: boolean }>`
        align-items: center;
        height: 2.2rem;
        font-size: 20px;
        font-weight: 500;
        background: ${({ selected, theme }) => (selected ? theme.bg7 : 'linear-gradient(177deg, #ED4962 0%, #F98F81 100%)')};
        color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
        border-radius: ${({ theme }) => theme.borderRadius};
        box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
        outline: none;
        cursor: pointer;
        user-select: none;
        border: none;
        padding: 0 0.5rem;

        :focus,
        :hover {
            background-color: ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.primary1))};
        }
    `

    const StyledTokenName = styled.span<{ active?: boolean }>`
        ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
        font-size:  ${({ active }) => (active ? '20px' : '16px')};

    `

    const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
        margin: 0 0.25rem 0 0.5rem;
        height: 35%;

        path {
            stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
            stroke-width: 1.5px;
        }
    `

    const CloseLoge = styled.img`
        :hover{
            opacity : 0.7;
        }
        cursor : pointer;
        height : 16px;
    
    `

    const InModalTrans = styled.div`
        margin-left: 10px
        width: 100%;
        display : flex;
        flex-direction: column;
        justify-content: space-between;
    `



    const ModalTextNum = styled.span`
        font-size: 20px;
        font-weight: bold;
        color: #FF526C;
        line-height: 24px;
    `

    const { t } = useTranslation();

    const [input, setInput] = useState<string>('0.0')
    const [output, setOutput] = useState<string>('0.0')
    const { account, chainId } = useActiveWeb3React()
    const toggleWalletModal = useWalletModalToggle()

    const tokenlist = useAllTokens()

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

    const inputToken  = useMemo(
        ()=>{
            const bigintAmount = new Decimal(parseFloat(input=='' ? '0' : input) * Math.pow( 10, yuzuToken?.decimals ||18 )).toFixed(0)
            return yuzuToken ? new TokenAmount(yuzuToken, bigintAmount): null
        }
        ,[yuzuToken, input]
    )

    const [approval, approveCallback] = useApproveCallback(inputToken||undefined, XYUZU_LIST[chainId ?? DefaultChainId]?.address)
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

    function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
        return b.addedTime - a.addedTime
      }
    const allTransactions = useAllTransactions()
    const sortedRecentTransactions = useMemo(() => {
      const txs = Object.values(allTransactions)
      return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
    }, [allTransactions])
    const pending = sortedRecentTransactions.filter(tx => !tx.receipt && tx.summary && tx.summary.includes('xYUZU Stake')).map(tx => tx.hash)
    const hasPendingTransactions = !!pending.length

    const dispatch = useDispatch<AppDispatch>()
    const clearAllTransactionsCallback = useCallback(() => {
      if (chainId) dispatch(clearAllTransactions({ chainId }))
    }, [dispatch, chainId])


    // mark when a user has submitted an approval, reset onTokenSelection for input field
    useEffect(() => {
      if (approval === ApprovalState.PENDING) {
        setApprovalSubmitted(true)
      }
    }, [approval, approvalSubmitted])

    const yuzuBalances = useCurrencyBalances(account ?? undefined, 
        [yuzuToken, xyuzuToken]
    )

    const onMax = useCallback(
        ()=>{
            setInput(
                fixFloatFloor(parseFloat(yuzuBalances[0]?.toExact() ?? '0.0'), 6) as string    
                )
        }
        ,
        [yuzuBalances]
    )

    const inputCheck = useMemo(
        ()=>{
            return parseFloat(input) > parseFloat(yuzuBalances[0]?.toExact() || '0') ? false : true
        },[input]
    )

    const [daynum , SetDaynum] = useState<number>(0);


    const [reviewModal, SetReviewModal] = useState<boolean>(false);


    const xyuzuConfs = useXYuzuConfig()

    const stakeDays = useMemo(
        ()=>{
            return xyuzuConfs?.map(
                (conf)=>{
                    let re = 0;
                    re = (conf.blockCount as number)/( 60 * 60 * 24 / blockNumPerS )
                    return re.toFixed(0)
                }
            )
        },
        [xyuzuConfs]
    )

    useEffect(()=>{
        setOutput(fixFloat(Number(input) * ((xyuzuConfs &&  xyuzuConfs[daynum].ratio) ?? 0), 6) as string)
    },
    [input, daynum])

    const XyuzuStake = useXYuzuStakeCallback(xyuzuToken?.address ?? '', inputToken?.raw ?? JSBI.BigInt(0) , (xyuzuConfs && xyuzuConfs[daynum].id) ?? 0)

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

    return (
        <div style={{marginTop: "40px", width:"100%"}}>
             <div className="s-zap-exchange" style={{width:"100%", padding : '20px'}}>
                <Line>
                    <ZapTitle>Lock YUZU</ZapTitle>
                    <ZapTitle>Balance:<BalanceValue> {yuzuBalances[0]?.toSignificant(6)}</BalanceValue></ZapTitle>
                </Line>
                <div className="s-zap-input" style={{marginTop:"20px"}}>
                    <div className="s-zap-line">
                        <>
                           { <NumericalInput
                                className="zap-input"
                                value={input}
                                onUserInput={val => {
                                    setInput(val)
                                }
                                }
                            />}
                            {(
                                <StyledBalanceMax style={{marginTop : 'auto', marginBottom : 'auto'}} onClick={onMax}>Max</StyledBalanceMax>
                            )}
                        </>
                    </div>
                </div>
                <img src={ArrowDownImg} style={{marginTop:"10px", marginBottom:"10px"}} height={'24px'}/>
                <Line>
                    <ZapTitle>To xYUZU <AddQuestionNoCHelper text={'Add to Wallet'} onClick={()=>xyuzuToken && addCurrency(xyuzuToken)}/></ZapTitle>
                    <ZapTitle>Balance:<BalanceValue> {yuzuBalances[1]?.toSignificant(6)}</BalanceValue></ZapTitle>
                </Line>
                <div className="s-zap-output"  style={{marginTop:"20px", marginBottom:"10px"}} >
                    <Line>
                        <Text2>{output}</Text2>
                    </Line>
                </div>
                <Line>
                    <ZapTitle>Set Lock Time:<QuestionHelper text="The countdown is based on the assumption that block time is 6s."/></ZapTitle>
                    <ZapTitle>1 YUZU for {(xyuzuConfs &&  xyuzuConfs[daynum].ratio) ?? 0} xYUZU</ZapTitle>
                </Line>
                <div style={{display: 'flex', marginTop: '20px', marginBottom: '20px'}}>
                    <Wrapper show={daynum == 0}>
                        <ButtonXyuzuPercent disabled={daynum == 0} onClick={()=>{SetDaynum(0)}}>{stakeDays && stakeDays[0]} D</ButtonXyuzuPercent>
                    </Wrapper>
                    <Wrapper show={daynum == 1}>
                        <ButtonXyuzuPercent disabled={daynum == 1} onClick={()=>{SetDaynum(1)}}>{stakeDays && stakeDays[1]} D</ButtonXyuzuPercent>
                    </Wrapper>
                    <Wrapper show={daynum == 2}>
                        <ButtonXyuzuPercent disabled={daynum == 2} onClick={()=>{SetDaynum(2)}}>{stakeDays && stakeDays[2]} D</ButtonXyuzuPercent>
                    </Wrapper>
                    <Wrapper show={daynum == 3}>
                        <ButtonXyuzuPercent disabled={daynum == 3} onClick={()=>{SetDaynum(3)}}>{stakeDays && stakeDays[3]} D</ButtonXyuzuPercent>
                    </Wrapper>
                </div>
                {!account ?<ButtonLight onClick={toggleWalletModal}>{t('connectwallet')}</ButtonLight>
                : 
                    approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING?
                    <ButtonConfirmed
                        onClick={approveCallback}
                        disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                        altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                        >
                        {approval === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                            Approving <Loader stroke="white" />
                            </AutoRow>
                        ) : (
                            'Approve ' + 'YUZU'
                        )}
                    </ButtonConfirmed>
                    :
                    <ButtonPrimary disabled={!inputCheck} onClick={
                        ()=>{
                            SetReviewModal(true)
                    }}>
                        LOCK
                    </ButtonPrimary>
                                 
                }
                <Modal isOpen={reviewModal} onDismiss={() =>{}} maxHeight={200} minHeight={10}>
                    <div style={{display:'flex', flexDirection:'column', width:"100%", padding:"20px"}}>
                        <Line>
                            <ZapTitle>Review</ZapTitle>
                            <CloseLoge src={CloseImg} onClick={()=>SetReviewModal(false)}/>
                        </Line>
                        <div className="s-xyuzu-tab-wrapper" style={{marginTop:"10px"}}>
                            <div className="s-modal-contentin" style={{display: 'flex', padding : '20px'}}>
                                <img src={LockImg} width={'73px'}/>
                                <InModalTrans>
                                    <Line><ModalTextNum> {input} </ModalTextNum><ModalText1>YUZU</ModalText1></Line>
                                        <img src={ArrowDownImg} height={'24px'} width={'24px'}/>
                                    <Line><ModalTextNum> {output} </ModalTextNum> <ModalText1>xYUZU</ModalText1></Line>
                                </InModalTrans>
                                
                            </div>
                        </div>
                        <ZapTitle style={{fontSize : '16px', marginTop:"10px"}}>Lock Time: {stakeDays && stakeDays[daynum]} D</ZapTitle>
                        <ZapTitle style={{fontSize : '16px', marginTop:"10px"}}>Warning: You CANNOT unstake xYUZU before the countdown to zero.</ZapTitle>
                        <ButtonPrimary disabled={false} onClick={()=>{
                            XyuzuStake()
                            SetReviewModal(false)
                        }}
                        style={{marginTop:"20px"}}
                        >
                            CONFIRM Lock
                        </ButtonPrimary>
                    </div>
                </Modal>

                <Modal isOpen={hasPendingTransactions} onDismiss={()=>{}} maxHeight={100}>
                    <div className="s-modal-content">
                    <RowBetween>
                        <div />
                        <CloseIcon onClick={clearAllTransactionsCallback} color ='#FFFFFF'/>
                    </RowBetween>
                        <div className="s-modal-loading">
                            <div className="s-modal-loading-img">
                                <LoadingRings/>
                            </div>
                            <ModalText1>Waiting for Confirmation</ModalText1>
                            <ZapTitle style={{display: 'inline-block', marginTop:'20px', textAlign: 'center'}}>Lock {input} YUZU for {output} xYUZU for {stakeDays && stakeDays[daynum]} days</ZapTitle>
                            <ZapTitle style={{display: 'inline-block', marginTop:'10px', marginBottom: '10px',fontSize:'16px', opacity:'0.4'}}>
                                Confirm this transaction in your wallet
                            </ZapTitle>
                        </div>
                    </div>
                </Modal>
                
            </div>
        </div>
    )
}