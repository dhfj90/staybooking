/* 고객센터 화면: 자주 묻는 질문 분류 필터, 최근 내 문의 */
(function () {
  'use strict';

  var USE_MOCK_DATA = true;

  /*
   * 백엔드 연동 전 mock 데이터
   *
   * 실제 API:
   * GET /api/v1/members/me/activities (내 Q&A)
   */
  var MOCK_INQUIRIES = [
    { qnaId: 12, category: 'booking', title: '체크인 시간 변경 가능한가요?', secret: true, answered: false, createdAt: '2026-10-18' },
    { qnaId: 9, category: 'refund', title: '환불 금액이 예상과 달라요', secret: false, answered: true, createdAt: '2026-10-12' }
  ];
  var RECENT_LIMIT = 3;
  var CATEGORY_LABELS = { booking: '예약', payment: '결제', refund: '취소·환불', account: '회원', etc: '기타' };

  Ui.renderHeader();

  /* ---------- 자주 묻는 질문 ---------- */

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

  /* ---------- 최근 내 문의 ---------- */

  var recentList = document.getElementById('inquiry-recent');
  var recentEmpty = document.getElementById('inquiry-empty');

  // 연동 전: 1:1 문의 작성 화면에서 등록한 글은 이 탭의 sessionStorage에 임시 보관된다
  function loadDrafts() {
    try {
      var stored = JSON.parse(sessionStorage.getItem('staybookMockInquiries'));
      return Array.isArray(stored) ? stored : [];
    } catch (e) {
      return [];
    }
  }

  function renderRecent(inquiries) {
    recentList.textContent = '';
    inquiries.slice(0, RECENT_LIMIT).forEach(function (q) {
      var li = document.createElement('li');

      var info = document.createElement('div');
      var title = document.createElement('p');
      title.className = 'inquiry-title';
      title.textContent = q.title;
      if (q.secret) {
        var lock = document.createElement('span');
        lock.className = 'inquiry-lock';
        lock.textContent = '비밀글';
        title.append(' ', lock);
      }
      var meta = document.createElement('p');
      meta.className = 'inquiry-meta';
      meta.textContent = q.createdAt + ' · ' + (CATEGORY_LABELS[q.category] || '기타');
      info.append(title, meta);

      var badge = document.createElement('span');
      badge.className = 'inquiry-badge ' + (q.answered ? 'done' : 'wait');
      badge.textContent = q.answered ? '답변 완료' : '답변 대기';

      li.append(info, badge);
      recentList.append(li);
    });
    recentEmpty.hidden = inquiries.length > 0;
  }

  renderRecent(USE_MOCK_DATA ? loadDrafts().concat(MOCK_INQUIRIES) : []);

  // 1:1 문의 등록 직후
  if (new URLSearchParams(window.location.search).get('inquiry') === 'done') {
    Ui.showAlert(document.getElementById('qna-alert'),
      '문의가 등록되었습니다. 답변이 등록되면 최근 내 문의에서 확인할 수 있습니다.', 'success');
    // 새로고침해도 알림이 다시 뜨지 않도록 주소에서 표시를 지운다
    window.history.replaceState(null, '', window.location.pathname);
  }
})();
