import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClipboardRenderOptions } from './clipboard-options';
import { KatexOptions } from './katex-options';
import {
  MarkdownService,
  ParseOptions,
  RenderOptions,
} from './markdown.service';
import { MermaidAPI } from './mermaid-options';
import { PrismPlugin } from './prism-plugin';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'markdown, [markdown]',
  template: '<ng-content></ng-content>',
})
export class MarkdownComponent implements OnChanges, AfterViewInit, OnDestroy {
  protected static ngAcceptInputType_clipboard: boolean | '';
  protected static ngAcceptInputType_emoji: boolean | '';
  protected static ngAcceptInputType_katex: boolean | '';
  protected static ngAcceptInputType_mermaid: boolean | '';
  protected static ngAcceptInputType_lineHighlight: boolean | '';
  protected static ngAcceptInputType_lineNumbers: boolean | '';
  protected static ngAcceptInputType_commandLine: boolean | '';

  @Input() data: string | null | undefined;
  @Input() src: string | null | undefined;

  @Input()
  get disableSanitizer(): boolean {
    return this._disableSanitizer;
  }
  set disableSanitizer(value: boolean) {
    this._disableSanitizer = this.coerceBooleanProperty(value);
  }

  @Input()
  get inline(): boolean {
    return this._inline;
  }
  set inline(value: boolean) {
    this._inline = this.coerceBooleanProperty(value);
  }

  // Plugin - clipboard
  @Input()
  get clipboard(): boolean {
    return this._clipboard;
  }
  set clipboard(value: boolean) {
    this._clipboard = this.coerceBooleanProperty(value);
  }

  @Input() clipboardButtonComponent: Type<unknown> | undefined;
  @Input() clipboardButtonTemplate: TemplateRef<unknown> | undefined;

  // Plugin - emoji
  @Input()
  get emoji(): boolean {
    return this._emoji;
  }
  set emoji(value: boolean) {
    this._emoji = this.coerceBooleanProperty(value);
  }

  // Plugin - katex
  @Input()
  get katex(): boolean {
    return this._katex;
  }
  set katex(value: boolean) {
    this._katex = this.coerceBooleanProperty(value);
  }

  @Input() katexOptions: KatexOptions | undefined;

  // Plugin - mermaid
  @Input()
  get mermaid(): boolean {
    return this._mermaid;
  }
  set mermaid(value: boolean) {
    this._mermaid = this.coerceBooleanProperty(value);
  }

  @Input() mermaidOptions: MermaidAPI.MermaidConfig | undefined;

  // Plugin - lineHighlight
  @Input()
  get lineHighlight(): boolean {
    return this._lineHighlight;
  }
  set lineHighlight(value: boolean) {
    this._lineHighlight = this.coerceBooleanProperty(value);
  }

  @Input() line: string | string[] | undefined;
  @Input() lineOffset: number | undefined;

  // Plugin - lineNumbers
  @Input()
  get lineNumbers(): boolean {
    return this._lineNumbers;
  }
  set lineNumbers(value: boolean) {
    this._lineNumbers = this.coerceBooleanProperty(value);
  }

  @Input() start: number | undefined;

  // Plugin - commandLine
  @Input()
  get commandLine(): boolean {
    return this._commandLine;
  }
  set commandLine(value: boolean) {
    this._commandLine = this.coerceBooleanProperty(value);
  }

  @Input() filterOutput: string | undefined;
  @Input() host: string | undefined;
  @Input() prompt: string | undefined;
  @Input() output: string | undefined;
  @Input() user: string | undefined;

  // Event emitters
  @Output() error = new EventEmitter<string | Error>();
  @Output() load = new EventEmitter<string>();
  @Output() ready = new EventEmitter<void>();

  private _clipboard = false;
  private _commandLine = false;
  private _disableSanitizer = false;
  private _emoji = false;
  private _inline = false;
  private _katex = false;
  private _lineHighlight = false;
  private _lineNumbers = false;
  private _mermaid = false;

  private readonly destroyed$ = new Subject<void>();

