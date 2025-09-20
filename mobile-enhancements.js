// Mobile-specific enhancements for T-Shirt Designer
// Add this to your existing script.js or include as a separate file

class MobileEnhancements {
    constructor(designer) {
        this.designer = designer;
        this.isMobile = window.innerWidth <= 768;
        this.isTouch = 'ontouchstart' in window;
        this.lastTouchTime = 0;
        this.touchStartPos = { x: 0, y: 0 };
        
        this.init();
    }

    init() {
        this.setupViewportMeta();
        this.addMobileSpecificUI();
        this.enhanceTouchInteractions();
        this.setupOrientationHandling();
        this.optimizeForKeyboard();
        this.addMobileGestures();
        this.setupMobileToolbar();
        this.addSwipeNavigation();
        
        // Initialize mobile boundaries if on mobile
        if (this.isMobile) {
            setTimeout(() => {
                this.adjustCustomizationBoundariesForMobile();
            }, 100);
        }
        
        // Listen for resize events
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    }

    setupViewportMeta() {
        // Ensure proper viewport meta tag
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        
        // Prevent zoom but allow accessibility zoom
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
        
        // Prevent bounce scrolling on iOS
        document.body.style.overscrollBehavior = 'none';
    }

    addMobileSpecificUI() {
        if (!this.isMobile) return;

        // Add mobile toolbar
        this.createMobileToolbar();
        
        // Add mobile-specific buttons
        this.addMobileButtons();
        
        // Modify existing UI for mobile
        this.modifyUIForMobile();
        
        // Add loading indicators
        this.addLoadingIndicators();
    }

    createMobileToolbar() {
        const designerPage = document.getElementById('designerPage');
        if (!designerPage || document.getElementById('mobileToolbar')) return;

        const toolbar = document.createElement('div');
        toolbar.id = 'mobileToolbar';
        toolbar.className = 'mobile-toolbar';
        toolbar.innerHTML = `
            <button id="mobileMenuToggle" class="mobile-btn">
                <span class="hamburger"></span>
                Menu
            </button>
            <button id="mobileViewToggle" class="mobile-btn">
                <span class="view-icon">👕</span>
                Views
            </button>
            <button id="mobileColorsToggle" class="mobile-btn">
                <span class="color-icon">🎨</span>
                Colors
            </button>
            <button id="mobilePreview" class="mobile-btn">
                <span class="preview-icon">👁</span>
                Preview
            </button>
        `;

        // Add toolbar styles
        const style = document.createElement('style');
        style.textContent = `
            .mobile-toolbar {
                display: none;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                border-top: 1px solid #e2e8f0;
                padding: 0.5rem;
                z-index: 1000;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            }
            
            @media (max-width: 768px) {
                .mobile-toolbar {
                    display: flex;
                    justify-content: space-around;
                }
                
                body {
                    padding-bottom: 60px;
                }
            }
            
            .mobile-btn {
                background: none;
                border: none;
                padding: 0.5rem;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.25rem;
                font-size: 0.7rem;
                color: #6b7280;
                transition: all 0.2s;
                min-width: 60px;
            }
            
            .mobile-btn:hover,
            .mobile-btn.active {
                background: #f3f4f6;
                color: #3b82f6;
            }
            
            .mobile-btn span {
                font-size: 1.2rem;
            }
            
            .hamburger {
                display: block;
                width: 20px;
                height: 2px;
                background: currentColor;
                position: relative;
            }
            
            .hamburger::before,
            .hamburger::after {
                content: '';
                display: block;
                width: 20px;
                height: 2px;
                background: currentColor;
                position: absolute;
                transition: all 0.2s;
            }
            
            .hamburger::before { top: -6px; }
            .hamburger::after { top: 6px; }
        `;
        document.head.appendChild(style);

        designerPage.appendChild(toolbar);
        this.bindMobileToolbarEvents();
    }

    bindMobileToolbarEvents() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const viewToggle = document.getElementById('mobileViewToggle');
        const colorsToggle = document.getElementById('mobileColorsToggle');
        const previewBtn = document.getElementById('mobilePreview');

