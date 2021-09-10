import { createElement } from 'lwc';

import Shadow from 'x/shadow';
import Light from 'x/light';

describe('lwc:render-mode', () => {
    it('should throw error if shadow template is passed to light component', () => {
        expect(() => {
            const root = createElement('x-test', { is: Light });
            document.body.appendChild(root);
        }).toThrowError(
            /Light DOM components can't render shadow DOM templates. Add an 'lwc:render-mode="light"' directive on the root template tag./
        );
    });
    it('should throw error if light template is passed to shadow component', () => {
        expect(() => {
            const root = createElement('x-test', { is: Shadow });
            document.body.appendChild(root);
        }).toThrowError(
            /Shadow DOM components template can't render light DOM templates. Either remove the 'lwc:render-mode' directive or set it to 'lwc:render-mode="shadow"/
        );
    });
});
