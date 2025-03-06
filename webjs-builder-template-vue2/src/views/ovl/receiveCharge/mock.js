let arr = []

let clearState = ['-', '已核销', '待核销']
let target = {
    serialNo: 'LSH202203008',
    entityNo: 'ORDER20220504',
    billNo: 'BILL20220506',
    childBusinessTypeName: '一件代发',
    chineseName: 'OUDALLE NORMANDIE',
    memberName: '广东广新家具有限公司',
    settlementOfficeName: '深圳一海通总公司',
    feeItemName: '整柜卸货费',
    curreny: 'USD',
    price: '100',
    chargeQuantity1: '1',
    estimateAmount: '100',
    amount: '100',
    entryStateName: '待出账',
    invoiceStateName: '-',
    clearStateName: '已核销',
    isCharge: true
}

for (let i = 0; i < 157; i++) {
    arr.push({
        ...target,
        clearState: clearState[i * 5 % 3]
    })
}

export default arr
