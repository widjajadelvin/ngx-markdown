import * as i0 from '@angular/core';
import { computed, ChangeDetectionStrategy, Component, InjectionToken, Pipe, PLATFORM_ID, Inject, Optional, Injectable, EventEmitter, Output, Input, SecurityContext, NgModule } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, merge, of, timer } from 'rxjs';
import { switchMap, mapTo, distinctUntilChanged, shareReplay, map, takeUntil, first } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Renderer, marked } from 'marked';
export { Renderer as MarkedRenderer } from 'marked';
import * as i1 from '@angular/common/http';
import * as i2 from '@angular/platform-browser';

const BUTTON_TEXT_COPY = 'Copy';
const BUTTON_TEXT_COPIED = 'Copied';
class ClipboardButtonComponent {
    constructor() {
        this._buttonClick$ = new Subject();
        this.copied = toSignal(this._buttonClick$.pipe(switchMap(() => merge(of(true), timer(3000).pipe(mapTo(false)))), distinctUntilChanged(), shareReplay(1)));
        this.copiedText = computed(() => this.copied()
            ? BUTTON_TEXT_COPIED
            : BUTTON_TEXT_COPY, ...(ngDevMode ? [{ debugName: "copiedText" }] : []));
    }
    onCopyToClipboardClick() {
        this._buttonClick$.next();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.1.2", ngImport: i0, type: ClipboardButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.1.2", type: ClipboardButtonComponent, isStandalone: true, selector: "markdown-clipboard", ngImport: i0, template: `
    <button
      class="markdown-clipboard-button"
      [class.copied]="copied()"
      (click)="onCopyToClipboardClick()"
    >{{ copiedText() }}</button>
  `, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.1.2", ngImport: i0, type: ClipboardButtonComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'markdown-clipboard',
                    template: `
    <button
      class="markdown-clipboard-button"
      [class.copied]="copied()"
      (click)="onCopyToClipboardClick()"
    >{{ copiedText() }}</button>
  `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }] });

const CLIPBOARD_OPTIONS = new InjectionToken('CLIPBOARD_OPTIONS');

/* eslint-disable */
class KatexSpecificOptions {
}

class LanguagePipe {
    transform(value, language) {
        if (value == null) {
            value = '';
        }
        if (language == null) {
            language = '';
        }
        if (typeof value !== 'string') {
            console.error(`LanguagePipe has been invoked with an invalid value type [${typeof value}]`);
            return value;
        }
        if (typeof language !== 'string') {
            console.error(`LanguagePipe has been invoked with an invalid parameter [${typeof language}]`);
            return value;
        }
        return '```' + language + '\n' + value + '\n```';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.1.2", ngImport: i0, type: LanguagePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "20.1.2", ngImport: i0, type: LanguagePipe, isStandalone: true, name: "language" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.1.2", ngImport: i0, type: LanguagePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'language',
                }]
        }] });

var PrismPlugin;
(function (PrismPlugin) {
    PrismPlugin["CommandLine"] = "command-line";
    PrismPlugin["LineHighlight"] = "line-highlight";
    PrismPlugin["LineNumbers"] = "line-numbers";
})(PrismPlugin || (PrismPlugin = {}));

const MARKED_EXTENSIONS = new InjectionToken('MARKED_EXTENSIONS');

const MARKED_OPTIONS = new InjectionToken('MARKED_OPTIONS');

const MERMAID_OPTIONS = new InjectionToken('MERMAID_OPTIONS');

