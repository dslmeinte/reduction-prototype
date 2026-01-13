import { asTreeTextWith, INodeBase } from "@lionweb/class-core"
import { idOf } from "@lionweb/core"

/**
 * @return the tree-based textualization of the given {@link INodeBase nodes}.
 * This is primarily for testing convenience!
 */
export const asTreeText = (...nodes: INodeBase[]) => asTreeTextWith(idOf)(nodes)

