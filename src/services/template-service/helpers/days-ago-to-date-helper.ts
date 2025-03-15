import dayjs from "dayjs";

export const daysAgoToDateHelper = (days: number) => {
    return dayjs().subtract(days, 'days').format('YYYY-MM-DD');
}
