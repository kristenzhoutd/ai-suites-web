/**
 * Web extraction routes — replaces electron/ipc/web-handlers.ts
 *
 * Uses cheerio for HTML parsing (same as the Electron version).
 */

import { Router } from 'express';

export const webRouter = Router();

// POST /api/web/extract — extract personalization slots from URL
webRouter.post('/extract', async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    res.json({ success: false, error: 'No URL provided.' });
    return;
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'AI-Suites-Web/1.0' },
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      res.json({ success: false, error: `HTTP ${response.status} fetching URL` });
      return;
    }
    const html = await response.text();

    // Dynamic import cheerio
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);

    const title = $('title').text().trim() || url;
    const spots: Array<{ id: string; selector: string; type: string; content: string }> = [];

    // Find common personalization targets
    $('[data-slot], [data-personalization], .hero-banner, .hero, .banner, .cta-section, .product-recommendation, .content-block').each((i, el) => {
      const $el = $(el);
      spots.push({
        id: `spot-${i}`,
        selector: $el.attr('data-slot') || $el.attr('class')?.split(' ')[0] || `element-${i}`,
        type: $el.attr('data-slot') ? 'data-slot' : 'semantic',
        content: $el.text().trim().slice(0, 200),
      });
    });

    res.json({
      success: true,
      data: {
        pageName: title,
        url,
        spots,
        rawHtmlLength: html.length,
      },
    });
  } catch (error) {
    res.json({ success: false, error: error instanceof Error ? error.message : 'Failed to extract.' });
  }
});

// GET /api/web/proxy — proxy a webpage for iframe embedding
webRouter.get('/proxy', async (req, res) => {
  const url = req.query.url as string;
  if (!url || typeof url !== 'string') {
    res.status(400).send('No URL provided.');
    return;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      res.status(response.status).send(`Failed to fetch: HTTP ${response.status}`);
      return;
    }

    const html = await response.text();
    const contentType = response.headers.get('content-type') || 'text/html';

    // Inject <base> tag, picker script, and command listener
    const baseTag = `<base href="${url}">`;
    const pickerScript = `<script>
(function() {
  // --- Picker state ---
  var enabled = false;
  var hoveredEl = null;
  var selectedSelectors = new Set();

  function getSelector(el) {
    if (el.id) {
      var byId = '#' + CSS.escape(el.id);
      if (document.querySelectorAll(byId).length === 1) return byId;
    }
    var parts = [];
    var current = el;
    while (current && current !== document.body && current !== document.documentElement) {
      var tag = current.tagName.toLowerCase();
      var parent = current.parentElement;
      if (parent) {
        var siblings = Array.from(parent.children).filter(function(c) { return c.tagName === current.tagName; });
        if (siblings.length > 1) {
          var idx = siblings.indexOf(current) + 1;
          tag += ':nth-of-type(' + idx + ')';
        }
      }
      parts.unshift(tag);
      current = parent;
    }
    var selector = parts.join(' > ');
    try { if (document.querySelectorAll(selector).length !== 1) selector = 'body > ' + selector; } catch(e) {}
    return selector;
  }

  function getElementType(el) {
    var tag = el.tagName.toLowerCase();
    if (tag === 'img' || tag === 'picture' || tag === 'svg') return 'IMAGE';
    if (tag === 'a' || tag === 'button') return 'CTA';
    if (/^h[1-6]$/.test(tag)) return 'HEADING';
    if (tag === 'p' || tag === 'span' || tag === 'label') return 'TEXT';
    return 'CONTAINER';
  }

  function getName(el) {
    var name = el.getAttribute('aria-label') || el.getAttribute('alt') || el.getAttribute('title') || (el.textContent || '').trim().substring(0, 40);
    if (!name) name = el.tagName.toLowerCase();
    return name.length > 40 ? name.substring(0, 37) + '...' : name;
  }

  function setHoverHighlight(el) {
    if (!el || selectedSelectors.has(getSelector(el))) return;
    el.style.outline = '2px solid #3B82F6';
    el.style.outlineOffset = '-2px';
  }
  function clearHoverHighlight(el) {
    if (!el) return;
    if (selectedSelectors.has(getSelector(el))) {
      el.style.outline = '2px solid #8B5CF6';
      el.style.outlineOffset = '-2px';
    } else {
      el.style.outline = '';
      el.style.outlineOffset = '';
    }
  }
  function setSelectedHighlight(el) {
    el.style.outline = '2px solid #8B5CF6';
    el.style.outlineOffset = '-2px';
  }

  document.addEventListener('mouseover', function(e) {
    if (!enabled) return;
    var el = e.target;
    if (el === document.body || el === document.documentElement) return;
    if (hoveredEl && hoveredEl !== el) clearHoverHighlight(hoveredEl);
    hoveredEl = el;
    setHoverHighlight(el);
  }, true);

  document.addEventListener('mouseout', function(e) {
    if (!enabled) return;
    clearHoverHighlight(e.target);
    if (hoveredEl === e.target) hoveredEl = null;
  }, true);

  document.addEventListener('click', function(e) {
    if (!enabled) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    var el = e.target;
    if (el === document.body || el === document.documentElement) return;
    var selector = getSelector(el);
    if (selectedSelectors.has(selector)) return;
    selectedSelectors.add(selector);
    setSelectedHighlight(el);
    hoveredEl = null;
    var data = {
      selector: selector,
      type: getElementType(el),
      name: getName(el),
      tagName: el.tagName.toLowerCase(),
      id: el.id || '',
      classes: el.className || '',
      role: el.getAttribute('role') || '',
      ariaLabel: el.getAttribute('aria-label') || '',
      ariaModal: '',
      style: '',
      hasImage: !!(el.querySelector('img') || el.querySelector('picture') || el.querySelector('svg')),
      hasHeading: !!(el.querySelector('h1') || el.querySelector('h2') || el.querySelector('h3')),
      parentTag: el.parentElement ? el.parentElement.tagName.toLowerCase() : '',
      parentClasses: el.parentElement ? (el.parentElement.className || '') : '',
      parentId: el.parentElement ? (el.parentElement.id || '') : ''
    };
    window.parent.postMessage({ type: 'picker', payload: '__SPOT_SELECTED__' + JSON.stringify(data) }, '*');
  }, true);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && enabled) {
      window.parent.postMessage({ type: 'picker', payload: '__PICKER_ESCAPE__' }, '*');
    }
  }, true);

  window.__PS_PICKER__ = {
    enable: function() { enabled = true; },
    disable: function() { enabled = false; if (hoveredEl) { clearHoverHighlight(hoveredEl); hoveredEl = null; } },
    removeHighlight: function(selector) {
      selectedSelectors.delete(selector);
      try { var el = document.querySelector(selector); if (el) { el.style.outline = ''; el.style.outlineOffset = ''; } } catch(e) {}
    }
  };
  window.__PS_PICKER_INSTALLED__ = true;

  // Listen for enable/disable commands from parent
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'picker-command' && window.__PS_PICKER__) {
      if (e.data.action === 'enable') window.__PS_PICKER__.enable();
      else if (e.data.action === 'disable') window.__PS_PICKER__.disable();
      else if (e.data.action === 'removeHighlight') window.__PS_PICKER__.removeHighlight(e.data.selector);
    }
  });
})();
    </script>`;
    const modifiedHtml = html.replace(/<\/body>/i, `${pickerScript}</body>`);

    res.setHeader('Content-Type', contentType);
    res.removeHeader('X-Frame-Options');
    res.send(modifiedHtml);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : 'Failed to proxy page.');
  }
});

