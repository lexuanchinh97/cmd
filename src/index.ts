import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
const { spawn } = require('child_process');

const command = process.platform === 'win32' ? 'powershell.exe' : 'bash';

const port = 8080;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});

app.post('/', (req: Request, res: Response) => {
    const commands = req.body;
    let args;
    if (process.platform === 'win32') {
        args = commands.map((cmd: string) => '.\\' + cmd).join(" ; ")
        args = "cd C:\\scripts ; " + args;
        args = ['-Command', args]
    } else {
        args = commands.map((cmd: string) => './' + cmd).join(" && ")
        args = "cd /Users/chinh.le/scripts && " + args;
        args = ['-c', args]
    }
    const child = spawn(command, args);
    child.stdout.on('data', (data: any) => {
        console.log(`Command output: ${data}`);
    });

    child.stderr.on('data', (data: any) => {
        console.error(`Command error: ${data}`);
    });

    child.on('close', (code: number) => {
        console.log(`Command process exited with code ${code}`);
    });
    res.json({processId: child.pid});
});