const errorJoyPixelsNotLoaded = '[ngx-markdown] When using the `emoji` attribute you *have to* include Emoji-Toolkit files to `angular.json` or use imports. See README for more information';
const errorKatexNotLoaded = '[ngx-markdown] When using the `katex` attribute you *have to* include KaTeX files to `angular.json` or use imports. See README for more information';
const errorMermaidNotLoaded = '[ngx-markdown] When using the `mermaid` attribute you *have to* include Mermaid files to `angular.json` or use imports. See README for more information';
const errorClipboardNotLoaded = '[ngx-markdown] When using the `clipboard` attribute you *have to* include Clipboard files to `angular.json` or use imports. See README for more information';
const errorClipboardViewContainerRequired = '[ngx-markdown] When using the `clipboard` attribute you *have to* provide the `viewContainerRef` parameter to `MarkdownService.render()` function';
const errorSrcWithoutHttpClient = '[ngx-markdown] When using the `src` attribute you *have to* pass the `HttpClient` as a parameter of the `forRoot` method. See README for more information';
const SECURITY_CONTEXT = new InjectionToken('SECURITY_CONTEXT');
class ExtendedRenderer extends Renderer {
    constructor() {
        super(...arguments);
        this.ɵNgxMarkdownRendererExtendedForExtensions = false;
        this.ɵNgxMarkdownRendererExtendedForMermaid = false;
    }
}
class MarkdownService {
    get options() { return this._options; }
    set options(value) {
        this._options = { ...this.DEFAULT_MARKED_OPTIONS, ...value };
    }
    get renderer() { return this.options.renderer; }
    set renderer(value) {
        this.options.renderer = value;
    }
    constructor(clipboardOptions, extensions, options, mermaidOptions, platform, securityContext, http, sanitizer) {
        this.clipboardOptions = clipboardOptions;
        this.extensions = extensions;
        this.mermaidOptions = mermaidOptions;
        this.platform = platform;
        this.securityContext = securityContext;
        this.http = http;
        this.sanitizer = sanitizer;
        this.DEFAULT_MARKED_OPTIONS = {
            renderer: new Renderer(),
        };
        this.DEFAULT_KATEX_OPTIONS = {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\begin{equation}', right: '\\end{equation}', display: true },
                { left: '\\begin{align}', right: '\\end{align}', display: true },
                { left: '\\begin{alignat}', right: '\\end{alignat}', display: true },
                { left: '\\begin{gather}', right: '\\end{gather}', display: true },
                { left: '\\begin{CD}', right: '\\end{CD}', display: true },
                { left: '\\[', right: '\\]', display: true },
            ],
        };
        this.DEFAULT_MERMAID_OPTIONS = {
            startOnLoad: false,
        };
        this.DEFAULT_CLIPBOARD_OPTIONS = {
            buttonComponent: undefined,
        };
        this.DEFAULT_PARSE_OPTIONS = {
            decodeHtml: false,
            inline: false,
            emoji: false,
            mermaid: false,
            markedOptions: undefined,
            disableSanitizer: false,
        };
        this.DEFAULT_RENDER_OPTIONS = {
            clipboard: false,
            clipboardOptions: undefined,
            katex: false,
            katexOptions: undefined,
            mermaid: false,
            mermaidOptions: undefined,
        };
        this._reload$ = new Subject();
        this.reload$ = this._reload$.asObservable();
        this.options = options;
    }
    parse(markdown, parseOptions = this.DEFAULT_PARSE_OPTIONS) {
        const { decodeHtml, inline, emoji, mermaid, disableSanitizer, } = parseOptions;
        const markedOptions = {
            ...this.options,
            ...parseOptions.markedOptions,
        };
        const renderer = markedOptions.renderer || this.renderer || new Renderer();
        if (this.extensions) {
            this.renderer = this.extendsRendererForExtensions(renderer);
        }
        if (mermaid) {
            this.renderer = this.extendsRendererForMermaid(renderer);
        }
        const trimmed = this.trimIndentation(markdown);
        const decoded = decodeHtml ? this.decodeHtml(trimmed) : trimmed;
        const emojified = emoji ? this.parseEmoji(decoded) : decoded;
        const marked = this.parseMarked(emojified, markedOptions, inline);
        const sanitized = disableSanitizer ? marked : this.sanitizer.sanitize(this.securityContext, marked);
        return sanitized || '';
    }
    render(element, options = this.DEFAULT_RENDER_OPTIONS, viewContainerRef) {
        const { clipboard, clipboardOptions, katex, katexOptions, mermaid, mermaidOptions, } = options;
        if (katex) {
            this.renderKatex(element, {
                ...this.DEFAULT_KATEX_OPTIONS,
                ...katexOptions,
            });
        }
        if (mermaid) {
            this.renderMermaid(element, {
                ...this.DEFAULT_MERMAID_OPTIONS,
                ...this.mermaidOptions,
                ...mermaidOptions,
            });
        }
        if (clipboard) {
            this.renderClipboard(element, viewContainerRef, {
                ...this.DEFAULT_CLIPBOARD_OPTIONS,
                ...this.clipboardOptions,
                ...clipboardOptions,
            });
        }
        this.highlight(element);
    }
    reload() {
        this._reload$.next();
    }
    getSource(src) {
        if (!this.http) {
            throw new Error(errorSrcWithoutHttpClient);
        }
        return this.http
            .get(src, { responseType: 'text' })
            .pipe(map(markdown => this.handleExtension(src, markdown)));
    }
    highlight(element) {
        if (!isPlatformBrowser(this.platform)) {
            return;
        }
        if (typeof Prism === 'undefined' || typeof Prism.highlightAllUnder === 'undefined') {
            return;
        }
        if (!element) {
            element = document;
        }
        const noLanguageElements = element.querySelectorAll('pre code:not([class*="language-"])');
        Array.prototype.forEach.call(noLanguageElements, (x) => x.classList.add('language-none'));
        Prism.highlightAllUnder(element);
    }
    decodeHtml(html) {
        if (!isPlatformBrowser(this.platform)) {
            return html;
        }
        const textarea = document.createElement('textarea');
        textarea.innerHTML = html;
        return textarea.value;
    }
    extendsRendererForExtensions(renderer) {
        const extendedRenderer = renderer;
        if (extendedRenderer.ɵNgxMarkdownRendererExtendedForExtensions === true) {
            return renderer;
        }
        if (this.extensions?.length > 0) {
            marked.use(...this.extensions);
        }
        extendedRenderer.ɵNgxMarkdownRendererExtendedForExtensions = true;
        return renderer;
    }
    extendsRendererForMermaid(renderer) {
        const extendedRenderer = renderer;
        if (extendedRenderer.ɵNgxMarkdownRendererExtendedForMermaid === true) {
            return renderer;
        }
        const defaultCode = renderer.code;
        renderer.code = (token) => {
            return token.lang === 'mermaid'
                ? `<div class="mermaid">${token.text}</div>`
                : defaultCode(token);
        };
        extendedRenderer.ɵNgxMarkdownRendererExtendedForMermaid = true;
        return renderer;
    }
    handleExtension(src, markdown) {
        const urlProtocolIndex = src.lastIndexOf('://');
        const urlWithoutProtocol = urlProtocolIndex > -1
            ? src.substring(urlProtocolIndex + 4)
            : src;
        const lastSlashIndex = urlWithoutProtocol.lastIndexOf('/');
        const lastUrlSegment = lastSlashIndex > -1
            ? urlWithoutProtocol.substring(lastSlashIndex + 1).split('?')[0]
            : '';
        const lastDotIndex = lastUrlSegment.lastIndexOf('.');
        const extension = lastDotIndex > -1
            ? lastUrlSegment.substring(lastDotIndex + 1)
            : '';
        return !!extension && extension !== 'md'
            ? '```' + extension + '\n' + markdown + '\n```'
            : markdown;
    }
    parseMarked(html, markedOptions, inline = false) {
        if (markedOptions.renderer) {
            // clone renderer and remove extended flags otherwise
            // marked throws an error thinking it is a renderer prop
            const renderer = { ...markedOptions.renderer };
            delete renderer.ɵNgxMarkdownRendererExtendedForExtensions;
            delete renderer.ɵNgxMarkdownRendererExtendedForMermaid;
            // remove renderer from markedOptions because if renderer is
            // passed to marked.parse method, it will ignore all extensions
            delete markedOptions.renderer;
            marked.use({ renderer });
        }
        return inline
            ? marked.parseInline(html, markedOptions)
            : marked.parse(html, markedOptions);
    }
    parseEmoji(html) {
        if (!isPlatformBrowser(this.platform)) {
            return html;
        }
        if (typeof joypixels === 'undefined' || typeof joypixels.shortnameToUnicode === 'undefined') {
            throw new Error(errorJoyPixelsNotLoaded);
        }
        return joypixels.shortnameToUnicode(html);
    }
    renderKatex(element, options) {
        if (!isPlatformBrowser(this.platform)) {
            return;
        }
        if (typeof katex === 'undefined' || typeof renderMathInElement === 'undefined') {
            throw new Error(errorKatexNotLoaded);
        }
        renderMathInElement(element, options);
    }
    renderClipboard(element, viewContainerRef, options) {
        if (!isPlatformBrowser(this.platform)) {
            return;
        }
        if (typeof ClipboardJS === 'undefined') {
            throw new Error(errorClipboardNotLoaded);
        }
        if (!viewContainerRef) {
            throw new Error(errorClipboardViewContainerRequired);
        }
        const { buttonComponent, buttonTemplate, } = options;
        // target every <pre> elements
        const preElements = element.querySelectorAll('pre');
        for (let i = 0; i < preElements.length; i++) {
            const preElement = preElements.item(i);
            // create <pre> wrapper element
            const preWrapperElement = document.createElement('div');
            preWrapperElement.style.position = 'relative';
            preElement.parentNode.insertBefore(preWrapperElement, preElement);
            preWrapperElement.appendChild(preElement);
            // create toolbar element
            const toolbarWrapperElement = document.createElement('div');
            toolbarWrapperElement.classList.add('markdown-clipboard-toolbar');
            toolbarWrapperElement.style.position = 'absolute';
            toolbarWrapperElement.style.top = '.5em';
            toolbarWrapperElement.style.right = '.5em';
            toolbarWrapperElement.style.zIndex = '1';
            preWrapperElement.insertAdjacentElement('beforeend', toolbarWrapperElement);
            // register listener to show/hide toolbar
            preWrapperElement.onmouseenter = () => toolbarWrapperElement.classList.add('hover');
            preWrapperElement.onmouseleave = () => toolbarWrapperElement.classList.remove('hover');
            // declare embeddedViewRef holding variable
            let embeddedViewRef;
            // use provided component via input property
            // or provided via ClipboardOptions provider
            if (buttonComponent) {
                const componentRef = viewContainerRef.createComponent(buttonComponent);
                embeddedViewRef = componentRef.hostView;
                componentRef.changeDetectorRef.markForCheck();
            }
            // use provided template via input property
            else if (buttonTemplate) {
                embeddedViewRef = viewContainerRef.createEmbeddedView(buttonTemplate);
            }
            // use default component
            else {
                const componentRef = viewContainerRef.createComponent(ClipboardButtonComponent);
                embeddedViewRef = componentRef.hostView;
                componentRef.changeDetectorRef.markForCheck();
            }
            // declare clipboard instance variable
            let clipboardInstance;
            // attach clipboard.js to root node
            embeddedViewRef.rootNodes.forEach((node) => {
                toolbarWrapperElement.appendChild(node);
                clipboardInstance = new ClipboardJS(node, { text: () => preElement.innerText });
            });
            // destroy clipboard instance when view is destroyed
            embeddedViewRef.onDestroy(() => clipboardInstance.destroy());
        }
    }
    renderMermaid(element, options = this.DEFAULT_MERMAID_OPTIONS) {
        if (!isPlatformBrowser(this.platform)) {
            return;
        }
        if (typeof mermaid === 'undefined' || typeof mermaid.initialize === 'undefined') {
            throw new Error(errorMermaidNotLoaded);
        }
        const mermaidElements = element.querySelectorAll('.mermaid');
        if (mermaidElements.length === 0) {
            return;
        }
        mermaid.initialize(options);
        mermaid.run({ nodes: mermaidElements });
    }
    trimIndentation(markdown) {
        if (!markdown) {
            return '';
        }
        let indentStart;
        return markdown
            .split('\n')
            .map(line => {
            let lineIdentStart = indentStart;
            if (line.length > 0) {
                lineIdentStart = isNaN(lineIdentStart)
                    ? line.search(/\S|$/)
                    : Math.min(line.search(/\S|$/), lineIdentStart);
            }
            if (isNaN(indentStart)) {
                indentStart = lineIdentStart;
            }
            return lineIdentStart
                ? line.substring(lineIdentStart)
                : line;
        }).join('\n');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.1.2", ngImport: i0, type: MarkdownService, deps: [{ token: CLIPBOARD_OPTIONS, optional: true }, { token: MARKED_EXTENSIONS, optional: true }, { token: MARKED_OPTIONS, optional: true }, { token: MERMAID_OPTIONS, optional: true }, { token: PLATFORM_ID }, { token: SECURITY_CONTEXT }, { token: i1.HttpClient, optional: true }, { token: i2.DomSanitizer }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.1.2", ngImport: i0, type: MarkdownService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.1.2", ngImport: i0, type: MarkdownService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [CLIPBOARD_OPTIONS]
                }, {
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MARKED_EXTENSIONS]
                }, {
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MARKED_OPTIONS]
                }, {
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MERMAID_OPTIONS]
                }, {
                    type: Optional
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.SecurityContext, decorators: [{
                    type: Inject,
                    args: [SECURITY_CONTEXT]
                }] }, { type: i1.HttpClient, decorators: [{
                    type: Optional
                }] }, { type: i2.DomSanitizer }] });

