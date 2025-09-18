// text-editor.js - Advanced Text Editing Module with True Curved Preview + Outline fix

class TextEditor {
    constructor(designer) {
        this.designer = designer;
        this.activeTextElement = null;
        this.isEditing = false;
        this.livePreviewDisabled = false;

        this.fonts = [
            'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
            'Courier New', 'Impact', 'Comic Sans MS', 'Trebuchet MS',
            'Arial Black', 'Palatino', 'Garamond', 'Bookman', 'Avant Garde'
        ];

        // Offscreen canvas for fast width measurement
        const c = document.createElement('canvas');
        this.measureCtx = c.getContext('2d');

        this.init();
    }

    init() {
        this.createTextEditor();
        this.bindEvents();
    }

    createTextEditor() {
        const textPanel = document.getElementById('textPanel');
        if (!textPanel) return;

        textPanel.innerHTML = `
            <h4>Text Editor</h4>
            <div class="text-editor-content">
                <div class="text-input-section">
                    <textarea id="textInput" placeholder="Enter your text" rows="3"></textarea>
                </div>

                <div class="text-controls-grid">
                    <div class="control-group">
                        <label>Font:</label>
                        <select id="fontFamily">
                            ${this.fonts.map(font => `<option value="${font}">${font}</option>`).join('')}
                        </select>
                    </div>

                    <div class="control-group">
                        <label>Size:</label>
                        <div class="size-control">
                            <input type="range" id="fontSize" min="8" max="120" value="24">
                            <span id="fontSizeDisplay">24px</span>
                        </div>
                    </div>

                    <div class="control-group">
                        <label>Color:</label>
                        <input type="color" id="textColor" value="#000000">
                    </div>

                    <div class="control-group">
                        <label>Rotation:</label>
                        <div class="rotation-control">
                            <input type="range" id="textRotation" min="-180" max="180" value="0">
                            <span id="rotationDisplay">0°</span>
                        </div>
                    </div>

                    <div class="control-group">
                        <label>Curve:</label>
                        <div class="curve-control">
                            <input type="range" id="textCurve" min="-100" max="100" value="0">
                            <span id="curveDisplay">0%</span>
                        </div>
                    </div>

                    <div class="control-group">
                        <label>Outline:</label>
                        <div class="outline-controls">
                            <input type="checkbox" id="textOutline">
                            <input type="color" id="outlineColor" value="#ffffff">
                            <input type="range" id="outlineWidth" min="0" max="5" value="1" step="0.5">
                        </div>
                    </div>

                    <div class="control-group">
                        <label>Effects:</label>
                        <div class="effect-buttons">
                            <button type="button" id="boldToggle" class="effect-btn">B</button>
                            <button type="button" id="italicToggle" class="effect-btn">I</button>
                            <button type="button" id="underlineToggle" class="effect-btn">U</button>
                        </div>
                    </div>
                </div>

                <div class="text-editor-actions">
                    <button id="addText" class="primary-btn">Add Text</button>
                    <button id="updateText" class="primary-btn" style="display:none;">Update Text</button>
                    <button id="duplicateText" class="secondary-btn" style="display:none;">Duplicate</button>
                    <button id="cancelEdit" class="secondary-btn" style="display:none;">Cancel</button>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const fontSizeSlider = document.getElementById('fontSize');
        const fontSizeDisplay = document.getElementById('fontSizeDisplay');
        fontSizeSlider?.addEventListener('input', () => {
            fontSizeDisplay.textContent = fontSizeSlider.value + 'px';
            this.updateLivePreview();
        });

        const rotationSlider = document.getElementById('textRotation');
        const rotationDisplay = document.getElementById('rotationDisplay');
        rotationSlider?.addEventListener('input', () => {
            rotationDisplay.textContent = rotationSlider.value + '°';
            this.updateLivePreview();
        });

        const curveSlider = document.getElementById('textCurve');
        const curveDisplay = document.getElementById('curveDisplay');
        curveSlider?.addEventListener('input', () => {
            curveDisplay.textContent = curveSlider.value + '%';
            this.updateLivePreview();
        });

        ['fontFamily', 'textColor', 'outlineColor', 'outlineWidth'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', () => this.updateLivePreview());
        });

        const textInput = document.getElementById('textInput');
        textInput?.addEventListener('input', () => this.updateLivePreview());
        textInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.addOrUpdateText();
            }
        });

        document.getElementById('boldToggle')?.addEventListener('click', () => {
            document.getElementById('boldToggle').classList.toggle('active');
            this.updateLivePreview();
        });
        document.getElementById('italicToggle')?.addEventListener('click', () => {
            document.getElementById('italicToggle').classList.toggle('active');
            this.updateLivePreview();
        });
        document.getElementById('underlineToggle')?.addEventListener('click', () => {
            document.getElementById('underlineToggle').classList.toggle('active');
            this.updateLivePreview();
        });

        document.getElementById('textOutline')?.addEventListener('change', () => this.updateLivePreview());

        document.getElementById('addText')?.addEventListener('click', () => this.addOrUpdateText());
        document.getElementById('updateText')?.addEventListener('click', () => this.addOrUpdateText());
        document.getElementById('duplicateText')?.addEventListener('click', () => this.duplicateText());
        document.getElementById('cancelEdit')?.addEventListener('click', () => this.cancelEdit());
    }

    // Performance toggles used by the main designer during drag
    disableLivePreview() { this.livePreviewDisabled = true; }
    enableLivePreview()  { this.livePreviewDisabled = false; }

    updateLivePreview() {
        if (this.livePreviewDisabled) return;
        if (this.activeTextElement && this.isEditing) {
            this.applyTextStyles(this.activeTextElement);
        }
    }

    addOrUpdateText() {
        const textInput = document.getElementById('textInput');
        if (!textInput || !textInput.value.trim()) {
            alert('Please enter some text');
            return;
        }

        if (this.isEditing && this.activeTextElement) {
            this.activeTextElement.dataset.rawText = textInput.value;
            this.applyTextStyles(this.activeTextElement);
            this.finishEditing();
        } else {
            this.createNewTextElement(textInput.value);
            textInput.value = '';
        }
    }

    createNewTextElement(text) {
        const canvas = document.getElementById('tshirtCanvas');
        if (!canvas) return;

        const bounds = this.designer.customizationBounds[this.designer.currentView];
        const textElement = document.createElement('div');

        textElement.className = 'draggable text-element';
        Object.assign(textElement.style, {
            position: 'absolute',
            left: (bounds.x + 20) + 'px',
            top: (bounds.y + 50) + 'px',
            cursor: 'move',
            userSelect: 'none',
            zIndex: '10',
            touchAction: 'none',
            // Important: do NOT pre-set any outline values
            WebkitTextStroke: '0px transparent',
            textStroke: '0px transparent'
        });

        // Keep the raw text (used for curved layout & export)
        textElement.dataset.rawText = text;

        // Apply current UI styles & render
        this.applyTextStyles(textElement);

        canvas.appendChild(textElement);
        this.designer.elements[this.designer.currentView].push(textElement);
        this.designer.makeDraggable(textElement);

        this.makeTextEditable(textElement);
    }

    makeTextEditable(textElement) {
        textElement.addEventListener('dblclick', (e) => {
            e.preventDefault(); e.stopPropagation();
            this.editText(textElement);
        });

        textElement.addEventListener('click', (e) => {
            if (textElement.classList.contains('selected')) {
                setTimeout(() => {
                    if (textElement.classList.contains('selected')) this.editText(textElement);
                }, 150);
            }
        });
    }

    editText(textElement) {
        if (this.isEditing) this.finishEditing();

        this.activeTextElement = textElement;
        this.isEditing = true;

        this.designer.activateTool('text');
        this.populateEditor(textElement);
        this.showEditingMode();

        document.querySelectorAll('.draggable').forEach(el => el.classList.remove('editing'));
        textElement.classList.add('editing');
    }

    populateEditor(textElement) {
        const textInput = document.getElementById('textInput');
        const fontSize = document.getElementById('fontSize');
        const fontFamily = document.getElementById('fontFamily');
        const textColor = document.getElementById('textColor');
        const textRotation = document.getElementById('textRotation');
        const textCurve = document.getElementById('textCurve');
        const textOutline = document.getElementById('textOutline');
        const outlineColor = document.getElementById('outlineColor');
        const outlineWidth = document.getElementById('outlineWidth');

        if (textInput) textInput.value = textElement.dataset.rawText || textElement.textContent || '';

        const cs = window.getComputedStyle(textElement);

        if (fontSize) {
            const s = parseInt(cs.fontSize) || 24;
            fontSize.value = s;
            document.getElementById('fontSizeDisplay').textContent = s + 'px';
        }
        if (fontFamily) fontFamily.value = cs.fontFamily.replace(/['"]/g, '');
        if (textColor)  textColor.value = this.rgbToHex(cs.color);

        // transform rotate(...) only; curve handled separately
        const m = (textElement.style.transform || '').match(/rotate\(([-\d.]+)deg\)/);
        const rot = m ? parseInt(m[1]) : 0;
        if (textRotation) {
            textRotation.value = rot;
            document.getElementById('rotationDisplay').textContent = rot + '°';
        }

        if (textCurve) {
            const curve = textElement.dataset.curve || '0';
            textCurve.value = curve;
            document.getElementById('curveDisplay').textContent = curve + '%';
        }

        // Outline: only true if checkbox checked
        const hasStroke = !!(textElement.dataset.outlineOn === '1');
        if (textOutline) textOutline.checked = hasStroke;
        if (outlineColor) outlineColor.value = textElement.dataset.outlineColor || '#ffffff';
        if (outlineWidth) outlineWidth.value = textElement.dataset.outlineWidth || '1';

        document.getElementById('boldToggle')?.classList.toggle(
            'active', cs.fontWeight === 'bold' || parseInt(cs.fontWeight) >= 700
        );
        document.getElementById('italicToggle')?.classList.toggle('active', cs.fontStyle === 'italic');
        document.getElementById('underlineToggle')?.classList.toggle('active', cs.textDecoration.includes('underline'));
    }

    applyTextStyles(textElement) {
        // Gather control values
        const fontSize = parseFloat(document.getElementById('fontSize')?.value || '24');
        const fontFamily = document.getElementById('fontFamily')?.value || 'Arial';
        const textColor = document.getElementById('textColor')?.value || '#000000';
        const textRotation = parseFloat(document.getElementById('textRotation')?.value || '0');
        const curve = parseFloat(document.getElementById('textCurve')?.value || '0');

        const isBold = document.getElementById('boldToggle')?.classList.contains('active');
        const isItalic = document.getElementById('italicToggle')?.classList.contains('active');
        const isUnderline = document.getElementById('underlineToggle')?.classList.contains('active');

        const outlineOn = !!document.getElementById('textOutline')?.checked;
        const outlineColor = document.getElementById('outlineColor')?.value || '#ffffff';
        const outlineWidth = parseFloat(document.getElementById('outlineWidth')?.value || '1');

        // Save some flags on element (used for PNG export & re-open)
        textElement.dataset.curve = String(curve);
        textElement.dataset.outlineOn = outlineOn ? '1' : '0';
        textElement.dataset.outlineColor = outlineColor;
        textElement.dataset.outlineWidth = String(outlineWidth);

        // Base font styles
        textElement.style.fontSize = fontSize + 'px';
        textElement.style.fontFamily = fontFamily;
        textElement.style.color = textColor;
        textElement.style.fontWeight = isBold ? 'bold' : 'normal';
        textElement.style.fontStyle = isItalic ? 'italic' : 'normal';
        textElement.style.textDecoration = isUnderline ? 'underline' : 'none';

        // Outline: apply only if checkbox is checked
        if (outlineOn) {
            textElement.style.webkitTextStroke = `${outlineWidth}px ${outlineColor}`;
            textElement.style.textStroke = `${outlineWidth}px ${outlineColor}`;
        } else {
            textElement.style.webkitTextStroke = '0px transparent';
            textElement.style.textStroke = '0px transparent';
        }

        // Rotation (applies to the whole block)
        textElement.style.transform = `rotate(${textRotation}deg)`;

        // Render curved or straight
        const raw = (document.getElementById('textInput')?.value.trim() || textElement.dataset.rawText || '');
        textElement.dataset.rawText = raw;

        if (curve === 0) {
            // Straight text (simple)
            textElement.innerText = raw;
        } else {
            this.renderCurvedText(textElement, raw, {
                fontSize, fontFamily, isBold, isItalic, curve
            });
        }
    }

    /**
     * True arced text rendering (DOM spans). Positive curve => arch up, negative => arch down.
     * Curve range expected: -100..100 (we map to -120..120 degrees of total arc).
     */
    renderCurvedText(container, text, opts) {
        const { fontSize, fontFamily, isBold, isItalic, curve } = opts;
        const fontWeight = isBold ? 'bold' : 'normal';
        const fontStyle  = isItalic ? 'italic' : 'normal';

        // Measure per-char widths with canvas (fast and layout-free)
        this.measureCtx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
        const chars = [...text];
        const widths = chars.map(ch => this.measureCtx.measureText(ch).width);
        const totalWidth = widths.reduce((a,b)=>a+b, 0) || 1;

        // Map curve to arc
        const totalArcDeg = (Math.max(-100, Math.min(100, curve)) / 100) * 120; // up to ±120°
        const totalArcRad = totalArcDeg * Math.PI / 180;

        // radius derived from chord length vs arc angle; clamp minimum to avoid extreme bends
        const minRadius = fontSize * 1.5;
        const radius = Math.max(minRadius, totalWidth / (Math.abs(totalArcRad) || 0.0001));

        // setup container for absolute-positioned glyph spans
        container.innerHTML = '';
        container.style.position = 'absolute';
        container.style.display = 'block';
        container.style.height = Math.ceil(fontSize * 2.5) + 'px';
        container.style.width = Math.ceil(totalWidth) + 'px';

        container.style.lineHeight = '1';
        container.style.whiteSpace = 'nowrap';

        container.style.transformOrigin = 'center center'; // rotation happens around center
        container.style.pointerEvents = 'auto';

        const upward = totalArcDeg > 0 ? -1 : 1; // negative y moves up on screen

        // We center around the middle of the text width
        let cumulative = 0;
        for (let i = 0; i < chars.length; i++) {
            const ch = chars[i];
            const cw = widths[i];

            // character center progress along the string (0..1)
            const tCenter = (cumulative + cw / 2) / totalWidth;
            const theta = (-totalArcRad / 2) + (tCenter * totalArcRad); // -halfArc .. +halfArc

            const span = document.createElement('span');
            span.textContent = ch === ' ' ? '\u00A0' : ch; // keep spaces
            span.style.position = 'absolute';
            span.style.display = 'inline-block';
            span.style.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
            span.style.transformOrigin = 'center center';
            span.style.left = (totalWidth / 2) + 'px';
            span.style.top = (container.clientHeight / 2) + 'px';

            // Place each glyph on the circle and orient upright
            // Translate to circle center, rotate by theta, then move back down/up by radius,
            // and finally counter-rotate so glyph sits upright.
            span.style.transform =
                `translate(-50%, -50%)
                 translate(0px, ${upward * -radius}px)
                 rotate(${theta}rad)
                 translate(0, ${upward * radius}px)
                 rotate(${-theta}rad)`;

            container.appendChild(span);
            cumulative += cw;
        }
    }

    duplicateText() {
        if (!this.activeTextElement) return;
        const original = this.activeTextElement;
        const clone = original.cloneNode(true);

        const currentLeft = parseInt(original.style.left) || 0;
        const currentTop  = parseInt(original.style.top) || 0;
        clone.style.left = (currentLeft + 20) + 'px';
        clone.style.top  = (currentTop + 20) + 'px';

        clone.classList.remove('editing', 'selected');

        const canvas = document.getElementById('tshirtCanvas');
        canvas.appendChild(clone);
        this.designer.elements[this.designer.currentView].push(clone);

        this.designer.makeDraggable(clone);
        this.makeTextEditable(clone);

        this.finishEditing();
        this.editText(clone);
    }

    showEditingMode() {
        document.getElementById('addText').style.display = 'none';
        document.getElementById('updateText').style.display = 'block';
        document.getElementById('duplicateText').style.display = 'block';
        document.getElementById('cancelEdit').style.display = 'block';
    }

    finishEditing() {
        if (this.activeTextElement) this.activeTextElement.classList.remove('editing');
        this.activeTextElement = null;
        this.isEditing = false;

        document.getElementById('addText').style.display = 'block';
        document.getElementById('updateText').style.display = 'none';
        document.getElementById('duplicateText').style.display = 'none';
        document.getElementById('cancelEdit').style.display = 'none';

        const textInput = document.getElementById('textInput');
        if (textInput) textInput.value = '';
    }

    cancelEdit() { this.finishEditing(); }

    // Utility: RGB -> HEX
    rgbToHex(rgb) {
        if (!rgb) return '#000000';
        if (rgb.startsWith('#')) return rgb;
        const m = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!m) return '#000000';
        const r = (+m[1]).toString(16).padStart(2,'0');
        const g = (+m[2]).toString(16).padStart(2,'0');
        const b = (+m[3]).toString(16).padStart(2,'0');
        return `#${r}${g}${b}`;
    }

