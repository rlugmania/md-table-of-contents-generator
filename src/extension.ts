import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('"mdcontenttable" is now active!');

	let disposable = vscode.commands.registerCommand('mdcontenttable.contentTable', () => {

		let activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			vscode.window.showErrorMessage('No active editor opened!');
			return;
		}
		
		const text = activeEditor.document.getText();
		try {
			const lines = text.split('\r\n');
			const titles = new Array<string>();
			lines.forEach(line => {
				if (line.startsWith('#')) {
					const lineTitle = line.replace('####', '     - [')
						.replace('###', '    - [')
						.replace('##', '   - [')
						.replace('#', '- [');
					const link = lineTitle.toLowerCase().trim().replace('-', '').trim().replace(/\s/g, '-');
					titles.push(`${lineTitle}](#${link})`);
				}
			});

			activeEditor.edit(editBuilder => {
				editBuilder.insert(new vscode.Position(0, 0), '## Table of Contents\r\n' + titles.join('\r\n') + '\r\n---\r\n');
			});
		} catch (error) {
			vscode.window.showErrorMessage(error);
		}

		vscode.window.showInformationMessage("Table Of Content Generated");
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
