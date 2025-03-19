import {AiQueryTemplate} from "@backend/db-models/db-models";

interface CheckReferFunc <T>{
    (referrer:T, item: T ): boolean;
}

export interface GraphNode <T> {
    value: T;
    children: GraphNode<T>[];
}

const refExp = /\{\{query_\d+}}/g;

const extractRefs = (text: string) => {
    const result = [];
    let ref = refExp.exec(text);
    while(ref) {
        result.push(ref[0]);
        ref = refExp.exec(text);
    }
    return result;
}

const checkForCycleRef = (root: GraphNode<AiQueryTemplate>) => {
    const visitedNodes = new Set()

    const check = (node: GraphNode<AiQueryTemplate>, path: string) => {
        for (const child of node.children) {
            if (root === child) {
                throw new Error(`Cycle reference detected ${path}->${child.value.id}`);
            } else {
                visitedNodes.add(child);
                check(child, `${path}->${child.value.id}`);
            }
        }
    }

    check(root, `${root.value.id}`);
}

export const buildGraphs = (templates:AiQueryTemplate[]): GraphNode<AiQueryTemplate>[] => {
    const itemToNode = (value: AiQueryTemplate): GraphNode<AiQueryTemplate> => ({
        children: [],
        value,
    })

    const nodes = templates.map(template => itemToNode(template));
    const rootNodes = new Set(nodes);
    for (const node of nodes) {
        const refs = extractRefs(node.value.text);
        for (const ref of refs) {
            const childNode = nodes.find(childNode => `{{query_${childNode.value.text}}}` === ref);
            if (childNode) {
                node.children.push(childNode);
                checkForCycleRef(childNode);
                rootNodes.delete(childNode);
            }
        }
    }
    return [...rootNodes];
}
