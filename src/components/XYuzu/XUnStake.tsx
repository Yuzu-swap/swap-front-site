import React, { useCallback, useContext,useRef, useEffect, useMemo, useState } from 'react'
import { ButtonLRTab, ButtonUnderLine } from 'components/Button'

enum UnstakeInfo{
    UNSTAKEING,
    WITHDRAW,
    COMPLETED
}

export function XUnStake(){
    const [unstakeInfo, SetUnstakeInfo] = useState<UnstakeInfo>(UnstakeInfo.UNSTAKEING)
    const detail = (type : UnstakeInfo)=>{
        switch(type){
            case UnstakeInfo.UNSTAKEING:
                return (
                    <div>unstake</div>
                )
            case UnstakeInfo.WITHDRAW:
                return (
                    <div>withDraw</div>
                )
            case UnstakeInfo.COMPLETED:
                return (
                    <div>completed</div>
                )
        }
    }

    return (
        <div>
            <ButtonUnderLine active={unstakeInfo == UnstakeInfo.UNSTAKEING} onClick={()=>SetUnstakeInfo(UnstakeInfo.UNSTAKEING)}>Unstaking</ButtonUnderLine>
            <ButtonUnderLine active={unstakeInfo == UnstakeInfo.WITHDRAW} onClick={()=>SetUnstakeInfo(UnstakeInfo.WITHDRAW)}>Withdraw</ButtonUnderLine>
            <ButtonUnderLine active={unstakeInfo == UnstakeInfo.COMPLETED} onClick={()=>SetUnstakeInfo(UnstakeInfo.COMPLETED)}>Completed</ButtonUnderLine>
            {
                detail(unstakeInfo)
            }
        </div>
    )
}