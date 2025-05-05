import { TemplateRef } from "./htmlEngine";

export class BindableVariableError extends Error {

    public ErrorRowIndex: number = 0;
    public ErrorStartColIndex: number = 0;
    public ErrorEndColIndex: number = 0;
    public ErrorCodePath?: string;
    public TemplateRef: TemplateRef;
    
    /**
     *
     */
    constructor(templateRef: TemplateRef) {
        super(`Variable ${templateRef.PathName} is not found in the model object`);
        this.ErrorStartColIndex = templateRef.StartedColIndex ?? 0;
        this.ErrorEndColIndex = templateRef.EndedColIndex ?? 0;
        this.ErrorRowIndex = templateRef.RowIndex ?? 0;
        this.TemplateRef = templateRef;
    }
}