const limitingConditionsType = {
  2: {
    name: 'size_restrictions',
    types: [{
      name: 'length',
      value: 4
    },
    {
      name: 'width',
      value: 5
    },
    {
      name: 'height',
      value: 6
    },
    {
      name: 'longestSide',
      value: 7
    },
    {
      name: 'secondLongestSide',
      value: 8
    },
    {
      name: 'shortestSide',
      value: 15
    },
    {
      name: 'arbitraryEdge',
      value: 16
    },
    {
      name: 'perimeter',
      value: 17
    },
    {
      name: 'chargingPerimeter',
      value: 9
    },
    {
      name: 'volume',
      value: 10,
      units: [
        {
          name: 'cubicFoot',
          value: 40
        },
        {
          name: 'cubicMeter',
          value: 41
        }
      ]
    }

    ],
    units: [
      {
        name: 'feet',
        value: 20
      },
      {
        name: 'meter',
        value: 21
      },
      {
        name: 'inches',
        value: 50
      },
      {
        name: 'centimetre',
        value: 51
      }

    ]
  }
}
export default limitingConditionsType
