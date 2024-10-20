/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { inspect } from 'util';

import { Comment } from './comment';
import { Component } from './component';
import { Element } from './element';
import { ForEach } from './for-each';
import { ForOf } from './for-of';
import { If, IfBlock } from './if';
import { Text } from './text';
import { createNewContext } from './context';

import type {
    ChildNode as IrChildNode,
    Node as IrNode,
    Root as IrRoot,
} from '@lwc/template-compiler';
import type { Statement as EsStatement } from 'estree';
import type { TemplateOpts, Transformer, TransformerContext } from './types';

const Root: Transformer<IrRoot> = function Root(node, cxt): EsStatement[] {
    return irChildrenToEs(node.children, cxt);
};

type Transformers = {
    [K in IrNode['type']]: IrNode extends infer T
        ? T extends IrNode & { type: K }
            ? Transformer<T>
            : never
        : never;
};

const defaultTransformer: Transformer = (node: IrNode) => {
    throw new Error(`Unimplemented IR node: ${inspect(node)}`);
};

const transformers: Transformers = {
    Comment,
    Component,
    Element,
    ExternalComponent: Element,
    ForEach,
    ForOf,
    If,
    IfBlock,
    Root,
    Text,
    // lwc:elseif cannot exist without an lwc:if (IfBlock); this gets handled by that transformer
    ElseifBlock: defaultTransformer,
    // lwc:elseif cannot exist without an lwc:elseif (IfBlock); this gets handled by that transformer
    ElseBlock: defaultTransformer,
    ScopedSlotFragment: defaultTransformer,
    Slot: Element,
    Lwc: defaultTransformer,
};

export function irChildrenToEs(children: IrChildNode[], cxt: TransformerContext): EsStatement[] {
    const result = children.flatMap((child, idx) => {
        cxt.prevSibling = children[idx - 1];
        cxt.nextSibling = children[idx + 1];
        return irToEs(child, cxt);
    });
    cxt.prevSibling = undefined;
    cxt.nextSibling = undefined;
    return result;
}

export function irToEs<T extends IrNode>(node: T, cxt: TransformerContext): EsStatement[] {
    const transformer = transformers[node.type] as Transformer<T>;
    return transformer(node, cxt);
}

export function templateIrToEsTree(node: IrNode, contextOpts: TemplateOpts) {
    const { hoisted, cxt } = createNewContext(contextOpts);
    const statements = irToEs(node, cxt);
    return {
        hoisted: hoisted.values(),
        statements,
    };
}
