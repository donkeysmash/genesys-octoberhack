// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TextEditor, Selection, Range, TextDocument, TextEditorEdit, ExtensionContext } from 'vscode';

import { showInputBox, showResultBox, updateKnowledge } from './basicInput';
//import * as constants from '../knowledgebaseutil/constants';

const UPDATE_KEYWORD = '@update';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated

    let documentUpdater = vscode.commands.registerCommand('extension.mlsUpdate', async () => {
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
        await updateKnowledge(selectedText.replace(UPDATE_KEYWORD, ''), currentLanguage);
        vscode.window.showInformationMessage("Knowledge Document Updated");

    });
    context.subscriptions.push(documentUpdater);

	console.log('Congratulations, your extension "mls" is now active!');
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

        if (selectedText.includes(UPDATE_KEYWORD)) {
            //Update previous here
            textEditor.edit(async (editBuilder: TextEditorEdit) => {
                editBuilder.replace(selectedRange, selectedText.replace(UPDATE_KEYWORD, ''));
                await updateKnowledge(selectedText.replace(UPDATE_KEYWORD, ''), currentLanguage);
                vscode.window.showInformationMessage("Knowledge Document Updated");
            });
        }
        else {
            const question = await showInputBox(selectedText);
            const {selectedGoogleGod, contents} = await showResultBox(question, currentLanguage);

            if (selectedGoogleGod) {
                vscode.env.openExternal(vscode.Uri.parse(contents));
            } else {
                textEditor.edit((editBuilder: TextEditorEdit) => {
                    editBuilder.replace(selectedRange, contents);
                });
            }
        }
    });
    context.subscriptions.push(mls);
}

// this method is called when your extension is deactivated
export function deactivate() {}
