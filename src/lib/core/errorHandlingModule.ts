import * as fs from 'fs';
import { FileOperationModule } from './fileOperationModule';

export class ErrorHandlingModule {

    private _fileOperationModule: FileOperationModule;

    /**
     *
     */
    constructor(fileOperationModule: any) {
        this._fileOperationModule = fileOperationModule;
    }

    public HandleError(error: any): string {
        console.error("Error in HTMLEngine: ", error);
        return this.getErrorTemplate();
    }

    private getErrorTemplate(){
        return this._fileOperationModule.ReadFile("src/lib/simple/error.html");
    }
}