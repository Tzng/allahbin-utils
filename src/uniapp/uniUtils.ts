// ==================== 响应处理工具函数 ====================

/**
 * 标准响应结构
 */
export interface StandardResponse<T = any> {
  code: number
  message?: string
  result?: T
}

/**
 * 处理成功响应 - 检查响应码是否为0
 * @param data 响应数据
 * @returns 是否成功
 */
export const handleSuccess = (data: any): boolean => {
  if (data && data.code === 0) {
    return true
  }
  return false
}

/**
 * 处理错误响应 - 统一错误处理和抛出
 * @param error 错误对象
 * @param context 错误上下文描述
 */
export const handleError = (error: any, context?: string): void => {
  const errorMessage = context ? `${context}: ${error.message || error}` : error.message || error
  console.error('Service error:', errorMessage)
  throw error
}

/**
 * 获取响应数据 - 从标准响应结构中提取数据
 * @param response 响应对象
 * @returns 响应数据或null
 */
export const getResponseData = <T = any>(response: any): T | null => {
  if (response && response.code === 0) {
    return response.result
  }
  return null
}

/**
 * 安全获取响应数据 - 失败时返回默认值
 * @param response 响应对象
 * @param defaultValue 默认值
 * @returns 响应数据或默认值
 */
export const safeGetResponseData = <T>(response: any, defaultValue: T): T => {
  const data = getResponseData<T>(response)
  return data !== null ? data : defaultValue
}

// ==================== 云函数调用工具函数 ====================

/**
 * 通用云函数调用方法
 * @param app CloudBase 应用实例
 * @param functionName 云函数名称
 * @param action 操作类型
 * @param params 参数
 * @returns 云函数执行结果
 */
export const callCloudFunction = async (
  app: any,
  functionName: string,
  action: string,
  params?: any
): Promise<any> => {
  try {
    const result = await app.callFunction({
      name: functionName,
      data: {
        action,
        params
      }
    })
    return result.result
  } catch (error) {
    handleError(error, `调用云函数 ${functionName} 失败`)
  }
}

/**
 * 带重试机制的云函数调用
 * @param app CloudBase 应用实例
 * @param functionName 云函数名称
 * @param action 操作类型
 * @param params 参数
 * @param retryCount 重试次数，默认3次
 * @returns 云函数执行结果
 */
export const callCloudFunctionWithRetry = async (
  app: any,
  functionName: string,
  action: string,
  params?: any,
  retryCount: number = 3
): Promise<any> => {
  let lastError: any

  for (let i = 0; i < retryCount; i++) {
    try {
      return await callCloudFunction(app, functionName, action, params)
    } catch (error) {
      lastError = error
      if (i < retryCount - 1) {
        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }

  throw lastError
}

// ==================== 业务数据处理工具函数 ====================

/**
 * 验证必填字段
 * @param data 数据对象
 * @param requiredFields 必填字段数组
 * @returns 验证结果
 */
export const validateRequiredFields = (data: any, requiredFields: string[]): {
  isValid: boolean
  missingFields: string[]
} => {
  const missingFields: string[] = []

  for (const field of requiredFields) {
    if (!data[field] && data[field] !== 0) {
      missingFields.push(field)
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}

/**
 * 创建带时间戳的数据对象
 * @param data 原始数据
 * @param userId 用户ID
 * @returns 带时间戳的数据对象
 */
export const createTimestampedData = (data: any, userId?: string) => {
  const now = new Date()
  return {
    ...data,
    createdAt: now,
    updateAt: now,
    ...(userId && { creatorId: userId })
  }
}

/**
 * 创建更新数据对象（只包含updateAt）
 * @param data 原始数据
 * @returns 带更新时间戳的数据对象
 */
export const createUpdateData = (data: any) => {
  const now = new Date()
  return {
    ...data,
    updateAt: now
  }
}

// ==================== 用户提示工具函数 ====================

/**
 * 显示成功提示
 * @param title 提示标题
 * @param duration 显示时长，默认1500ms
 */
export const showSuccessToast = (title: string, duration: number = 1500): void => {
  uni.showToast({
    title,
    icon: 'success',
    duration
  })
}

/**
 * 显示错误提示
 * @param title 提示标题
 * @param duration 显示时长，默认2000ms
 */
export const showErrorToast = (title: string, duration: number = 2000): void => {
  uni.showToast({
    title,
    icon: 'none',
    duration
  })
}

/**
 * 显示加载提示
 * @param title 提示标题，默认"加载中..."
 */
export const showLoading = (title: string = '加载中...'): void => {
  uni.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
export const hideLoading = (): void => {
  uni.hideLoading()
}

/**
 * 显示确认对话框
 * @param content 对话框内容
 * @param title 对话框标题，默认"提示"
 * @returns Promise<boolean> 用户是否确认
 */
export const showConfirmDialog = (content: string, title: string = '提示'): Promise<boolean> => {
  return new Promise((resolve) => {
    uni.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

// ==================== 数据格式化工具函数 ====================

/**
 * 格式化日期
 * @param date 日期对象、时间戳或日期字符串
 * @param format 格式化模式，默认'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | number | string, format: string = 'YYYY-MM-DD'): string => {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return ''
  }

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化时间为相对时间
 * @param timestamp 时间戳或日期字符串
 * @returns 相对时间字符串
 */
export const formatRelativeTime = (timestamp: string | number): string => {
  const now = Date.now()
  const time = new Date(timestamp).getTime()
  const diff = now - time

  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) { // 1天内
    return `${Math.floor(diff / 3600000)}小时前`
  } else if (diff < 2592000000) { // 30天内
    return `${Math.floor(diff / 86400000)}天前`
  } else {
    return formatDate(timestamp, 'YYYY-MM-DD')
  }
}

// ==================== 数组和对象工具函数 ====================

/**
 * 安全的数组操作 - 确保返回数组
 * @param data 可能为数组的数据
 * @returns 数组
 */
export const ensureArray = <T>(data: T[] | T | null | undefined): T[] => {
  if (Array.isArray(data)) {
    return data
  }
  if (data !== null && data !== undefined) {
    return [data]
  }
  return []
}

/**
 * 根据ID查找数组中的项
 * @param array 数组
 * @param id ID值
 * @param idField ID字段名，默认'id'
 * @returns 找到的项或undefined
 */
export const findById = <T extends Record<string, any>>(
  array: T[],
  id: any,
  idField: string = 'id'
): T | undefined => {
  return array.find(item => item[idField] === id)
}

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 拷贝后的对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T
  }

  const cloned = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }

  return cloned
}

// ==================== 云函数响应验证工具函数 ====================

/**
 * 验证家庭成员身份的响应结构
 */
export interface FamilyValidationResponse {
  code: number
  message?: string
}

/**
 * 验证数据存在性的响应结构
 */
export interface ExistenceValidationResponse<T = any> {
  code: number
  message?: string
  result?: T
}

/**
 * 检查是否为有效的家庭验证响应
 * @param response 响应对象
 * @returns 是否验证通过
 */
export const isValidFamilyMember = (response: FamilyValidationResponse): boolean => {
  return response && response.code === 0
}

/**
 * 检查数据是否存在
 * @param response 响应对象
 * @returns 数据是否存在
 */
export const isDataExists = <T>(response: ExistenceValidationResponse<T>): boolean => {
  return !!(response && response.code === 0 && response.result)
}