import Handlebars from "handlebars";
import {loadTrends} from "./value-providers/trend-provider";
import {AIQueryTemplate} from "backend/db-models/db-models";

export class TemplateService {
    async processTemplate(templateContent: string, context: object) {
        if (!templateContent) {
            return '';
        }

        const asyncValues: Record<string, any> = {};
        const promises: Promise<any>[] = [];

        const createAsyncHelper = (provider: Function) => {
            return (...args: any[]) => {
                const context = args[args.length - 1];
                const valueId =
                    context.name + args.reduce((result: string, arg: any) => `${result}.${arg}`, '');
                if (asyncValues[valueId]) {
                    return asyncValues[valueId];
                }
                const promise = provider(...args).then((result: any) => asyncValues[valueId] = result);
                promises.push(promise);
                return null;
            }
        }

        const options = {
            helpers: {
                'trend': createAsyncHelper(loadTrends)
            }
        }

        const template = Handlebars.compile(templateContent);
        template(context, options);
        await Promise.all(promises);
        return template(context, options);
    }

    async loadTemplates(query: Partial<AIQueryTemplate>) {
        return AIQueryTemplate.query().where(query);
    }
    
    async loadTemplate(templateId: number) {
        return AIQueryTemplate.query().where('id', templateId);
    }

    async saveTemplate(template: Partial<AIQueryTemplate>) {
        if (template.id) {
            await AIQueryTemplate.query().patch(template).where('id', template.id);
            return template.id;
        } else {
            const result = await AIQueryTemplate.query().insert(template);
            return result.id;
        }
    }
}