  constructor(
    public element: ElementRef<HTMLElement>,
    public markdownService: MarkdownService,
    public viewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges(): void {
    this.loadContent();
  }

  loadContent(): void {
    if (this.data != null) {
      this.handleData();
      return;
    }
    if (this.src != null) {
      this.handleSrc();
      return;
    }
  }

  ngAfterViewInit(): void {
    if (!this.data && !this.src) {
      this.handleTransclusion();
    }

    this.markdownService.reload$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.loadContent());
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  // Add this property to your MarkdownComponent class to track the previous state
  private lastParsedHtml = '';
  private counter = 1;
  async render(markdown: string, decodeHtml = false): Promise<void> {
    // These options remain the same
    const parsedOptions: ParseOptions = {
      decodeHtml,
      inline: this.inline,
      emoji: this.emoji,
      mermaid: this.mermaid,
      disableSanitizer: this.disableSanitizer,
    };
    this.counter++;
    if (this.counter < 100) {
      console.log('yo im rendered');
    }
    const renderOptions: RenderOptions = {
      clipboard: this.clipboard,
      clipboardOptions: this.getClipboardOptions(),
      katex: this.katex,
      katexOptions: this.katexOptions,
      mermaid: this.mermaid,
      mermaidOptions: this.mermaidOptions,
    };

    // --- START: THE FIX ---

    // 1. Always parse the complete, updated markdown string.
    // This is crucial for getting the correct HTML structure, especially for lists and code blocks.
    const newParsedHtml = await this.markdownService.parse(
      markdown,
      parsedOptions
    );

    // 2. Instead of replacing innerHTML, intelligently patch the live DOM.
    this.patch(this.element.nativeElement, newParsedHtml);

    // 3. Update the last known state for the next render cycle.
    this.lastParsedHtml = newParsedHtml;

    // --- END: THE FIX ---

    // The rest of the original method remains the same
    this.handlePlugins();
    this.markdownService.render(
      this.element.nativeElement,
      renderOptions,
      this.viewContainerRef
    );
    this.ready.emit();
  }

  /**
   * Intelligently updates the live DOM to match a new HTML structure with minimal changes,
   * preserving selections by avoiding destructive operations on unchanged nodes.
   * @param liveContainer The live DOM element to update.
   * @param newHtmlString The target HTML structure as a string.
   */
  private patch(liveContainer: HTMLElement, newHtmlString: string): void {
    // Create a temporary, disconnected container to hold the new, ideal DOM structure
    const newContainer = document.createElement('div');
    newContainer.innerHTML = newHtmlString;

    const patchRecursive = (oldNode: Node, newNode: Node) => {
      // If the nodes are identical in every way, we don't need to do anything.
      if (oldNode.isEqualNode(newNode)) {
        return;
      }

      // --- Key Insight for Streaming Text ---
      // If both are text nodes, we check if the new text is an extension of the old.
      // If so, we use `appendData()` which is a non-destructive modification.
      if (
        oldNode.nodeType === Node.TEXT_NODE &&
        newNode.nodeType === Node.TEXT_NODE
      ) {
        if (oldNode.textContent !== newNode.textContent) {
          // This is the most important part for preserving selection during streaming.
          if (newNode.textContent?.startsWith(oldNode.textContent!)) {
            const diff = newNode.textContent.substring(
              oldNode.textContent!.length
            );
            (oldNode as Text).appendData(diff); // Non-destructive text append
          } else {
            // If it's not a simple append, we must replace the content.
            oldNode.textContent = newNode.textContent;
          }
        }
        return;
      }

      // If nodes have different tags or types, replace the old with the new.
      // This handles structural changes, like a paragraph becoming a list.
      if (oldNode.nodeName !== newNode.nodeName) {
        oldNode.parentNode?.replaceChild(newNode.cloneNode(true), oldNode);
        return;
      }

      // If they are element nodes, we recursively patch their children.
      const oldChildren = Array.from(oldNode.childNodes);
      const newChildren = Array.from(newNode.childNodes);
      const maxLen = Math.max(oldChildren.length, newChildren.length);

      for (let i = 0; i < maxLen; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];

        if (newChild && !oldChild) {
          // If new nodes were added, append them.
          oldNode.appendChild(newChild.cloneNode(true));
        } else if (!newChild && oldChild) {
          // If old nodes were removed, remove them.
          oldNode.removeChild(oldChild);
        } else if (oldChild && newChild) {
          // If the child exists in both, recursively patch it.
          patchRecursive(oldChild, newChild);
        }
      }
    };

    // Start the patching process by comparing the top-level children
    const oldLiveChildren = Array.from(liveContainer.childNodes);
    const newVirtualChildren = Array.from(newContainer.childNodes);
    const maxChildrenLength = Math.max(
      oldLiveChildren.length,
      newVirtualChildren.length
    );

    for (let i = 0; i < maxChildrenLength; i++) {
      const oldChild = oldLiveChildren[i];
      const newChild = newVirtualChildren[i];

      if (newChild && !oldChild) {
        liveContainer.appendChild(newChild.cloneNode(true));
      } else if (!newChild && oldChild) {
        liveContainer.removeChild(oldChild);
      } else if (oldChild && newChild) {
        patchRecursive(oldChild, newChild);
      }
    }
  }

