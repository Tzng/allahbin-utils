/**
 * 云函数工具类
 * 提供云函数调用、重试、响应处理等功能
 */

/**
 * 处理错误响应 - 统一错误处理和抛出
 * @param error 错误对象
 * @param context 错误上下文描述
 */
const handleError = (error: any, context?: string): void => {
  const errorMessage = context ? `${context}: ${error.message || error}` : error.message || error
  console.error('Service error:', errorMessage)
  throw error
}

/**
 * 云函数工具对象
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
  async call(
    app: any,
    functionName: string,
    action: string,
    params?: any
  ): Promise<any> {
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
   * @param result 云函数返回结果
   * @param successMessage 成功提示消息
   * @returns 处理后的结果数据
   */
  handleResponse(result: any, successMessage?: string) {
    if (result.result?.code === 0) {
      if (successMessage) {
        uni.showToast({
          title: successMessage,
          icon: 'success'
        })
      }
      return result.result.result
    } else {
      const errorMessage = result.result?.message || '操作失败'
      uni.showToast({
        title: errorMessage,
        icon: 'none'
      })
      throw new Error(errorMessage)
    }
  }
}