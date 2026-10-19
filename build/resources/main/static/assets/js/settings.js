/*
 * 설정 화면: 알림·일반 설정
 * 백엔드 연동 전이라 이 브라우저의 localStorage에만 저장한다.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'staybookSettings';
  var DEFAULTS = {
    notifyBooking: true,
    notifyMarketing: false,
    language: 'ko',
    defaultSort: 'recommended'
  };

  var savedMessage = document.getElementById('settings-saved');
  var controls = document.querySelectorAll('[data-setting]');
  var hideTimer = null;

  Ui.renderHeader();

  function load() {
    var settings = Object.assign({}, DEFAULTS);
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored && typeof stored === 'object') Object.assign(settings, stored);
    } catch (e) { /* 저장소를 못 쓰면 기본값 사용 */ }
    return settings;
  }

  function save(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      return true;
    } catch (e) {
      return false;
    }
  }

  function showSaved(ok) {
    savedMessage.textContent = ok ? '설정이 저장되었습니다.' : '이 브라우저에서는 설정을 저장할 수 없습니다.';
    savedMessage.hidden = false;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { savedMessage.hidden = true; }, 2000);
  }

  var settings = load();

  controls.forEach(function (control) {
    var key = control.dataset.setting;
    if (control.type === 'checkbox') {
      control.checked = Boolean(settings[key]);
    } else {
      control.value = settings[key];
      if (control.value !== settings[key]) control.value = DEFAULTS[key];
    }

    control.addEventListener('change', function () {
      settings[key] = control.type === 'checkbox' ? control.checked : control.value;
      showSaved(save(settings));
    });
  });
})();
