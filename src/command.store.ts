import * as vscode from 'vscode';
import { Command } from './models/commands';

let extensionContext: vscode.ExtensionContext;

const COMMAND_STORAGE_KEY = 'MCB_COMPLETION_COMMANDS';

export function init(context: vscode.ExtensionContext) {
  extensionContext = context;
}

export function getSavedCommands() {
  const commands = extensionContext.globalState.get<Command[]>(COMMAND_STORAGE_KEY)?.filter((savedCommand) => !!savedCommand.command);
  return commands;
}

export function saveCommand(command: string) {
  const savedCommands = getSavedCommands() ?? [];

  const updatedCommands = savedCommands?.filter((savedCommand) => savedCommand.command !== command);

  updatedCommands.unshift({
    command,
    lastUsed: new Date().toISOString(),
  });

  extensionContext.globalState.update(COMMAND_STORAGE_KEY, updatedCommands);
}
