/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command } from './commandManager';

export class AlertHintContentCommand implements Command {
	public readonly id = 'typescript.alertHintContent';

	public execute(args: any) {
		vscode.window.showInformationMessage('foo' + JSON.stringify(args));
	}
}