// GET /api/web/test-picker — simple test page for picker debugging
webRouter.get('/test-picker', (_req, res) => {
  res.send(`<!DOCTYPE html>
<html><head><title>Picker Test</title></head>
<body>
<h1 id="title">Test Page</h1>
<p>Click elements to test picker</p>
<div style="padding:20px;background:#eee;margin:10px;">Box 1</div>
<div style="padding:20px;background:#ddd;margin:10px;">Box 2</div>
<button>Test Button</button>
<script>
(function() {
  var enabled = false;
  var hoveredEl = null;
  var selectedSelectors = new Set();

  function getSelector(el) {
    if (el.id) return '#' + el.id;
    var parts = [];
    var current = el;
    while (current && current !== document.body) {
      var tag = current.tagName.toLowerCase();
      var parent = current.parentElement;
      if (parent) {
        var siblings = Array.from(parent.children).filter(function(c) { return c.tagName === current.tagName; });
        if (siblings.length > 1) tag += ':nth-of-type(' + (siblings.indexOf(current) + 1) + ')';
      }
      parts.unshift(tag);
      current = parent;
    }
    return parts.join(' > ');
  }

  document.addEventListener('mouseover', function(e) {
    if (!enabled) return;
    if (hoveredEl) hoveredEl.style.outline = '';
    hoveredEl = e.target;
    e.target.style.outline = '2px solid blue';
  }, true);

  document.addEventListener('mouseout', function(e) {
    if (!enabled) return;
    e.target.style.outline = '';
  }, true);

  document.addEventListener('click', function(e) {
    if (!enabled) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    var data = { selector: getSelector(e.target), type: 'CONTAINER', name: e.target.textContent.trim().substring(0,40), tagName: e.target.tagName.toLowerCase() };
    console.log('Sending postMessage', data);
    window.parent.postMessage({ type: 'picker', payload: '__SPOT_SELECTED__' + JSON.stringify(data) }, '*');
  }, true);

  window.__PS_PICKER__ = {
    enable: function() { enabled = true; console.log('Picker enabled'); },
    disable: function() { enabled = false; console.log('Picker disabled'); }
  };
  window.__PS_PICKER_INSTALLED__ = true;

  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'picker-command') {
      console.log('Received command:', e.data);
      if (e.data.action === 'enable') window.__PS_PICKER__.enable();
      else if (e.data.action === 'disable') window.__PS_PICKER__.disable();
    }
  });

  console.log('Picker script loaded');
})();
</script>
</body></html>`);
});

// POST /api/web/extract-text — extract visible text from URL
webRouter.post('/extract-text', async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    res.json({ success: false, error: 'No URL provided.' });
    return;
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'AI-Suites-Web/1.0' },
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      res.json({ success: false, error: `HTTP ${response.status}` });
      return;
    }
    const html = await response.text();
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);

    // Remove non-content elements
    $('script, style, nav, footer, header, iframe, noscript').remove();

    const title = $('title').text().trim() || url;
    const headings = $('h1, h2, h3').map((_, el) => $(el).text().trim()).get();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 10000);
    const metaDescription = $('meta[name="description"]').attr('content') || '';

    res.json({
      success: true,
      data: {
        title,
        url,
        headings,
        bodyText,
        metaDescription,
        _method: 'direct',
      },
    });
  } catch (error) {
    res.json({ success: false, error: error instanceof Error ? error.message : 'Failed to extract.' });
  }
});
