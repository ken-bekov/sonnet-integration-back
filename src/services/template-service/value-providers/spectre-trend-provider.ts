import {appContext} from "@backend/app-context";
import {FrequencyMalfunction, SpectreTrend, SpectreTrendName} from "@backend/db-models/metrics";
import dayjs from "dayjs";

export async function loadSpectreTrends(
    malfunctionId: string,
    fromDate: string = '2024-11-01',
    toDate: string = '2024-11-07',
    intervalInMins: number = 30,
) {
    const {knex} = appContext;
    const malfunction = await FrequencyMalfunction.query().where({id: malfunctionId}).first();
    if (!malfunction) {
        return '';
    }

    const spectreTrendName = await SpectreTrendName.query().where({
        minion_id: malfunction.minion_id,
        name: malfunction.name,
        channel: malfunction.channel,
    }).first();
    if (!spectreTrendName) {
        return '';
    }
    
    const intervalInMs = intervalInMins * 60 * 1000;

    const [spectreTrends] = await knex.raw(`
        select
            from_unixtime((truncate (date / ${intervalInMs}, 0) * ${intervalInMs}) / 1000) as time, 
            round(avg(avg), 2) avg 
        from trend_specters_copy1
        where 
            date between 
                unix_timestamp('${fromDate} 00:00:00') * 1000 and unix_timestamp('${toDate} 23:59:59') * 1000
            and name_id = ${spectreTrendName.$id()}
        group by from_unixtime((truncate (date / ${intervalInMs}, 0) * ${intervalInMs}) / 1000);
    `);

    return spectreTrends
        .map((trend: SpectreTrend) =>
            `${dayjs(trend.time).format('DD-MM-YYYY HH:mm:ss')}, ${trend.avg}`
        ).join('\n');
}