  private coerceBooleanProperty(value: boolean | ''): boolean {
    return value != null && `${String(value)}` !== 'false';
  }

  private getClipboardOptions(): ClipboardRenderOptions | undefined {
    if (this.clipboardButtonComponent || this.clipboardButtonTemplate) {
      return {
        buttonComponent: this.clipboardButtonComponent,
        buttonTemplate: this.clipboardButtonTemplate,
      };
    }
    return undefined;
  }

  private handleData(): void {
    this.render(this.data!);
  }

  private handleSrc(): void {
    this.markdownService.getSource(this.src!).subscribe({
      next: (markdown) => {
        this.render(markdown).then(() => {
          this.load.emit(markdown);
        });
      },
      error: (error: string | Error) => this.error.emit(error),
    });
  }

  private handleTransclusion(): void {
    this.render(this.element.nativeElement.innerHTML, true);
  }

  private handlePlugins(): void {
    if (this.commandLine) {
      this.setPluginClass(this.element.nativeElement, PrismPlugin.CommandLine);
      this.setPluginOptions(this.element.nativeElement, {
        dataFilterOutput: this.filterOutput,
        dataHost: this.host,
        dataPrompt: this.prompt,
        dataOutput: this.output,
        dataUser: this.user,
      });
    }
    if (this.lineHighlight) {
      this.setPluginOptions(this.element.nativeElement, {
        dataLine: this.line,
        dataLineOffset: this.lineOffset,
      });
    }
    if (this.lineNumbers) {
      this.setPluginClass(this.element.nativeElement, PrismPlugin.LineNumbers);
      this.setPluginOptions(this.element.nativeElement, {
        dataStart: this.start,
      });
    }
  }

  private setPluginClass(
    element: HTMLElement,
    plugin: string | string[]
  ): void {
    const preElements = element.querySelectorAll('pre');
    for (let i = 0; i < preElements.length; i++) {
      const classes = plugin instanceof Array ? plugin : [plugin];
      preElements.item(i).classList.add(...classes);
    }
  }

  private setPluginOptions(
    element: HTMLElement,
    options: Record<string, number | string | string[] | undefined>
  ): void {
    const preElements = element.querySelectorAll('pre');
    for (let i = 0; i < preElements.length; i++) {
      Object.keys(options).forEach((option) => {
        const attributeValue = options[option];
        if (attributeValue) {
          const attributeName = this.toLispCase(option);
          preElements
            .item(i)
            .setAttribute(attributeName, attributeValue.toString());
        }
      });
    }
  }

  private toLispCase(value: string): string {
    const upperChars = value.match(/([A-Z])/g);
    if (!upperChars) {
      return value;
    }
    let str = value.toString();
    for (let i = 0, n = upperChars.length; i < n; i++) {
      str = str.replace(
        new RegExp(upperChars[i]),
        '-' + upperChars[i].toLowerCase()
      );
    }
    if (str.slice(0, 1) === '-') {
      str = str.slice(1);
    }
    return str;
  }
}
