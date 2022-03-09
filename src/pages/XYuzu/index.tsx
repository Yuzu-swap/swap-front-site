import React, { useCallback, useContext,useRef, useEffect, useMemo, useState } from 'react'
import { ButtonLRTab, ButtonUnderLine } from 'components/Button'
import { XStake } from 'components/XYuzu/XStake'
import { XUnStake } from 'components/XYuzu/XUnStake'

export function XYuzu(){
    const [left , SetLeft] = useState<boolean>(true)
    

    return(
        <>
        <div className="s-xyuzu-body">
            <div className="s-xyuzu-header">
                <h1 className="s-banner-coming">YuzuSwap is updating the smart contract, the update will be done in a couple of hours.</h1>
            </div>
            <div className="s-xyuzu-tab">
                <ButtonLRTab isLeft={true} disabled={left} onClick={()=>SetLeft(true)}>143</ButtonLRTab>
                <ButtonLRTab isLeft={false} disabled={!left} onClick={()=>SetLeft(false)}>123</ButtonLRTab>
            </div>
            {
                left ?
                <XStake/> : <XUnStake/>
            }
            <div></div>
        </div>
        </>
    )
}