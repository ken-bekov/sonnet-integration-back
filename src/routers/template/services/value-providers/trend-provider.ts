import dayjs from "dayjs";
import {appContext} from "@backend/app-context";
import {Trend} from "@backend/db-models/db-models";

export async function loadTrends(nameId: string) {
    const {knex} = appContext;

    const [trends] = await knex.raw(`
        select time, avg(avg) avg, min(min) min, max(max) max
        from (
            select 
                from_unixtime((truncate (date / 600000, 0) * 600000) / 1000) as time, avg, min, max
            from trends
            where from_unixtime(date / 1000) between date('2024-11-01') and date('2024-11-07') and name_id = ${nameId}
        ) as reduced_trends
        group by time;
    `);

    return trends
        .map((trend: Trend)=>
            `${dayjs(trend.time).format('DD-MM-YYYY HH:mm:ss')}, ${trend.avg}, ${trend.min}, ${trend.max}`)
        .join('\n');
}