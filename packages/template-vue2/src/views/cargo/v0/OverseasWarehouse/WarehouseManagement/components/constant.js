const constant = {
  warehouseTypes: [
    {
      label: '海外仓',
      value: '1'
    }],
  timeZones: [
    {
      label: '中时区',
      value: 0
    },
    {
      label: '东一区',
      value: 1
    },
    {
      label: '东二区',
      value: 2
    },
    {
      label: '东三区',
      value: 3
    },
    {
      label: '东四区',
      value: 4
    },
    {
      label: '东五区',
      value: 5
    },
    {
      label: '东六区',
      value: 6
    },
    {
      label: '东七区',
      value: 7
    },
    {
      label: '东八区',
      value: 8
    },
    {
      label: '东九区',
      value: 9
    },
    {
      label: '东十区',
      value: 10
    },
    {
      label: '东十一区',
      value: 11
    },
    {
      label: '东十二区',
      value: 12
    },
    {
      label: '西十一区',
      value: -11
    },
    {
      label: '西十区',
      value: -10
    },
    {
      label: '西九区',
      value: -9
    },
    {
      label: '西八区',
      value: -8
    },
    {
      label: '西七区',
      value: -7
    },
    {
      label: '西六区',
      value: -6
    },
    {
      label: '西五区',
      value: -5
    },
    {
      label: '西四区',
      value: -4
    },
    {
      label: '西三区',
      value: -3
    },
    {
      label: '西二区',
      value: -2
    },
    {
      label: '西一区',
      value: -1
    }
  ],
  dockingWays: [
    {
      label: 'API',
      value: '1'
    },
    {
      label: 'EDI',
      value: '2'
    },
    {
      label: 'FTP',
      value: '3'
    },
    {
      label: '云仓',
      value: '4'
    }
  ],
  receiveTypes: [
    {
      label: '整柜（托盘）',
      value: '1'
    },
    {
      label: '整柜（散货）',
      value: '2'
    },
    {
      label: '托盘',
      value: '3'
    },
    {
      label: '包裹入库',
      value: '4'
    },
    {
      label: '退货入库',
      value: '5'
    }
  ],
  goodsTypes: [
    {
      label: '普货',
      value: '1'
    },
    {
      label: '带电产品',
      value: '2'
    },
    {
      label: '危险品',
      value: '3'
    },
    {
      label: 'FDA产品',
      value: '4'
    },
    {
      label: '保质期产品',
      value: '5'
    }
  ],
  outWarehouseTypes: [
    {
      label: '一件代发',
      value: '10'
    },
    {
      label: '转运',
      value: '20'
    },
    {
      label: '转运FBA',
      value: '22'
    },
    {
      label: '一单多件',
      value: '30'
    }
  ],
  libraryServices: [
    {
      label: '合并打包',
      value: '1'
    },
    {
      label: '产品换标',
      value: '2'
    },
    {
      label: '外箱贴标',
      value: '3'
    },
    {
      label: '打托',
      value: '4'
    },
    {
      label: '更换包装',
      value: '5'
    }
  ]
}
export default constant
