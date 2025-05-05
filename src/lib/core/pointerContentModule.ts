import { DetectionRegexCodes } from "./detectionRegexCodes";
import { EHTMLFormatTypes, HTMLTemlateInfo, TemplateRef } from "./htmlEngine";

export class PointerContentModule {

    public PointerContent(html: string): HTMLTemlateInfo {

        const htmlTemplateInfo = this.detectForLoop(html);
        return this.detectVariables(html, htmlTemplateInfo);

        //var dForLoops = this.detectForLoop(html);
        //var dVariables = this.detectVariables(dForLoops.outContent);

        // templateInfo.inContent = dVariables.inContent;
        // templateInfo.outContent = dVariables.outContent;
        // templateInfo.templateList = dForLoops.templateList.concat(dVariables.templateList);
    }

    private detectVariables(html: string, overTemplateInfo?: HTMLTemlateInfo): HTMLTemlateInfo {
        if (overTemplateInfo == undefined)
            overTemplateInfo = new HTMLTemlateInfo();
        const htmlRows = html.split("\r\n");
        const resultHTML: string[] = [];
        htmlRows.forEach((element, rowIndex) => {
            let outHtmlRow = "";
            const d = this.detectVariableInRow(element, rowIndex);
            resultHTML.push(outHtmlRow);
            if (d.refList.length > 0) {
                console.log("Detected Variables: ", d);
            }
            overTemplateInfo.templateList.push(...d.refList);
            resultHTML.push(d.o);
        });
        overTemplateInfo.outContent = resultHTML.join("\r\n");
        overTemplateInfo.inContent = html;
        return overTemplateInfo;
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

    private detectForLoop(html: string): HTMLTemlateInfo | undefined {
        const resultOutput: HTMLTemlateInfo = new HTMLTemlateInfo();
        const templateInfo: TemplateRef[] = [];
        const detectedVal = this.detectRegex(html, DetectionRegexCodes.ForLoopFullRegexCode);
        if (detectedVal.length > 0) {
            let htmlOutput: string | undefined = html;
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

            resultOutput.templateList = templateInfo;
            resultOutput.inContent = htmlOutput;
            resultOutput.outContent = htmlOutput;
            return resultOutput;
        }
    }
}
