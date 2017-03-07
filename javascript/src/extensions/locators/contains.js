import findByXPath from "../lib/xpath";
import log from "../../log";

export default {
    options: {
        "contains": {
            locate: function ({target, containerElements}) {
                let {label} = target;
                
                log.debug("Searching for text that contains:", label);

                return containerElements.reduce((result, containerElement) => result.concat(findByXPath(".//*[not(self::script) and not(self::noscript) and not(self::style) and text()]/../*[contains(translate(normalize-space(string(.)), 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'),translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", containerElement)), []);
            }
        }
    }
};