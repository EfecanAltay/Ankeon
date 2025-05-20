import { DetectionRegexCodes } from "./detectionRegexCodes";
import { FileOperationModule } from "./fileOperationModule";
import { EHTMLFormatTypes, HTMLTemlateInfo, TemplateRef } from "./htmlEngine";
import * as  Cheerio from 'cheerio';
import * as parse5 from 'parse5';

export class PointerContentModule {

    private _fileOperationModule: FileOperationModule = new FileOperationModule();
    public PointerContent(pageModel: any): HTMLTemlateInfo {

        const contentPath = (pageModel as any).prototype["ContentPath"] as string;
        const content = this._fileOperationModule.ReadFile(contentPath);

        let htmlTemplateInfo = new HTMLTemlateInfo();
        htmlTemplateInfo.FilePath = contentPath;
        htmlTemplateInfo = this.detectForLoop(content, htmlTemplateInfo);
        htmlTemplateInfo = this.detectFuncCall(content, htmlTemplateInfo);

        return this.detectVariables(content, htmlTemplateInfo);

        //var dForLoops = this.detectForLoop(html);
        //var dVariables = this.detectVariables(dForLoops.outContent);

        // templateInfo.inContent = dVariables.inContent;
        // templateInfo.outContent = dVariables.outContent;
        // templateInfo.templateList = dForLoops.templateList.concat(dVariables.templateList);
    }


    private detectRegex(htmlRow: string, regexCode: RegExp): RegExpExecArray[] {
        const bindingDetect = htmlRow.matchAll(regexCode);
        var matches: RegExpExecArray[] = [];
        let match: IteratorResult<RegExpExecArray, undefined>;
        do {
            match = bindingDetect.next();
            if (match?.value)
                matches.push(match?.value);
        } while (match.done === false);
        return matches;
    }

    private detectVariableInRow(inHtmlRow: string, rowIndex: number): { o: string, refList: TemplateRef[] } {
        const templateInfo: TemplateRef[] = [];
        let outHtmlRow = inHtmlRow;
        const detectedVal = this.detectRegex(inHtmlRow, DetectionRegexCodes.VariableRegexCode);
        if (detectedVal.length > 0) {
            for (let i = 0; i < detectedVal.length; i++) {
                const item = detectedVal[i];
                const fullFinding = item[0]; // ₺₺ item ₺₺
                const variableName = item[1].trim();
                const n = new TemplateRef(fullFinding, EHTMLFormatTypes.VARIABLE, variableName, rowIndex, item.index,
                    item.index + fullFinding.length - 1);
                outHtmlRow = outHtmlRow.replace(fullFinding, n.toString());
                templateInfo.push(n);
            }
        }
        return { o: outHtmlRow, refList: templateInfo };
    }

    private detectLoopInRow(htmlRow: string, rowIndex: number): TemplateRef[] {
        const templateInfo: TemplateRef[] = [];
        const detectedVal = this.detectRegex(htmlRow, DetectionRegexCodes.ForLoopHeaderRegexCode);
        if (detectedVal.length > 0) {
            detectedVal.forEach((item) => {
                const fullFinding = item[0]; //  for (item in list) { ... }
                const loopListName = item[2]; //  loop variable name
                const loopItemName = item[3]; // loop item name
                // Searching for condition
                const n = new TemplateRef(fullFinding, EHTMLFormatTypes.FOR, loopListName, loopItemName, null, rowIndex,
                    item.index, item.index + fullFinding.length - 1);
                templateInfo.push(n);
            });
        }
        return templateInfo;
    }

    private detectFuncCall(html: string, resultOutput?: HTMLTemlateInfo): HTMLTemlateInfo {
        if (resultOutput == undefined)
            resultOutput = new HTMLTemlateInfo();

        const $ = Cheerio.load(html);

        const document = parse5.parse(html, { sourceCodeLocationInfo: true });

        this.detectCallbackOnDoc(document, resultOutput.FilePath);

        resultOutput.inContent = html;
        resultOutput.outContent = html;
        return resultOutput;
    }

    private detectCallbackOnDoc(node: any, docPath: string) {
        if (node.attrs && node.sourceCodeLocation?.attrs) {
            for (const attr of node.attrs) {
                const attrName = attr.name;
                if (attrName.startsWith('$')) {
                    const attrLoc = node.sourceCodeLocation.attrs[attrName];
                    console.log(
                        `[pc log] Detected Callback :'${attrName}' at ${docPath}:${attrLoc.startLine}:${attrLoc.startCol}`
                    );
                }
            }
        }

        if (node.childNodes) {
            for (const child of node.childNodes) {
                this.detectCallbackOnDoc(child, docPath);
            }
        }
    }

    private detectForLoop(html: string, resultOutput?: HTMLTemlateInfo): HTMLTemlateInfo {
        if (resultOutput == undefined)
            resultOutput = new HTMLTemlateInfo();
        const templateInfo: TemplateRef[] = [];
        const detectedVal = this.detectRegex(html, DetectionRegexCodes.ForLoopFullRegexCode);
        let htmlOutput: string | undefined = html;
        if (detectedVal.length > 0) {
            detectedVal.forEach((item) => {
                const fullFinding = item[0]; //  for (item in list) { ... }
                const loopListName = item[2]; //  loop variable name
                const loopItemName = item[3]; // loop item name
                let loopContent = item[4]; // loop content  
                loopContent = loopContent.replace("\r\n", "").trim(); // remove new line characters

                // Searching for condition
                const n = new TemplateRef(fullFinding, EHTMLFormatTypes.FOR, loopListName, loopItemName, loopContent);

                // TODO : for loop content detection
                //n.InnerTempleteInfo = this.PointerContent(loopContent);

                htmlOutput = htmlOutput?.replace(fullFinding, n.toString()); // replace the loop with the item name
                templateInfo.push(n);
            });
        }
        resultOutput.templateList = templateInfo;
        resultOutput.inContent = htmlOutput;
        resultOutput.outContent = htmlOutput;
        return resultOutput;
    }

    private detectVariables(html: string, resultOutput?: HTMLTemlateInfo): HTMLTemlateInfo {
        if (resultOutput == undefined)
            resultOutput = new HTMLTemlateInfo();
        const htmlRows = html.split("\r\n");
        const resultHTML: string[] = [];
        htmlRows.forEach((element, rowIndex) => {
            let outHtmlRow = "";
            const d = this.detectVariableInRow(element, rowIndex);
            resultHTML.push(outHtmlRow);
            if (d.refList.length > 0) {
                d.refList.forEach((item) => {
                    console.log(`[pc log] Detected Variables: '${item.PathName}' ${resultOutput.FilePath}:${item.RowIndex + 1}:${item.StartedColIndex + 1}`);
                });
            }
            resultOutput.templateList.push(...d.refList);
            resultHTML.push(d.o);
        });
        resultOutput.outContent = resultHTML.join("\r\n");
        resultOutput.inContent = html;
        return resultOutput;
    }
}
