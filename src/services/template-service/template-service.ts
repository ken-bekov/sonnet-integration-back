import Handlebars from "handlebars";
import {loadTrends} from "./value-providers/trend-provider";
import {AiQueryTemplate} from "@backend/db-models/db-models";
import {loadSpectreTrends} from "@backend/services/template-service/value-providers/spectre-trend-provider";

const createAsyncHelper = (
    providerFunc: Function,
    valuesCache: Record<string, any>,
    promises: Promise<any>[],
) => {
    return (...args: any[]) => {
        const context = args[args.length - 1];
        const valueId =
            context.name + args.reduce((result: string, arg: any) => `${result}.${arg}`, '');
        if (valuesCache[valueId]) {
            return valuesCache[valueId];
        }
        const promise = providerFunc(...args).then((result: any) => valuesCache[valueId] = result);
        promises.push(promise);
        return null;
    }
}

export class TemplateService {
    async processTemplate(templateContent: string, context: object) {
        if (!templateContent) {
            return '';
        }

        const asyncValues: Record<string, any> = {};
        const promises: Promise<any>[] = [];

        const options = {
            helpers: {
                'trend': createAsyncHelper(loadTrends, asyncValues, promises),
                'spectre-trend': createAsyncHelper(loadSpectreTrends, asyncValues, promises),
            }
        }

        const template = Handlebars.compile(templateContent);
        template(context, options);
        await Promise.all(promises);
        return template(context, options);
    }

    async processTemplateSet(templateContent: AiQueryTemplate[], context: object) {

    }

    async loadTemplates(query: Partial<AiQueryTemplate>) {
        return AiQueryTemplate.query().where(query);
    }

    async loadTemplate(templateId: number) {
        return AiQueryTemplate.query().where('id', templateId);
    }

    async saveTemplate(template: Partial<AiQueryTemplate>) {
        if (template.id) {
            await AiQueryTemplate.query().patch(template).where('id', template.id);
            return template.id;
        } else {
            const result = await AiQueryTemplate.query().insert(template);
            return result.id;
        }
    }

    async createTemplateForAgent(template: Partial<AiQueryTemplate>) {
        const result = await AiQueryTemplate.query().insert(template);
        return result.id;
    }

    async deleteTemplate(id: string) {
        await AiQueryTemplate.query().delete().where('id', id);
    }
}
