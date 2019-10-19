// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TextEditor, Selection, Range, TextDocument, TextEditorEdit } from 'vscode';
import * as searchKnowledge from '../libs/searchKnowledge';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "mls" is now active!');

	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World!');
	// });

    // context.subscriptions.push(disposable);


    let mls = vscode.commands.registerCommand('extension.mls', async () => {
        let textEditor: TextEditor;
        if (vscode.window.activeTextEditor !== undefined) {
            textEditor = vscode.window.activeTextEditor;
        } else {
            throw new Error('cannot find activetexteditor');
        }
        const currentLanguage = textEditor.document.languageId;

        const selection: Selection = textEditor.selection;

        const selectedRange: Range = new Range(selection.start, selection.end);
        const currentDocument: TextDocument = textEditor.document;
        const selectedText = currentDocument.getText(selectedRange);

        console.log('language:' + currentLanguage + ', selected text:' + selectedText);
        //run long's function here
        try {
            const jsonResponse = await searchKnowledge.search();
        } catch (error) {
            console.log(JSON.stringify(error));
        }
        textEditor.edit((editBuilder: TextEditorEdit) => {
            if (selectedText.includes('concat')) {
                editBuilder.replace(selectedRange, "string\.concat\(\)");
            }
        });
    });

    context.subscriptions.push(mls);
}

// this method is called when your extension is deactivated
export function deactivate() {}
