const limitingConditionsType = {
  1: {
    name: '重量限制',
    types: [{
      name: '实重',
      value: 1
    },
    {
      name: '体积重',
      value: 2
    },
    {
      name: '计费重',
      value: 3
    }],
    units: [
      {
        name: '磅',
        value: 10
      },
      {
        name: '千克',
        value: 11
      }
    ]
  },
  2: {
    name: '尺寸限制',
    types: [{
      name: '长',
      value: 4
    },
    {
      name: '宽',
      value: 5
    },
    {
      name: '高',
      value: 6
    },
    {
      name: '最长边',
      value: 7
    },
    {
      name: '第二长边',
      value: 8
    },
    {
      name: '最短边',
      value: 15
    },
    {
      name: '任意边',
      value: 16
    },
    {
      name: '周长',
      value: 17
    },
    {
      name: '计费周长',
      value: 9
    },
    {
      name: '体积',
      value: 10,
      units: [
        {
          name: '立方英尺',
          value: 40
        },
        {
          name: '立方米',
          value: 41
        }
      ]
    }

    ],
    units: [
      {
        name: '英尺',
        value: 20
      },
      {
        name: '米',
        value: 21
      }

    ]
  },
  // 3: {
  //   name: '金额限制',
  //   types: [{
  //     name: '运费',
  //     value: 11
  //   },
  //   {
  //     name: '附加费',
  //     value: 12
  //   },
  //   {
  //     name: '申报价值',
  //     value: 13
  //   }
  //   ],
  //   units: [
  //     {
  //       name: '美元',
  //       value: 30
  //     },
  //     {
  //       name: '欧元',
  //       value: 31
  //     },
  //     {
  //       name: '英镑',
  //       value: 32
  //     },
  //     {
  //       name: '人民币',
  //       value: 33
  //     }
  //   ]
  // },
  4: {
    name: '国家限制',
    types: [{
      name: '可发货国家',
      value: 14
    }
    ]
  }
}
export default limitingConditionsType
