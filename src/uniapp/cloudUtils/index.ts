import { handleError } from "../uniUtils"

/**
 * 云函数工具类
 * 提供云函数调用、重试、响应处理等功能
 */
export const cloudUtils = {
  /**
   * 调用云函数
   * @param app CloudBase 应用实例
   * @param functionName 云函数名称
   * @param action 操作类型
   * @param params 参数
   * @returns 云函数执行结果
   */
  async call<T = any>(
    app: any,
    functionName: string,
    action: string,
    params?: any
  ): Promise<T> {
    try {
      const result = await app.callFunction({
        name: functionName,
        data: {
          action,
          params
        }
      })
      return result.result as T
    } catch (error) {
      handleError(error, `调用云函数 ${functionName} 失败`)
    }
    return null as T
  },

  /**
   * 带重试机制调用云函数
   * @param app CloudBase 应用实例
   * @param functionName 云函数名称
   * @param action 操作类型
   * @param params 参数
   * @param retryCount 重试次数，默认3次
   * @returns 云函数执行结果
   */
  async callWithRetry(
    app: any,
    functionName: string,
    action: string,
    params?: any,
    retryCount: number = 3
  ): Promise<any> {
    let lastError: any

    for (let i = 0; i < retryCount; i++) {
      try {
        return await this.call(app, functionName, action, params)
      } catch (error) {
        lastError = error
        if (i < retryCount - 1) {
          // 等待一段时间后重试
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
    }

    throw lastError
  },

  /**
   * 处理响应
   * @param data 云函数返回结果
   * @param successMessage 成功提示消息
   * @returns 处理后的结果数据
   */
  handleResponse(data: any, successMessage?: string) {
    if (data?.code === 0) {
      if (successMessage) {
        uni.showToast({
          title: successMessage,
          icon: 'success'
        })
      }
      return data.result
    } else {
      const errorMessage = data?.message || '操作失败'
      uni.showToast({
        title: errorMessage,
        icon: 'none'
      })
      throw new Error(errorMessage)
    }
  }
}