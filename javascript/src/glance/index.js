import Preprocessor from '../command-queue/preprocessor';
import Extensions from '../extensions';
import DefaultExtensions from '../extensions/default';
import DefaultOptions from '../default-options';
import processCommands from './processor';
import requiredParameter from '../utils/required-parameter';
import Parser from 'glance-parser';
import log from '../utils/log';

function createglanceDOM() {
    this.extensions = new Extensions(DefaultExtensions);
    this.selector = (reference = requiredParameter('Selector required'), config = {}) => {
        let {containerElements = [document.documentElement]} = config;

        let preprocessor = new Preprocessor({extensions: this.extensions, defaultOptions: DefaultOptions});

        let commands = preprocessor.create(reference);

        return processCommands({commands, extensions: this.extensions, glanceDOM: this.selector, containerElements, reference});
    };

    this.selector.addExtension = (extension) => {
        this.extensions.add(extension);
    };

    this.selector.setLogLevel = (level) => {
        log.setLogLevel(level);
    };

    return this.selector;
}

export default new createglanceDOM();
export {Parser, DefaultExtensions, DefaultOptions};