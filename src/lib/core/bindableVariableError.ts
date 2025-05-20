import { TemplateRef } from "./htmlEngine";

export class BindableVariableError extends Error {

    public ErrorTitle: string = "Bindable Property Error";
    public ErrorDesc: string = "";
    public ErrorRowIndex: number = 0;
    public ErrorStartColIndex: number = 0;
    public ErrorEndColIndex: number = 0;
    public ErrorCodePath?: string;
    public TemplateRef: TemplateRef;

    /**
     *
     */
    constructor(templateRef: TemplateRef, filePath: string = "") {
        super(`[bindable module] ${templateRef.PathName} is not found in the model object
            ${filePath}:${templateRef.RowIndex+1}:${templateRef.StartedColIndex+1}`);
        this.ErrorDesc = `Variable ${templateRef.PathName} is not found in the model object`;
        this.ErrorStartColIndex = templateRef.StartedColIndex ?? 0;
        this.ErrorEndColIndex = templateRef.EndedColIndex ?? 0;
        this.ErrorRowIndex = templateRef.RowIndex ?? 0;
        this.TemplateRef = templateRef;
    }
}