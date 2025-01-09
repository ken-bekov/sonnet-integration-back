import express from "express";
import {asyncHandler} from "backend/middlewares/async-handler";
import {appContext} from "backend/app-context";
import {AIQueryTemplate} from "backend/db-models/db-models";

export const templateRouter = express.Router();

templateRouter.post('/result', asyncHandler(async (request, response) => {
    const {template, context} = request.body || {};

    if (!template) {
        throw new Error("No template was found.");
    }

    if (!context) {
        throw new Error("No context was found.");
    }

    const {templateService} = appContext;
    const result = await templateService.processTemplate(request.body.template, context);
    response.json({result});
}))

templateRouter.get('/:id', asyncHandler(async (request, response) => {
    const {id} = request.params;
    if (!id || Number.isNaN(+id)) {
        response.status(400).json({message: 'No id was found.'});
    }

    const {templateService} = appContext;
    const template = await templateService.loadTemplate(+id);
    response.json({template});
}))

templateRouter.get('/', asyncHandler(async (request, response) => {
    const {templateService} = appContext;

    const {agent_id} = request.query;

    const query: Partial<AIQueryTemplate> = {};
    agent_id && (query.agent_id = +agent_id);

    const templates = await templateService.loadTemplates(query);
    response.json({templates});
}))

templateRouter.put('/', asyncHandler(async (request, response) => {
    const {template} = request.body || {};
    if (!template) {
        response.status(400).json({message: 'No template was provided.'});
        return;
    }

    const {templateService} = appContext;
    const id = await templateService.saveTemplate({
        ...template,
        modified_at: new Date(),
    });
    response.json({id});
}))