class MarkdownComponent {
    get disableSanitizer() {
        return this._disableSanitizer;
    }
    set disableSanitizer(value) {
        this._disableSanitizer = this.coerceBooleanProperty(value);
    }
    get inline() {
        return this._inline;
    }
    set inline(value) {
        this._inline = this.coerceBooleanProperty(value);
    }
    // Plugin - clipboard
    get clipboard() {
        return this._clipboard;
    }
    set clipboard(value) {
        this._clipboard = this.coerceBooleanProperty(value);
    }
    // Plugin - emoji
    get emoji() {
        return this._emoji;
    }
    set emoji(value) {
        this._emoji = this.coerceBooleanProperty(value);
    }
    // Plugin - katex
    get katex() {
        return this._katex;
    }
    set katex(value) {
        this._katex = this.coerceBooleanProperty(value);
    }
    // Plugin - mermaid
    get mermaid() {
        return this._mermaid;
    }
    set mermaid(value) {
        this._mermaid = this.coerceBooleanProperty(value);
    }
    // Plugin - lineHighlight
    get lineHighlight() {
        return this._lineHighlight;
    }
    set lineHighlight(value) {
        this._lineHighlight = this.coerceBooleanProperty(value);
    }
    // Plugin - lineNumbers
    get lineNumbers() {
        return this._lineNumbers;
    }
    set lineNumbers(value) {
        this._lineNumbers = this.coerceBooleanProperty(value);
    }
    // Plugin - commandLine
    get commandLine() {
        return this._commandLine;
    }
    set commandLine(value) {
        this._commandLine = this.coerceBooleanProperty(value);
    }
    constructor(element, markdownService, viewContainerRef) {
        this.element = element;
        this.markdownService = markdownService;
        this.viewContainerRef = viewContainerRef;
        // Event emitters
        this.error = new EventEmitter();
        this.load = new EventEmitter();
        this.ready = new EventEmitter();
        this._clipboard = false;
        this._commandLine = false;
        this._disableSanitizer = false;
        this._emoji = false;
        this._inline = false;
        this._katex = false;
        this._lineHighlight = false;
        this._lineNumbers = false;
        this._mermaid = false;
        this.destroyed$ = new Subject();
        // Add this property to your MarkdownComponent class to track the previous state
        this.lastParsedHtml = '';
        this.counter = 1;
    }
    ngOnChanges() {
        this.loadContent();
    }
    loadContent() {
        if (this.data != null) {
            this.handleData();
            return;
        }
        if (this.src != null) {
            this.handleSrc();
            return;
        }
    }
    ngAfterViewInit() {
        if (!this.data && !this.src) {
            this.handleTransclusion();
        }
        this.markdownService.reload$
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => this.loadContent());
    }
    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
    async render(markdown, decodeHtml = false) {
        // These options remain the same
        const parsedOptions = {
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
        const renderOptions = {
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
        const newParsedHtml = await this.markdownService.parse(markdown, parsedOptions);
        // 2. Instead of replacing innerHTML, intelligently patch the live DOM.
        this.patch(this.element.nativeElement, newParsedHtml);
        // 3. Update the last known state for the next render cycle.
        this.lastParsedHtml = newParsedHtml;
        // --- END: THE FIX ---
        // The rest of the original method remains the same
        this.handlePlugins();
        this.markdownService.render(this.element.nativeElement, renderOptions, this.viewContainerRef);
        this.ready.emit();
    }
    /**
     * Intelligently updates the live DOM to match a new HTML structure with minimal changes,
     * preserving selections by avoiding destructive operations on unchanged nodes.
     * @param liveContainer The live DOM element to update.
     * @param newHtmlString The target HTML structure as a string.
     */
    patch(liveContainer, newHtmlString) {
        // Create a temporary, disconnected container to hold the new, ideal DOM structure
        const newContainer = document.createElement('div');
        newContainer.innerHTML = newHtmlString;
        const patchRecursive = (oldNode, newNode) => {
            // If the nodes are identical in every way, we don't need to do anything.
            if (oldNode.isEqualNode(newNode)) {
                return;
            }
            // --- Key Insight for Streaming Text ---
            // If both are text nodes, we check if the new text is an extension of the old.
            // If so, we use `appendData()` which is a non-destructive modification.
            if (oldNode.nodeType === Node.TEXT_NODE &&
                newNode.nodeType === Node.TEXT_NODE) {
                if (oldNode.textContent !== newNode.textContent) {
                    // This is the most important part for preserving selection during streaming.
                    if (newNode.textContent?.startsWith(oldNode.textContent)) {
                        const diff = newNode.textContent.substring(oldNode.textContent.length);
                        oldNode.appendData(diff); // Non-destructive text append
                    }
                    else {
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
                }
                else if (!newChild && oldChild) {
                    // If old nodes were removed, remove them.
                    oldNode.removeChild(oldChild);
                }
                else if (oldChild && newChild) {
                    // If the child exists in both, recursively patch it.
                    patchRecursive(oldChild, newChild);
                }
            }
        };
        // Start the patching process by comparing the top-level children
        const oldLiveChildren = Array.from(liveContainer.childNodes);
        const newVirtualChildren = Array.from(newContainer.childNodes);
        const maxChildrenLength = Math.max(oldLiveChildren.length, newVirtualChildren.length);
        for (let i = 0; i < maxChildrenLength; i++) {
            const oldChild = oldLiveChildren[i];
            const newChild = newVirtualChildren[i];
            if (newChild && !oldChild) {
                liveContainer.appendChild(newChild.cloneNode(true));
            }
            else if (!newChild && oldChild) {
                liveContainer.removeChild(oldChild);
            }
            else if (oldChild && newChild) {
                patchRecursive(oldChild, newChild);
            }
        }
    }
    coerceBooleanProperty(value) {
        return value != null && `${String(value)}` !== 'false';
    }
    getClipboardOptions() {
        if (this.clipboardButtonComponent || this.clipboardButtonTemplate) {
            return {
                buttonComponent: this.clipboardButtonComponent,
                buttonTemplate: this.clipboardButtonTemplate,
            };
        }
        return undefined;
    }
    handleData() {
        this.render(this.data);
    }
    handleSrc() {
        this.markdownService.getSource(this.src).subscribe({
            next: (markdown) => {
                this.render(markdown).then(() => {
                    this.load.emit(markdown);
                });
            },
            error: (error) => this.error.emit(error),
        });
    }
    handleTransclusion() {
        this.render(this.element.nativeElement.innerHTML, true);
    }
    handlePlugins() {
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
    setPluginClass(element, plugin) {
        const preElements = element.querySelectorAll('pre');
        for (let i = 0; i < preElements.length; i++) {
            const classes = plugin instanceof Array ? plugin : [plugin];
            preElements.item(i).classList.add(...classes);
        }
    }
    setPluginOptions(element, options) {
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
    toLispCase(value) {
        const upperChars = value.match(/([A-Z])/g);
        if (!upperChars) {
            return value;
        }
        let str = value.toString();
        for (let i = 0, n = upperChars.length; i < n; i++) {
            str = str.replace(new RegExp(upperChars[i]), '-' + upperChars[i].toLowerCase());
        }
        if (str.slice(0, 1) === '-') {
            str = str.slice(1);
        }
        return str;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.1.2", ngImport: i0, type: MarkdownComponent, deps: [{ token: i0.ElementRef }, { token: MarkdownService }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.1.2", type: MarkdownComponent, isStandalone: true, selector: "markdown, [markdown]", inputs: { data: "data", src: "src", disableSanitizer: "disableSanitizer", inline: "inline", clipboard: "clipboard", clipboardButtonComponent: "clipboardButtonComponent", clipboardButtonTemplate: "clipboardButtonTemplate", emoji: "emoji", katex: "katex", katexOptions: "katexOptions", mermaid: "mermaid", mermaidOptions: "mermaidOptions", lineHighlight: "lineHighlight", line: "line", lineOffset: "lineOffset", lineNumbers: "lineNumbers", start: "start", commandLine: "commandLine", filterOutput: "filterOutput", host: "host", prompt: "prompt", output: "output", user: "user" }, outputs: { error: "error", load: "load", ready: "ready" }, usesOnChanges: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.1.2", ngImport: i0, type: MarkdownComponent, decorators: [{
            type: Component,
            args: [{
                    // eslint-disable-next-line @angular-eslint/component-selector
                    selector: 'markdown, [markdown]',
                    template: '<ng-content></ng-content>',
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: MarkdownService }, { type: i0.ViewContainerRef }], propDecorators: { data: [{
                type: Input
            }], src: [{
                type: Input
            }], disableSanitizer: [{
                type: Input
            }], inline: [{
                type: Input
            }], clipboard: [{
                type: Input
            }], clipboardButtonComponent: [{
                type: Input
            }], clipboardButtonTemplate: [{
                type: Input
            }], emoji: [{
                type: Input
            }], katex: [{
                type: Input
            }], katexOptions: [{
                type: Input
            }], mermaid: [{
                type: Input
            }], mermaidOptions: [{
                type: Input
            }], lineHighlight: [{
                type: Input
            }], line: [{
                type: Input
            }], lineOffset: [{
                type: Input
            }], lineNumbers: [{
                type: Input
            }], start: [{
                type: Input
            }], commandLine: [{
                type: Input
            }], filterOutput: [{
                type: Input
            }], host: [{
                type: Input
            }], prompt: [{
                type: Input
            }], output: [{
                type: Input
            }], user: [{
                type: Input
            }], error: [{
                type: Output
            }], load: [{
                type: Output
            }], ready: [{
                type: Output
            }] } });

class MarkdownPipe {
    constructor(domSanitizer, elementRef, markdownService, viewContainerRef, zone) {
        this.domSanitizer = domSanitizer;
        this.elementRef = elementRef;
        this.markdownService = markdownService;
        this.viewContainerRef = viewContainerRef;
        this.zone = zone;
    }
    async transform(value, options) {
        if (value == null) {
            return '';
        }
        if (typeof value !== 'string') {
            console.error(`MarkdownPipe has been invoked with an invalid value type [${typeof value}]`);
            return value;
        }
        const markdown = await this.markdownService.parse(value, options);
        this.zone.onStable
            .pipe(first())
            .subscribe(() => this.markdownService.render(this.elementRef.nativeElement, options, this.viewContainerRef));
        return this.domSanitizer.bypassSecurityTrustHtml(markdown);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.1.2", ngImport: i0, type: MarkdownPipe, deps: [{ token: i2.DomSanitizer }, { token: i0.ElementRef }, { token: MarkdownService }, { token: i0.ViewContainerRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "20.1.2", ngImport: i0, type: MarkdownPipe, isStandalone: true, name: "markdown" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.1.2", ngImport: i0, type: MarkdownPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'markdown',
                }]
        }], ctorParameters: () => [{ type: i2.DomSanitizer }, { type: i0.ElementRef }, { type: MarkdownService }, { type: i0.ViewContainerRef }, { type: i0.NgZone }] });

