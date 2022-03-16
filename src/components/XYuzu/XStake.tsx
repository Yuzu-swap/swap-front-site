import React, { useCallback, useContext,useRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { AutoRow, RowBetween } from '../Row'
import Loader from '../Loader'
import { darken } from 'polished'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import ArrowDownImg from '../../assets/newUI/arrowDown.png'
import { Input as NumericalInput } from '../NumericalInput'
import { ButtonLRTab, ButtonXyuzuPercent } from '../Button'


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
    const ZapTitle = styled.div`
        text-align: left;
        font-size: 20px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
        line-height: 24px;
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
    return (
        <div style={{marginTop: "40px", width:"100%"}}>
             <div className="s-zap-exchange" style={{width:"100%"}}>
                <Line>
                    <ZapTitle>Stake YUZU</ZapTitle>
                    <ZapTitle>Balance:<BalanceValue> 123</BalanceValue></ZapTitle>
                </Line>
                <div className="s-zap-input" style={{marginTop:"20px"}}>
                    <div className="s-zap-line">
                        <>
                           { <NumericalInput
                                className="zap-input"
                                value={123}
                                onUserInput={()=>{}
                                }
                            />}
                            {(
                                <StyledBalanceMax style={{marginTop : 'auto', marginBottom : 'auto'}} onClick={()=>{}}>Max</StyledBalanceMax>
                            )}
                        </>
                    </div>
                </div>
                <img src={ArrowDownImg} style={{marginTop:"10px", marginBottom:"10px"}} height={'24px'}/>
                <Line>
                    <ZapTitle>To xYUZU</ZapTitle>
                    <ZapTitle>Balance:<BalanceValue> 123</BalanceValue></ZapTitle>
                </Line>
                <div className="s-zap-output"  style={{marginTop:"20px", marginBottom:"10px"}} >
                    <Line>
                        <Text2>{123}</Text2>
                    </Line>
                </div>
                <Line>
                    <ZapTitle>Set Stake Time:</ZapTitle>
                    <ZapTitle>1 YUZU for 0.124 xYUZU</ZapTitle>
                </Line>
                <ButtonXyuzuPercent active={true}>123</ButtonXyuzuPercent>

                {/*<ButtonPrimary disabled={true}>
                    <TYPE.main mb="4px">{t('invalidassets')}</TYPE.main>
                                </ButtonPrimary>*/}
                
            </div>
        </div>
    )
}