    // Export helpers used by script.js
    getTextElementData(textElement) {
        return {
            content: textElement.dataset.rawText || textElement.textContent,
            styles: {
                fontSize: textElement.style.fontSize,
                fontFamily: textElement.style.fontFamily,
                color: textElement.style.color,
                fontWeight: textElement.style.fontWeight,
                fontStyle: textElement.style.fontStyle,
                textDecoration: textElement.style.textDecoration,
                transform: textElement.style.transform,
                webkitTextStroke: textElement.style.webkitTextStroke || '',
                curve: textElement.dataset.curve || '0'
            },
            position: {
                x: parseInt(textElement.style.left) || 0,
                y: parseInt(textElement.style.top) || 0
            }
        };
    }

    loadTextElementData(elementData, view) {
        const canvas = document.getElementById('tshirtCanvas');
        if (!canvas) return;

        const textElement = document.createElement('div');
        textElement.className = 'draggable text-element';
        Object.assign(textElement.style, {
            position: 'absolute',
            left: elementData.position.x + 'px',
            top: elementData.position.y + 'px',
            cursor: 'move',
            userSelect: 'none',
            zIndex: '10',
            touchAction: 'none',
            display: view === this.designer.currentView ? 'block' : 'none'
        });

        Object.assign(textElement.style, elementData.styles);
        textElement.dataset.rawText = elementData.content || '';
        if (elementData.styles.curve) textElement.dataset.curve = elementData.styles.curve;

        // Ensure outline defaults are respected
        if (!elementData.styles.webkitTextStroke) {
            textElement.style.webkitTextStroke = '0px transparent';
            textElement.style.textStroke = '0px transparent';
        }

        // Render with curve if needed
        if (parseFloat(textElement.dataset.curve || '0') !== 0) {
            this.renderCurvedText(textElement, textElement.dataset.rawText, {
                fontSize: parseFloat(textElement.style.fontSize) || 24,
                fontFamily: textElement.style.fontFamily || 'Arial',
                isBold: (textElement.style.fontWeight || '').toString() === 'bold' || parseInt(textElement.style.fontWeight) >= 700,
                isItalic: (textElement.style.fontStyle || '') === 'italic',
                curve: parseFloat(textElement.dataset.curve)
            });
        } else {
            textElement.innerText = textElement.dataset.rawText;
        }

        canvas.appendChild(textElement);
        this.designer.elements[view].push(textElement);
        this.designer.makeDraggable(textElement);
        this.makeTextEditable(textElement);
    }
}

// Export
window.TextEditor = TextEditor;
