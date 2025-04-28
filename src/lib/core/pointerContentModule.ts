import { BindableVariable, EHTMLFormatTypes, HTMLTemlateInfo, TemplateRef } from "./htmlEngine";

export class PointerContentModule {

    public PointerContent(html: string): HTMLTemlateInfo {

        const templateInfo: HTMLTemlateInfo = new HTMLTemlateInfo();

        var dForLoops = this.detectForLoop(html);
        var dVariables = this.detectVariables(dForLoops.outContent);

        templateInfo.inContent = dVariables.inContent;
        templateInfo.outContent = dVariables.outContent;
        templateInfo.templateList = dForLoops.templateList.concat(dVariables.templateList);

        return templateInfo;
    }


    private detectVariables(html: string): HTMLTemlateInfo {
        const resultOutput: HTMLTemlateInfo = new HTMLTemlateInfo();
        const templateInfo: TemplateRef[] = [];
        const bindingDetect = html.matchAll(/₺₺(.*.)₺₺/g);
        var match: IteratorResult<RegExpExecArray, undefined>;
        let htmlOutput: string | undefined = html;
        do {
            match = bindingDetect.next();
            if (match.value) {

                const fullFinding = match.value[0]; // ₺₺ item ₺₺
                const variableName = match.value[1]; // loop variable name

                const n = new TemplateRef(fullFinding, EHTMLFormatTypes.VARIABLE, variableName);
                htmlOutput = htmlOutput.replace(fullFinding, n.toString()); // replace the loop with the item name
                templateInfo.push(n);
            }
        } while (match.done === false);
        resultOutput.templateList = templateInfo;
        resultOutput.inContent = htmlOutput;
        resultOutput.outContent = htmlOutput;
        return resultOutput;
    }

    private detectForLoop(html: string): HTMLTemlateInfo {
        const resultOutput: HTMLTemlateInfo = new HTMLTemlateInfo();
        const templateInfo: TemplateRef[] = [];
        const bindingDetect = html.matchAll(/₺(for|döngü)\s*\(\s*([\w.]+)\s*,\s*([\w.]+)\s*\){([\s\S]*?)\}/g);
        var match: IteratorResult<RegExpExecArray, undefined>;
        let htmlOutput: string | undefined = html;
        do {
            match = bindingDetect.next();
            if (match.value) {

                const fullFinding = match.value[0]; //  for (item in list) { ... }
                const loopListName = match.value[2]; //  loop variable name
                const loopItemName = match.value[3]; // loop item name
                let loopContent = match.value[4]; // loop content  
                loopContent = loopContent.replace("\r\n", "").trim(); // remove new line characters

                // Searching for condition
                const n = new TemplateRef(fullFinding, EHTMLFormatTypes.FOR, loopListName, loopItemName, loopContent);
                n.InnerTempleteInfo = this.PointerContent(loopContent);

                htmlOutput = htmlOutput.replace(fullFinding, n.toString()); // replace the loop with the item name
                templateInfo.push(n);
            }
        } while (match.done === false);

        resultOutput.templateList = templateInfo;
        resultOutput.inContent = htmlOutput;
        resultOutput.outContent = htmlOutput;
        return resultOutput;
    }
}
