import { BindableObject, BindableVariable, EHTMLFormatTypes, HTMLTemlateInfo } from "./htmlEngine";
import * as fs from 'fs';

export class BindableObjectModule {

    public RenderContent<T>(htmlTemlateInfo: HTMLTemlateInfo, modelObj: T) {
        try {
            const fileId = Math.floor(Math.random() * 99999);
            // fs.rm(`${__dirname}/tmp_*.html`, { force: true, recursive: true });
            //fs.writeFileSync(`${__dirname}/tmp_${fileId}.html`, detectedHTMLInfo.outContent, { encoding: "utf-8" });

            // TODO : Detect the template and replace the variables with the model object
            const o = this.getHTMLMergedViewModel(htmlTemlateInfo, modelObj);


            // bindingVars.forEach((item, index) => {
            //     const fVar = this.getBindableValue(modelObj, item[1].trim());
            //     if (fVar) {
            //         html = html.replace(item[0], fVar);
            //     }
            // });
            fs.writeFileSync(`${__dirname}/tmp_v.html`, htmlTemlateInfo.outContent, { encoding: "utf-8" });
            return o.outContent;
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }

    private getHTMLMergedViewModel<T>(detectedHtmlInfo: HTMLTemlateInfo, viewModelObject: T): HTMLTemlateInfo {
        if (Array.isArray(viewModelObject)) {
            const arrayTemplate = detectedHtmlInfo;
            let resultContent = "";
            arrayTemplate.isArray = true;
            viewModelObject.forEach((item) => {
                arrayTemplate.outContent = "";
                this.bindToTemplate(item, arrayTemplate);
                resultContent = resultContent + " " + arrayTemplate.outContent;
            });
            detectedHtmlInfo.outContent = resultContent;
        }
        else {
            this.bindToTemplate(viewModelObject, detectedHtmlInfo);
        }
        return detectedHtmlInfo;
    }

    private bindToTemplate<T>(viewModelObject: T, detectedHtmlInfo: HTMLTemlateInfo) {

        const bindableObject = viewModelObject ? this.getBindable(viewModelObject) : undefined;
        if (bindableObject) {
            for (const item of detectedHtmlInfo.templateList) {
                if (detectedHtmlInfo.outContent && detectedHtmlInfo.outContent.length > 0) {
                    detectedHtmlInfo.inContent = detectedHtmlInfo.outContent;
                }
                if (bindableObject instanceof BindableObject) {
                    let itemPathName = item.PathName.trim();
                    let prop: any = undefined;
                    if (detectedHtmlInfo.isArray) {
                        prop = viewModelObject;
                        let val = prop?.toString();
                        if (itemPathName !== detectedHtmlInfo?.ArrayItemName) {
                            itemPathName = itemPathName.replace(detectedHtmlInfo?.ArrayItemName + ".", "");

                            val = this.getBindableValue(prop, itemPathName);
                        }

                        if (!prop) {
                            throw SyntaxError(`Variable ${item.PathName} is not found in the model object`);
                        }
                        switch (item.FormatType) {
                            case EHTMLFormatTypes.VARIABLE:
                                detectedHtmlInfo.outContent = detectedHtmlInfo.inContent.replace(item.toString(), val ? val : '<b> UNDEFINED </b>');
                                break;
                            case EHTMLFormatTypes.FOR:
                                // if (prop.VariableValue) {
                                //     if (!Array.isArray(prop.VariableValue)) {
                                //         prop.VariableValue = this.propertyToArray(prop.VariableValue);
                                //     }
                                //     const forList = this.getHTMLMergedViewModel(item.InnerTempleteInfo!, prop.VariableValue);
                                //     this.writeTMPFiles("i", detectedHtmlInfo.outContent);
                                //     detectedHtmlInfo.outContent = detectedHtmlInfo.inContent.replace(item.toString(), forList.outContent.toString());
                                //     this.writeTMPFiles("o", detectedHtmlInfo.outContent);
                                // }
                                // else {
                                //     detectedHtmlInfo.outContent = detectedHtmlInfo.inContent.replace(item.InnerTempleteInfo!.outContent.toString(), "");
                                // }
                                break;
                        }
                    }
                    else {
                        prop = bindableObject?.GetProperty(itemPathName);
                        if (!prop) {
                            throw SyntaxError(`Variable ${item.PathName} is not found in the model object`);
                        }
                        switch (item.FormatType) {
                            case EHTMLFormatTypes.VARIABLE:
                                detectedHtmlInfo.outContent = detectedHtmlInfo.inContent.replace(item.toString(), prop.VariableValue?.toString());
                                break;
                            case EHTMLFormatTypes.FOR:
                                if (prop.VariableValue) {
                                    if (!Array.isArray(prop.VariableValue)) {
                                        prop.VariableValue = this.propertyToArray(prop.VariableValue);
                                    }
                                    if (item.InnerTempleteInfo)
                                        item.InnerTempleteInfo.ArrayItemName = item.FORConditionPath?.trim();

                                    const forList = this.getHTMLMergedViewModel(item.InnerTempleteInfo!, prop.VariableValue);
                                    this.writeTMPFiles("i", detectedHtmlInfo.outContent);
                                    detectedHtmlInfo.outContent = detectedHtmlInfo.inContent.replace(item.toString(), forList.outContent.toString());
                                    this.writeTMPFiles("o", detectedHtmlInfo.outContent);
                                }
                                else {
                                    detectedHtmlInfo.outContent = detectedHtmlInfo.inContent.replace(item.InnerTempleteInfo!.outContent.toString(), "");
                                }
                                break;
                        }
                    }

                }
                else {
                    detectedHtmlInfo.outContent = detectedHtmlInfo.inContent.replace(item.toString(), bindableObject.VariableValue?.toString());
                }
            }
        }
        else {
            // TODO : Error handling
            console.error(`Bindable object is not found for the model object`);
        }
        return detectedHtmlInfo;
    }

    private getBindable<T>(bindingObjectModel: T, parentName: string | undefined = undefined): BindableObject | BindableVariable {
        if (['string', 'number'].includes(typeof bindingObjectModel)) {
            return new BindableVariable(parentName ? `${parentName}.${bindingObjectModel ? bindingObjectModel.toString() : "none"}` : bindingObjectModel ? bindingObjectModel.toString() : "none", parentName, bindingObjectModel);
        }
        else {
            return new BindableObject(this.getBindableVariables(bindingObjectModel, parentName));
        }
    }

    /// var
    /// obj0.var0
    /// obj0.obj0.var0
    /// -- depBindings
    /// obj0.₺.props[0]
    private getBindableValue(bindingModel: any, propName: any): string | undefined {
        const propPaths = propName.split('.');
        const sObj = bindingModel[propPaths[0]];
        if (propPaths.length > 1) {
            if (!sObj || typeof sObj !== 'object') {
                return undefined;
            }
            return this.getBindableValue(sObj, propName.substring(propPaths[0].length + 1));
        }
        else {
            return sObj?.toString();
        }
    }

    private getBindableVariables<T>(bindingObjectModel: T, parentName: string | undefined = undefined): BindableVariable[] {
        let resultProps: BindableVariable[] = [];
        if (typeof bindingObjectModel === 'string') {
            //resultProps.push(new BindableVariable(propName, parentName ? `${parentName}.${propName}` : propName, bindingObjectModel));
        }
        else if (typeof bindingObjectModel === 'object') {
            const modelProps = Object.getOwnPropertyNames(bindingObjectModel);
            for (const propName of modelProps) {
                if (typeof bindingObjectModel === 'string') {
                    resultProps.push(new BindableVariable(propName, parentName ? `${parentName}.${propName}` : propName, bindingObjectModel));
                }
                else {
                    if (bindingObjectModel && propName) {
                        const sObj = (bindingObjectModel as any)[propName];
                        if (sObj && typeof sObj === 'object' && !Array.isArray(sObj) && sObj !== null) {
                            if (typeof sObj.toString === 'function') {
                                resultProps.push(new BindableVariable(propName, parentName ? `${parentName}.${propName}` : propName, sObj));
                            }
                        }
                        if (sObj && typeof sObj === 'object') {
                            resultProps.push(new BindableVariable(propName, parentName ? `${parentName}.${propName}` : propName, sObj));
                            const cObj = this.getBindableVariables(sObj, parentName ? `${parentName}.${propName}` : propName);
                            if (cObj && cObj.length > 0) {
                                resultProps = resultProps.concat(cObj);
                            }
                        }
                        else {
                            resultProps.push(new BindableVariable(propName, parentName ? `${parentName}.${propName}` : propName, sObj));
                        }
                    }
                    else {
                        // TODO : ???
                    }
                }
            }
        }
        return resultProps;
    }

    private propertyToArray<T>(object: any) {
        const result: any[] = [];
        for (const propName of Object.getOwnPropertyNames(object)) {
            const sObj = object[propName];
            if (sObj && typeof sObj === 'object') {
                result.push(...this.propertyToArray(sObj));
            }
            else {
                const nObj: any = {
                    [propName]: sObj
                };
                nObj.toString = function () {
                    return JSON.stringify(nObj); // Burada doğrudan nObj referansı kullanılıyor
                };
                result.push(nObj);
            }
        }
        return result;
    }

    private propertyObject<T>(object: any) {
        const nObj: any = new Object();
        for (const propName of Object.getOwnPropertyNames(object)) {
            nObj[propName] = object[propName];
        }
        return nObj;
    }

    private writeTMPFiles(tag: string, htmlContent: string) {
        fs.writeFileSync(`${__dirname}/tmp_i.html`, htmlContent, { encoding: "utf-8" });
    }
}