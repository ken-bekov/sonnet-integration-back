import express from 'express';
import {asyncHandler} from "backend/middlewares/async-handler";
import {appContext} from "backend/app-context";

export const aiRouter = express.Router();

aiRouter.post('/message', asyncHandler(async (request, response) => {
    const {message} = await request.body;
    const {aiService} = appContext;
    const answer = await aiService.sendMessage(message);
    response.json({
        answer,
    })
}))