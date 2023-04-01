import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import * as vscode from 'vscode';
export class CommandRunner {
  public get commandRunning() {
    return this._commandRunning;
  }

  public get stdOut() {
    return this._stdOut;
  }

  public get stdErr() {
    return this._stdErr;
  }

  public get end() {
    return this._end;
  }

  private _stdOut = new vscode.EventEmitter<string>();
  private _stdErr = new vscode.EventEmitter<string>();
  private _end = new vscode.EventEmitter<void>();
  private _commandRunning: boolean;
  private commandProcess: ChildProcessWithoutNullStreams;

  public execute(command: string) {
    this.commandProcess = spawn(command, [], { cwd: vscode.workspace?.workspaceFolders?.[0]?.uri?.fsPath, shell: true });
    this._commandRunning = true;

    this.commandProcess.stdout.on('data', (data) => this._stdOut.fire(formatText(data?.toString())));
    this.commandProcess.stderr.on('data', (data) => this._stdErr.fire(formatText(data?.toString())));
    this.commandProcess.on('exit', () => this.handleProcessEnd());
  }

  public terminate() {
    this.commandProcess?.kill();
    this.handleProcessEnd();
  }

  private handleProcessEnd() {
    this._end.fire();
    this._commandRunning = false;
    this.commandProcess = null;
  }
}

const formatText = (text: string) => `\r${text.split(/(\r?\n)/g).join('\r')}\r`;
