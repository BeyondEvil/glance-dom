import Extensions from '../extensions';
import Preprocessor from './locator-preprocessor';

let extensions = new Extensions([{
    options: {
        'default-locator-1': {
            locate: 'custom'
        }
    }
}]);

let defaultOptions = ['default-locator-1'];

describe('Preprocessor: locators', () => {
    it('should support no options', () => {
        let preprocessor = new Preprocessor();
        preprocessor.extensions.extensions.length.should.equal(0);
        preprocessor.defaultOptions.length.should.equal(0);
    });

    it('should have no default extensions or options', () => {
        let preprocessor = new Preprocessor({});
        preprocessor.extensions.extensions.length.should.equal(0);
        preprocessor.defaultOptions.length.should.equal(0);
    });

    it('should apply default locators', () => {
        let preprocessor = new Preprocessor({extensions, defaultOptions});

        let commands = preprocessor.getLocatorCommands({label: 'subject', options: []});

        commands.should.deep.equal([{command: 'locate', label: 'subject', option: 'default-locator-1'}]);
    });

    it('should not apply option without locator', () => {
        let customExtension = {
            options: {
                'custom-filter': () => {
                }
            }
        };

        extensions.add(customExtension);

        let preprocessor = new Preprocessor({extensions, defaultOptions});

        let commands = preprocessor.getLocatorCommands({label: 'subject', options: ['custom-locator']});

        commands.should.deep.equal([{command: 'locate', label: 'subject', option: 'default-locator-1'}]);
    });

    it('should apply additional locator by option', () => {
        let customExtension = {
            options: {
                'custom-locator': {
                    locate: 'custom'
                }
            }
        };

        extensions.add(customExtension);

        let preprocessor = new Preprocessor({extensions, defaultOptions});

        let commands = preprocessor.getLocatorCommands({label: 'subject', options: ['custom-locator']});

        commands.should.deep.equal([
            {command: 'locate', label: 'subject', option: 'default-locator-1'},
            {command: 'locate', label: 'subject', option: 'custom-locator'}
        ]);
    });

    it('should apply custom label locator with defaults', () => {
        extensions.add({
            labels: {
                'custom-label': 'custom'
            }
        });

        let preprocessor = new Preprocessor({extensions, defaultOptions});

        let commands = preprocessor.getLocatorCommands({label: 'custom-label', options: []});

        commands.should.deep.equal([
            {command: 'locate', label: 'custom-label', option: 'custom-label'},
            {command: 'locate', label: 'custom-label', option: 'default-locator-1'}]);
    });

    it('should apply dynamic locator with defaults', () => {
        extensions.add({
            locator: {
                check: () => true,
                locate: () => {
                }
            }
        });

        let preprocessor = new Preprocessor({extensions, defaultOptions});

        let commands = preprocessor.getLocatorCommands({label: 'subject', options: ['dynamic']});

        commands.should.deep.equal([
            {command: 'locate', label: 'subject', option: 'default-locator-1'},
            {command: 'locate', label: 'subject', option: 'dynamic'}
        ]);
    });
});
