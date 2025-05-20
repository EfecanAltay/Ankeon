import { randomUUID } from "crypto";
import { FileOperationModule } from "./fileOperationModule";
import { PointerContentModule } from "./pointerContentModule";
import { BindableObjectModule } from "./bindableObjectModule";
import * as path from 'path';
import { ErrorHandlingModule } from "./errorHandlingModule";
import { PageRenderEngine } from "./pageRenderEngine";
import { isFunction } from "util";

export class HTMLEngine {

    private _pageRenderEngine: PageRenderEngine = new PageRenderEngine();
    private _errorHandlingModule: ErrorHandlingModule = new ErrorHandlingModule(this._pageRenderEngine);

    public RenderHTML<T>(modelObj: T): string {
        try {
            return this._pageRenderEngine.RenderPage(modelObj);
        }
        catch (error) {
            return this._errorHandlingModule.RenderErrorTemplate(error);
        }
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
             case EHTMLFormatTypes.FUNCTIONCALL:
                this.RowIndex = details[1];
                this.StartedColIndex = details[2];
                this.EndedColIndex = details[3];
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
    public FilePath: string = "";
    templateList: TemplateRef[] = [];
    outContent: string = "";
    inContent: string = "";
    isArray: boolean = false;
    isFunction: boolean = false;
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
    DO,
    FUNCTIONCALL,
}