import Knex from 'knex';
import { Model } from 'objection';
import { StructureService } from './services/structure-service';
import {TemplateService} from "./routers/template/services/template-service";
import {AiService} from "@backend/services/ai-service";
import pino from "pino";
import pretty from "pino-pretty";

export const logger = pino(
    {level: process.env.APP_LOG_LEVEL || 'info', timestamp: false},
    pretty({translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l'})
);

const knex = Knex({
    dialect: 'mysql2',
    client: 'mysql2',
    pool: {
        max: 5
    },
    connection: {
        user: process.env.IDM_DB_USER,
        host: process.env.IDM_DB_HOST || 'localhost',
        password: process.env.IDM_DB_PASSWORD,
        database: 'idm',
    }
});

Model.knex(knex);

const structureService = new StructureService();
const templateService = new TemplateService();
const aiService = new AiService({
    apiKey: process.env.IDM_SONNET_API_KEY || '',
    maxTokens: 1024,
});

export interface AppContext {
    structureService: StructureService,
    templateService: TemplateService,
    knex: typeof knex,
    aiService: AiService,
}

export const appContext: AppContext = {
    structureService,
    templateService,
    knex,
    aiService,
}
