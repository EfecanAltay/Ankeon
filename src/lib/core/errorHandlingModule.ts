import { FileOperationModule } from './fileOperationModule';
import { BindableVariableError } from './bindableVariableError';
import { PointerContentModule } from './pointerContentModule';
import { BindableObjectModule } from './bindableObjectModule';
import { ErrorPage } from '../simple/errorPage';

export class ErrorHandlingModule {

    private _fileOperationModule: FileOperationModule;
    private _pointerContentModule: PointerContentModule;
    private _bindableObjectModule: BindableObjectModule;

    // Reading Error Template

    /**
     *
     */
    constructor(
        fileOperationModule: FileOperationModule,
        pointerContentModule: PointerContentModule,
        bindableObjectModule: BindableObjectModule
    ) {
        this._fileOperationModule = fileOperationModule;
        this._pointerContentModule = pointerContentModule;
        this._bindableObjectModule = bindableObjectModule;
    }

    public RenderErrorTemplate(error: any): string {
        const errorPage = new ErrorPage(error);
        const contentPath = (errorPage as any).prototype["ContentPath"];
        const content = this._fileOperationModule.ReadFile(contentPath);
        const pointeredContent = this._pointerContentModule.PointerContent(content);
        return this._bindableObjectModule.RenderContent(pointeredContent, errorPage);
    }
}

export class ErrorMessage {
    public ErrorCode: string;
    public ErrorMessage: string;
    public ErrorStack?: string;
    public ErrorDate: Date;
    public ErrorRowIndex?: number;
    public ErrorColIndex?: number;
    public ErrorCodePath?: string;

    constructor(err: BindableVariableError) {
        if (err instanceof BindableVariableError) {
            this.ErrorCode = "ERR01";
            this.ErrorMessage = err.message;
            this.ErrorStack = err.stack;
            this.ErrorDate = new Date();
            this.ErrorRowIndex = err.ErrorRowIndex;
            this.ErrorColIndex = err.ErrorStartColIndex;
            this.ErrorCodePath = err.ErrorCodePath;
        }
        else {
            this.ErrorCode = "ERR02";
            this.ErrorMessage = "Unknown error occurred";
            this.ErrorStack = "Unknown error occurred";
            this.ErrorDate = new Date();
            this.ErrorRowIndex = 0;
            this.ErrorColIndex = 0;
            this.ErrorCodePath = "";
        }
    }
}