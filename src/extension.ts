'use strict';
import * as vscode from 'vscode';
import { init } from './command.store';
import { McbTerminal } from './mcb-terminal';

export function activate(context: vscode.ExtensionContext) {
  init(context);

  new McbTerminal();

  context.subscriptions.push(
    vscode.commands.registerCommand('myCommandBuddyTerminal.create', () => {
      new McbTerminal();
    })
  );
}
