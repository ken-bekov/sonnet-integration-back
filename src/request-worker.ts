import {AiQueryTemplate} from "@backend/db-models/db-models";
import {appContext} from "@backend/app-context";
import {buildGraphs, GraphNode} from "@backend/services/request-service/graph";
import {AiRequest} from "@backend/db-models/ai-request";
import {workerData} from "node:worker_threads";
import {logger} from "@backend/logger";

const getTagForTemplate = (template: AiQueryTemplate) => {
    return `query_${template.id}`;
}

const getRequestGraphs = async (agentId: number) => {
    const {templateService} = appContext;
    const templates = await templateService.loadTemplates({agent_id: agentId});
    return buildGraphs(templates);
}

const processGraphNode = async (
    node: GraphNode<AiQueryTemplate>,
    setId: number,
    context: Record<string, string>,
) => {
    const {aiService, templateService, aiRequestService} = appContext;

    for (const child of node.children) {
        const template = child.value;
        const isAlreadyDone = !!context[getTagForTemplate(template)];
        if (!template.text || isAlreadyDone) {
            continue;
        }

        await processGraphNode(child, setId, context);
    }

    const template = node.value;
    const request: Partial<AiRequest> = {
        request_set_id: setId,
        name: template.name,
        template: template.text,
        response: '',
        error: '',
    }

    try {
        const prompt = await templateService.processTemplate(template.text, context);
        request.prompt = prompt;

        const response = await aiService.sendMessage(prompt);
        context[getTagForTemplate(template)] = response?.text || '';
        if (response) {
            request.response = response.text;
            request.state = 'done';
        }
    } catch (error: any) {
        request.state = 'error';
        request.error = error.message;
    }
    await aiRequestService.saveRequest(request);
}

const run = async (agentId: number) => {
    const {aiRequestService} = appContext;
    const requestSet = await aiRequestService.saveRequestSet({agent_id: agentId, state: 'processing'});
    const context: Record<string, string> = {};

    try {
        const rootNodes = await getRequestGraphs(agentId);
        for (const node of rootNodes) {
            await processGraphNode(node, requestSet.id!, context);
        }
    } catch (error: any) {
        logger.error(error.message);
        aiRequestService.saveRequestSet({
            ...requestSet,
            state: 'error',
            error: error.message,
        });
        return;
    }

    aiRequestService.saveRequestSet({
        ...requestSet,
        state: 'done',
    });
}

(async () => {
    const {agentId} = workerData;
    console.log(`Running worker for agent with id ${agentId}`);
    try {
        await run(agentId);
    } catch (error: any) {
        console.log(error.message);
    }
})();