        if (menuToggle) {
            menuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        if (viewToggle) {
            viewToggle.addEventListener('click', this.toggleViewSelector.bind(this));
        }

        if (colorsToggle) {
            colorsToggle.addEventListener('click', this.toggleColorPicker.bind(this));
        }

        if (previewBtn) {
            previewBtn.addEventListener('click', this.enterPreviewMode.bind(this));
        }
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        const isVisible = sidebar.style.display !== 'none';
        sidebar.style.display = isVisible ? 'none' : 'block';
        
        const btn = document.getElementById('mobileMenuToggle');
        if (btn) btn.classList.toggle('active');
    }

    toggleViewSelector() {
        const viewTabs = document.querySelector('.view-tabs');
        if (!viewTabs) return;

        // Create mobile view selector if it doesn't exist
        let mobileViewSelector = document.getElementById('mobileViewSelector');
        if (!mobileViewSelector) {
            mobileViewSelector = this.createMobileViewSelector();
        }

        const isVisible = mobileViewSelector.style.display !== 'none';
        mobileViewSelector.style.display = isVisible ? 'none' : 'block';
    }

    createMobileViewSelector() {
        const selector = document.createElement('div');
        selector.id = 'mobileViewSelector';
        selector.className = 'mobile-view-selector';
        selector.innerHTML = `
            <div class="mobile-view-header">
                <h4>Select View</h4>
                <button class="close-btn" onclick="this.parentElement.parentElement.style.display='none'">×</button>
            </div>
            <div class="mobile-view-options">
                <button class="mobile-view-option" data-view="front">
                    <img src="${this.designer.productImages[this.designer.currentProduct]?.front || ''}" alt="Front">
                    <span>Front</span>
                </button>
                <button class="mobile-view-option" data-view="side">
                    <img src="${this.designer.productImages[this.designer.currentProduct]?.side || ''}" alt="Side">
                    <span>Side</span>
                </button>
                <button class="mobile-view-option" data-view="back">
                    <img src="${this.designer.productImages[this.designer.currentProduct]?.back || ''}" alt="Back">
                    <span>Back</span>
                </button>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .mobile-view-selector {
                display: none;
                position: fixed;
                bottom: 60px;
                left: 1rem;
                right: 1rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 1001;
                overflow: hidden;
            }
            
            .mobile-view-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid #e2e8f0;
                background: #f8fafc;
            }
            
            .mobile-view-header h4 {
                margin: 0;
                font-size: 1rem;
                color: #1e293b;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #6b7280;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
            }
            
            .close-btn:hover {
                background: #e5e7eb;
            }
            
            .mobile-view-options {
                display: flex;
                padding: 1rem;
                gap: 1rem;
                justify-content: space-around;
            }
            
            .mobile-view-option {
                background: none;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                padding: 0.75rem;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                flex: 1;
                transition: all 0.2s;
            }
            
            .mobile-view-option:hover,
            .mobile-view-option.active {
                border-color: #3b82f6;
                background: #f0f9ff;
            }
            
            .mobile-view-option img {
                width: 40px;
                height: 40px;
                object-fit: contain;
                border-radius: 4px;
            }
            
            .mobile-view-option span {
                font-size: 0.8rem;
                font-weight: 500;
                color: #374151;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(selector);

        // Bind events
        selector.querySelectorAll('.mobile-view-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.designer.switchView(view);
                selector.style.display = 'none';
                
                // Update active state
                selector.querySelectorAll('.mobile-view-option').forEach(opt => 
                    opt.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        return selector;
    }

    toggleColorPicker() {
        const colorsPanel = document.getElementById('colorsPanel');
        if (!colorsPanel) return;

        // Activate colors tool
        this.designer.activateTool('colors');
        
        // Show colors panel
        colorsPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    enterPreviewMode() {
        // Hide all UI elements except the canvas
        const sidebar = document.querySelector('.sidebar');
        const rightPanel = document.querySelector('.right-panel');
        const toolbar = document.getElementById('mobileToolbar');
        
        const isPreview = document.body.classList.contains('preview-mode');
        
        if (isPreview) {
            // Exit preview mode
            document.body.classList.remove('preview-mode');
            if (sidebar) sidebar.style.display = '';
            if (rightPanel) rightPanel.style.display = '';
            if (toolbar) toolbar.style.display = '';
        } else {
            // Enter preview mode
            document.body.classList.add('preview-mode');
            if (sidebar) sidebar.style.display = 'none';
            if (rightPanel) rightPanel.style.display = 'none';
            if (toolbar) toolbar.style.display = 'none';
            
            // Auto-exit after 5 seconds
            setTimeout(() => {
                if (document.body.classList.contains('preview-mode')) {
                    this.enterPreviewMode();
                }
            }, 5000);
        }
        
        // Update button state
        const btn = document.getElementById('mobilePreview');
        if (btn) btn.classList.toggle('active');
    }

    enhanceTouchInteractions() {
        if (!this.isTouch) return;

        // Enhance draggable elements for touch
        this.improveTouchDragging();
        
        // Add touch-friendly gestures
        this.addPinchToZoom();
        
        // Improve touch target sizes
        this.improveTouchTargets();
    }

    improveTouchDragging() {
        // Override the existing makeDraggable method for better touch support
        const originalMakeDraggable = this.designer.makeDraggable.bind(this.designer);
        
        this.designer.makeDraggable = (element) => {
            originalMakeDraggable(element);
            
            let touchStartTime = 0;
            let touchStartPos = { x: 0, y: 0 };
            let longPressTimer = null;
            
            const handleTouchStart = (e) => {
                touchStartTime = Date.now();
                const touch = e.touches[0];
                touchStartPos = { x: touch.clientX, y: touch.clientY };
                
                // Long press for selection
                longPressTimer = setTimeout(() => {
                    element.classList.add('selected');
                    this.designer.onElementSelected(element);
                    
                    // Haptic feedback if supported
                    if (navigator.vibrate) {
                        navigator.vibrate(50);
                    }
                }, 500);
                
                e.preventDefault();
            };
            
            const handleTouchMove = (e) => {
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
                e.preventDefault();
            };
            
            const handleTouchEnd = (e) => {
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
                
                const touchEndTime = Date.now();
                const touchDuration = touchEndTime - touchStartTime;
                
                // Double tap for editing (text elements)
                if (touchDuration < 300) {
                    const timeSinceLastTouch = touchStartTime - this.lastTouchTime;
                    if (timeSinceLastTouch < 300 && timeSinceLastTouch > 0) {
                        // Double tap detected
                        if (element.classList.contains('text-element') && this.designer.textEditor) {
                            this.designer.textEditor.editText(element);
                        }
                    }
                    this.lastTouchTime = touchStartTime;
                }
            };
            
            element.addEventListener('touchstart', handleTouchStart, { passive: false });
            element.addEventListener('touchmove', handleTouchMove, { passive: false });
            element.addEventListener('touchend', handleTouchEnd);
        };
    }

    addPinchToZoom() {
        const canvas = document.getElementById('tshirtCanvas');
        if (!canvas) return;

        let initialDistance = 0;
        let initialScale = 1;
        
        const getDistance = (touch1, touch2) => {
            const dx = touch1.clientX - touch2.clientX;
            const dy = touch1.clientY - touch2.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        };

        const handleTouchStart = (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                initialDistance = getDistance(e.touches[0], e.touches[1]);
                initialScale = parseFloat(canvas.style.transform.match(/scale\(([\d.]+)\)/)?.[1] || '1');
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const currentDistance = getDistance(e.touches[0], e.touches[1]);
                const scale = Math.min(Math.max((currentDistance / initialDistance) * initialScale, 0.5), 3);
                
                canvas.style.transform = `scale(${scale})`;
                canvas.style.transformOrigin = 'center center';
            }
        };

        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    improveTouchTargets() {
        // Ensure all interactive elements meet minimum touch target size (44px)
        const elements = document.querySelectorAll('button, .tool-btn, .color-option, .view-tab');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                el.style.minWidth = '44px';
                el.style.minHeight = '44px';
                el.style.display = 'flex';
                el.style.alignItems = 'center';
                el.style.justifyContent = 'center';
            }
        });
    }

    setupOrientationHandling() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
    }

    handleOrientationChange() {
        // Recalculate canvas size and element positions
        const canvas = document.getElementById('tshirtCanvas');
        if (canvas) {
            // Reset any transforms applied by pinch-to-zoom
            canvas.style.transform = '';
            
            // Recalculate customization boundaries for mobile
            this.adjustCustomizationBoundariesForMobile();
            
            // Update the product canvas
            this.designer.updateProductCanvas(this.designer.currentProduct);
        }

        // Update mobile UI layout
        this.updateMobileLayout();
        
        // Ensure elements stay within bounds
        Object.values(this.designer.elements).flat().forEach(element => {
            this.designer._fitAndClamp(element);
        });
    }

    // mobile-enhancements.js
    adjustCustomizationBoundariesForMobile() {
        if (!this.designer) return;

        // Rebuild centered, responsive boundary (sets data-view & updates internal bounds)
        this.designer.addCustomizationBoundary();

        // Re-clamp everything into the new box
        Object.values(this.designer.elements).flat().forEach(el => {
            this.designer._fitAndClamp(el);
        });
    }


    getMobileBoundaryLabel(view) {
        const labels = {
            'front': 'Design Area',
            'side': 'Sleeve',
            'back': 'Back Print'
        };
        return labels[view] || 'Design Area';
    }

    updateMobileLayout() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const designerContainer = document.querySelector('.designer-container');
        
        if (designerContainer && this.isMobile) {
            if (isLandscape) {
                designerContainer.classList.add('landscape-mode');
            } else {
                designerContainer.classList.remove('landscape-mode');
            }
        }
    }

    optimizeForKeyboard() {
        // Handle virtual keyboard appearance
        let initialViewportHeight = window.innerHeight;
        
        const handleViewportChange = () => {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            
            // If height reduced significantly, keyboard is likely open
            if (heightDifference > 150) {
                document.body.classList.add('keyboard-open');
                this.adjustForKeyboard(true);
            } else {
                document.body.classList.remove('keyboard-open');
                this.adjustForKeyboard(false);
            }
        };

        window.addEventListener('resize', handleViewportChange);
        
        // Focus handling for inputs
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
    }

    adjustForKeyboard(isOpen) {
        const designArea = document.querySelector('.design-area');
        const sidebar = document.querySelector('.sidebar');
        
        if (isOpen) {
            if (designArea) designArea.style.minHeight = '30vh';
            if (sidebar) sidebar.style.maxHeight = '40vh';
        } else {
            if (designArea) designArea.style.minHeight = '';
            if (sidebar) sidebar.style.maxHeight = '';
        }
    }

    addMobileGestures() {
        this.addSwipeGestures();
        this.addTapGestures();
    }

    addSwipeGestures() {
        const designArea = document.querySelector('.design-area');
        if (!designArea) return;

        let startX = 0;
        let startY = 0;
        let startTime = 0;

        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        };

        const handleTouchEnd = (e) => {
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const endTime = Date.now();

            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;

            // Check for swipe gesture
            if (deltaTime < 300 && Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
                const views = ['front', 'side', 'back'];
                const currentIndex = views.indexOf(this.designer.currentView);
                
                if (deltaX > 0 && currentIndex > 0) {
                    // Swipe right - previous view
                    this.designer.switchView(views[currentIndex - 1]);
                } else if (deltaX < 0 && currentIndex < views.length - 1) {
                    // Swipe left - next view
                    this.designer.switchView(views[currentIndex + 1]);
                }
            }
        };

        designArea.addEventListener('touchstart', handleTouchStart);
        designArea.addEventListener('touchend', handleTouchEnd);
    }

    addTapGestures() {
        const canvas = document.getElementById('tshirtCanvas');
        if (!canvas) return;

        let tapTimeout = null;
        let lastTap = 0;

        const handleTap = (e) => {
            const now = Date.now();
            const timeSinceLastTap = now - lastTap;

            if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
                // Double tap - toggle preview mode
                this.enterPreviewMode();
                if (tapTimeout) {
                    clearTimeout(tapTimeout);
                    tapTimeout = null;
                }
            } else {
                // Single tap - deselect after delay
                tapTimeout = setTimeout(() => {
                    if (e.target === canvas || e.target.classList.contains('tshirt-color-layer')) {
                        document.querySelectorAll('.draggable').forEach(el => 
                            el.classList.remove('selected'));
                        this.designer.activeImageEl = null;
                        this.designer.syncImageControls();
                    }
                }, 300);
            }

            lastTap = now;
        };

        canvas.addEventListener('touchend', handleTap);
    }

    setupMobileToolbar() {
        // Add mobile-specific toolbar functionality
        if (!this.isMobile) return;

        // Create floating action button for quick access
        this.createFloatingActionButton();
        
        // Add bottom sheet for tools
        this.createBottomSheet();
    }

    createFloatingActionButton() {
        if (document.getElementById('mobileFAB')) return;

        const fab = document.createElement('button');
        fab.id = 'mobileFAB';
        fab.className = 'mobile-fab';
        fab.innerHTML = '+';
        fab.title = 'Add Element';

        const style = document.createElement('style');
        style.textContent = `
            .mobile-fab {
                display: none;
                position: fixed;
                bottom: 80px;
                right: 1rem;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: #3b82f6;
                color: white;
                border: none;
                font-size: 24px;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                cursor: pointer;
                z-index: 1000;
                transition: all 0.3s ease;
            }
            
            @media (max-width: 768px) {
                .mobile-fab {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
            
            .mobile-fab:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(59, 130, 246, 0.6);
            }
            
            .mobile-fab.rotated {
                transform: rotate(45deg);
            }
        `;
        document.head.appendChild(style);

        fab.addEventListener('click', this.toggleBottomSheet.bind(this));
        document.body.appendChild(fab);
    }

    createBottomSheet() {
        if (document.getElementById('mobileBottomSheet')) return;

        const bottomSheet = document.createElement('div');
        bottomSheet.id = 'mobileBottomSheet';
        bottomSheet.className = 'mobile-bottom-sheet';
        bottomSheet.innerHTML = `
            <div class="bottom-sheet-header">
                <div class="drag-handle"></div>
                <h4>Add Elements</h4>
            </div>
            <div class="bottom-sheet-content">
                <div class="quick-actions">
                    <button class="quick-action" data-action="text">
                        <span class="icon">T</span>
                        <span>Text</span>
                    </button>
                    <button class="quick-action" data-action="upload">
                        <span class="icon">📁</span>
                        <span>Upload</span>
                    </button>
                    <button class="quick-action" data-action="colors">
                        <span class="icon">🎨</span>
                        <span>Colors</span>
                    </button>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .mobile-bottom-sheet {
                display: none;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                border-radius: 20px 20px 0 0;
                box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
                z-index: 1001;
                transform: translateY(100%);
                transition: transform 0.3s ease;
            }
            
            @media (max-width: 768px) {
                .mobile-bottom-sheet {
                    display: block;
                }
            }
            
            .mobile-bottom-sheet.open {
                transform: translateY(0);
            }
            
            .bottom-sheet-header {
                padding: 1rem;
                text-align: center;
                border-bottom: 1px solid #e2e8f0;
                position: relative;
            }
            
            .drag-handle {
                width: 40px;
                height: 4px;
                background: #d1d5db;
                border-radius: 2px;
                margin: 0 auto 0.5rem;
            }
            
            .bottom-sheet-header h4 {
                margin: 0;
                font-size: 1.1rem;
                color: #1e293b;
            }
            
            .bottom-sheet-content {
                padding: 1rem;
            }
            
            .quick-actions {
                display: flex;
                gap: 1rem;
                justify-content: space-around;
            }
            
            .quick-action {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 1rem;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                flex: 1;
                transition: all 0.2s;
            }
            
            .quick-action:hover {
                background: #f1f5f9;
                border-color: #3b82f6;
            }
            
            .quick-action .icon {
                font-size: 1.5rem;
            }
            
            .quick-action span:last-child {
                font-size: 0.9rem;
                font-weight: 500;
                color: #374151;
            }
        `;
        document.head.appendChild(style);

        // Bind events
        bottomSheet.querySelectorAll('.quick-action').forEach(action => {
            action.addEventListener('click', (e) => {
                const actionType = e.currentTarget.dataset.action;
                this.handleQuickAction(actionType);
                this.toggleBottomSheet();
            });
        });

        document.body.appendChild(bottomSheet);
    }

    toggleBottomSheet() {
        const bottomSheet = document.getElementById('mobileBottomSheet');
        const fab = document.getElementById('mobileFAB');
        
        if (bottomSheet && fab) {
            const isOpen = bottomSheet.classList.contains('open');
            bottomSheet.classList.toggle('open');
            fab.classList.toggle('rotated');
        }
    }

    handleQuickAction(action) {
        switch (action) {
            case 'text':
                this.designer.activateTool('text');
                break;
            case 'upload':
                this.designer.activateTool('upload');
                const fileInput = document.getElementById('logoUpload');
                if (fileInput) fileInput.click();
                break;
            case 'colors':
                this.designer.activateTool('colors');
                break;
        }
    }

    addSwipeNavigation() {
        // Add swipe navigation between views
        let isSwipeActive = false;
        let swipeStartX = 0;
        let swipeStartY = 0;

        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                swipeStartX = e.touches[0].clientX;
                swipeStartY = e.touches[0].clientY;
                isSwipeActive = true;
            }
        });

        document.addEventListener('touchend', (e) => {
            if (!isSwipeActive || e.changedTouches.length !== 1) return;
            
            const swipeEndX = e.changedTouches[0].clientX;
            const swipeEndY = e.changedTouches[0].clientY;
            
            const deltaX = swipeEndX - swipeStartX;
            const deltaY = swipeEndY - swipeStartY;
            
            // Only process horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
                const views = ['front', 'side', 'back'];
                const currentIndex = views.indexOf(this.designer.currentView);
                
                if (deltaX > 0 && currentIndex > 0) {
                    // Swipe right - previous view
                    this.designer.switchView(views[currentIndex - 1]);
                } else if (deltaX < 0 && currentIndex < views.length - 1) {
                    // Swipe left - next view
                    this.designer.switchView(views[currentIndex + 1]);
                }
            }
            
            isSwipeActive = false;
        });
    }

    addMobileButtons() {
        // Add mobile-specific buttons to existing UI
        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons && this.isMobile) {
            const mobileShareBtn = document.createElement('button');
            mobileShareBtn.className = 'save-btn mobile-only';
        }
    }

    modifyUIForMobile() {
        // Add mobile classes to elements
        document.body.classList.add('mobile-device');
        
        // Improve button sizes
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (!btn.classList.contains('mobile-optimized')) {
                btn.classList.add('mobile-optimized');
            }
        });
        
        // Add pull-to-refresh indicator
        this.addPullToRefresh();
    }

    addPullToRefresh() {
        let startY = 0;
        let pulling = false;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0) {
                const currentY = e.touches[0].clientY;
                const pullDistance = currentY - startY;
                
                if (pullDistance > 100) {
                    pulling = true;
                    // Add visual indicator
                    document.body.style.background = 'linear-gradient(to bottom, #e0f2fe 0%, #f5f5f5 10%)';
                }
            }
        });
        
        document.addEventListener('touchend', () => {
            if (pulling) {
                // Reset visual state
                document.body.style.background = '';
                pulling = false;
                
                // Reload design data or refresh
                console.log('Pull to refresh triggered');
            }
        });
    }

    addLoadingIndicators() {
        // Add loading states for mobile
        const style = document.createElement('style');
        style.textContent = `
            .mobile-loading-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                gap: 1rem;
            }
            
            .mobile-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #e2e8f0;
                border-top: 4px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .mobile-loading-text {
                color: #6b7280;
                font-size: 0.9rem;
            }
        `;
        document.head.appendChild(style);
    }

    showMobileLoading(text = 'Loading...') {
        let overlay = document.getElementById('mobileLoadingOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'mobileLoadingOverlay';
            overlay.className = 'mobile-loading-overlay';
            overlay.innerHTML = `
                <div class="mobile-spinner"></div>
                <div class="mobile-loading-text">${text}</div>
            `;
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'flex';
    }

    hideMobileLoading() {
        const overlay = document.getElementById('mobileLoadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    handleResize() {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== this.isMobile) {
            this.isMobile = newIsMobile;
            // Reinitialize mobile features
            this.init();
        }
    }

    // Utility methods for mobile optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize mobile enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the main designer to be initialized
    setTimeout(() => {
        if (window.tshirtDesigner) {
            window.mobileEnhancements = new MobileEnhancements(window.tshirtDesigner);
        }
    }, 500);
});

// Export for use in other modules
window.MobileEnhancements = MobileEnhancements;