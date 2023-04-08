import * as vscode from 'vscode';
import { KeyCodes } from './ansi-escapes';
import { CommandRunner } from './command-runner';
import { saveCommand } from './command.store';
import { getSuggestedCommands } from './completion-provider';
import { TerminalWriter } from './terminal-writer';

const SPECIAL_KEY_CODES = [KeyCodes.ENTER, KeyCodes.BACKSPACE];
const SPECIAL_COMMANDS = [KeyCodes.UP_ARROW, KeyCodes.DOWN_ARROW, KeyCodes.TAB];

/**
 * A vscode pseudo terminal for providing command auto completions
 */
export class McbTerminal {
  private terminal: vscode.Terminal;
  private terminalWriter = new TerminalWriter();
  private command = '';
  private commandRunner = new CommandRunner();
  private suggestedCommands: string[];
  private highlightedCommandIndex = 0;

  constructor() {
    const pty: vscode.Pseudoterminal = {
      onDidWrite: this.terminalWriter.events,
      open: () => this.terminalWriter.write('Start typing to see the command auto completions\r\n\r\n'),
      close: () => {
        // no op
      },
      handleInput: this.terminalInputHandler.bind(this),
    };

    this.terminal = vscode.window.createTerminal({
      name: `Command Buddy`,
      pty,
    });
    this.terminal.show();
  }

  private terminalInputHandler(input: string) {
    if (SPECIAL_KEY_CODES.includes(input)) {
      this.handleSpecialKeyCodes(input);
      return;
    }

    if (SPECIAL_COMMANDS.includes(input)) {
      this.handleSpecialCommands(input);
      return;
    }

    this.handleCommandInput(input);
  }

  private handleSpecialKeyCodes(input: string) {
    if (input === KeyCodes.ENTER) {
      this.handleCommandSelection(this.command);
      this.resetCommand();
      return;
    }

    if (input === KeyCodes.BACKSPACE) {
      this.handleBackspaceInput();
      return;
    }
  }

  private handleSpecialCommands(input: string) {
    if (input === KeyCodes.TAB) {
      if (!this.suggestedCommands?.length) {
        return;
      }

      const commandCompletion = this.suggestedCommands[this.highlightedCommandIndex ?? 0].slice(this.command.length);
      this.handleCommandInput(commandCompletion);
      return;
    }

    if (input === KeyCodes.DOWN_ARROW) {
      if (!this.suggestedCommands?.length || this.suggestedCommands?.length - 1 <= this.highlightedCommandIndex) {
        return;
      }

      const commandIndexToHighlight = (this.highlightedCommandIndex ?? 0) + 1;

      this.suggest(this.suggestedCommands, commandIndexToHighlight);
      return;
    }

    if (input === KeyCodes.UP_ARROW) {
      if (!this.suggestedCommands?.length || this.highlightedCommandIndex === 0) {
        return;
      }

      const commandIndexToHighlight = (this.highlightedCommandIndex ?? 0) - 1;

      this.suggest(this.suggestedCommands, commandIndexToHighlight);
      return;
    }
  }

  private handleCommandInput(input: string) {
    this.command += input;
    this.terminalWriter.write(input);

    if (this.command.length < 3) {
      return;
    }

    const suggestedCommands = getSuggestedCommands(this.command);
    this.suggest(suggestedCommands, 0);
  }

  private handleCommandSelection(command: string) {
    saveCommand(command);
    this.runCommand(command);
  }

  private handleBackspaceInput() {
    if (this.command.length === 0) {
      return;
    }
    this.command = this.command.substring(0, this.command.length - 1);

    this.terminalWriter.backspace();
    if (this.command.length < 3) {
      this.clearSuggestions();
    }
  }

  private runCommand(command: string) {
    this.suggest([]);
    this.commandRunner.execute(command);
    this.terminalWriter.clear();
  }

  private clearSuggestions() {
    this.suggest([]);
  }

  private suggest(commands: string[], highlightedCommandIndex?: number) {
    this.suggestedCommands = commands;
    this.highlightedCommandIndex = highlightedCommandIndex;
    this.terminalWriter.suggest(this.suggestedCommands, highlightedCommandIndex);
  }

  private resetCommand() {
    this.command = '';
    this.suggestedCommands = [];
    this.clearSuggestions();
  }
}
