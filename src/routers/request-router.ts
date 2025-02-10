import express from 'express';
import {asyncHandler} from "@backend/middlewares/async-handler";
import {appContext} from "@backend/app-context";

export const router = express.Router();

router.post('/', asyncHandler(async (request, response) => {
    const {agentId} = request.body;

    if (!agentId) {
        response.status(400).json({
            status: 'error',
            message: 'No agent id provided',
        });
    }

    const {aiRequestService} = appContext;
    await aiRequestService.runRequestSet(+agentId);
    response.sendStatus(200);
}));

router.get('/set', asyncHandler(async (request, response) => {
    const {agentId} = request.query;

    if (!agentId) {
        response.status(400).json({
            status: 'error',
            message: 'No agent id provided',
        });
        return;
    }

    const {aiRequestService} = appContext;
    const requestSets = await aiRequestService.getRequestSets(+agentId);
    response.json({
        requestSets,
    });
}))