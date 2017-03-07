import dom from "../../../test/dom"
import extension from './exact-text';

describe("Locator: Exact Match", () => {
    let findExactText = extension.options["exact-text"].locate;

    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should find by exact text match", () => {
        dom.render(<div id="target">exact text</div>);

        findExactText({
            target: {label: "exact text"},
            containerElements: [document.body]
        }).should.deep.equal([dom.get("target")]);
    });

    it("should not find containing match", () => {
        dom.render(<div>not so exact text here</div>);

        findExactText({target: {label: "exact text"}, containerElements: [document.body]}).should.deep.equal([]);
    });

    it("should find more than one", () => {
        dom.render(<div>
            <div id="target-1">exact text</div>
            <div id="target-2">exact text</div>
        </div>);

        findExactText({
            target: {label: "exact text"},
            containerElements: [document.body]
        }).should.deep.equal(dom.get("target-1", "target-2"));
    })
});