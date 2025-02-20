import {Model} from "objection";

export class Trend extends Model {
    static get tableName() {
        return 'trends';
    }

    public time: number = 0;
    public avg: number = 0;
    public min: number = 0;
    public max: number = 0;
}

export class SpectreTrendName extends Model {
    static get tableName() {
        return 'trend_specter_names';
    }

    public minion_id: number = 0;
    public name: string = '';
}

export interface SpectreTrend {
    time: number;
    avg: number;
    min: number;
    max: number;
}

export class FrequencyMalfunction extends Model {
    static get tableName() {
        return 'message_dependent';
    }

    public channel: string = '';
    public type: string = '';
    public name: string = '';
    public text: string = '';
    public minion_id: number = 0;
}

export class NoFrequencyMalfunction extends Model {
    static get tableName() {
        return 'message_independent';
    }

    public channel: string = '';
    public type: string = '';
    public name: string = '';
    public text: string = '';
}
