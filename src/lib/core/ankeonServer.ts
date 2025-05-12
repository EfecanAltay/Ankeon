import { HTMLEngine } from "./htmlEngine";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { SimplePage } from "../simple/simple";

export class AnkeonServer {

    private _appRoutePath: string;
    private _htmlEngine?: HTMLEngine;

    constructor(appRoutePath: string) {
        this._appRoutePath = appRoutePath;
    }

    public StartServer(): void {
        this._htmlEngine = new HTMLEngine();
        const server = http.createServer((req, res) => this.onRequest(req, res, this._appRoutePath));
        const port: number = 4200;
        server.listen(port, () => {
            console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
        });
    }

    private onRequest(req: http.IncomingMessage, res: http.ServerResponse, rootPath: string): void {
        let filePath = req.url || '/';
        // if (filePath === '/') {
        //     filePath = '/index.html'; // anasayfa
        // }
        const fullPath = path.join(rootPath, filePath); // Burada simple klasöründen çekiyoruz

        const extname = String(path.extname(fullPath)).toLowerCase();
        const mimeTypes: { [key: string]: string } = {
            '.html': 'text/html; charset=utf-8',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon'
        };

        const contentType = mimeTypes[extname];

        if (contentType) {
            fs.readFile(fullPath, (error, content) => {
                if (error) {
                    if (error.code === 'ENOENT') {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Server Error');
                    }
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });
            return;
        }

        // TODO : Routing System
        const simplePage = new SimplePage();
        simplePage.FrameworkName = "ANKEON";
        simplePage.Desc = "Welcome To ANKEON !";
        const result = this._htmlEngine?.RenderHTML(simplePage);
        res.end(result);
    }
}