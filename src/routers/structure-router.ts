import express from 'express';
import {appContext} from '@backend/app-context';
import {asyncHandler} from '@backend/middlewares/async-handler';

export const router = express.Router();

router.get('/tree', asyncHandler(
    async (request, response) => {
        const {structureService} = appContext;
        const tree = await structureService.getClientsTree();
        response.json(tree);
    })
);

router.get('/agent/:id', asyncHandler(
    async (request, response) => {
        const {id} = request.params;

        const {structureService} = appContext;
        const agent = await structureService.getAgent(+id);
        if (agent) {
            response.json({
                agent
            });
            return;
        } else {
            response.status(404).json({
                status: 'error',
                message: 'Agent Not Found',
            });
            return;
        }
    })
);

router.get('/agent/:id/minion', asyncHandler(
    async (request, response) => {
        const {structureService} = appContext;
        const result = await structureService.getMinionsByAgentId(request.params.id);
        response.json({result});
    })
);