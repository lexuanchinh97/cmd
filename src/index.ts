import express, { Request, Response } from "express";
const { exec, spawn } = require('child_process');

const command = process.platform === 'win32' ? 'powershell.exe' : 'bash';
const args = process.platform === 'win32' ? ['-Command', 'ls'] : ['-c', 'ls'];

const port = 8080;

const app = express();

app.get("/", (req: Request, res: Response) => {

    const child = spawn(command, args);
    console.log("pid ", child.pid, process.platform)
    child.stdout.on('data', (data: any) => {
        console.log(`Command output: ${data}`);
    });

    child.stderr.on('data', (data: any) => {
        console.error(`Command error: ${data}`);
    });

    child.on('close', (code: number) => {
        console.log(`Command process exited with code ${code}`);
    });
    // const childProcessObj = exec('ls', (err: Error | null, stdout: string, stderr: string) => {
    //     if (err) {
    //         console.error(`exec error: ${err}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    //     console.error(`stderr: ${stderr}`);
    //     console.error(`stderr: ${childProcessObj.pid}`);
    // });
    // console.error(`stderr11: ${childProcessObj.pid}`);

    res.send("hello");
});

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});