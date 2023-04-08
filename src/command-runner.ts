import { window } from 'vscode';

export class CommandRunner {
  public execute(command: string) {
    const terminal = window.createTerminal();
    terminal.sendText(command);
    terminal.show();
  }
}
