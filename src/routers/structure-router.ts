import express from 'express';
import {appContext} from '@backend/app-context';
import { asyncHandler } from '@backend/middlewares/async-handler';

export const structureRouter = express.Router();

structureRouter.get('/tree', asyncHandler(
    async (request, response) => {
        const {structureService} = appContext;
        const tree = await structureService.getClientsTree();
        response.json(tree);
    })
);

structureRouter.get('/agent/:id/minion', asyncHandler(
    async (request, response) => {
        const {structureService} = appContext;
        const result = await structureService.getMinionsByAgentId(request.params.id);
        response.json({result});
    })
)