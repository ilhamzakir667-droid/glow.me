(function () {
  'use strict';

  const NOTICE_KEY = 'glamme_cookie_notice_v1';
  const NOTICE_VERSION = '2026-09-02';
  const NOTICE_LIFETIME_MS = 365 * 24 * 60 * 60 * 1000;

  function hasCurrentNotice() {
    try {
      const saved = JSON.parse(localStorage.getItem(NOTICE_KEY));
      return Boolean(saved && saved.version === NOTICE_VERSION && Number(saved.expiresAt) > Date.now());
    } catch (error) {
      return false;
    }
  }

  function saveNotice() {
    try {
      localStorage.setItem(NOTICE_KEY, JSON.stringify({
        version: NOTICE_VERSION,
        acknowledgedAt: new Date().toISOString(),
        expiresAt: Date.now() + NOTICE_LIFETIME_MS
      }));
    } catch (error) {
      // Если локальное хранилище недоступно, уведомление закроется до обновления страницы.
    }
  }

  function initNotice() {
    const notice = document.getElementById('cookieNotice');
    const acceptButton = document.getElementById('cookieNoticeAccept');
    if (!notice || !acceptButton) return;

    if (!hasCurrentNotice()) notice.hidden = false;

    acceptButton.addEventListener('click', function () {
      saveNotice();
      notice.hidden = true;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotice, { once: true });
  } else {
    initNotice();
  }
})();
