// script.js

class TShirtDesigner {
    constructor() {
        this.currentProduct = null;
        this.currentView = 'front';
        this.currentColor = { name: 'White', hex: '#ffffff', url: 'https://cdn.ssactivewear.com/Images/ColorSwatch/33742_fm.jpg' };
        this.elements = { front: [], side: [], back: [] };
        this.draggedElement = null;

        // ACTIVE IMAGE (logo) state for controls
        this.activeImageEl = null;

        // TextEditor instance (initialized in init())
        this.textEditor = null;

        // S&S Activewear / Gildan 5000 swatches
        this.swatches = [
            {name:'White', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33742_fm.jpg', hex: '#ffffff'},
            {name:'Black', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33681_fm.jpg', hex: '#000000'},
            {name:'Antique Cherry Red', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33673_fm.jpg', hex: '#a0282c'},
            {name:'Antique Irish Green', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33674_fm.jpg', hex: '#1c5234'},
            {name:'Antique Jade Dome', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33675_fm.jpg', hex: '#4a6741'},
            {name:'Antique Orange', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33676_fm.jpg', hex: '#cc6600'},
            {name:'Antique Sapphire', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33677_fm.jpg', hex: '#1e3a5f'},
            {name:'Aquatic', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/35529_fm.jpg', hex: '#00a0b0'},
            {name:'Ash', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33678_fm.jpg', hex: '#c6c2b6'},
            {name:'Azalea', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33679_fm.jpg', hex: '#f17ba0'},
            {name:'Berry', url:'https://cdn.ssactivewear.com/Images/ColorSwash/33680_fm.jpg', hex: '#a8226b'},
            {name:'Blackberry', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33682_fm.jpg', hex: '#4c2c4a'},
            {name:'Blue Dusk', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/35527_fm.jpg', hex: '#7bb3da'},
            {name:'Brown Savana', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33683_fm.jpg', hex: '#8b4513'},
            {name:'Cardinal', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33684_fm.jpg', hex: '#c8102e'},
            {name:'Carolina Blue', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33685_fm.jpg', hex: '#4b9cd3'},
            {name:'Charcoal', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33686_fm.jpg', hex: '#36454f'},
            {name:'Cobalt', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33687_fm.jpg', hex: '#0047ab'},
            {name:'Coral Silk', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33688_fm.jpg', hex: '#f88379'},
            {name:'Cornsilk', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33689_fm.jpg', hex: '#fff8dc'},
            {name:'Daisy', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33690_fm.jpg', hex: '#ffed4e'},
            {name:'Dark Chocolate', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33691_fm.jpg', hex: '#3c1810'},
            {name:'Dark Heather', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33692_fm.jpg', hex: '#616161'},
            {name:'Dusty Rose', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/35528_fm.jpg', hex: '#dcae96'},
            {name:'Electric Green', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33693_fm.jpg', hex: '#00ff00'},
            {name:'Forest Green', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33694_fm.jpg', hex: '#013220'},
            {name:'Garnet', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33695_fm.jpg', hex: '#733635'},
            {name:'Gold', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33696_fm.jpg', hex: '#ffd700'},
            {name:'Graphite Heather', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33697_fm.jpg', hex: '#1c2951'},
            {name:'Gravel', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33698_fm.jpg', hex: '#8a8680'},
            {name:'Heather Military Green', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33699_fm.jpg', hex: '#5a6650'},
            {name:'Heather Navy', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33700_fm.jpg', hex: '#36454f'},
            {name:'Heather Radiant Orchid', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33701_fm.jpg', hex: '#b565a7'},
            {name:'Heather Red', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33702_fm.jpg', hex: '#cc0000'},
            {name:'Heather Sapphire', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33703_fm.jpg', hex: '#2e5090'},
            {name:'Heliconia', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33704_fm.jpg', hex: '#df73ff'},
            {name:'Ice Grey', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33705_fm.jpg', hex: '#b9c0c9'},
            {name:'Indigo Blue', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33706_fm.jpg', hex: '#1e3a8a'},
            {name:'Iris', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/7545_fm.jpg', hex: '#5a4fcf'},
            {name:'Irish Green', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33707_fm.jpg', hex: '#009639'},
            {name:'Jade Dome', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/6433_fm.jpg', hex: '#00a693'},
            {name:'Kiwi', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33708_fm.jpg', hex: '#8ee53f'},
            {name:'Light Blue', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33709_fm.jpg', hex: '#add8e6'},
            {name:'Light Pink', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33710_fm.jpg', hex: '#ffb6c1'},
            {name:'Lilac', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33711_fm.jpg', hex: '#c8a2c8'},
            {name:'Lime', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33712_fm.jpg', hex: '#00ff00'},
            {name:'Maroon', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33713_fm.jpg', hex: '#800000'},
            {name:'Midnight', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33714_fm.jpg', hex: '#191970'},
            {name:'Military Green', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33715_fm.jpg', hex: '#4b5320'},
            {name:'Mint Green', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33716_fm.jpg', hex: '#98ff98'},
            {name:'Natural', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33717_fm.jpg', hex: '#f5f5dc'},
            {name:'Navy', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33718_fm.jpg', hex: '#000080'},
            {name:'Neon Blue', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33719_fm.jpg', hex: '#1b03a3'},
            {name:'Neon Green', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33720_fm.jpg', hex: '#39ff14'},
            {name:'Off White', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/35526_fm.jpg', hex: '#faf0e6'},
            {name:'Old Gold', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33721_fm.jpg', hex: '#cfb53b'},
            {name:'Orange', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33722_fm.jpg', hex: '#ff8c00'},
            {name:'Purple', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33723_fm.jpg', hex: '#800080'},
            {name:'Red', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33724_fm.jpg', hex: '#ff0000'},
            {name:'Royal', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33725_fm.jpg', hex: '#4169e1'},
            {name:'Russet', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33726_fm.jpg', hex: '#80461b'},
            {name:'Safety Green', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33727_fm.jpg', hex: '#32cd32'},
            {name:'Safety Orange', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33728_fm.jpg', hex: '#ff6600'},
            {name:'Safety Pink', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33729_fm.jpg', hex: '#ff1493'},
            {name:'Sand', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33730_fm.jpg', hex: '#c2b280'},
            {name:'Sapphire', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33731_fm.jpg', hex: '#0f52ba'},
            {name:'Sky', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33732_fm.jpg', hex: '#87ceeb'},
            {name:'Sport Grey', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33733_fm.jpg', hex: '#9e9e9e'},
            {name:'Sunset', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33734_fm.jpg', hex: '#fad5a5'},
            {name:'Tangerine', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33735_fm.jpg', hex: '#f28500'},
            {name:'Tennessee Orange', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33736_fm.jpg', hex: '#ff8200'},
            {name:'Texas Orange', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33737_fm.jpg', hex: '#bf5700'},
            {name:'Tropical Blue', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33738_fm.jpg', hex: '#00b7eb'},
            {name:'Turf Green', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33739_fm.jpg', hex: '#2e8b57'},
            {name:'Tweed', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33740_fm.jpg', hex: '#a0522d'},
            {name:'Violet', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33741_fm.jpg', hex: '#8a2be2'},
            {name:'Yellow Haze', url:'https://cdn.ssactivewear.com/Images/ColorSwatch/33743_fm.jpg', hex: '#ffff99'}
        ];

        // Product-specific color availability
        this.productColors = {
            'tshirt': this.swatches,
            'longsleeve': this.swatches.filter(s => ['White', 'Black', 'Navy', 'Ash', 'Sport Grey', 'Red', 'Royal'].includes(s.name)),
            'polo': this.swatches.filter(s => ['White', 'Black', 'Navy', 'Red', 'Royal', 'Forest Green'].includes(s.name)),
            'hoodie': this.swatches.filter(s => ['White', 'Black', 'Navy', 'Charcoal', 'Sport Grey', 'Red'].includes(s.name))
        };

        // Customization boundaries for each view
        this.customizationBounds = {
            front: { x: 165, y: 120, width: 275, height: 350 },
            side:  { x: 265,  y: 100, width: 130, height: 175 },
            back:  { x: 165, y: 80, width: 275, height: 400 }
        };

        // Product template images
        this.productImages = {
            tshirt: {
                front: '/Products/tshirtfront.png',
                side: '/Products/tshirtside.png',
                back: '/Products/tshirtback.png',
            },
            longsleeve: {
                front: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+',
                side:  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+',
                back:  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+'
            },
            polo: {
                front: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+',
                side:  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+',
                back:  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+'
            },
            hoodie: {
                front: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+',
                side:  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+',
                back:  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+'
            }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.showPage('productSelection');

        // Initialize the advanced text editor if available
        if (window.TextEditor && document.getElementById('textPanel')) {
            this.textEditor = new window.TextEditor(this);
        } else {
            this.textEditor = null;
        }

        // Build Image (logo) Controls UI inside the Upload panel
        this.buildImageControls();
        this.syncImageControls(); // start disabled until an image is selected
    }

    // Build Image Controls UI dynamically (no HTML edits required)
    buildImageControls() {
        const panel = document.getElementById('uploadPanel');
        if (!panel || document.getElementById('imageControls')) return;

        const controls = document.createElement('div');
        controls.id = 'imageControls';
        controls.style.marginTop = '1rem';
        controls.innerHTML = `
            <h4 style="margin-bottom:.5rem">Image Controls</h4>
            <div class="text-controls-grid">
                <div class="control-group">
                    <label>Size</label>
                    <div class="size-control">
                        <input type="range" id="imageSize" min="40" max="600" value="120">
                        <span id="imageSizeDisplay">120px</span>
                    </div>
                </div>
                <div class="control-group">
                    <label>Rotation</label>
                    <div class="rotation-control">
                        <input type="range" id="imageRotation" min="-180" max="180" value="0">
                        <span id="imageRotationDisplay">0°</span>
                    </div>
                </div>
                <div class="control-group">
                    <label>Flip</label>
                    <div class="effect-buttons">
                        <button type="button" id="flipH" class="secondary-btn" title="Flip Horizontal">Flip H</button>
                        <button type="button" id="flipV" class="secondary-btn" title="Flip Vertical">Flip V</button>
                    </div>
                </div>
                <div class="text-editor-actions">
                    <button id="duplicateImage" class="secondary-btn">Duplicate</button>
                </div>
            </div>
        `;
        panel.appendChild(controls);

        // Bind control events
        document.getElementById('imageSize')?.addEventListener('input', () => this.applyImageSizeFromUI());
        document.getElementById('imageRotation')?.addEventListener('input', () => this.applyImageRotationFromUI());
        document.getElementById('duplicateImage')?.addEventListener('click', () => this.duplicateActiveImage());
        document.getElementById('flipH')?.addEventListener('click', () => this.flipActiveImage(true, false));
        document.getElementById('flipV')?.addEventListener('click', () => this.flipActiveImage(false, true));
    }

    // ===== Masked color layer =====
    ensureColorLayer() {
        const canvas = document.getElementById('tshirtCanvas');
        if (!canvas) return null;

        if (getComputedStyle(canvas).position === 'static') {
            canvas.style.position = 'relative';
        }
        canvas.style.touchAction = 'none';

        let layer = canvas.querySelector('#tshirtColorLayer');
        if (!layer) {
            layer = document.createElement('div');
            layer.id = 'tshirtColorLayer';
            layer.className = 'tshirt-color-layer';
            canvas.appendChild(layer);
        }
        return layer;
    }

    applyColorMask(imgSrc) {
        const layer = this.ensureColorLayer();
        if (!layer) return;

        Object.assign(layer.style, {
            position: 'absolute',
            inset: '0',
            zIndex: '2',
            pointerEvents: 'none',
            mixBlendMode: 'multiply',
            maskImage: `url(${imgSrc})`,
            WebkitMaskImage: `url(${imgSrc})`,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskSize: 'contain',
            WebkitMaskSize: 'contain'
        });
    }

    // ===== Geometry helpers for boundary-aware logic =====
    _getCanvasRect() {
        const canvas = document.getElementById('tshirtCanvas');
        return canvas ? canvas.getBoundingClientRect() : null;
    }
    _getBoundaryRect() {
        const canvas = document.getElementById('tshirtCanvas');
        if (!canvas) return null;
        const boundaryEl = canvas.querySelector('.customization-boundary');
        if (boundaryEl) return boundaryEl.getBoundingClientRect();

        // Fallback: compute from numeric bounds if boundary not in DOM yet
        const cRect = canvas.getBoundingClientRect();
        const b = this.customizationBounds[this.currentView];
        return new DOMRect(cRect.left + b.x, cRect.top + b.y, b.width, b.height);
    }
    _getElementRect(el) {
        return el.getBoundingClientRect();
    }

    // Keep element inside boundary; if too big to fit, optionally shrink to fit
    _fitElementWithinBoundary(el) {
        const bRect = this._getBoundaryRect();
        const eRect = this._getElementRect(el);
        if (!bRect || !eRect) return;

        // If the rotated bounding box exceeds boundary, scale down via image width
        if (eRect.width > bRect.width || eRect.height > bRect.height) {
            const scale = Math.min(bRect.width / eRect.width, bRect.height / eRect.height);
            const img = el.querySelector('img');
            if (img) {
                const currentW = parseFloat(img.style.width) || img.getBoundingClientRect().width;
                const newW = Math.max(40, Math.floor(currentW * scale));
                img.style.maxWidth = 'none';
                img.style.maxHeight = 'none';
                img.style.width = newW + 'px';
                img.style.height = 'auto';
                // reflect in UI
                const sizeInput = document.getElementById('imageSize');
                const sizeDisp  = document.getElementById('imageSizeDisplay');
                if (sizeInput) sizeInput.value = Math.min(600, Math.max(40, newW));
                if (sizeDisp) sizeDisp.textContent = (sizeInput ? sizeInput.value : newW) + 'px';
            }
        }
    }
    _clampElementWithinBoundary(el) {
        const bRect = this._getBoundaryRect();
        const eRect = this._getElementRect(el);
        if (!bRect || !eRect) return;

        let dx = 0, dy = 0;
        if (eRect.left < bRect.left) dx += (bRect.left - eRect.left);
        if (eRect.right > bRect.right) dx -= (eRect.right - bRect.right);
        if (eRect.top < bRect.top) dy += (bRect.top - eRect.top);
        if (eRect.bottom > bRect.bottom) dy -= (eRect.bottom - bRect.bottom);

        if (dx !== 0 || dy !== 0) {
            const left = parseFloat(el.style.left) || 0;
            const top  = parseFloat(el.style.top) || 0;
            el.style.left = (left + dx) + 'px';
            el.style.top  = (top + dy) + 'px';
        }
    }
    _fitAndClamp(el) {
        // First shrink if necessary, then clamp into the box
        this._fitElementWithinBoundary(el);
        this._clampElementWithinBoundary(el);
    }

    bindEvents() {
        // Product selection events
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const productType = e.currentTarget.dataset.product;
                this.selectProduct(productType);
            });
        });

        // Back to products button
        const backBtn = document.getElementById('backToProducts');
        if (backBtn) backBtn.addEventListener('click', () => this.showPage('productSelection'));

        // Tool button events
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                this.activateTool(tool);
            });
        });

        // View tab events
        document.querySelectorAll('.view-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Color selection events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-option')) {
                const colorData = JSON.parse(e.target.dataset.colorData || '{}');
                if (colorData && colorData.name) this.changeProductColor(colorData);
            }
        });

        // File upload events
        const logoUpload = document.getElementById('logoUpload');
        if (logoUpload) {
            logoUpload.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files[0]);
            });
        }

        // Text addition events (guarded — injected by TextEditor)
        const addTextBtn = document.getElementById('addText');
        if (addTextBtn) addTextBtn.addEventListener('click', () => this.addTextElement());
        const textInputEl = document.getElementById('textInput');
        if (textInputEl) {
            textInputEl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addTextElement();
            });
        }

        // Canvas background click (deselect)
        const canvas = document.getElementById('tshirtCanvas');
        if (canvas) {
            canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        }

        // Action buttons
        const saveBtn = document.getElementById('saveDesign');
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveDesign());
        const priceBtn = document.getElementById('getPrice');
        if (priceBtn) priceBtn.addEventListener('click', () => this.getPrice());

        // Prevent default drag behavior on images
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') e.preventDefault();
        });

        // Keyboard shortcuts (guard typing in inputs/editors)
        document.addEventListener('keydown', (e) => {
            const ae = document.activeElement;
            const editing = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable);
            if (!editing && (e.key === 'Delete' || e.key === 'Backspace')) {
                this.deleteSelectedElement();
            }
        });
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        const page = document.getElementById(pageId);
        if (page) page.classList.add('active');
    }

    selectProduct(productType) {
        this.currentProduct = productType;
        this.updateProductInfo(productType);
        this.updateProductCanvas(productType);
        this.updateColorOptions(productType);
        this.updateViewTabs(); // ensure right-side thumbnails match selected product
        this.showPage('designerPage');
    }

    updateColorOptions(productType) {
        const colorsPanel = document.getElementById('colorsPanel');
        if (!colorsPanel) return;
        const colorGrid = colorsPanel.querySelector('.color-grid');
        if (!colorGrid) return;

        colorGrid.innerHTML = '';

        const availableColors = this.productColors[productType] || this.swatches;

        availableColors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundImage = `url(${color.url})`;
            colorOption.dataset.colorData = JSON.stringify(color);
            colorOption.title = color.name;

            if (color.name === 'White') {
                colorOption.classList.add('selected');
                this.currentColor = color;
            }

            colorGrid.appendChild(colorOption);
        });

        this.changeProductColor(this.currentColor);
    }

    updateProductCanvas(productType) {
        const canvas = document.getElementById('tshirtCanvas');
        if (!canvas) return;

        // Ensure color layer is present first
        this.ensureColorLayer();

        // Remove existing product image and boundary
        const existingImage = canvas.querySelector('.tshirt-view-image');
        const existingBoundary = canvas.querySelector('.customization-boundary');
        if (existingImage) existingImage.remove();
        if (existingBoundary) existingBoundary.remove();

        // Add new product template image
        if (this.productImages[productType] && this.productImages[productType][this.currentView]) {
            const img = document.createElement('img');
            img.className = 'tshirt-view-image';
            img.src = this.productImages[productType][this.currentView];

            Object.assign(img.style, {
                position: 'absolute',
                inset: '0',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                zIndex: '1',
                pointerEvents: 'none'
            });

            canvas.appendChild(img);

            // Apply the masking to the color layer using this image
            this.applyColorMask(img.src);
        }

        // Add customization boundary on top
        this.addCustomizationBoundary();

        // Refresh view tab thumbnails
        this.updateViewTabs();
    }

    addCustomizationBoundary() {
        const canvas = document.getElementById('tshirtCanvas');
        if (!canvas) return;
        const bounds = this.customizationBounds[this.currentView];
        if (!bounds) return;

        const boundary = document.createElement('div');
        boundary.className = 'customization-boundary';
        Object.assign(boundary.style, {
            left: bounds.x + 'px',
            top: bounds.y + 'px',
            width: bounds.width + 'px',
            height: bounds.height + 'px',
            position: 'absolute',
            border: '2px dashed #3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            pointerEvents: 'none',
            zIndex: '5',
            borderRadius: '8px'
        });

        const label = document.createElement('div');
        label.textContent = this.currentView === 'front' ? 'Left Chest' :
                            this.currentView === 'side'  ? 'Sleeve'     : 'Back Print';
        Object.assign(label.style, {
            position: 'absolute',
            top: '-25px',
            left: '0',
            fontSize: '12px',
            color: '#3b82f6',
            backgroundColor: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid #3b82f6'
        });

        boundary.appendChild(label);
        canvas.appendChild(boundary);
    }

    updateProductInfo(productType) {
        const productInfo = this.getProductInfo(productType);
        const nameEl = document.getElementById('selectedProductName');
        const priceEl = document.getElementById('selectedProductPrice');
        if (nameEl) nameEl.textContent = productInfo.name;
        if (priceEl) priceEl.textContent = productInfo.price;
    }

    getProductInfo(productType) {
        const products = {
            tshirt: { name: 'Classic T-Shirt', price: '$19.99' },
            longsleeve: { name: 'Long Sleeve Tee', price: '$24.99' },
            polo: { name: 'Performance Polo', price: '$34.99' },
            hoodie: { name: 'Pullover Hoodie', price: '$39.99' }
        };
        return products[productType] || products.tshirt;
    }

    activateTool(tool) {
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));

        const toolBtn = document.querySelector(`[data-tool="${tool}"]`);
        if (toolBtn) toolBtn.classList.add('active');

        const panels = { upload: 'uploadPanel', text: 'textPanel', colors: 'colorsPanel' };
        if (panels[tool]) {
            const panel = document.getElementById(panels[tool]);
            if (panel) panel.classList.add('active');
        }
    }

    switchView(view) {
        this.currentView = view;

        // Update tabs
        document.querySelectorAll('.view-tab').forEach(tab => tab.classList.remove('active'));
        const activeTab = document.querySelector(`[data-view="${view}"]`);
        if (activeTab) activeTab.classList.add('active');

        // Hide all elements
        document.querySelectorAll('.draggable').forEach(el => { el.style.display = 'none'; });

        // Show current view elements
        (this.elements[view] || []).forEach(el => { el.style.display = 'block'; });

        // Clear active image (nothing selected on view change)
        this.activeImageEl = null;
        this.syncImageControls();

        // Update the template and mask for the new view
        this.updateProductCanvas(this.currentProduct);

        // Keep thumbnails/labels in sync
        this.updateViewTabs();
    }

    changeProductColor(colorData) {
        this.currentColor = colorData;

        // Only tint the shirt (masked color layer)
        const colorLayer = this.ensureColorLayer();
        if (colorLayer) {
            colorLayer.style.backgroundColor = colorData.hex;
        }

        // Update color selection appearance
        document.querySelectorAll('.color-option').forEach(option => option.classList.remove('selected'));
        const currentOption = [...document.querySelectorAll('.color-option')].find(option => {
            try {
                const optionData = JSON.parse(option.dataset.colorData || '{}');
                return optionData.name === colorData.name;
            } catch { return false; }
        });
        if (currentOption) currentOption.classList.add('selected');

        const colorNameEl = document.getElementById('selectedProductColor');
        if (colorNameEl) colorNameEl.textContent = colorData.name;
    }

    handleFileUpload(file) {
        if (!file) return;
        if (!file.type.startsWith('image/')) { alert('Please upload an image file.'); return; }

        const reader = new FileReader();
        reader.onload = (e) => this.addImageElement(e.target.result);
        reader.readAsDataURL(file);
    }

    addImageElement(src) {
        const canvas = document.getElementById('tshirtCanvas');
        if (!canvas) return;
        const bounds = this.customizationBounds[this.currentView];

        const img = document.createElement('img');
        const container = document.createElement('div');

        container.className = 'draggable';
        Object.assign(container.style, {
            position: 'absolute',
            left: (bounds.x + 20) + 'px',
            top: (bounds.y + 20) + 'px',
            zIndex: '10',
            touchAction: 'none',
            transform: 'rotate(0deg)'
        });
        // transform state dataset
        container.dataset.rot = '0';
        container.dataset.flipH = '0';
        container.dataset.flipV = '0';

        img.src = src;

        // Let width drive size; remove max constraints so slider can scale freely
        img.style.maxWidth = 'none';
        img.style.maxHeight = 'none';
        img.style.width = '120px';
        img.style.height = 'auto';
        img.style.pointerEvents = 'none';

        container.appendChild(img);
        canvas.appendChild(container);

        this.elements[this.currentView].push(container);
        this.makeDraggable(container);

        // Auto-select new image for immediate control
        document.querySelectorAll('.draggable').forEach(el => el.classList.remove('selected'));
        container.classList.add('selected');
        this.onElementSelected(container);

        // Ensure inside box initially
        this._fitAndClamp(container);
    }

    // ===== Text (fallback when editor not loaded) =====
    addTextElement() {
        if (this.textEditor) {
            this.textEditor.addOrUpdateText();
            return;
        }

        const textInput = document.getElementById('textInput');
        const fontSize = document.getElementById('fontSize');
        const textColor = document.getElementById('textColor');
        if (!textInput || !fontSize || !textColor) return;
        if (!textInput.value.trim()) { alert('Please enter some text'); return; }

        const canvas = document.getElementById('tshirtCanvas');
        if (!canvas) return;
        const bounds = this.customizationBounds[this.currentView];
        const textElement = document.createElement('div');

        textElement.className = 'draggable text-element';
        Object.assign(textElement.style, {
            position: 'absolute',
            left: (bounds.x + 20) + 'px',
            top: (bounds.y + 50) + 'px',
            fontSize: (fontSize.value || 24) + 'px',
            color: textColor.value || '#000000',
            cursor: 'move',
            userSelect: 'none',
            zIndex: '10',
            touchAction: 'none'
        });
        textElement.textContent = textInput.value;

        canvas.appendChild(textElement);
        this.elements[this.currentView].push(textElement);
        this.makeDraggable(textElement);

        if (this.textEditor) this.textEditor.makeTextEditable(textElement);

        textInput.value = '';
    }

    // ===== Draggable =====
    makeDraggable(element) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        element.style.touchAction = 'none';

        const onPointerMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            const bounds = this.customizationBounds[this.currentView];
            let newX = startLeft + dx;
            let newY = startTop + dy;

            // Simple (non-rotated) clamp while dragging
            if (bounds) {
                newX = Math.max(bounds.x, Math.min(bounds.x + bounds.width - element.offsetWidth, newX));
                newY = Math.max(bounds.y, Math.min(bounds.y + bounds.height - element.offsetHeight, newY));
            }

            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
        };

        const onPointerUp = (e) => {
            if (!isDragging) return;
            isDragging = false;

            // Re-enable TextEditor live preview if it exists
            if (this.textEditor && this.textEditor.enableLivePreview) {
                this.textEditor.enableLivePreview();
            }

            // After drag ends, clamp precisely with rotated bounds
            this._clampElementWithinBoundary(element);

            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            element.style.cursor = 'grab';
            document.body.style.cursor = '';
            try { element.releasePointerCapture(e.pointerId); } catch {}
        };

        element.addEventListener('pointerdown', (e) => {
            e.preventDefault();

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseFloat(element.style.left) || 0;
            startTop = parseFloat(element.style.top) || 0;

            // Disable TextEditor live preview during drag to prevent performance issues
            if (this.textEditor && this.textEditor.disableLivePreview) {
                this.textEditor.disableLivePreview();
            }

            // Selection visuals
            document.querySelectorAll('.draggable').forEach(el => el.classList.remove('selected'));
            element.classList.add('selected');

            // Notify selection (updates image controls if this is an image)
            this.onElementSelected(element);

            // Visual feedback
            element.style.cursor = 'grabbing';
            document.body.style.cursor = 'grabbing';

            try { element.setPointerCapture(e.pointerId); } catch {}

            document.addEventListener('pointermove', onPointerMove, { passive: true });
            document.addEventListener('pointerup', onPointerUp);
        });

        element.addEventListener('mouseenter', () => {
            if (!isDragging) element.style.cursor = 'grab';
        });

        element.addEventListener('mouseleave', () => {
            if (!isDragging) element.style.cursor = 'default';
        });

        // Double-click behavior
        element.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.textEditor && element.classList.contains('text-element')) {
                this.textEditor.editText(element);
            } else if (!element.classList.contains('text-element')) {
                if (confirm('Delete this element?')) this.removeElement(element);
            }
        });
    }

    // ===== Selection & Image Controls =====
    onElementSelected(element) {
        const isImage = !element.classList.contains('text-element') && element.querySelector('img');
        this.activeImageEl = isImage ? element : null;

        if (this.activeImageEl) {
            // Initialize dataset transform state from existing style (for loaded designs)
            this._initTransformDatasetFromStyle(this.activeImageEl);
        }
        this.syncImageControls();
    }

    _initTransformDatasetFromStyle(el) {
        if (!el) return;
        const t = el.style.transform || '';
        if (el.dataset.rot == null) {
            const m = t.match(/rotate\(([-\d.]+)deg\)/);
            el.dataset.rot = m ? String(parseFloat(m[1])) : '0';
        }
        if (el.dataset.flipH == null || el.dataset.flipV == null) {
            let sx = 1, sy = 1;
            const sxm = t.match(/scaleX\(([-\d.]+)\)/);
            const sym = t.match(/scaleY\(([-\d.]+)\)/);
            const sm  = t.match(/scale\(([-\d.]+)\s*,\s*([-\d.]+)\)/);
            if (sxm) sx = parseFloat(sxm[1]);
            if (sym) sy = parseFloat(sym[1]);
            if (sm)  { sx = parseFloat(sm[1]); sy = parseFloat(sm[2]); }
            el.dataset.flipH = sx < 0 ? '1' : '0';
            el.dataset.flipV = sy < 0 ? '1' : '0';
        }
        // Normalize transform based on dataset
        this._applyTransformFromDataset(el);
    }

    _applyTransformFromDataset(el) {
        const rot = parseFloat(el.dataset.rot || '0');
        const flipH = el.dataset.flipH === '1';
        const flipV = el.dataset.flipV === '1';
        const sx = flipH ? -1 : 1;
        const sy = flipV ? -1 : 1;
        el.style.transform = `scale(${sx}, ${sy}) rotate(${rot}deg)`;
    }

    syncImageControls() {
        const sizeInput = document.getElementById('imageSize');
        const sizeDisp  = document.getElementById('imageSizeDisplay');
        const rotInput  = document.getElementById('imageRotation');
        const rotDisp   = document.getElementById('imageRotationDisplay');
        const dupBtn    = document.getElementById('duplicateImage');
        const flipHB    = document.getElementById('flipH');
        const flipVB    = document.getElementById('flipV');

        const enable = !!(this.activeImageEl && this.activeImageEl.querySelector('img'));
        [sizeInput, rotInput, dupBtn, flipHB, flipVB].forEach(ctrl => { if (ctrl) ctrl.disabled = !enable; });

        if (!enable) {
            if (sizeDisp) sizeDisp.textContent = '-';
            if (rotDisp) rotDisp.textContent = '-';
            return;
        }

        const img = this.activeImageEl.querySelector('img');
        const widthPx = parseInt(img.style.width) || Math.round(img.getBoundingClientRect().width);
        const rot = parseFloat(this.activeImageEl.dataset.rot || '0');

        if (sizeInput) sizeInput.value = Math.min(600, Math.max(40, widthPx));
        if (sizeDisp)  sizeDisp.textContent = (sizeInput ? sizeInput.value : widthPx) + 'px';

        if (rotInput) rotInput.value = rot;
        if (rotDisp)  rotDisp.textContent = rot + '°';
    }

    applyImageSizeFromUI() {
        if (!this.activeImageEl) return;
        const sizeInput = document.getElementById('imageSize');
        const sizeDisp  = document.getElementById('imageSizeDisplay');
        const img = this.activeImageEl.querySelector('img');
        if (!img || !sizeInput) return;

        const w = parseInt(sizeInput.value) || 120;
        img.style.maxWidth = 'none';
        img.style.maxHeight = 'none';
        img.style.width = w + 'px';
        img.style.height = 'auto';

        if (sizeDisp) sizeDisp.textContent = w + 'px';

        // Keep the image inside the print box after resizing
        this._fitAndClamp(this.activeImageEl);
    }

    applyImageRotationFromUI() {
        if (!this.activeImageEl) return;
        const rotInput = document.getElementById('imageRotation');
        const rotDisp  = document.getElementById('imageRotationDisplay');
        if (!rotInput) return;

        const deg = parseFloat(rotInput.value) || 0;
        this.activeImageEl.dataset.rot = String(deg);
        this._applyTransformFromDataset(this.activeImageEl);

        if (rotDisp) rotDisp.textContent = deg + '°';

        // After rotating, ensure it still fits/clamps inside
        this._fitAndClamp(this.activeImageEl);
    }

    flipActiveImage(flipH = false, flipV = false) {
        if (!this.activeImageEl) return;
        if (flipH) {
            this.activeImageEl.dataset.flipH = this.activeImageEl.dataset.flipH === '1' ? '0' : '1';
        }
        if (flipV) {
            this.activeImageEl.dataset.flipV = this.activeImageEl.dataset.flipV === '1' ? '0' : '1';
        }
        this._applyTransformFromDataset(this.activeImageEl);

        // Keep inside after flip
        this._fitAndClamp(this.activeImageEl);
    }

    duplicateActiveImage() {
        if (!this.activeImageEl) return;
        const original = this.activeImageEl;
        const clone = original.cloneNode(true);

        // Offset the clone a bit
        const currentLeft = parseFloat(original.style.left) || 0;
        const currentTop  = parseFloat(original.style.top)  || 0;
        clone.style.left = (currentLeft + 20) + 'px';
        clone.style.top  = (currentTop + 20) + 'px';

        // Ensure handlers for new element
        clone.classList.remove('selected');
        this.makeDraggable(clone);

        // Copy dataset transform state and re-apply normalized transform
        clone.dataset.rot = original.dataset.rot || '0';
        clone.dataset.flipH = original.dataset.flipH || '0';
        clone.dataset.flipV = original.dataset.flipV || '0';
        this._applyTransformFromDataset(clone);

        const canvas = document.getElementById('tshirtCanvas');
        canvas.appendChild(clone);
        this.elements[this.currentView].push(clone);

        // Select the clone and sync controls
        document.querySelectorAll('.draggable').forEach(el => el.classList.remove('selected'));
        clone.classList.add('selected');
        this.onElementSelected(clone);

        // Make sure the clone is inside the box
        this._fitAndClamp(clone);
    }

    removeElement(element) {
        element.remove();
        const viewElements = this.elements[this.currentView];
        const index = viewElements.indexOf(element);
        if (index > -1) viewElements.splice(index, 1);

        if (this.activeImageEl === element) {
            this.activeImageEl = null;
            this.syncImageControls();
        }
    }

    deleteSelectedElement() {
        const selected = document.querySelector('.draggable.selected');
        if (selected) this.removeElement(selected);
    }

    handleMouseDown(e) {
        if (e.target.id === 'tshirtCanvas' || e.target.classList.contains('tshirt-color-layer')) {
            document.querySelectorAll('.draggable').forEach(el => el.classList.remove('selected'));
            this.activeImageEl = null;
            this.syncImageControls();
        }
    }

    handleMouseMove(e) {}
    handleMouseUp(e) {}

    saveDesign() {
        const designData = this.exportDesignData();
        alert('Design saved! In a real implementation, this would save to your Shopify backend.');
        console.log('Design Data:', designData);
        localStorage.setItem('savedDesign', JSON.stringify(designData));
    }

    // ---- DOWNLOAD MOCKUP (PNG) ----
    async downloadMockup() {
        try {
            const canvasEl = document.getElementById('tshirtCanvas');
            if (!canvasEl) return alert('Canvas not found.');

            const cw = canvasEl.clientWidth;
            const ch = canvasEl.clientHeight;
            const dpr = window.devicePixelRatio || 1;

            // Export canvas at device pixel ratio for crisp results
            const out = document.createElement('canvas');
            out.width = cw * dpr;
            out.height = ch * dpr;
            const ctx = out.getContext('2d');
            ctx.scale(dpr, dpr);

            // (Optional) white background so PNG isn’t transparent
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, cw, ch);

            // 1) Base product image (object-fit: contain)
            const shirtSrc = this.productImages?.[this.currentProduct]?.[this.currentView];
            let shirtImg = null, fit = null;
            if (shirtSrc) {
                shirtImg = await this._loadImage(shirtSrc);
                fit = this._computeContainFit(shirtImg.naturalWidth || shirtImg.width,
                                            shirtImg.naturalHeight || shirtImg.height,
                                            cw, ch);
                // draw base with ~0.8 opacity (matches your UI)
                ctx.save();
                ctx.globalAlpha = 0.8;
                ctx.drawImage(shirtImg, fit.x, fit.y, fit.w, fit.h);
                ctx.restore();
            }

            // 2) Color tint masked to shirt shape, then multiplied
            if (shirtImg && this.currentColor?.hex) {
                const tint = document.createElement('canvas');
                tint.width = cw;
                tint.height = ch;
                const tctx = tint.getContext('2d');

                // Fill with current color
                tctx.fillStyle = this.currentColor.hex;
                tctx.fillRect(0, 0, cw, ch);

                // Keep only where shirt is visible (mask)
                tctx.globalCompositeOperation = 'destination-in';
                tctx.drawImage(shirtImg, fit.x, fit.y, fit.w, fit.h);

                // Multiply over the base shirt
                ctx.save();
                ctx.globalCompositeOperation = 'multiply';
                ctx.drawImage(tint, 0, 0, cw, ch);
                ctx.restore();
            }

            // 3) Draw design elements (current view only), in DOM order
            const list = this.elements[this.currentView] || [];
            for (const el of list) {
                if (el.classList.contains('text-element')) {
                    await this._drawTextElementToCanvas(ctx, el);
                } else {
                    await this._drawImageElementToCanvas(ctx, el);
                }
            }

            // 4) Download as PNG
            const info = this.getProductInfo(this.currentProduct);
            const fnSafe = s => String(s || '').replace(/\s+/g, '-').replace(/[^-\w.]/g, '');
            const filename = `${fnSafe(info.name)}_${fnSafe(this.currentView)}_${fnSafe(this.currentColor?.name)}.png`;

            out.toBlob((blob) => {
                if (!blob) return alert('Could not create image.');
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    URL.revokeObjectURL(a.href);
                    a.remove();
                }, 500);
            }, 'image/png');
        } catch (err) {
            console.error('Download mockup error:', err);
            alert('Could not create mockup. If you used images from another site, CORS may block exporting. Upload files directly instead.');
        }
    }

    // ---- Helpers for download ----
    _computeContainFit(iw, ih, cw, ch) {
        // object-fit: contain math
        const scale = Math.min(cw / iw, ch / ih);
        const w = iw * scale;
        const h = ih * scale;
        const x = (cw - w) / 2;
        const y = (ch - h) / 2;
        return { x, y, w, h };
    }

    _loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            // Try to avoid tainting the canvas with cross-origin images
            if (/^https?:/i.test(src) && !src.startsWith(location.origin)) {
                img.crossOrigin = 'anonymous';
            }
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
            img.src = src;
        });
    }

    async _drawImageElementToCanvas(ctx, container) {
        const imgEl = container.querySelector('img');
        if (!imgEl) return;

        const img = await this._loadImage(imgEl.src);

        // Position & size from CSS
        const x = parseFloat(container.style.left) || 0;
        const y = parseFloat(container.style.top) || 0;

        // Use explicit style width if set, otherwise measure
        const w = parseFloat(imgEl.style.width) ||
                Math.round(imgEl.getBoundingClientRect().width);
        const ratio = (img.naturalHeight || img.height) / (img.naturalWidth || img.width);
        const h = imgEl.style.height && imgEl.style.height.endsWith('px')
            ? parseFloat(imgEl.style.height)
            : w * ratio;

        const rot = parseFloat(container.dataset.rot || '0') * Math.PI / 180;
        const flipH = container.dataset.flipH === '1';
        const flipV = container.dataset.flipV === '1';

        ctx.save();
        // Rotate/flip around the element center
        ctx.translate(x + w / 2, y + h / 2);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.rotate(rot);
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
        ctx.restore();
    }

    async _drawTextElementToCanvas(ctx, textEl) {
        const content = textEl.textContent || '';
        if (!content) return;

        // Styles
        const size = parseFloat(textEl.style.fontSize) || 24;
        const family = (textEl.style.fontFamily || 'Arial').split(',')[0];
        const color = textEl.style.color || '#000000';
        const weight = textEl.style.fontWeight || 'normal';
        const italic = (textEl.style.fontStyle || '') === 'italic';
        const underline = (textEl.style.textDecoration || '').includes('underline');

        // Outline (webkitTextStroke like "1px #fff")
        let strokeW = 0, strokeC = '#000';
        const strokeStr = textEl.style.webkitTextStroke || '';
        const m = strokeStr.match(/([\d.]+)px\s+(.+)/);
        if (m) {
            strokeW = parseFloat(m[1]) || 0;
            strokeC = m[2].trim();
        }

        // Transform: rotate(...) and optional skewY(...) from curve
        const tf = textEl.style.transform || '';
        let rotDeg = 0, skewYDeg = 0;
        const rm = tf.match(/rotate\(([-\d.]+)deg\)/);
        const sm = tf.match(/skewY\(([-\d.]+)deg\)/);
        if (rm) rotDeg = parseFloat(rm[1]) || 0;
        if (sm) skewYDeg = parseFloat(sm[1]) || 0;

        const x = parseFloat(textEl.style.left) || 0;
        const y = parseFloat(textEl.style.top) || 0;

        ctx.save();
        ctx.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${family}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Measure block for centering rotation
        const lines = String(content).split('\n');
        const lineHeight = size * 1.2;
        const widths = lines.map(l => ctx.measureText(l).width);
        const blockW = Math.max(...widths, 0);
        const blockH = lineHeight * lines.length;

        ctx.translate(x + blockW / 2, y + blockH / 2);

        // Apply skewY (curve approximation) then rotate
        if (skewYDeg) {
            ctx.transform(1, Math.tan(skewYDeg * Math.PI / 180), 0, 1, 0, 0);
        }
        if (rotDeg) ctx.rotate(rotDeg * Math.PI / 180);

        // Draw each line centered
        let cy = -blockH / 2;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (strokeW > 0) {
                ctx.lineWidth = strokeW;
                ctx.strokeStyle = strokeC;
                ctx.strokeText(line, 0, cy);
            }
            ctx.fillText(line, 0, cy);

            // underline
            if (underline) {
                const w = widths[i];
                const uy = cy + size + 2; // a bit below baseline
                ctx.beginPath();
                ctx.moveTo(-w / 2, uy);
                ctx.lineTo(w / 2, uy);
                ctx.lineWidth = Math.max(1, Math.round(size / 14));
                ctx.strokeStyle = color;
                ctx.stroke();
            }
            cy += lineHeight;
        }

        ctx.restore();
    }

    getPrice() {
        const raw = this.getProductInfo(this.currentProduct).price;
        const basePrice = parseFloat(String(raw).replace(/[^0-9.]/g, '')) || 0;
        const totalElements = this.elements.front.length + this.elements.side.length + this.elements.back.length;
        const customizationFee = totalElements * 2.99;
        const totalPrice = (basePrice + customizationFee).toFixed(2);
        alert(`Estimated Price: ${totalPrice}\nBase Product: ${raw}\nCustomization Fee: ${customizationFee.toFixed(2)} (${totalElements} elements × $2.99)`);
    }

    addNewProduct(productData) {
        const productGrid = document.querySelector('.product-grid');
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.product = productData.id;

        productCard.innerHTML = `
            <img src="${productData.imageUrl}" alt="${productData.name}">
            <h3>${productData.name}</h3>
            <p>${productData.price}</p>
        `;

        productCard.addEventListener('click', () => this.selectProduct(productData.id));
        productGrid.appendChild(productCard);

        if (productData.views) this.productImages[productData.id] = productData.views;
        if (productData.colors) this.productColors[productData.id] = productData.colors;

        console.log(`Added new product: ${productData.name}`);
    }

    // ===== Export / Import =====
    exportDesignData() {
        const exportData = {
            product: this.currentProduct,
            color: this.currentColor,
            timestamp: new Date().toISOString(),
            views: {}
        };

        ['front', 'side', 'back'].forEach(view => {
            exportData.views[view] = (this.elements[view] || []).map(element => {
                const isText = element.classList.contains('text-element');
                const base = {
                    type: isText ? 'text' : 'image',
                    position: {
                        x: parseInt(element.style.left) || 0,
                        y: parseInt(element.style.top) || 0
                    }
                };

                if (isText) {
                    if (this.textEditor) {
                        const t = this.textEditor.getTextElementData(element);
                        return { ...base, content: t.content, style: t.styles };
                    }
                    return {
                        ...base,
                        content: element.textContent,
                        style: {
                            fontSize: element.style.fontSize || '24px',
                            color: element.style.color || '#000000',
                            fontWeight: element.style.fontWeight || 'normal',
                            fontStyle: element.style.fontStyle || 'normal',
                            textDecoration: element.style.textDecoration || 'none',
                            transform: element.style.transform || '',
                            webkitTextStroke: element.style.webkitTextStroke || '',
                            curve: element.dataset?.curve || '0'
                        }
                    };
                } else {
                    const img = element.querySelector('img');
                    return {
                        ...base,
                        content: img ? img.src : '',
                        style: {
                            width: img ? (img.style.width || '') : '',
                            height: img ? (img.style.height || '') : '',
                            // Save normalized transform (includes flip + rotation)
                            transform: element.style.transform || ''
                        }
                    };
                }
            });
        });

        return exportData;
    }

    loadDesignData(designData) {
        if (!designData) return;

        this.currentProduct = designData.product;
        this.updateProductInfo(this.currentProduct);

        // Rebuild canvas baseline (empty, then ensure color layer)
        const canvas = document.getElementById('tshirtCanvas');
        if (canvas) {
            canvas.innerHTML = '';
            this.ensureColorLayer();
        }

        // Rebuild color palette and apply saved color AFTER layer exists
        this.updateColorOptions(this.currentProduct);
        if (designData.color && designData.color.name) {
            this.changeProductColor(designData.color);
        }

        // Reset elements and repopulate
        this.elements = { front: [], side: [], back: [] };
        if (designData.views) {
            Object.keys(designData.views).forEach(view => {
                (designData.views[view] || []).forEach(elementData => {
                    if (elementData.type === 'text') {
                        if (this.textEditor && typeof this.textEditor.loadTextElementData === 'function') {
                            this.textEditor.loadTextElementData(elementData, view);
                        } else {
                            this.loadTextElement(elementData, view);
                        }
                    } else {
                        this.loadImageElement(elementData, view);
                    }
                });
            });
        }

        this.switchView('front');
    }

    loadTextElement(elementData, view) {
        const canvas = document.getElementById('tshirtCanvas');
        if (!canvas) return;
        const textElement = document.createElement('div');

        textElement.className = 'draggable text-element';
        Object.assign(textElement.style, {
            position: 'absolute',
            left: elementData.position.x + 'px',
            top: elementData.position.y + 'px',
            fontSize: elementData.style.fontSize,
            color: elementData.style.color,
            cursor: 'move',
            userSelect: 'none',
            zIndex: '10',
            display: view === this.currentView ? 'block' : 'none',
            touchAction: 'none'
        });
        textElement.textContent = elementData.content;

        canvas.appendChild(textElement);
        this.elements[view].push(textElement);
        this.makeDraggable(textElement);

        if (this.textEditor) this.textEditor.makeTextEditable(textElement);
    }

    loadImageElement(elementData, view) {
        const canvas = document.getElementById('tshirtCanvas');
        if (!canvas) return;

        const img = document.createElement('img');
        const container = document.createElement('div');

        container.className = 'draggable';
        Object.assign(container.style, {
            position: 'absolute',
            left: elementData.position.x + 'px',
            top: elementData.position.y + 'px',
            display: view === this.currentView ? 'block' : 'none',
            zIndex: '10',
            touchAction: 'none',
            transform: elementData.style?.transform || 'rotate(0deg)'
        });

        // initialize dataset from saved transform
        const rotMatch = (container.style.transform || '').match(/rotate\(([-\d.]+)deg\)/);
        container.dataset.rot = rotMatch ? String(parseFloat(rotMatch[1])) : '0';
        const sxm = container.style.transform.match(/scale\(([-\d.]+)\s*,\s*([-\d.]+)\)/);
        let sx = 1, sy = 1;
        if (sxm) { sx = parseFloat(sxm[1]); sy = parseFloat(sxm[2]); }
        const sxOnly = container.style.transform.match(/scaleX\(([-\d.]+)\)/);
        const syOnly = container.style.transform.match(/scaleY\(([-\d.]+)\)/);
        if (sxOnly) sx = parseFloat(sxOnly[1]);
        if (syOnly) sy = parseFloat(syOnly[1]);
        container.dataset.flipH = sx < 0 ? '1' : '0';
        container.dataset.flipV = sy < 0 ? '1' : '0';
        // normalize
        this._applyTransformFromDataset(container);

        img.src = elementData.content;

        // Apply saved size; fall back to 120px width
        img.style.maxWidth = 'none';
        img.style.maxHeight = 'none';
        img.style.width = (elementData.style?.width && elementData.style.width !== '100px') ? elementData.style.width : '120px';
        img.style.height = elementData.style?.height || 'auto';
        img.style.pointerEvents = 'none';

        container.appendChild(img);
        canvas.appendChild(container);
        this.elements[view].push(container);
        this.makeDraggable(container);

        // Ensure it fits in the box on load
        this._fitAndClamp(container);
    }

    loadSavedDesign() {
        const savedDesign = localStorage.getItem('savedDesign');
        if (!savedDesign) { alert('No saved design found.'); return; }
        try {
            const designData = JSON.parse(savedDesign);
            this.loadDesignData(designData);
            alert('Saved design loaded!');
        } catch (e) {
            alert('Error loading saved design.');
        }
    }

    // ===== New: keep right-side view buttons showing thumbnails + labels =====
    updateViewTabs() {
        const tabs = document.querySelectorAll('.view-tab');
        if (!tabs.length || !this.currentProduct) return;

        tabs.forEach(tab => {
            const view = tab.dataset.view; // "front", "side", "back"
            const labelText =
                view === 'side' ? 'Sleeve' :
                view === 'back' ? 'Back'   : 'Front';

            // Ensure there is an <img> thumb + <span> label inside the button
            let img = tab.querySelector('img.view-thumb');
            let span = tab.querySelector('span');

            if (!img) {
                img = document.createElement('img');
                img.className = 'view-thumb';
                tab.prepend(img);
            }
            if (!span) {
                span = document.createElement('span');
                tab.appendChild(span);
            }

            // Set label
            span.textContent = labelText;

            // Set image source for this product/view
            const src = this.productImages?.[this.currentProduct]?.[view];
            if (src) {
                img.src = src;
                img.alt = `${labelText} preview`;
                img.style.visibility = 'visible';
            } else {
                img.removeAttribute('src');
                img.alt = '';
                img.style.visibility = 'hidden';
            }
        });
    }
}

// Shopify integration helpers
const ShopifyIntegration = {
    addToCart(designData, quantity = 1) {
        const cartData = {
            id: this.getShopifyVariantId(designData.product, designData.color),
            quantity: quantity,
            properties: {
                'Design Data': JSON.stringify(designData),
                'Customization': 'Yes',
                'Design Elements': `Front: ${designData.views.front?.length || 0}, Side: ${designData.views.side?.length || 0}, Back: ${designData.views.back?.length || 0}`,
                'Product Color': designData.color.name
            }
        };
        console.log('Would add to Shopify cart:', cartData);
        alert('Design would be added to cart in a real Shopify environment!');
        return cartData;
    },

    getShopifyVariantId(product, colorData) {
        const variantMap = {
            'tshirt-White': '123450001',
            'tshirt-Black': '123450002',
            'tshirt-Navy': '123450003',
            'tshirt-Red': '123450004',
            'tshirt-Royal': '123450005',
            'longsleeve-White': '123460001',
            'longsleeve-Black': '123460002',
            'polo-White': '123470001',
            'polo-Black': '123470002',
            'hoodie-White': '123480001',
            'hoodie-Black': '123480002'
        };
        const key = `${product}-${colorData.name}`;
        return variantMap[key] || '123450001';
    },

    generateProductMockup(designData) {
        console.log('Generate mockup for:', designData);
        const colorHex = designData.color.hex.replace('#', '');
        return `https://via.placeholder.com/600x600/${colorHex}/000000?text=Custom+Design`;
    },

    calculateTotals(designData, quantity = 1) {
        const product = window.tshirtDesigner.getProductInfo(designData.product);
        const raw = product.price;
        const basePrice = parseFloat(String(raw).replace(/[^0-9.]/g, '')) || 0;
        const totalElements = (designData.views.front?.length || 0) + (designData.views.side?.length || 0) + (designData.views.back?.length || 0);
        const customizationFee = totalElements * 2.99;

        const subtotal = (basePrice + customizationFee) * quantity;
        const shipping = subtotal > 50 ? 0 : 5.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        return { basePrice, customizationFee, subtotal, shipping, tax, total, colorName: designData.color.name };
    }
};

// Initialize the designer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.tshirtDesigner = new TShirtDesigner();

    console.log('T-Shirt Designer loaded!');
    console.log('- window.tshirtDesigner.loadSavedDesign()');
    console.log('- window.tshirtDesigner.addNewProduct({id, name, price, imageUrl, views, colors})');
    console.log('- ShopifyIntegration.addToCart(designData)');
});

// Expose ShopifyIntegration
window.ShopifyIntegration = ShopifyIntegration;

// Demo: add a "Load Saved Design" button
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const backBtn = document.getElementById('backToProducts');
        if (backBtn) {
            const loadBtn = document.createElement('button');
            loadBtn.textContent = 'Load Saved';
            loadBtn.className = 'back-btn';
            loadBtn.style.marginLeft = '10px';
            loadBtn.onclick = () => window.tshirtDesigner.loadSavedDesign();
            backBtn.parentNode.appendChild(loadBtn);
        }
    }, 100);
});

// Inject a "Download Mockup (PNG)" button into the right panel actions
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const actions = document.querySelector('.action-buttons');
        if (actions && !document.getElementById('downloadMockup')) {
            const btn = document.createElement('button');
            btn.id = 'downloadMockup';
            btn.className = 'save-btn';
            btn.textContent = 'Download Mockup (PNG)';
            btn.onclick = () => window.tshirtDesigner.downloadMockup();
            // Put it above "Get Price"
            actions.insertBefore(btn, actions.firstChild);
        }
    }, 150);
});
