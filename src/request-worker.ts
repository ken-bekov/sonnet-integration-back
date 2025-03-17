import {AiQueryTemplate} from "@backend/db-models/db-models";
import {appContext} from "@backend/app-context";
import {buildGraphs, GraphNode} from "@backend/services/request-service/graph";
import {AiRequest} from "@backend/db-models/ai-request";
import {workerData} from "node:worker_threads";

const logGraphNode = (node: GraphNode<AiQueryTemplate>, level = 0) => {
    console.log(`${'-'.repeat(level)}${node.value.name}`);
    node.children.forEach(child => {
        logGraphNode(child, level + 1);
    })
}

const createNewRequestSet = async (agentId: number) => {
    const {aiRequestService} = appContext;
    return aiRequestService.saveRequestSet({agent_id: agentId});
}

const getTagForTemplate = (template: AiQueryTemplate) => {
    return `query_${template.id}`;
}

const getRequestGraphs = async (agentId: number) => {
    const {templateService} = appContext;
    const templates = await templateService.loadTemplates({agent_id: agentId});
    return buildGraphs(
        templates,
        (referrer, template) => !!referrer.text?.includes(`{{${getTagForTemplate(template)}}}`),
    )
}

const saveRequest = async (request: Partial<AiRequest>) => {
    const {aiRequestService} = appContext;
    await aiRequestService.saveRequest(request);
}

const run = async (agentId: number) => {
    const requestSet = await createNewRequestSet(agentId);

    const {aiService, templateService} = appContext;
    const context: Record<string, string> = {};
    const processGraphNode = async (node: GraphNode<AiQueryTemplate>) => {
        for (const child of node.children) {
            const template = child.value;
            const isAlreadyDone = !!context[getTagForTemplate(template)];
            if (!template.text || isAlreadyDone) {
                continue;
            }

            await processGraphNode(child);
        }

        const template = node.value;
        const request: Partial<AiRequest> = {
            request_set_id: requestSet.id,
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
        await saveRequest(request);
    }

    const requestGraphs = await getRequestGraphs(agentId);
    requestGraphs.forEach(node => {
        processGraphNode(node);
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
