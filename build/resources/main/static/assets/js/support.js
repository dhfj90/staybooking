/* 고객센터 화면: 자주 묻는 질문 분류 필터 */
(function () {
  'use strict';

  Ui.renderHeader();

  var tabs = document.querySelectorAll('.faq-tab');
  var items = document.querySelectorAll('#faq-list details');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var category = tab.dataset.category;
      tabs.forEach(function (t) {
        t.setAttribute('aria-pressed', t === tab ? 'true' : 'false');
      });
      items.forEach(function (item) {
        item.hidden = category !== 'all' && item.dataset.category !== category;
      });
    });
  });
})();
