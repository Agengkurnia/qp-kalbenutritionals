/**
 * KICAO KDS prototype shell — AdminLTE skin-green
 */
const KicaoLayout = {
    getBasePath: function () {
        const path = window.location.pathname.replace(/\\/g, '/');
        if (path.indexOf('/kicao/') >= 0) return '../';
        return './';
    },

    getAssetBase: function () {
        return this.getBasePath() + 'assets/kicao/';
    },

    init: function (opts) {
        opts = opts || {};
        const active = opts.active || 'mkpp';
        const asset = this.getAssetBase();
        const base = this.getBasePath();

        document.body.className = 'hold-transition skin-green sidebar-mini';

        const pageContent = document.getElementById('kicaoPageContent');
        const innerHtml = pageContent ? pageContent.innerHTML : '';

        document.body.innerHTML =
            '<div class="wrapper">' +
            this.renderHeader(asset) +
            this.renderSidebar(base, active) +
            '<div class="content-wrapper">' +
            '<div id="kicaoPageContent">' + innerHtml + '</div>' +
            '</div>' +
            this.renderFooter() +
            '</div>';

        if (!document.getElementById('kicao-switch-template-style')) {
            const style = document.createElement('style');
            style.id = 'kicao-switch-template-style';
            style.textContent =
                '.main-sidebar .sidebar{padding-bottom:72px;}' +
                '.main-sidebar .df-switch-template{' +
                'position:fixed;left:0;bottom:0;width:230px;z-index:1030;' +
                'border-top:1px solid rgba(255,255,255,.12);' +
                'padding:8px 0 14px;background:#222d32;' +
                '}' +
                '.main-sidebar .df-switch-template .df-switch-label{' +
                'display:block;margin:0 15px 4px;font-size:11px;' +
                'text-transform:uppercase;color:#4b646f;font-weight:600;' +
                '}' +
                '.main-sidebar .df-switch-template>a{' +
                'display:block;color:#b8c7ce;padding:12px 15px;' +
                '}' +
                '.main-sidebar .df-switch-template>a:hover{color:#fff;background:rgba(0,0,0,.1);}' +
                '.sidebar-collapse .main-sidebar .df-switch-template{width:50px;}' +
                '.sidebar-collapse .main-sidebar .df-switch-template .df-switch-label,' +
                '.sidebar-collapse .main-sidebar .df-switch-template span{display:none;}' +
                '.sidebar-collapse .main-sidebar .df-switch-template>a{text-align:center;padding:12px 5px;}' +
                '@media (max-width:767px){.main-sidebar .df-switch-template{width:230px;}}';
            document.head.appendChild(style);
        }

        if (window.jQuery) {
            const $ = window.jQuery;
            try {
                if ($.AdminLTE && $.AdminLTE.layout && typeof $.AdminLTE.layout.activate === 'function') {
                    $.AdminLTE.layout.activate();
                }
                if ($.AdminLTE && typeof $.AdminLTE.tree === 'function') {
                    $.AdminLTE.tree('.sidebar');
                }
            } catch (e) { /* ignore */ }
            $(document).off('click.kicaoOffcanvas', '[data-toggle="offcanvas"]')
                .on('click.kicaoOffcanvas', '[data-toggle="offcanvas"]', function (e) {
                    e.preventDefault();
                    $('body').toggleClass('sidebar-collapse');
                });
        }
    },

    renderHeader: function (asset) {
        return (
            '<header class="main-header">' +
            '<a href="mkpp.html" class="logo">' +
            '<span class="logo-mini"><img src="' + asset + 'img/favicon.ico" alt="" style="height:28px;margin-top:10px;"></span>' +
            '<span class="logo-lg"><b>KICAO</b> KDS</span>' +
            '</a>' +
            '<nav class="navbar navbar-static-top">' +
            '<a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">' +
            '<span class="sr-only">Toggle navigation</span>' +
            '<span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>' +
            '</a>' +
            '<div class="navbar-custom-menu">' +
            '<ul class="nav navbar-nav">' +
            '<li class="dropdown user user-menu">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown">' +
            '<span class="hidden-xs">Welcome, Prototype <span class="label label-warning">DF</span></span>' +
            '</a>' +
            '<ul class="dropdown-menu">' +
            '<li class="user-footer">' +
            '<div class="pull-right"><a href="' + this.getBasePath() + 'index.html" class="btn btn-default btn-flat"><i class="fa fa-exchange"></i> Ke MAVEN</a></div>' +
            '</li></ul></li></ul></div></nav></header>'
        );
    },

    renderSidebar: function (base, active) {
        const mkppActive = active === 'mkpp' ? ' active' : '';
        return (
            '<aside class="main-sidebar">' +
            '<section class="sidebar">' +
            '<ul class="sidebar-menu">' +
            '<li class="header">MAIN NAVIGATION</li>' +
            '<li class="' + mkppActive.trim() + '">' +
            '<a href="mkpp.html"><i class="fa fa-file-text-o"></i> <span>MKPP</span>' +
            '<span class="pull-right-container"><small class="label pull-right bg-yellow">Proto</small></span>' +
            '</a></li>' +
            '</ul>' +
            '<div class="df-switch-template">' +
            '<span class="df-switch-label">Switch Prototype</span>' +
            '<a href="' + base + 'index.html"><i class="fa fa-exchange"></i> <span>Ke MAVEN</span></a>' +
            '</div>' +
            '</section></aside>'
        );
    },

    renderFooter: function () {
        return (
            '<footer class="main-footer">' +
            '<div class="pull-right hidden-xs"><b>Prototype</b> DF · KICAO shell</div>' +
            '<strong>Copyright &copy; Kalbe Nutritionals</strong> · Development Fund prototype' +
            '</footer>'
        );
    },

    toast: function (message, title) {
        if (typeof bootbox !== 'undefined') {
            bootbox.alert({ title: title || 'Info', message: message });
        } else {
            window.alert(message);
        }
    }
};

window.KicaoLayout = KicaoLayout;
