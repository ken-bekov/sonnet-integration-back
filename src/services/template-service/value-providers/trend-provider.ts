import dayjs from "dayjs";
import {appContext} from "@backend/app-context";

import {Trend} from "@backend/db-models/metrics";

export async function loadTrends(
    nameId: string,
    fromDate: string = '2024-11-01',
    toDate: string = '2024-11-07',
) {
    const {knex} = appContext;
    const intervalInMs = 30 * 60 * 1000;
    const [trends] = await knex.raw(`
        select
            from_unixtime((truncate (date / ${intervalInMs}, 0) * ${intervalInMs}) / 1000) as time, 
            round(avg(avg), 2) avg 
        from trends
        where date(from_unixtime(date / 1000)) between '${fromDate}' and '${toDate}' and name_id = ${nameId}
        group by from_unixtime((truncate (date / ${intervalInMs}, 0) * ${intervalInMs}) / 1000);
    `);

    return trends
        .map((trend: Trend)=>
            `${dayjs(trend.time).format('DD-MM-YYYY HH:mm:ss')}, ${trend.avg}`)
        .join('\n');
}
