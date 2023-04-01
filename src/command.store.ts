import * as vscode from 'vscode';

let extensionContext: vscode.ExtensionContext;

const COMMAND_STORAGE_KEY = 'MCB_COMPLETION_COMMANDS';

export function init(context: vscode.ExtensionContext) {
  extensionContext = context;
}

export function getSavedCommands() {
  const commands = extensionContext.globalState.get<string[]>(COMMAND_STORAGE_KEY);
  return commands;
}

export function saveCommand(command: string) {
  const savedCommands = getSavedCommands() ?? [];

  if (savedCommands?.includes(command)) {
    return;
  }

  savedCommands.push(command);

  extensionContext.globalState.update(COMMAND_STORAGE_KEY, savedCommands);
}
