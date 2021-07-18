import { ReOrder } from '../../models/re-order';


export class ArrayUtils {

    static reOrderInput(content: ReOrder[], contentsOrg: string[]): ReOrder[] {
        // Find first occurence of change and last item affected.
        let startIndex: number = null;
        let endIndex = 0;
        let subSet: ReOrder[] = [];

        content.forEach((category, index: number) => {
            if (contentsOrg[index] !== category.id) {
                if (startIndex === null) {
                    startIndex = index;
                }
                endIndex = index + 1;
            }
        });
        // Find Max sort order in the affected region found on the prvious loop
        let maxSortOrder = 0;
        if (endIndex > 0) {
            subSet = content.slice(startIndex, endIndex);
            subSet.forEach((value: ReOrder) => {
                if (value.sort_order > maxSortOrder) {
                    maxSortOrder = value.sort_order;
                }
            });
        }
        return subSet.map((value: ReOrder) => new ReOrder(value.id, maxSortOrder--))
    }
}

