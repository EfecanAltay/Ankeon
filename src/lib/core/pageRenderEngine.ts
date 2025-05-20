import { BindableObjectModule } from "./bindableObjectModule";
import { PointerContentModule } from "./pointerContentModule";

export class PageRenderEngine {


    private _pointerContentModule: PointerContentModule = new PointerContentModule();
    private _bindableObjectModule: BindableObjectModule = new BindableObjectModule();

    /**
     *
     */
    constructor() {
    }

    RenderPage<T>(pageModel: T): string {
        const pointeredContent = this._pointerContentModule.PointerContent(pageModel);
        return this._bindableObjectModule.RenderContent(pointeredContent, pageModel);
    }
}