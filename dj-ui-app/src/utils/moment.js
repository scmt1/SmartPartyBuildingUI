import moment from 'moment'

// 格式化时间
export const formatTime = (time, str="YYYY-MM-DD") => {
  return moment(time).format(str)
}
export const dateDiffInYearsDays = (date1) => {
  const currentDate = formatTime(new Date()); // 当前日期
  const date2 = new Date(currentDate);
  date1 = new Date(date1);
  // 将日期转换为毫秒
  const millisecondsPerYear = 365 * 24 * 60 * 60 * 1000;
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  const totalMilliseconds = Math.abs(date2 - date1);
  const totalDays = totalMilliseconds / millisecondsPerDay;
  const years = totalMilliseconds / millisecondsPerYear;
  const days = totalDays % 365;

  return {
    years: Math.floor(years),
    days: Math.floor(days),
  };
}
