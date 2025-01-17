/*
 * Copyright (c) 2021 FinancialForce.com, inc. All rights reserved.
 */
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DatabaseAccess } from '../Database';
import { LogLine } from '../parsers/TreeParser';
import { showTreeNode } from '../TreeView';

@customElement('call-stack')
export class CallStack extends LitElement {
  @property({ type: Number }) stack = -1;

  static get styles() {
    return css`
      a {
        color: var(--vscode-textLink-foreground);
        text-decoration: underline;
      }

      .stackEntryFirst {
        cursor: pointer;
      }

      .stackEntry {
        cursor: pointer;
        display: block;
        padding-left: 1em;
      }
    `;
  }

  render() {
    const stacks = DatabaseAccess.instance()?.stacks;
    if (stacks && this.stack >= 0 && this.stack < stacks.length) {
      const stack = stacks[this.stack];
      if (stack) {
        const details = stack.slice(1, 10).map((entry) => this.lineLink(entry, false));
        return html`<details>
          <summary>${this.lineLink(stack[0], true)}</summary>
          ${details}
        </details>`;
      } else {
        return html`<div class="stackEntry">No call stack available</div>`;
      }
    }
  }

  private lineLink(line: LogLine, first: boolean) {
    const style = first ? 'stackEntryFirst' : 'stackEntry';
    return html`
      <a @click=${this.onCallerClick} class=${style} data-timestamp="${line.timestamp}"
        >${line.text}</a
      >
    `;
  }

  private onCallerClick(evt: Event) {
    const target = evt.target as HTMLElement;
    const dataTimestamp = target.getAttribute('data-timestamp');
    if (dataTimestamp) {
      showTreeNode(parseInt(dataTimestamp));
    }
  }
}
