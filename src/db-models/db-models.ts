import {Model} from 'objection';
import {FrequencyMalfunction, NoFrequencyMalfunction} from "@backend/db-models/metrics";

export class MinionType extends Model {
    static get tableName() { return 'minion_types' }
}

export class TrendName extends Model {
    static get tableName() { return 'trend_names' }
}

export class Minion extends Model {
    static get tableName() { return 'minions' }

    static relationMappings = {
        type: {
            relation: Model.HasOneRelation,
            modelClass: MinionType,
            join: {
                from: 'minion_types.id',
                to: 'minions.type_id',
            }
        },
        trendNames: {
            relation: Model.HasManyRelation,
            modelClass: TrendName,
            join: {
                from: 'minions.id',
                to: 'trend_names.minion_id',
            }
        },
        dependentMalfunctions: {
            relation: Model.HasManyRelation,
            modelClass: FrequencyMalfunction,
            join: {
                from: 'minions.id',
                to: 'message_dependent.minion_id',
            }
        },
        independentMalfunctions: {
            relation: Model.HasManyRelation,
            modelClass: NoFrequencyMalfunction,
            join: {
                from: 'minions.id',
                to: 'message_independent.minion_id',
            }
        }
    }
}

export class Agent extends Model {
    static get tableName() { return 'agents' }

    static relationMappings = {
        minions: {
            relation: Model.HasManyRelation,
            modelClass: Minion,
            join: {
                from: 'agents.id',
                to: 'minions.agent_id',
            }
        }
    }
}

export class Factory extends Model {
    static get tableName() { return 'factories' }

    static relationMappings = {
        agents: {
            relation: Model.HasManyRelation,
            modelClass: Agent,
            join: {
                from: 'factories.id',
                to: 'agents.factory_id',
            }
        }
    }
}

export class Branch extends Model {
    static get tableName() { return 'branches' }

    static relationMappings = {
        factories: {
            relation: Model.HasManyRelation,
            modelClass: Factory,
            join: {
                from: 'branches.id',
                to: 'factories.branch_id',
            }
        }
    }
}

export class Company extends Model {
    static get tableName() { return 'companies' }

    static relationMappings = {
        branches: {
            relation: Model.HasManyRelation,
            modelClass: Branch,
            join: {
                from: 'companies.id',
                to: 'branches.company_id',
            }
        }
    }
}



export class AiQueryTemplate extends Model {
    static get tableName() { return 'ai_query_templates' }
    public name: string = '';
    public id?: number = 0;
    public agent_id: number = 0;
    public text: string = '';
    public modified_at: Date = new Date();
}
