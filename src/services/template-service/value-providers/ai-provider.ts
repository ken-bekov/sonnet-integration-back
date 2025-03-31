import {appContext} from "@backend/app-context";

export async function loadReport(
    id: number
) {
    const {knex} = appContext;

    const report = await knex('ai_request')
        .where('request_set_id', id)
        .first();

    return report
}
