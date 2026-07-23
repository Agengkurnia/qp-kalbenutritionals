class Layout {
    constructor() {
        const scripts = document.getElementsByTagName('script');
        let appRootPath = '';
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src && scripts[i].src.includes('/js/layout.js')) {
                appRootPath = scripts[i].src.substring(0, scripts[i].src.indexOf('/js/layout.js'));
                break;
            }
        }
        this.basePath = appRootPath ? appRootPath + '/' : '';
    }

    async init() {
        if (window.layoutInitialized) return;
        window.layoutInitialized = true;
        this.loadCSS();
        await this.loadHeadScripts();
        this.renderStructure();
        await this.loadScripts();
        this.setActiveMenu();
        this.initMenuToggle();

        // Dispatch ready event
        document.dispatchEvent(new Event('layoutReady'));
    }

    loadCSS() {
        const styles = [
            'lib/fonts/googlefont.css',
            'lib/fonts/kalbe.css',
            'lib/vuexy/vendor/fonts/fontawesome.css',
            'lib/vuexy/vendor/fonts/tabler-icons.css',
            'lib/vuexy/vendor/fonts/flag-icons.css',
            'lib/vuexy/vendor/css/rtl/core.css',
            'lib/vuexy/vendor/css/rtl/theme-default.css',
            'lib/vuexy/css/demo.css',
            'lib/vuexy/vendor/libs/perfect-scrollbar/perfect-scrollbar.css',
            'lib/vuexy/vendor/libs/node-waves/node-waves.css',
            'lib/vuexy/vendor/libs/typeahead-js/typeahead.css',
            'lib/vuexy/vendor/libs/bs-stepper/bs-stepper.css',
            'lib/vuexy/vendor/libs/select2/select2.css',
            'lib/vuexy/vendor/libs/select2/select2.css',
            'lib/vuexy/vendor/libs/sweetalert2/sweetalert2.css',
            'lib/vuexy/vendor/libs/datatables-bs5/datatables.bootstrap5.css',
            'lib/vuexy/vendor/libs/datatables-responsive-bs5/responsive.bootstrap5.css',
            'styles.css'
        ];

        styles.forEach(href => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = this.basePath + href;
                document.head.appendChild(link);
            }
        });

        // Add smooth transition CSS for sidebar menu + DF DataTable grid
        const style = document.createElement('style');
        style.innerHTML = `
            .menu-inner .menu-item .menu-sub {
                transition: max-height 0.3s ease-out, opacity 0.2s ease-in;
                overflow: hidden;
                display: none;
            }
            .menu-inner .menu-item.open > .menu-sub {
                display: block;
                animation: menuSlideDown 0.3s ease-out forwards;
            }
            @keyframes menuSlideDown {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 1199.98px) {
                .layout-menu-toggle.d-xl-none {
                    display: flex !important;
                }
            }

            /* DF DataTables — grid */
            table.df-dt-grid {
                border-collapse: collapse !important;
                width: 100% !important;
            }
            table.df-dt-grid thead th {
                background: #f8f9fa;
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: .03em;
                white-space: nowrap;
                vertical-align: middle;
                border: 1px solid #d9dee3 !important;
            }
            table.df-dt-grid tbody td {
                vertical-align: middle;
                border: 1px solid #d9dee3 !important;
            }
            table.df-dt-grid tbody tr:hover {
                background-color: rgba(67, 89, 113, 0.04);
            }
            .df-dt-wrap,
            .dataTables_wrapper {
                width: 100%;
            }
            .dataTables_wrapper .dataTables_filter {
                text-align: right;
            }
            .dataTables_wrapper .dataTables_filter input,
            .dataTables_wrapper .dataTables_length select {
                margin-left: .5rem;
                display: inline-block;
                width: auto;
            }
            .dataTables_wrapper .dataTables_paginate .paginate_button {
                padding: .25rem .5rem !important;
            }
            /* Modal LOV: pastikan grid DT penuh */
            .modal .dataTables_wrapper {
                padding: 0;
            }
        `;
        document.head.appendChild(style);
    }

    async loadHeadScripts() {
        const scripts = [
            'lib/vuexy/vendor/js/helpers.js',
            // 'lib/vuexy/vendor/js/template-customizer.js', // Causes document.write error
            'lib/vuexy/js/config.js'
        ];
        for (const src of scripts) {
            await this.loadScript(src);
        }
    }

    renderStructure() {
        // Assume the body contains the main content or there is a specific #app-content div
        // If not found, wrapping entire body innerHTML
        let content = '';
        const appContent = document.getElementById('app-content');
        if (appContent) {
            content = appContent.innerHTML;
        } else {
            // Fallback: move layout-wrapper if exists, or body content
            // Assuming we are migrating pages that have raw content
            content = document.body.innerHTML;
        }

        const sidebar = `
            <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
                <div class="app-brand demo">
                    <span class="app-brand-text demo menu-text fw-bolder ms-2">Development Fund</span>
                </div>
                <div class="menu-divider mt-0"></div>
                <ul class="menu-inner py-1">

                    <li class="menu-item">
                        <a href="${this.basePath}index.html" class="menu-link">
                            <i class="menu-icon tf-icons fas fa-home"></i>
                            <div data-i18n="Dashboard">Dashboard</div>
                        </a>
                    </li>

                    <li class="menu-header small text-uppercase">
                        <span class="menu-header-text">Master</span>
                    </li>
                    <li class="menu-item">
                        <a href="javascript:void(0);" class="menu-link menu-toggle">
                            <i class="menu-icon tf-icons fas fa-database"></i>
                            <div data-i18n="Master">Master</div>
                        </a>
                        <ul class="menu-sub">
                            <li class="menu-item">
                                <a href="${this.basePath}masters/mapping-subdist.html" class="menu-link">
                                    <div data-i18n="Mapping Subdist">Mapping Subdist</div>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li class="menu-header small text-uppercase">
                        <span class="menu-header-text">Transaction</span>
                    </li>
                    <li class="menu-item">
                        <a href="javascript:void(0);" class="menu-link menu-toggle">
                            <i class="menu-icon tf-icons fas fa-file-invoice"></i>
                            <div data-i18n="Transaction">Transaction</div>
                        </a>
                        <ul class="menu-sub">
                            <li class="menu-item">
                                <a href="${this.basePath}transactions/monitoring-subdist.html" class="menu-link">
                                    <div data-i18n="Monitoring SubDist">Monitoring SubDist</div>
                                </a>
                            </li>
                            <li class="menu-item">
                                <a href="${this.basePath}transactions/memo-qp.html" class="menu-link">
                                    <div data-i18n="Memo QP">Memo QP</div>
                                </a>
                            </li>
                        </ul>
                    </li>

                </ul>
            </aside>
        `;

        const navbar = `
            <nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
                <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                    <a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
                        <i class="fas fa-bars"></i>
                    </a>
                </div>
                <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                    <div class="navbar-nav align-items-center">
                        <div class="nav-item d-flex align-items-center">
                            <i class="fas fa-search fs-4 lh-0"></i>
                            <input type="text" class="form-control border-0 shadow-none" placeholder="Search..." aria-label="Search...">
                        </div>
                    </div>
                    <ul class="navbar-nav flex-row align-items-center ms-auto">
                        <li class="nav-item navbar-dropdown dropdown-user dropdown">
                            <a class="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);">
                                <div class="avatar avatar-online">
                                    <img src="${this.basePath}img/avatar.png" alt class="w-px-40 h-auto rounded-circle">
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        `;

        const layoutHtml = `
            <div class="layout-wrapper layout-content-navbar">
                <div class="layout-container">
                    ${sidebar}
                    <div class="layout-page">
                        ${navbar}
                        <div class="content-wrapper">
                            <div class="container-xxl flex-grow-1 container-p-y">
                                ${content}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layout-overlay layout-menu-toggle"></div>
            </div>
        `;

        document.body.innerHTML = layoutHtml;
        // Restore classes to body and html (Vuexy needs these classNames to initialize)
        document.body.className = 'light-style layout-navbar-fixed layout-menu-fixed layout-compact';
        document.documentElement.className = 'light-style layout-navbar-fixed layout-menu-fixed';
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('data-theme', 'theme-default');
        document.documentElement.setAttribute('data-template', 'vertical-menu-template');
    }

    async loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = this.basePath + src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    async loadScripts() {
        // On file:// protocol (local), only load the minimum scripts needed for layout
        // Most Vuexy scripts cause "Unsafe attempt to load URL" errors on mobile browsers
        const isFileProtocol = window.location.protocol === 'file:';

        const scripts = isFileProtocol
            ? [
                // Minimum + DataTables (dipakai Mapping Subdist grid)
                'lib/vuexy/vendor/libs/jquery/jquery.js',
                'lib/vuexy/vendor/libs/popper/popper.js',
                'lib/vuexy/vendor/js/bootstrap.js',
                'lib/datatables/jquery.dataTables.min.js',
                'lib/vuexy/vendor/js/tables/datatable/dataTables.bootstrap5.min.js',
                'js/role-manager.js'
              ]
            : [
                // Full script list for http:// (server)
                'lib/vuexy/vendor/libs/jquery/jquery.js',
                'lib/vuexy/vendor/libs/popper/popper.js',
                'lib/vuexy/vendor/js/bootstrap.js',
                'lib/vuexy/vendor/libs/perfect-scrollbar/perfect-scrollbar.js',
                'lib/vuexy/vendor/libs/node-waves/node-waves.js',
                'lib/vuexy/vendor/libs/hammer/hammer.js',
                'lib/vuexy/vendor/libs/bs-stepper/bs-stepper.js',
                'lib/vuexy/vendor/libs/select2/select2.js',
                'lib/vuexy/vendor/libs/sweetalert2/sweetalert2.js',
                'lib/vuexy/vendor/libs/datatables-bs5/datatables-bootstrap5.js',
                'js/role-manager.js'
              ];

        for (const src of scripts) {
            try {
                await this.loadScript(src);
            } catch (err) {
                console.warn('Failed to load script: ' + src, err);
            }
        }
    }

    setActiveMenu() {
        let currentUrl = window.location.href.split('?')[0].split('#')[0];
        try { currentUrl = decodeURIComponent(currentUrl); } catch(e) {}
        
        const links = document.querySelectorAll('.menu-link');

        links.forEach(link => {
            let href = link.href.split('?')[0].split('#')[0];
            try { href = decodeURIComponent(href); } catch(e) {}
            
            if (href === currentUrl || href === currentUrl + 'index.html' || currentUrl === href + 'index.html') {
                const menuItem = link.closest('.menu-item');
                if (menuItem) {
                    menuItem.classList.add('active');

                    let parent = menuItem.parentElement;
                    while (parent) {
                        if (parent.classList.contains('menu-sub')) {
                            const parentItem = parent.closest('.menu-item');
                            if (parentItem) {
                                parentItem.classList.add('active', 'open');
                                parent = parentItem.parentElement;
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                }
            }
        });
    }

    initMenuToggle() {
        const layoutMenu = document.getElementById('layout-menu');
        const overlay    = document.querySelector('.layout-overlay');
        if (!layoutMenu) return;

        let sidebarOpen = false;

        // Force sidebar off-screen on mobile
        const applyMobileInit = () => {
            if (window.innerWidth < 1200) {
                layoutMenu.style.cssText = 'display:block!important;position:fixed!important;top:0!important;left:-260px!important;height:100vh!important;width:260px!important;z-index:1100!important;transition:left 0.3s ease!important;overflow-y:auto!important;transform:none!important';
                sidebarOpen = false;
            } else {
                layoutMenu.style.cssText = '';
                sidebarOpen = false;
            }
        };

        applyMobileInit();
        window.addEventListener('resize', applyMobileInit);

        const openSidebar = () => {
            sidebarOpen = true;
            layoutMenu.style.cssText = 'display:block!important;position:fixed!important;top:0!important;left:0px!important;height:100vh!important;width:260px!important;z-index:1100!important;transition:left 0.3s ease!important;overflow-y:auto!important;transform:none!important';
            if (overlay) {
                overlay.style.cssText = 'display:block!important;position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;background:rgba(0,0,0,0.5)!important;z-index:1099!important;cursor:pointer!important';
            }
            document.body.style.overflow = 'hidden';
        };

        const closeSidebar = () => {
            sidebarOpen = false;
            layoutMenu.style.cssText = 'display:block!important;position:fixed!important;top:0!important;left:-260px!important;height:100vh!important;width:260px!important;z-index:1100!important;transition:left 0.3s ease!important;overflow-y:auto!important;transform:none!important';
            if (overlay) overlay.style.cssText = 'display:none!important';
            document.body.style.overflow = '';
        };

        if (overlay) {
            overlay.addEventListener('click', closeSidebar);
            overlay.addEventListener('touchend', function(e) { e.preventDefault(); closeSidebar(); });
        }

        let lastTime = 0;
        const handleBurger = (e) => {
            const now = Date.now();
            if (now - lastTime < 300) return;
            lastTime = now;

            if (e.target.closest('.layout-menu-toggle')) {
                e.preventDefault();
                e.stopPropagation();
                sidebarOpen ? closeSidebar() : openSidebar();
                return;
            }

            const toggle = e.target.closest('.menu-toggle');
            if (toggle) {
                e.preventDefault();
                const menuItem = toggle.closest('.menu-item');
                if (menuItem) menuItem.classList.toggle('open');
            }
        };

        document.addEventListener('click', handleBurger, { passive: false });
        document.addEventListener('touchend', handleBurger, { passive: false });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.layoutInitialized) {
        new Layout().init();
    }
});
