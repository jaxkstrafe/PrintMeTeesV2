// text-editor.js - Advanced Text Editing Module with Performance Optimizations

class TextEditor {
    constructor(designer) {
        this.designer = designer;
        this.activeTextElement = null;
        this.isEditing = false;
        this.livePreviewDisabled = false; // Performance flag
        this.fonts = [
            'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
            'Courier New', 'Impact', 'Comic Sans MS', 'Trebuchet MS',
            'Arial Black', 'Palatino', 'Garamond', 'Bookman', 'Avant Garde'
        ];
        
        this.init();
    }

    init() {
        this.createTextEditor();
        this.bindEvents();
    }

    createTextEditor() {
        // Create text editor panel
        const textPanel = document.getElementById('textPanel');
        if (!textPanel) return;

        // Clear existing content and rebuild
        textPanel.innerHTML = `
            <h4>Text Editor</h4>
            <div class="text-editor-content">
                <!-- Basic Text Input -->
                <div class="text-input-section">
                    <textarea id="textInput" placeholder="Enter your text" rows="3"></textarea>
                </div>

                <!-- Text Style Controls -->
                <div class="text-controls-grid">
                    <!-- Font Family -->
                    <div class="control-group">
                        <label>Font:</label>
                        <select id="fontFamily">
                            ${this.fonts.map(font => `<option value="${font}">${font}</option>`).join('')}
                        </select>
                    </div>

                    <!-- Font Size -->
                    <div class="control-group">
                        <label>Size:</label>
                        <div class="size-control">
                            <input type="range" id="fontSize" min="8" max="120" value="24">
                            <span id="fontSizeDisplay">24px</span>
                        </div>
                    </div>

                    <!-- Text Color -->
                    <div class="control-group">
                        <label>Color:</label>
                        <input type="color" id="textColor" value="#000000">
                    </div>

                    <!-- Text Rotation -->
                    <div class="control-group">
                        <label>Rotation:</label>
                        <div class="rotation-control">
                            <input type="range" id="textRotation" min="-180" max="180" value="0">
                            <span id="rotationDisplay">0°</span>
                        </div>
                    </div>

                    <!-- Text Curve -->
                    <div class="control-group">
                        <label>Curve:</label>
                        <div class="curve-control">
                            <input type="range" id="textCurve" min="-100" max="100" value="0">
                            <span id="curveDisplay">0%</span>
                        </div>
                    </div>

                    <!-- Outline -->
                    <div class="control-group">
                        <label>Outline:</label>
                        <div class="outline-controls">
                            <input type="checkbox" id="textOutline">
                            <input type="color" id="outlineColor" value="#ffffff">
                            <input type="range" id="outlineWidth" min="0" max="5" value="1" step="0.5">
                        </div>
                    </div>

                    <!-- Text Effects -->
                    <div class="control-group">
                        <label>Effects:</label>
                        <div class="effect-buttons">
                            <button type="button" id="boldToggle" class="effect-btn">B</button>
                            <button type="button" id="italicToggle" class="effect-btn">I</button>
                            <button type="button" id="underlineToggle" class="effect-btn">U</button>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="text-editor-actions">
                    <button id="addText" class="primary-btn">Add Text</button>
                    <button id="updateText" class="primary-btn" style="display: none;">Update Text</button>
                    <button id="duplicateText" class="secondary-btn" style="display: none;">Duplicate</button>
                    <button id="cancelEdit" class="secondary-btn" style="display: none;">Cancel</button>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Font size slider
        const fontSizeSlider = document.getElementById('fontSize');
        const fontSizeDisplay = document.getElementById('fontSizeDisplay');
        if (fontSizeSlider && fontSizeDisplay) {
            fontSizeSlider.addEventListener('input', () => {
                fontSizeDisplay.textContent = fontSizeSlider.value + 'px';
                this.updateLivePreview();
            });
        }

        // Rotation slider
        const rotationSlider = document.getElementById('textRotation');
        const rotationDisplay = document.getElementById('rotationDisplay');
        if (rotationSlider && rotationDisplay) {
            rotationSlider.addEventListener('input', () => {
                rotationDisplay.textContent = rotationSlider.value + '°';
                this.updateLivePreview();
            });
        }

        // Curve slider
        const curveSlider = document.getElementById('textCurve');
        const curveDisplay = document.getElementById('curveDisplay');
        if (curveSlider && curveDisplay) {
            curveSlider.addEventListener('input', () => {
                curveDisplay.textContent = curveSlider.value + '%';
                this.updateLivePreview();
            });
        }

        // Live preview for all controls (debounced for better performance)
        const controls = ['fontFamily', 'textColor', 'outlineColor', 'outlineWidth'];
        controls.forEach(controlId => {
            const control = document.getElementById(controlId);
            if (control) {
                control.addEventListener('input', () => this.updateLivePreview());
            }
        });

        // Text input live preview
        const textInput = document.getElementById('textInput');
        if (textInput) {
            textInput.addEventListener('input', () => this.updateLivePreview());
            textInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.addOrUpdateText();
                }
            });
        }

        // Effect toggles
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

        // Outline checkbox
        document.getElementById('textOutline')?.addEventListener('change', () => {
            this.updateLivePreview();
        });

        // Action buttons
        document.getElementById('addText')?.addEventListener('click', () => this.addOrUpdateText());
        document.getElementById('updateText')?.addEventListener('click', () => this.addOrUpdateText());
        document.getElementById('duplicateText')?.addEventListener('click', () => this.duplicateText());
        document.getElementById('cancelEdit')?.addEventListener('click', () => this.cancelEdit());

        // REMOVED: Global document click listener that was interfering with dragging
        // The old global listener was causing performance issues during drag operations
    }

    // Performance control methods
    disableLivePreview() {
        this.livePreviewDisabled = true;
    }

    enableLivePreview() {
        this.livePreviewDisabled = false;
    }

    updateLivePreview() {
        // Respect the disabled flag to prevent interference during drag operations
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
            // Update existing text
            this.activeTextElement.textContent = textInput.value;
            this.applyTextStyles(this.activeTextElement);
            this.finishEditing();
        } else {
            // Create new text element
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
        textElement.style.position = 'absolute';
        textElement.style.left = (bounds.x + 20) + 'px';
        textElement.style.top = (bounds.y + 50) + 'px';
        textElement.style.cursor = 'move';
        textElement.style.userSelect = 'none';
        textElement.style.zIndex = '10';
        textElement.textContent = text;

        // Apply current styles
        this.applyTextStyles(textElement);

        canvas.appendChild(textElement);
        this.designer.elements[this.designer.currentView].push(textElement);
        this.designer.makeDraggable(textElement);

        // Add click-to-edit functionality
        this.makeTextEditable(textElement);
    }

    // OPTIMIZED: Removed global click handler, using direct element handlers only
    makeTextEditable(textElement) {
        // Use direct event handlers on the element instead of global document listener
        textElement.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.editText(textElement);
        });
        
        // Add a single click handler that doesn't interfere with dragging
        textElement.addEventListener('click', (e) => {
            // Only trigger edit mode if we're not dragging and element is already selected
            if (!e.defaultPrevented && textElement.classList.contains('selected')) {
                // Small delay to differentiate from drag start
                setTimeout(() => {
                    if (textElement.classList.contains('selected')) {
                        this.editText(textElement);
                    }
                }, 150);
            }
        });
    }

    editText(textElement) {
        if (this.isEditing) {
            this.finishEditing();
        }

        this.activeTextElement = textElement;
        this.isEditing = true;

        // Switch to text tool
        this.designer.activateTool('text');

        // Populate editor with current values
        this.populateEditor(textElement);

        // Update UI
        this.showEditingMode();

        // Highlight the element being edited
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

        if (textInput) textInput.value = textElement.textContent;
        
        // Extract current styles
        const computedStyle = window.getComputedStyle(textElement);
        
        if (fontSize) {
            const currentSize = parseInt(computedStyle.fontSize);
            fontSize.value = currentSize;
            document.getElementById('fontSizeDisplay').textContent = currentSize + 'px';
        }

        if (fontFamily) {
            fontFamily.value = computedStyle.fontFamily.replace(/['"]/g, '');
        }

        if (textColor) {
            textColor.value = this.rgbToHex(computedStyle.color);
        }

        // Get transform values
        const transform = textElement.style.transform || '';
        const rotateMatch = transform.match(/rotate\(([^)]+)\)/);
        if (rotateMatch && textRotation) {
            const rotation = parseInt(rotateMatch[1]);
            textRotation.value = rotation;
            document.getElementById('rotationDisplay').textContent = rotation + '°';
        }

        // Get curve value from data attribute
        if (textCurve) {
            const curve = textElement.dataset.curve || '0';
            textCurve.value = curve;
            document.getElementById('curveDisplay').textContent = curve + '%';
        }

        // Get outline properties
        if (textOutline) {
            const hasOutline = computedStyle.webkitTextStroke && computedStyle.webkitTextStroke !== 'initial';
            textOutline.checked = hasOutline;
        }

        // Update effect buttons
        document.getElementById('boldToggle')?.classList.toggle('active', 
            computedStyle.fontWeight === 'bold' || parseInt(computedStyle.fontWeight) >= 700);
        document.getElementById('italicToggle')?.classList.toggle('active', 
            computedStyle.fontStyle === 'italic');
        document.getElementById('underlineToggle')?.classList.toggle('active', 
            computedStyle.textDecoration.includes('underline'));
    }

    applyTextStyles(textElement) {
        const fontSize = document.getElementById('fontSize')?.value || '24';
        const fontFamily = document.getElementById('fontFamily')?.value || 'Arial';
        const textColor = document.getElementById('textColor')?.value || '#000000';
        const textRotation = document.getElementById('textRotation')?.value || '0';
        const textCurve = document.getElementById('textCurve')?.value || '0';
        const textOutline = document.getElementById('textOutline')?.checked || false;
        const outlineColor = document.getElementById('outlineColor')?.value || '#ffffff';
        const outlineWidth = document.getElementById('outlineWidth')?.value || '1';

        // Update text input if editing
        const textInput = document.getElementById('textInput');
        if (textInput && textInput.value.trim()) {
            textElement.textContent = textInput.value;
        }

        // Apply basic styles
        textElement.style.fontSize = fontSize + 'px';
        textElement.style.fontFamily = fontFamily;
        textElement.style.color = textColor;

        // Apply effects
        const isBold = document.getElementById('boldToggle')?.classList.contains('active');
        const isItalic = document.getElementById('italicToggle')?.classList.contains('active');
        const isUnderline = document.getElementById('underlineToggle')?.classList.contains('active');

        textElement.style.fontWeight = isBold ? 'bold' : 'normal';
        textElement.style.fontStyle = isItalic ? 'italic' : 'normal';
        textElement.style.textDecoration = isUnderline ? 'underline' : 'none';

        // Apply rotation
        let transform = `rotate(${textRotation}deg)`;

        // Apply curve effect
        if (parseInt(textCurve) !== 0) {
            textElement.dataset.curve = textCurve;
            // Create curved text using CSS transform-origin and multiple spans
            this.applyCurveEffect(textElement, parseInt(textCurve));
        } else {
            textElement.style.transform = transform;
        }

        // Apply outline
        if (textOutline) {
            textElement.style.webkitTextStroke = `${outlineWidth}px ${outlineColor}`;
            textElement.style.textStroke = `${outlineWidth}px ${outlineColor}`;
        } else {
            textElement.style.webkitTextStroke = 'initial';
            textElement.style.textStroke = 'initial';
        }
    }

    applyCurveEffect(textElement, curveAmount) {
        // Simple curve effect using CSS transforms
        const rotation = document.getElementById('textRotation')?.value || '0';
        const skewAmount = curveAmount * 0.3; // Scale curve to reasonable skew
        textElement.style.transform = `rotate(${rotation}deg) skewY(${skewAmount}deg)`;
    }

    duplicateText() {
        if (!this.activeTextElement) return;

        // Create a copy of the active element
        const original = this.activeTextElement;
        const clone = original.cloneNode(true);
        
        // Position slightly offset
        const currentLeft = parseInt(original.style.left) || 0;
        const currentTop = parseInt(original.style.top) || 0;
        clone.style.left = (currentLeft + 20) + 'px';
        clone.style.top = (currentTop + 20) + 'px';
        
        // Remove editing state
        clone.classList.remove('editing', 'selected');
        
        // Add to canvas and elements array
        const canvas = document.getElementById('tshirtCanvas');
        canvas.appendChild(clone);
        this.designer.elements[this.designer.currentView].push(clone);
        
        // Make it draggable and editable
        this.designer.makeDraggable(clone);
        this.makeTextEditable(clone);
        
        // Select the new element
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
        if (this.activeTextElement) {
            this.activeTextElement.classList.remove('editing');
        }
        
        this.activeTextElement = null;
        this.isEditing = false;

        document.getElementById('addText').style.display = 'block';
        document.getElementById('updateText').style.display = 'none';
        document.getElementById('duplicateText').style.display = 'none';
        document.getElementById('cancelEdit').style.display = 'none';

        // Clear text input
        const textInput = document.getElementById('textInput');
        if (textInput) textInput.value = '';
    }

    cancelEdit() {
        this.finishEditing();
    }

    // Utility function to convert RGB to HEX
    rgbToHex(rgb) {
        if (rgb.startsWith('#')) return rgb;
        
        const rgbMatch = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!rgbMatch) return '#000000';
        
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Save text data for export
    getTextElementData(textElement) {
        return {
            content: textElement.textContent,
            styles: {
                fontSize: textElement.style.fontSize,
                fontFamily: textElement.style.fontFamily,
                color: textElement.style.color,
                fontWeight: textElement.style.fontWeight,
                fontStyle: textElement.style.fontStyle,
                textDecoration: textElement.style.textDecoration,
                transform: textElement.style.transform,
                webkitTextStroke: textElement.style.webkitTextStroke,
                curve: textElement.dataset.curve || '0'
            },
            position: {
                x: parseInt(textElement.style.left) || 0,
                y: parseInt(textElement.style.top) || 0
            }
        };
    }

    // Load text data from save
    loadTextElementData(elementData, view) {
        const canvas = document.getElementById('tshirtCanvas');
        if (!canvas) return;

        const textElement = document.createElement('div');
        textElement.className = 'draggable text-element';
        textElement.style.position = 'absolute';
        textElement.style.left = elementData.position.x + 'px';
        textElement.style.top = elementData.position.y + 'px';
        textElement.style.cursor = 'move';
        textElement.style.userSelect = 'none';
        textElement.style.zIndex = '10';
        textElement.textContent = elementData.content;
        textElement.style.display = view === this.designer.currentView ? 'block' : 'none';

        // Apply saved styles
        Object.assign(textElement.style, elementData.styles);
        if (elementData.styles.curve) {
            textElement.dataset.curve = elementData.styles.curve;
        }

        canvas.appendChild(textElement);
        this.designer.elements[view].push(textElement);
        this.designer.makeDraggable(textElement);
        this.makeTextEditable(textElement);
    }
}

// Export for use in main script
window.TextEditor = TextEditor;