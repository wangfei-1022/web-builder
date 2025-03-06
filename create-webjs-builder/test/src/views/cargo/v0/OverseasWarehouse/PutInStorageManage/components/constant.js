const constant = {
  status: [
    {
      label: 'all',
      value: null
    },
    {
      label: 'waitingList',
      value: 2
    },

    {
      label: 'hasRefusedTo',
      value: 3
    },
    {
      label: 'haveOrder',
      value: 4
    },
    {
      label: 'deliveredWarehouse',
      value: 5
    },
    {
      label: 'warehouseReceiving',
      value: 9
    },
    {
      label: 'warehouseToConfirm',
      value: 6
    },
    {
      label: 'warehouseRefusedTo',
      value: 7
    },
    {
      label: 'TheEntryListHasBeenGenerated',
      value: 8
    }
  ],
  receiveTypes: [ // 入库类型
    {
      label: 'all',
      value: null
    },
    {
      label: 'FCLPallet',
      value: '1'
    },
    {
      label: 'FCLBulk',
      value: '2'
    },
    {
      label: 'pallet',
      value: '3'
    }
    // {
    //   label: 'courier',
    //   value: '4'
    // },
    // {
    //   label: 'returnOfTreasury',
    //   value: '5'
    // }
  ],
  orderStatus: [ // 入库单订单状态
    {
      label: 'waitingList',
      value: 2
    },
    {
      label: 'hasRefusedTo',
      value: 3
    },
    {
      label: 'haveOrder',
      value: 4
    },
    {
      label: 'deliveredWarehouse',
      value: 5
    },

    {
      label: 'warehouseToConfirm',
      value: 6
    },
    {
      label: 'warehouseRefusedTo',
      value: 7
    },
    {
      label: 'firstLegInTransit',
      value: 8
    },

    {
      label: 'partOfTheShelf',
      value: 12
    },
    {
      label: 'allTheShelves',
      value: 13
    }
  ],
  deliverTypeStatus: [ // 交货类型
    {
      label: 'sinceTheSend',
      value: 1
    },
    {
      label: 'lanShou',
      value: 2
    }
  ],
  deliveryMethod: [
    {
      label: 'airForce',
      value: 1
    },
    {
      label: 'seaForce',
      value: 2
    }
  ]
}
export default constant
