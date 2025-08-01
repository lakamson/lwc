/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// Must be first so that later exports take precedence
export * from './stubs';

export {
    htmlEscape,
    setHooks,
    sanitizeHtmlContent,
    normalizeClass,
    normalizeTabIndex,
    setContextKeys,
    setTrustedSignalSet,
    setTrustedContextSet,
    addTrustedContext as __dangerous_do_not_use_addTrustedContext,
    isTrustedSignal,
} from '@lwc/shared';

export { SignalBaseClass } from '@lwc/signals';

export { setFeatureFlag, setFeatureFlagForTest } from '@lwc/features';

export { ClassList } from './class-list';
export {
    LightningElement,
    LightningElementConstructor,
    SYMBOL__DEFAULT_TEMPLATE,
    SYMBOL__GENERATE_MARKUP,
    SYMBOL__SET_INTERNALS,
} from './lightning-element';
export { mutationTracker } from './mutation-tracker';
export {
    fallbackTmpl,
    fallbackTmplNoYield,
    GenerateMarkupAsyncYield,
    renderAttrs,
    renderAttrsNoYield,
    addSlottedContent,
    serverSideRenderComponent,
    // renderComponent is an alias for serverSideRenderComponent
    serverSideRenderComponent as renderComponent,
} from './render';
export { normalizeTextContent, renderTextContent } from './render-text-content';
export { hasScopedStaticStylesheets, renderStylesheets } from './styles';
export { toIteratorDirective } from './to-iterator-directive';
export { validateStyleTextContents } from './validate-style-text-contents';
export { createContextProvider, establishContextfulRelationship, connectContext } from './wire';
export { readonly } from './get-read-only-proxy';
