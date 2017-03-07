import dom from "../../../test/dom"
import extension from './node-type';

describe("Locator: Exact Match", () => {
    let findByNodeType = extension.options["node-type"].locate;

    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should find by node type", () => {
        dom.render(<p id="subject"></p>);

        findByNodeType({
            target: {label: "p"},
            containerElements: [document.body]
        }).should.deep.equal([dom.get("subject")]);
    });

    it("should not find by node type", () => {
        dom.render(<span></span>);

        findByNodeType({target: {label: "p"}, containerElements: [document.body]}).should.deep.equal([]);
    });
});