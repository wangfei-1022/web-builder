import { getPlanCountryListApi } from '@/api/planManager'
export default {
  name: 'ListOfBatch',
  data() {
    return {
      // 国家列表
      countryList: [],
      // 末端列表
      oriLastMailCarrierList: [
        {
          label: 'Collisimo',
          value: 'Collisimo',
          dependent: 'FR'
        },
        {
          label: 'DAF',
          value: 'DAF',
          dependent: 'FR'
        },
        {
          label: 'USPS',
          value: 'USPS',
          dependent: 'US'
        },
        {
          label: 'PB',
          value: 'PB',
          dependent: 'US'
        },
        {
          label: 'Inpost',
          value: 'Inpost',
          dependent: 'PL'
        },
        {
          label: 'Yodel',
          value: 'Yodel',
          dependent: 'GB'
        },
        {
          label: 'Evri',
          value: 'Evri',
          dependent: 'GB'
        },
        {
          label: 'Royalmail',
          value: 'Royalmail',
          dependent: 'GB'
        },
        {
          label: 'DHL',
          value: 'DHL',
          dependent: 'DE'
        },
        {
          label: 'Hermes',
          value: 'Hermes',
          dependent: 'DE'
        }
      ],
      // 目的港列表
      originPodList: [
        {
          label: 'GRU',
          value: 'GRU',
          dependent: 'BR'
        },
        {
          label: 'MAD',
          value: 'MAD',
          dependent: 'ES'
        },
        {
          label: 'MEX',
          value: 'MEX',
          dependent: 'MX'
        },
        {
          label: 'CDG',
          value: 'CDG',
          dependent: 'FR'
        },
        {
          label: 'XCR',
          value: 'XCR',
          dependent: 'FR'
        },
        {
          label: 'LAX',
          value: 'LAX',
          dependent: 'US'
        },
        {
          label: 'JFK',
          value: 'JFK',
          dependent: 'US'
        },
        {
          label: 'ORD',
          value: 'ORD',
          dependent: 'US'
        },
        {
          label: 'AMS',
          value: 'AMS',
          dependent: 'DE,PL'
        },
        {
          label: 'LGG',
          value: 'LGG',
          dependent: 'DE,PL'
        },
        {
          label: 'LHR',
          value: 'LHR',
          dependent: 'GB'
        },
        {
          label: 'STN',
          value: 'STN',
          dependent: 'GB'
        }
      ],
      // 渠道类型
      cargoList: [
        {
          label: this.$t('planManager.normalProduct'),
          value: this.$t('planManager.normalProduct')
        },
        {
          label: this.$t('planManager.electricProduct'),
          value: this.$t('planManager.electricProduct')
        },
        {
          label: this.$t('planManager.specialProduct'),
          value: this.$t('planManager.specialProduct')
        },
        {
          label: this.$t('planManager.mixinsProduct'),
          value: this.$t('planManager.mixinsProduct')
        }
      ]
    }
  },
  mounted() {},
  methods: {
    async getCountryList() {
      const res = await getPlanCountryListApi()
      if (res && res.ok) {
        this.countryList = []
        res.content.forEach(item => {
          this.countryList.push({
            label: item.countryName,
            value: item.countryCode
          })
        })
      }
    }
  }
}
