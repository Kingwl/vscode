/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import 'vs/editor/contrib/inlineHints/inlineHintsController';

import { Disposable, dispose } from 'vs/base/common/lifecycle';
import { ICodeEditor, IEditorMouseEvent, MouseTargetType } from 'vs/editor/browser/editorBrowser';
import { registerEditorContribution } from 'vs/editor/browser/editorExtensions';
import { IEditorContribution } from 'vs/editor/common/editorCommon';
import { MenuId, IMenuService, IMenu } from 'vs/platform/actions/common/actions';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IAction } from 'vs/base/common/actions';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { createAndFillInContextMenuActions } from 'vs/platform/actions/browser/menuEntryActionViewItem';

export class InlineHintsContribution extends Disposable implements IEditorContribution {

	public static readonly ID: string = 'editor.contrib.inlineHintsContribution';

	private menu: IMenu;

	constructor(private readonly _editor: ICodeEditor,
		@IMenuService private readonly _menuService: IMenuService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
	) {
		super();
		this.menu = this._menuService.createMenu(MenuId.InlineHintContext, this._contextKeyService);
		this._register(this.menu);
		this._register(this._editor.onContextMenu((e) => this.onContextMenu(e)));
	}

	dispose(): void {
		super.dispose();
	}

	private onContextMenu(mouseEvent: IEditorMouseEvent) {
		const targetType = mouseEvent.target.type;

		if (targetType !== MouseTargetType.CONTENT_TEXT) {
			return;
		}

		const hoverOnInlineHints = [...mouseEvent.target.element?.classList.values() || []].find(className => className.startsWith('ced-inlineHints'));
		if (!hoverOnInlineHints) {
			return;
		}

		if (!mouseEvent.target.range) {
			return;
		}

		const actions: IAction[] = [];
		const actionsDisposable = createAndFillInContextMenuActions(this.menu, { arg: {}, shouldForwardArgs: false }, actions);
		const anchor = { x: mouseEvent.event.posx - 1, width: 2, y: mouseEvent.event.posy - 1, height: 2 };
		this._contextMenuService.showContextMenu({
			getAnchor: () => anchor,
			getActions: () => actions,
			onHide: () => dispose(actionsDisposable)
		});
	}
}

registerEditorContribution(InlineHintsContribution.ID, InlineHintsContribution);
