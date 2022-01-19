import { JSBI } from "@liuxingfeiyu/zoo-sdk";
import { Decimal } from "decimal.js"

export function tokenAmountForshow(amount :any, decimal:number = 18) :number{
//    console.log("decimal is ",decimal,"amount is ",amount.toString(10), "res is ",JSBI.toNumber( JSBI.divide( JSBI.multiply(amount,JSBI.BigInt(100)),JSBI.BigInt(Math.pow(10,decimal)))))
    return new Decimal(amount.toString()).div( new Decimal(Math.pow(10,decimal) )).toNumber()
    //return JSBI.toNumber( JSBI.divide( JSBI.multiply(amount,JSBI.BigInt(1e10)),JSBI.BigInt(Math.pow(10,decimal))))/1e10
}
export function numberToString(num:any)
{
    let numStr = String(num);

    if (Math.abs(num) < 1.0)
    {
        let e = parseInt(num.toString().split('e-')[1]);
        if (e)
        {
            let negative = num < 0;
            if (negative) num *= -1
            num *= Math.pow(10, e - 1);
            numStr = '0.' + (new Array(e)).join('0') + num.toString().substring(2);
            if (negative) numStr = "-" + numStr;
        }
    }
    else
    {
        let e = parseInt(num.toString().split('+')[1]);
        if (e > 20)
        {
            e -= 20;
            num /= Math.pow(10, e);
            numStr = num.toString() + (new Array(e + 1)).join('0');
        }
    }

    return numStr;
}
