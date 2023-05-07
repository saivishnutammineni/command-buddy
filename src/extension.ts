'use strict';
import * as vscode from 'vscode';
import { COMMAND_BUDDY_TERMINAL_NAME, McbTerminal } from './cb-terminal';
import { init } from './command.store';

export function activate(context: vscode.ExtensionContext) {
  init(context);

  new McbTerminal();

  context.subscriptions.push(
    vscode.commands.registerCommand('commandBuddyTerminal.create', () => {
      focusTerminalOrCreateNew();
    })
  );
}

function focusTerminalOrCreateNew() {
  const cbTerminal = vscode.window.terminals?.find((terminal) => terminal.name === COMMAND_BUDDY_TERMINAL_NAME);
  if (!cbTerminal) {
    new McbTerminal();
  } else {
    cbTerminal.show();
  }
}
