import { BindableObjectModule } from "./bindableObjectModule";
import { FileOperationModule } from "./fileOperationModule";
import { PointerContentModule } from "./pointerContentModule";

export class PageRenderEngine {

    private _fileOperationModule: FileOperationModule = new FileOperationModule();
    private _pointerContentModule: PointerContentModule = new PointerContentModule();
    private _bindableObjectModule: BindableObjectModule = new BindableObjectModule();

    /**
     *
     */
    constructor() {
    }

    RenderPage<T>(pageModel: T): string {
        const contentPath = (pageModel as any).prototype["ContentPath"];
        const content = this._fileOperationModule.ReadFile(contentPath);
        const pointeredContent = this._pointerContentModule.PointerContent(content);
        return this._bindableObjectModule.RenderContent(pointeredContent, pageModel);
    }
}