interface CheckReferFunc <T>{
    (referrer:T, item: T ): boolean;
}

export interface GraphNode <T> {
    value: T;
    children: GraphNode<T>[];
}

export const buildGraphs = <T>(templates:T[], refersFn:CheckReferFunc<T>): GraphNode<T>[] => {
    const itemToNode = (value: T): GraphNode<T> => ({
        children: [],
        value,
    })

    const nodes = templates
        .filter(item => !templates.some(referrer => refersFn(referrer, item)))
        .map(itemToNode);

    const traversingSet = new Set();

    const addChildren = (node: GraphNode<T>) => {
        traversingSet.add(node);

        if (refersFn(node.value, node.value)) {
            throw Error(`One of the nodes referrers itself`);
        }

        node.children = templates
            .filter(item => refersFn(node.value, item))
            .map(itemToNode);

        node.children.forEach((child: GraphNode<T>) => {
            if (traversingSet.has(child.value)) {
                throw Error('Cycle reference detected');
            }
        })

        for (const child of node.children) {
            addChildren(child);
        }
        traversingSet.delete(node.value);
    }

    for (const node of nodes) {
        addChildren(node);
    }

    return nodes;
}