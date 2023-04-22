'use strict';
import * as vscode from 'vscode';
import { McbTerminal } from './cb-terminal';
import { init } from './command.store';

export function activate(context: vscode.ExtensionContext) {
  init(context);

  new McbTerminal();

  context.subscriptions.push(
    vscode.commands.registerCommand('commandBuddyTerminal.create', () => {
      new McbTerminal();
    })
  );
}
