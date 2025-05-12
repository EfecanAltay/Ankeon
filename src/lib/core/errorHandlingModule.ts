import { BindableVariableError } from './bindableVariableError';
import { ErrorPage } from '../simple/errorPage';
import { PageRenderEngine } from './pageRenderEngine';

export class ErrorHandlingModule {

    /**
     *
     */
    constructor(
        private _pageRenderEngine: PageRenderEngine = new PageRenderEngine()) {
    }

    public RenderErrorTemplate(error: any): string {
        const errorPage = new ErrorPage(error);
        return this._pageRenderEngine.RenderPage(errorPage);
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