function provideMarkdown(markdownModuleConfig) {
    return [
        MarkdownService,
        markdownModuleConfig?.loader ?? [],
        markdownModuleConfig?.clipboardOptions ?? [],
        markdownModuleConfig?.markedOptions ?? [],
        markdownModuleConfig?.mermaidOptions ?? [],
        markdownModuleConfig?.markedExtensions ?? [],
        {
            provide: SECURITY_CONTEXT,
            useValue: markdownModuleConfig?.sanitize ?? SecurityContext.HTML,
        },
    ];
}

;
;
const sharedDeclarations = [
    ClipboardButtonComponent,
    LanguagePipe,
    MarkdownComponent,
    MarkdownPipe,
];
class MarkdownModule {
    static forRoot(markdownModuleConfig) {
        return {
            ngModule: MarkdownModule,
            providers: [
                provideMarkdown(markdownModuleConfig),
            ],
        };
    }
    static forChild() {
        return {
            ngModule: MarkdownModule,
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.1.2", ngImport: i0, type: MarkdownModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.1.2", ngImport: i0, type: MarkdownModule, imports: [ClipboardButtonComponent,
            LanguagePipe,
            MarkdownComponent,
            MarkdownPipe], exports: [ClipboardButtonComponent,
            LanguagePipe,
            MarkdownComponent,
            MarkdownPipe] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.1.2", ngImport: i0, type: MarkdownModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.1.2", ngImport: i0, type: MarkdownModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: sharedDeclarations,
                    exports: sharedDeclarations,
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { CLIPBOARD_OPTIONS, ClipboardButtonComponent, ExtendedRenderer, KatexSpecificOptions, LanguagePipe, MARKED_EXTENSIONS, MARKED_OPTIONS, MERMAID_OPTIONS, MarkdownComponent, MarkdownModule, MarkdownPipe, MarkdownService, PrismPlugin, SECURITY_CONTEXT, errorClipboardNotLoaded, errorClipboardViewContainerRequired, errorJoyPixelsNotLoaded, errorKatexNotLoaded, errorMermaidNotLoaded, errorSrcWithoutHttpClient, provideMarkdown };
//# sourceMappingURL=ngx-markdown.mjs.map
