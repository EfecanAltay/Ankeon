import { randomUUID } from "crypto";
import { FileOperationModule } from "./fileOperationModule";
import { PointerContentModule } from "./pointerContentModule";
import { BindableObjectModule } from "./bindableObjectModule";
import * as path from 'path';
import { ErrorHandlingModule, ErrorMessage } from "./errorHandlingModule";
import { BindableVariableError } from "./bindableVariableError";

export class HTMLEngine {

    private _fileOperationModule: FileOperationModule = new FileOperationModule();
    private _pointerContentModule: PointerContentModule = new PointerContentModule();
    private _bindableObjectModule: BindableObjectModule = new BindableObjectModule();
    private _errorHandlingModule: ErrorHandlingModule = new ErrorHandlingModule(this._fileOperationModule);

    // Reading HTML file
    private errorContent = this._fileOperationModule.ReadFile(path.join(__dirname, "../simple/error.html"));

    public RenderHTML<T>(htmlPath: string, modelObj: T): string {
        try {

            // Reading HTML file
            const readingContent = this._fileOperationModule.ReadFile(path.join(__dirname, htmlPath));

            // Detecting the HTML content
            const pointeredContent = this._pointerContentModule.PointerContent(readingContent);

            // Detecting the HTML content
            const resultContent = this._bindableObjectModule.RenderContent(pointeredContent, modelObj);

            return resultContent;
        }
        catch (error) {
            return this.RenderErrorTemplate(error); 
        }
    }

    public RenderErrorTemplate(error: any): string {  
        // Detecting the HTML content
        const pointeredContent = this._pointerContentModule.PointerContent(this.errorContent);
        const errMessage = new ErrorMessage(error);
        return this._bindableObjectModule.RenderContent(pointeredContent, errMessage);
    }

    public TemplateRefMap: Map<string, HTMLTemlateInfo> = new Map<string, HTMLTemlateInfo>();
}

export class BindableObject {
    private props: BindableVariable[] = [];
    RowIndex: number = 0;
    ColumnIndex: number = 0;

    public GetProperty(propertyPath: string): BindableVariable | undefined {
        return this.props.find((item) => item.VariablePath === propertyPath);
    }

    public GetPropertyWithIndex(propertyIndex: number): BindableVariable | undefined {
        return this.props.at(propertyIndex);
    }

    /**
     * 
     */
    constructor(props: BindableVariable[] = []) {
        this.props = props;
    }
}

export class BindableVariable {
    public VariableName: string;
    public VariablePath: string | undefined;
    public VariableValue: any;
    public IsBindable: boolean = false;
    public RowIndex: number = 0;
    public ColumnIndex: number = 0;

    constructor(variableName: string, variablePath?: string, variableValue?: any) {
        this.VariableValue = variableValue;
        this.VariableName = variableName;
        this.VariablePath = variablePath;
    }
}

export class TemplateRef {
    public Id: string;
    public DetectedContent: string;
    public FormatType: EHTMLFormatTypes;
    public PathName: string;

    public FORConditionPath: string | undefined;
    public FORContentPath: string | undefined;
    public InnerTempleteInfo: HTMLTemlateInfo | undefined;

    public RowIndex: number = 0;

    public StartedColIndex: number = 0;
    public EndedColIndex: number = 0;

    /**
     *  CTOR
     */
    constructor(detectedContent: string, formatType: EHTMLFormatTypes, ...details: any[]) {
        this.DetectedContent = detectedContent;
        this.FormatType = formatType;
        this.Id = randomUUID().toString();
        this.PathName = details[0];
        switch (formatType) {
            case EHTMLFormatTypes.VARIABLE:
                this.RowIndex = details[1];
                this.StartedColIndex = details[2];
                this.EndedColIndex = details[3];
                break;
            case EHTMLFormatTypes.FOR:
                this.FORConditionPath = details[1];
                this.FORContentPath = details[2];
                this.RowIndex = details[3];
                this.StartedColIndex = details[4];
                this.EndedColIndex = details[5];
                break;
        }
    }

    toString() {
        return `<!--₺${this.getFormatTypeSign()}${this.Id}-->`;
    }

    private getFormatTypeSign(): string {
        switch (this.FormatType) {
            case EHTMLFormatTypes.VARIABLE:
                return "V";
            case EHTMLFormatTypes.FOR:
                return "F";
            case EHTMLFormatTypes.IF:
                return "I";
            default:
                return "NONE";
        }
    }
}

export class HTMLTemlateInfo {
    templateList: TemplateRef[] = [];
    outContent: string = "";
    inContent: string = "";
    isArray: boolean = false;
    ArrayItemName: string | undefined = undefined;
}

export class HTMLFormatType {
    public Type: EHTMLFormatTypes;
    public ContentCode: string;
    /**
     *
     */
    constructor() {
        this.Type = EHTMLFormatTypes.VARIABLE;
        this.ContentCode = "₺₺";
    }
}

export enum EHTMLFormatTypes {
    VARIABLE,
    FOR,
    IF,
    ELSE,
    ELSEIF,
    SWITCH,
    CASE,
    DEFAULT,
    BREAK,
    CONTINUE,
    WHILE,
    DO
}