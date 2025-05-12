import { BindableVariableError } from "../core/bindableVariableError";
import { PageModel } from "../core/decorators";

@PageModel("./errorPage.html", __dirname)
export class ErrorPage {
    public ErrorCode: string;
    public ErrorMessage: string;
    public ErrorStack?: string;
    public ErrorDate: Date;
    public ErrorRowIndex? : number;
    public ErrorColIndex? : number;
    public ErrorCodePath? : string;

    constructor(err : BindableVariableError) {
        if(err instanceof BindableVariableError) {
            this.ErrorCode = "ERR01";
            this.ErrorMessage = err.message;
            this.ErrorStack = err.stack;
            this.ErrorDate = new Date();
            this.ErrorRowIndex = err.ErrorRowIndex;
            this.ErrorColIndex = err.ErrorStartColIndex;  
            this.ErrorCodePath = err.ErrorCodePath;
        } 
        else{
            this.ErrorCode = "ERR02";
            this.ErrorMessage = "Unknown error occurred";
            this.ErrorStack = "Unknown error occurred";
            this.ErrorDate = new Date();
            this.ErrorRowIndex = 0;
            this.ErrorColIndex = 0;
            this.ErrorCodePath = "";
        }
    }

    public GetErrorCode() : string {
        return this.ErrorCode;
    }
}