/** 导入文件验证处理 */
export type ImportFileVerifyHandle = (importData: any[]) => Promise<{
  /** 顺序号 */
  sequence: number;
  /** 成功状态 */
  success: boolean;
  /** 结果信息 */
  resultMessage: string;
}[]>;

/** 导入文件提交处理 */
export type ImportFileSubmitHandle = (importData: any[]) => boolean | void |Promise<boolean | void>;