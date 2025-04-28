import * as fs from 'fs';

export class FileOperationModule {
    public ReadFile(filePath: string): string {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public WriteFile(filePath: string, content: string) {
        try {
            fs.writeFileSync(filePath, content, { encoding: "utf-8" });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}