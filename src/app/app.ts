import * as path from 'path';
import { AnkeonServer } from '../lib/core/ankeonServer';

const rootPath = path.resolve(__dirname, '../../'); // Proje kökü!
console.log("App Route Path : " + rootPath);  
const ankeonServer = new AnkeonServer(rootPath);
ankeonServer.StartServer();