import route from "./route";
import original from "./originTranslate";
import ETDInfoTable from "./ETDInfoTable";
// import BilListTable from './BilListTable'
import TipsMessage from "./TipsMessage";
import blInfo from "./blInfo";
import message from "./message.js";
import logisticsCompany from "./logisticsCompany";
import logisticsProduct from "./logisticsProduct";
import partition from "./partition";
import channel from "./channel";
import channelPriceCard from "./channelPriceCard";
import warehousePriceCard from "./warehousePriceCard";
import warehouse from "./warehouse";
import common from "./common";
import billAMS from "./billAMS";
import containerManager from "./containerManager";
import charteredBoat from "./charteredBoat";
import boatBlList from "./boatBlList";
import boatEtdList from "./boatEtdList";
import boatBookingDetail from "./boatBookingDetail";
import preManifest from "./preManifest";
import releaseBillList from "./releaseBillList";
import goodsManagement from "./goodsManagement";
import spaceRule from "./spaceRule";
import boatContainerList from "./boatContainerList";
import outInStorageManage from "./outInStorageManage";
import putInStorageManage from "./putInStorageManage";
import inventoryManager from "./inventoryManager";
import taskList from "./taskList";
import peakSeasonTimeManage from "./peakSeasonTimeManage";
// import billList from '@/lang/ZH-CN/billList'
import sea from "@/lang/ZH-CN/seaExportOrder";
import packageWarehouse from "./packageWarehouse";
import analyticStatistics from "./analyticStatistics"; // BI 船舶概览数据监控时间轴

import overseasManage from "./overseasManage";
import air from "./airExport";
import planManager from "./planManager";
import InterfaceLog from "./InterfaceLog";
import role from './role';
import packageTransfer from "./packageTransfer";
import codeManager from './codeManager'
import seaBl from './OvlSeaSitManage/seaBl'
import seaQuotationExport from "./seaQuotationExport";
import seaProduct from "./seaProduct";

import openPlatform from "./openPlatform";
import uexpress from "./uexpress"; // 小包相关
import financial from "./financial"; // 结算相关
import partner from "./partner"; // 客商管理相关
import country from "./country"; // 国家行政区相关
import thirdKindOrder from './thirdKindOrder'
import ovlDivisionRate from './ovlDivisionRate'
import estimateCharge from './estimateCharge'
import chargeLog from './chargeLog'
import sys from "@/lang/ZH-CN/sys";

export default {
  ...original,
  route,
  common,
  // BilListTable,
  ETDInfoTable,
  TipsMessage,
  blInfo,
  ...message,
  logisticsCompany,
  logisticsProduct,
  partition,
  warehouse,
  channel,
  channelPriceCard,
  warehousePriceCard,
  billAMS,
  preManifest,
  goodsManagement,
  containerManager,
  charteredBoat,
  boatBlList,
  boatEtdList,
  boatBookingDetail,
  releaseBillList,
  spaceRule,
  boatContainerList,
  putInStorageManage,
  outInStorageManage,
  inventoryManager,
  taskList,
  peakSeasonTimeManage,
  ...message,
  // billList,
  // preManifest,
  sea,
  packageWarehouse,
  analyticStatistics,
  overseasManage,
  air,
  planManager,
  InterfaceLog,
  role,
  packageTransfer,
  codeManager,
  seaBl,
  seaQuotationExport,
  seaProduct,
  ...uexpress,
  ...financial,
  ...partner,
  ...openPlatform,
  country,
  thirdKindOrder,
  ovlDivisionRate,
  chargeLog,
  estimateCharge,
  sys
};
