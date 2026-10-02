/* Shared site chrome: theme toggle, ⌘K command palette, scroll reveal.
   Loaded on every page. The theme class itself is applied by a tiny inline
   script in each <head> so the page never flashes the wrong theme. */

(function () {
    'use strict';

    var root = document.documentElement;
    var CONTENT_URL = '/content/content.json';

    /* --- Theme ------------------------------------------------------------ */

    function isDark() {
        return root.classList.contains('dark-theme');
    }

    function setTheme(dark) {
        root.classList.toggle('dark-theme', dark);
        try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) { }
        var btn = document.getElementById('themeToggle');
        if (btn) btn.innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }

    function toggleTheme() {
        setTheme(!isDark());
    }

    /* --- Controls (top-right) ---------------------------------------------- */

    function buildControls() {
        var bar = document.createElement('div');
        bar.className = 'site-controls';
        var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
        bar.innerHTML =
            '<button type="button" class="ctrl-btn kbd-hint" id="paletteOpen" aria-label="Open command palette">' +
            '<i class="fa-solid fa-magnifying-glass"></i><kbd>' + (mac ? '⌘' : 'Ctrl') + ' K</kbd></button>' +
            '<button type="button" class="ctrl-btn" id="themeToggle" aria-label="Toggle dark mode"></button>';
        document.body.appendChild(bar);
        document.getElementById('themeToggle').addEventListener('click', toggleTheme);
        document.getElementById('paletteOpen').addEventListener('click', openPalette);
        setTheme(isDark());
    }

    /* --- Command palette --------------------------------------------------- */

    var palette, input, list, items = [], filtered = [], active = 0;
    var onHome = /^\/(index\.html)?$/.test(location.pathname);

    function section(label, id, icon) {
        return {
            label: label, group: 'Go to', icon: icon,
            run: function () {
                if (onHome) {
                    var el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    location.href = '/index.html#' + id;
                }
            }
        };
    }

    function link(label, url, group, icon) {
        return {
            label: label, group: group, icon: icon,
            run: function () {
                if (/^(mailto:|\/)/.test(url) || url.indexOf('assets/') === 0) location.href = url;
                else window.open(url, '_blank', 'noopener');
            }
        };
    }

    function baseItems() {
        return [
            section('About', 'about', 'fa-user'),
            section('Now', 'now', 'fa-bolt'),
            section('Skills', 'skills', 'fa-layer-group'),
            section('Experience', 'history', 'fa-briefcase'),
            section('Writing', 'writingContainer', 'fa-pen-nib'),
            section('Projects', 'pet-projects', 'fa-flask'),
            section('Publications', 'publicationsContainer', 'fa-book'),
            section('Achievements', 'miscContainer', 'fa-trophy'),
            section('More links', 'moreLinksContainer', 'fa-link'),
            section('Contact', 'contact', 'fa-paper-plane'),
            link('All writing', '/blog.html', 'Pages', 'fa-newspaper'),
            { label: 'Toggle dark mode', group: 'Actions', icon: 'fa-circle-half-stroke', run: toggleTheme }
        ];
    }

    function contentItems(c) {
        var out = [];
        var email = null;
        ((c.header || {}).socialLinks || []).forEach(function (s) {
            if (s.show === false) return;
            if (s.url.indexOf('mailto:') === 0) email = s.url.slice(7);
            out.push(link(s.platform.charAt(0).toUpperCase() + s.platform.slice(1), s.url, 'Links', 'fa-arrow-up-right-from-square'));
        });
        if (email) {
            out.push({
                label: 'Copy email', hint: email, group: 'Actions', icon: 'fa-copy',
                run: function () {
                    if (navigator.clipboard) navigator.clipboard.writeText(email).then(function () { toast('Email copied'); });
                }
            });
        }
        ((c.moreLinks || {}).items || []).forEach(function (l) {
            out.push(link(l.title, l.url, 'Links', 'fa-arrow-up-right-from-square'));
        });
        ((c.projects || {}).items || []).forEach(function (p) {
            out.push(link(p.name, p.demo || p.url, 'Projects', 'fa-code'));
        });
        return out;
    }

    function buildPalette() {
        palette = document.createElement('div');
        palette.className = 'palette';
        palette.setAttribute('role', 'dialog');
        palette.setAttribute('aria-modal', 'true');
        palette.setAttribute('aria-label', 'Command palette');
        palette.innerHTML =
            '<div class="palette-box">' +
            '<input class="palette-input" type="text" placeholder="Type a command or search…" aria-label="Search" />' +
            '<ul class="palette-list" role="listbox"></ul>' +
            '<div class="palette-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>' +
            '</div>';
        document.body.appendChild(palette);
        input = palette.querySelector('.palette-input');
        list = palette.querySelector('.palette-list');

        palette.addEventListener('mousedown', function (e) {
            if (e.target === palette) closePalette();
        });
        input.addEventListener('input', function () { active = 0; render(); });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
            else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
            else if (e.key === 'Escape') { closePalette(); }
        });
        list.addEventListener('click', function (e) {
            var li = e.target.closest('li[data-i]');
            if (li) choose(Number(li.getAttribute('data-i')));
        });
    }

    function render() {
        var q = input.value.trim().toLowerCase();
        filtered = items.filter(function (it) {
            return !q || (it.label + ' ' + it.group + ' ' + (it.hint || '')).toLowerCase().indexOf(q) !== -1;
        });
        if (!filtered.length) {
            list.innerHTML = '<li class="palette-empty">No results</li>';
            return;
        }
        var html = '', lastGroup = null;
        filtered.forEach(function (it, i) {
            if (it.group !== lastGroup) {
                html += '<li class="palette-group" role="presentation">' + it.group + '</li>';
                lastGroup = it.group;
            }
            html += '<li role="option" data-i="' + i + '" class="palette-item' + (i === active ? ' active' : '') + '"' +
                ' aria-selected="' + (i === active) + '">' +
                '<i class="fa-solid ' + it.icon + '"></i><span>' + it.label + '</span>' +
                (it.hint ? '<span class="palette-hint">' + it.hint + '</span>' : '') + '</li>';
        });
        list.innerHTML = html;
        var el = list.querySelector('.active');
        if (el) el.scrollIntoView({ block: 'nearest' });
    }

    function move(d) {
        if (!filtered.length) return;
        active = (active + d + filtered.length) % filtered.length;
        render();
    }

    function choose(i) {
        var it = filtered[i];
        if (!it) return;
        closePalette();
        it.run();
    }

    function openPalette() {
        if (!palette) buildPalette();
        palette.classList.add('open');
        input.value = '';
        active = 0;
        render();
        setTimeout(function () { input.focus(); }, 0);
    }

    function closePalette() {
        if (palette) palette.classList.remove('open');
    }

    document.addEventListener('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (palette && palette.classList.contains('open')) closePalette();
            else openPalette();
        }
    });

    /* --- Toast ------------------------------------------------------------- */

    function toast(msg) {
        var t = document.createElement('div');
        t.className = 'toast';
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(function () { t.classList.add('show'); }, 10);
        setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 1800);
    }

    /* --- Scroll reveal ----------------------------------------------------- */

    function reveal(selector) {
        if (!('IntersectionObserver' in window)) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    var el = en.target;
                    el.classList.add('in');
                    io.unobserve(el);
                    // Drop the classes afterwards so hover transforms work again.
                    setTimeout(function () { el.classList.remove('reveal', 'in'); }, 700);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        document.querySelectorAll(selector).forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.top < window.innerHeight) return; // already on screen: leave it alone
            el.classList.add('reveal');
            io.observe(el);
        });
    }

    /* --- Boot -------------------------------------------------------------- */

    items = baseItems();
    buildControls();

    fetch(CONTENT_URL, { cache: 'no-cache' })
        .then(function (r) { return r.json(); })
        .then(function (c) { items = baseItems().concat(contentItems(c)); })
        .catch(function () { });

    window.Site = { reveal: reveal, toast: toast, openPalette: openPalette };
})();
