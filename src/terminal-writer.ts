import * as vscode from 'vscode';
import { AnsiEscapes } from './ansi-escapes';

export interface TerminalWriteOptions {
  writeOnNewLine?: boolean;
  newLineAfterWrite?: boolean;
}

export class TerminalWriter {
  private writeEvents = new vscode.EventEmitter<string>();

  get events() {
    return this.writeEvents.event;
  }

  public write(content: string, options?: TerminalWriteOptions) {
    let text = content;
    if (options?.writeOnNewLine) {
      text = '\n\r' + text;
    }

    if (options?.newLineAfterWrite) {
      text = text + '\n\r';
    }

    if (text) {
      this.writeEvents.fire(text);
    }
    return this;
  }

  public clear() {
    this.writeEvents.fire(AnsiEscapes.CLEAR_TERMINAL);
    this.writeEvents.fire(AnsiEscapes.LEFT_START);
  }

  public backspace() {
    // Move cursor backward
    this.write(AnsiEscapes.LEFT);
    // Delete character
    this.write('\x1b[P');

    return this;
  }

  public goDown() {
    this.write('\n');
    this.write(AnsiEscapes.DOWN);
    return this;
  }

  public newLine() {
    this.goDown().write(AnsiEscapes.LEFT_START);
    return this;
  }

  public replaceCurrentLine(command: string) {
    this.write(AnsiEscapes.LEFT_START).write(AnsiEscapes.ERASE_CURRENT_LINE).write(command);
  }

  public suggest(commands: string[], highlightedCommandIndex?: number) {
    const commandSuggestion = commands
      ?.map((command, index) => {
        return `${index === highlightedCommandIndex ? '> ' : ''}${index + 1})${command}`;
      })
      ?.join(' ');

    this.write(AnsiEscapes.SAVE_POS)
      .goDown()
      .write(AnsiEscapes.LEFT_START)
      .write(AnsiEscapes.ERASE_TO_END)
      .write(commandSuggestion)
      .write(AnsiEscapes.RESTORE_POS);
  }
}
