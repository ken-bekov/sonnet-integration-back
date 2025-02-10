import {knexSnakeCaseMappers, Model, snakeCaseMappers} from "objection";

export class AiRequest extends Model{
    static get tableName() {
        return 'ai_request';
    }

    public id?: number;
    public name: string = '';
    public request_set_id?: number;
    public state: string = 'new';
    public template: string = ''
    public prompt: string = '';
    public response: string = '';
    public error: string = '';
    public start_time?: Date;
    public end_time?: Date;
}

export class AiRequestSet extends Model{
    static get tableName() {
        return 'ai_request_set';
    }

    public id?: number;
    public agent_id: number = 0;

    static relationMappings = {
        requests: {
            relation: Model.HasManyRelation,
            modelClass: AiRequest,
            join: {
                from: 'ai_request_set.id',
                to: 'ai_request.request_set_id',
            }
        }
    }
}
