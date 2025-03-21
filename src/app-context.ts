import {Model} from 'objection';
import {StructureService} from './services/structure-service';
import {TemplateService} from "./services/template-service/template-service";
import {AiService} from "@backend/services/ai-service";
import {knexInstance} from "@backend/knex-instance";
import {AiRequestService} from "@backend/services/request-service/ai-request-service";

Model.knex(knexInstance);

const structureService = new StructureService();
const templateService = new TemplateService();
const aiRequestService = new AiRequestService();

const maxTokens = process.env.IDM_SONNET_RESPONSE_MAX_TOKEN
    ? +process.env.IDM_SONNET_RESPONSE_MAX_TOKEN
    : 2048;

const aiService = new AiService({
    apiKey: process.env.IDM_SONNET_API_KEY || '',
    maxTokens,
});

export interface AppContext {
    structureService: StructureService,
    templateService: TemplateService,
    knex: typeof knexInstance,
    aiService: AiService,
    aiRequestService: AiRequestService,
}

export const appContext: AppContext = {
    structureService,
    templateService,
    knex: knexInstance,
    aiService,
    aiRequestService,
}
