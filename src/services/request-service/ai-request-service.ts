import {AiRequest, AiRequestSet} from "@backend/db-models/ai-request";
import {Worker} from "node:worker_threads";
import {logger} from "@backend/logger";
import {loadReport} from "./../template-service/value-providers/ai-provider";
import {generatePDF} from "./../pdf-service.ts";

export class AiRequestService {
    constructor() {
    }

    getRequestSetsForAgent(agentId: number) {
        return AiRequestSet.query().where('agentId', agentId);
    }

    getRequestsForSet(setId: number) {
        return AiRequest.query().where('requestSetId', setId);
    }

    async runRequestSet(agentId: number) {
        console.log(`Running request for agent ${agentId}`);
        const worker = new Worker(`${__dirname}/request-worker.js`, {workerData: {agentId}});
        worker.on('error', (error) => {
            logger.error(`Error on processing request for agent ${agentId}: ${error.message}`);
        });
        worker.on('exit', (code) => {
            logger.error(`Request done for agent ${agentId}`);
        })
    }

    async saveRequestSet(requestSet: Partial<AiRequestSet>) {
        if(requestSet.id) {
            return AiRequestSet.query().patchAndFetchById(requestSet.id, requestSet);
        } else {
            return AiRequestSet.query().insertAndFetch(requestSet);
        }
    }

    async saveRequest(request: Partial<AiRequest>) {
        if(request.id) {
            return AiRequest.query().updateAndFetch(request);
        } else {
            return AiRequest.query().insertAndFetch(request);
        }
    }

    async getRequestSets(agentId: number) {
        return AiRequestSet
            .query().where('agent_id', agentId)
            .withGraphFetched('requests');
    }

    async savePDF(agentId: number) {
        const requestSet = await AiRequestSet.query()
            .where('agent_id', agentId)
            .where('state', 'done')
            .first();

        if (!requestSet) {
            return { message: 'No request set found' };
        }

        if (requestSet?.id !== undefined) {
            const report = await loadReport(requestSet.id);
            const fileName = `report_${agentId}.pdf`;

            await generatePDF({title: report.name, content: report.prompt, fileName: fileName });
        } else {
            console.log('Report not found');
        }
    }
}
