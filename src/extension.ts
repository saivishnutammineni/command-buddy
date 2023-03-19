'use strict';
import * as vscode from 'vscode';
import { McbTerminal } from './mcb-terminal';

export function activate(context: vscode.ExtensionContext) {
  new McbTerminal();
  context.subscriptions.push(
    vscode.commands.registerCommand('myCommandBuddyTerminal.create', () => {
      new McbTerminal();
    })
  );
}
