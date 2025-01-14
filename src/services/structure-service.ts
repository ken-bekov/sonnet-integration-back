import {Company, Minion} from "@backend/db-models/db-models";

export class StructureService {
    async getClientsTree() {
        return Company.query()
            .select('companies.name', 'companies.id')
            .whereNull('companies.deleted_at')
            .withGraphFetched('branches.[factories.[agents.[minions.[type, trendNames]]]]')
            .modifyGraph('branches', builder => {
                builder
                    .select('id', 'name')
                    .whereNull('deleted_at');
            })
            .modifyGraph('branches.factories', builder => {
                builder
                    .select('id', 'name')
                    .whereNull('deleted_at')
            })
            .modifyGraph('branches.factories.agents', builder => {
                builder
                    .select('id', 'device_name')
                    .whereNull('deleted_at')
            })
            .modifyGraph('branches.factories.agents.minions', builder => {
                builder
                    .select('id')
            })
    }

    async getMinionsByAgentId(agentId: string) {
        return Minion.query()
            .withGraphFetched('trendNames')
            .withGraphFetched('type')
            .where('agent_id', agentId);
    }
}



