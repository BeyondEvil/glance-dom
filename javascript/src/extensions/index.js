export default class Extensions {
    constructor(extensions = []) {
        this.extensions = extensions;
    }

    add(extension) {
        this.extensions = this.extensions.concat(extension);
    }

    getLocatorForLabel(text) {
        let labels = Extensions.labels(this.extensions);
        let label = labels[text];
        return label ? this.getLocator(label.locate || label) : () => [];
    }

    getLocatorForOption(name, label) {
        let options = Extensions.options(this.extensions);
        let option = options[name];

        return option ? this.getLocator(option.locate) : this.getDynamicLocator(name, label);
    }

    getDynamicLocator(option, label) {
        let catchAlls = this.extensions.filter(e => e.locator ? e.locator.check({label, option}) : false)
            .map(e => e.locator.locate);

        if (catchAlls.length > 0) {
            return (data) => catchAlls.reduce((result, locate) => result.concat(locate(data)), []);
        }
    }

    getLocator(locator) {
        if (Object.prototype.toString.call(locator) === '[object Array]') {
            return ({glanceSelector}) => locator.reduce((result, label) => result.concat(glanceSelector(label), []) , []);
        }
        else if (typeof(locator) === 'string') {
            return ({glanceSelector}) => glanceSelector(locator);
        }
        else if (typeof(locator) === 'function') {
            return locator;
        }

        return () => [];
    }

    getFilterForOption(name, label) {
        let options = Extensions.options(this.extensions);
        let option = options[name];

        if (option)
            return typeof(option) === 'function' ? option : option.filter;
        else
            return this.getDynamicFilter(name, label);
    }

    getDynamicFilter(option, label) {
        let catchAlls = this.extensions.filter(e => e.filter ? e.filter.check({label, option}) : false)
            .map(e => e.filter.filter);

        if (catchAlls.length > 0) {
            return (data) => catchAlls.reduce((result, filter) => result.concat(filter(data)), []);
        }
    }

    getExtensions() {
        return this.extensions;
    }

    getLabels() {
        return Extensions.labels(this.extensions);
    }

    getOptions() {
        return Extensions.options(this.extensions);
    }

    static beforeScopeEvent(data, extensions) {
        return extensions.filter(e => e.beforeScope).forEach(e => e.beforeScope(data));
    }

    static afterScopeEvent(data, extensions) {
        return extensions.filter(e => e.afterScope).forEach(e => e.afterScope(data));
    }

    static labels(extensions) {
        return extensions
            .filter(e => e.labels)
            .reduce((l, e) => Object.assign(l, e.labels), {});
    }

    static options(extensions) {
        return extensions
            .filter(e => e.options)
            .reduce((l, e) => Object.assign(l, e.options), {});
    }
};