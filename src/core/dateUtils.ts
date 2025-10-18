/**
 * 日期工具函数
 */

import dayjs, { Dayjs } from "dayjs";

/**
 * 日期工具对象
 */
const dateUtils = {
  /**
   * 格式化日期
   * @param date 日期对象或时间戳
   * @param format 格式字符串，如 'YYYY-MM-DD HH:mm:ss'
   * @returns 格式化后的日期字符串
   */
  formatDate(date: Date | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },

  /**
   * 获取相对时间描述
   * @param date 日期对象或时间戳
   * @returns 相对时间描述，如 '2小时前'
   */
  timeAgo(date: Date | number): string {
    const now = new Date();
    const target = new Date(date);
    const diff = now.getTime() - target.getTime();

    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = day * 365;

    if (diff < minute) {
      return '刚刚';
    } else if (diff < hour) {
      return `${Math.floor(diff / minute)}分钟前`;
    } else if (diff < day) {
      return `${Math.floor(diff / hour)}小时前`;
    } else if (diff < month) {
      return `${Math.floor(diff / day)}天前`;
    } else if (diff < year) {
      return `${Math.floor(diff / month)}个月前`;
    } else {
      return `${Math.floor(diff / year)}年前`;
    }
  },

  /**
   * 添加时间
   * @param date 日期对象或时间戳
   * @param amount 数量
   * @param unit 单位：'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'
   * @returns 新的日期对象
   */
  addTime(
    date: Date | number,
    amount: number,
    unit: 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'
  ): Date {
    const d = new Date(date);

    switch (unit) {
      case 'years':
        d.setFullYear(d.getFullYear() + amount);
        break;
      case 'months':
        d.setMonth(d.getMonth() + amount);
        break;
      case 'days':
        d.setDate(d.getDate() + amount);
        break;
      case 'hours':
        d.setHours(d.getHours() + amount);
        break;
      case 'minutes':
        d.setMinutes(d.getMinutes() + amount);
        break;
      case 'seconds':
        d.setSeconds(d.getSeconds() + amount);
        break;
    }

    return d;
  },

  /**
   * 获取日期范围的开始和结束
   * @param date 日期对象或时间戳
   * @param unit 单位：'day' | 'week' | 'month' | 'year'
   * @returns 包含开始和结束日期的对象
   */
  getDateRange(
    date: Date | number,
    unit: 'day' | 'week' | 'month' | 'year'
  ): { start: Date; end: Date } {
    const d = new Date(date);
    let start: Date;
    let end: Date;

    switch (unit) {
      case 'day':
        start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
        break;
      case 'week':
        const dayOfWeek = d.getDay();
        start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dayOfWeek);
        end = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dayOfWeek + 7);
        break;
      case 'month':
        start = new Date(d.getFullYear(), d.getMonth(), 1);
        end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        break;
      case 'year':
        start = new Date(d.getFullYear(), 0, 1);
        end = new Date(d.getFullYear() + 1, 0, 1);
        break;
    }

    return { start, end };
  },

  /**
   * 判断是否为同一天
   * @param date1 日期1
   * @param date2 日期2
   * @returns 是否为同一天
   */
  isSameDay(date1: Date | number, date2: Date | number): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  },

  /**
   * 判断是否为闰年
   * @param year 年份
   * @returns 是否为闰年
   */
  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  },

  /**
   * 获取月份天数
   * @param year 年份
   * @param month 月份（0-11）
   * @returns 天数
   */
  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  },

  /**
   * 获取最近几年的年份选项
   * @param num 几年？默认三年（向上取）
   * @returns 年份选项数组
   */
  getYearOptions(num: number = 3): Array<{ id: number; text: number }> {
    const yearList: Array<{ id: number; text: number }> = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < num; i += 1) {
      const year = currentYear + i;
      yearList.push({
        id: year,
        text: year
      });
    }
    return yearList;
  },

  /**
   * 获取最近几年的年份选项（向下取）
   * @param num 几年？默认三年（向下取）
   * @returns 年份选项数组
   */
  getPastYearOptions(num: number = 3): Array<{ id: number; text: number }> {
    const yearList: Array<{ id: number; text: number }> = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < num; i += 1) {
      const year = currentYear - i;
      yearList.push({
        id: year,
        text: year
      });
    }
    return yearList;
  },

  /**
   * 根据当前的时间，来生成是凌晨、早上、中午、下午、晚上，返回对应的字符串
   */
  getDayTimeStr: (date: Dayjs = dayjs()) => {
    const hour = date.hour();
    if (hour >= 0 && hour < 6) {
      return '凌晨';
    } else if (hour >= 6 && hour < 12) {
      return '上午';
    } else if (hour >= 12 && hour < 14) {
      return '中午';
    } else if (hour >= 14 && hour < 18) {
      return '下午';
    } else if (hour >= 18 && hour < 24) {
      return '晚上';
    }
    return '';
  },

  /**
   * 安全格式化日期
   *
   * @param date - 要格式化的日期，可以是字符串、数字、Date 对象或 dayjs 对象
   * @param format - 输出的日期格式，默认为 "YYYY-MM-DD"
   * @returns 格式化后的日期字符串；如果输入无效，则返回 "-"
   *
   * @example
   * safeFormat("2025-09-20") // "2025-09-20"
   * safeFormat("2025-13-40") // "-"
   * safeFormat(new Date(), "YYYY/MM/DD HH:mm") // "2025/09/20 16:30"
   */
  safeFormat: (date: any, format = 'YYYY-MM-DD'): string => {
    if (date === null || date === undefined || date === '') {
      return '-';
    }
    const d = dayjs(date);
    return d.isValid() ? d.format(format) : '-';
  },

  /**
   * 安全格式化时间
   */
  safeFormatTime: (date: any, format = 'YYYY-MM-DD HH:mm:ss'): string => {
    return dateUtils.safeFormat(date, format);
  },

  /**
   * 格式化日期范围显示
   * 将开始时间和结束时间格式化为范围显示
   * @param startTime 开始时间
   * @param endTime 结束时间
   * @returns 格式化后的日期范围字符串
   */
  formatDateRange: (startTime?: string, endTime?: string) => {
    const start = dateUtils.safeFormat(startTime);
    const end = dateUtils.safeFormat(endTime);

    if (start === '-' && end === '-') {
      return '-';
    } else if (start === '-') {
      return `至 ${end}`;
    } else if (end === '-') {
      return `${start} 至 -`;
    }
    return `${start} - ${end}`;
  }
};

export default dateUtils;