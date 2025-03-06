let arr = []
let target = {
    billNo: 'BILL20220010',
    salesNames: '刘某',
    warehouseName: 'OUDALLE NORMANDIE',
    settlementOfficeName: '广东广新家具有限公司',
    settlementCompanyName: '深圳一海通总公司',
    feeItemName: '整柜卸货费',
    currency: 'USD',
    price: '100',
    chargeQuantity1: '1',
    estimateAmount: '100',
    billAmount: '100',
    entryStateName: '待出账',
    invoiceStateName: '-',
    clearName: '已核销',
    isBill: true
}

for (let i = 0; i < 157; i++) {
    arr.push(target)
}

export default arr
