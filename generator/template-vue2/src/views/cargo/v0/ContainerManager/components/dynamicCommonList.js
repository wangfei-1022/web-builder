import i18n from '../../../../../lang'

// 业务类型下拉
export const commonBusinessTypeList = [
  {
    label: i18n.t('containerManager.dynamicList.byShip'),
    value: 1
  },
  {
    label: i18n.t('containerManager.dynamicList.railway'),
    value: 2
  },
  {
    label: i18n.t('containerManager.dynamicList.oneWay'),
    value: 3
  },
  {
    label: i18n.t('containerManager.dynamicList.outShip'),
    value: 4
  },
  {
    label: i18n.t('containerManager.dynamicList.shoutOut'),
    value: 6
  }
]

// 空重下拉
export const commonEmptyWeightList = [
  {
    label: 'E',
    value: 1
  },
  {
    label: 'F',
    value: 2
  }
]

// 空箱对应的动态
export const commonEmptyStatusArr = ['MT', 'OP', 'MM', 'OH', 'XX', 'RO', 'RM']

// 重箱对应的动态
export const commonFullStatusArr = ['MT', 'OP', 'MM', 'OH', 'XX', 'RO', 'RM']

// 箱况下拉
export const commonContainerSituationList = [
  {
    value: 1,
    label: 'AV'
  },
  {
    value: 2,
    label: 'DM'
  }
]
