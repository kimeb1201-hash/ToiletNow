const toilets = [
  {
    id: 1,
    name: '스타필드몰 1층 공용 화장실',
    location: '현재 위치에서 도보 2분',
    distance: 180,
    status: 'available',
    cleanliness: 4.8,
    passwordRequired: false,
    waitTime: 0,
    memo: '유아용 칸과 손 세정제가 잘 구비되어 있어요.',
    open: '24시간',
    reviews: 128,
  },
  {
    id: 2,
    name: '중앙역 2번 출구 화장실',
    location: '현재 위치에서 도보 4분',
    distance: 320,
    status: 'busy',
    cleanliness: 4.1,
    passwordRequired: false,
    waitTime: 3,
    memo: '출퇴근 시간에는 혼잡하지만 접근성이 좋아요.',
    open: '05:30 ~ 23:50',
    reviews: 87,
  },
  {
    id: 3,
    name: '그린카페 내부 화장실',
    location: '현재 위치에서 도보 5분',
    distance: 410,
    status: 'available',
    cleanliness: 4.5,
    passwordRequired: true,
    waitTime: 1,
    memo: '카페 이용 고객 중심이지만 비밀번호 안내가 잘 되어 있어요.',
    open: '09:00 ~ 22:00',
    reviews: 52,
  },
  {
    id: 4,
    name: '공원 관리사무소 화장실',
    location: '현재 위치에서 도보 7분',
    distance: 620,
    status: 'closed',
    cleanliness: 3.6,
    passwordRequired: false,
    waitTime: null,
    memo: '야간에는 문이 잠겨 있어 이용이 어려워요.',
    open: '06:00 ~ 20:00',
    reviews: 31,
  },
];

const toiletList = document.getElementById('toiletList');
const detailPanel = document.getElementById('detailPanel');
const toiletSelect = document.getElementById('toiletSelect');
const feedbackForm = document.getElementById('feedbackForm');
const formMessage = document.getElementById('formMessage');
const listStatus = document.getElementById('listStatus');
const nearbyCount = document.getElementById('nearbyCount');
const availableCount = document.getElementById('availableCount');
const avgCleanliness = document.getElementById('avgCleanliness');
const findNearbyBtn = document.getElementById('findNearbyBtn');
const refreshBtn = document.getElementById('refreshBtn');
const guideModal = document.getElementById('guideModal');
const openGuideBtn = document.getElementById('openGuideBtn');
const closeGuideBtn = document.getElementById('closeGuideBtn');
const loginBtn = document.getElementById('loginBtn');

let activeFilter = 'all';
let selectedId = null;

function statusLabel(status) {
  if (status === 'available') return '바로 이용 가능';
  if (status === 'busy') return '현재 사용 중';
  return '이용 불가';
}

function statusClass(status) {
  if (status === 'available') return 'available';
  if (status === 'busy') return 'busy';
  return 'closed';
}

function getFilteredToilets() {
  if (activeFilter === 'available') return toilets.filter((item) => item.status === 'available');
  if (activeFilter === 'clean') return toilets.filter((item) => item.cleanliness >= 4.5);
  if (activeFilter === 'password') return toilets.filter((item) => item.passwordRequired === false);
  return toilets;
}

function renderStats() {
  const available = toilets.filter((item) => item.status === 'available').length;
  const average = toilets.reduce((sum, item) => sum + item.cleanliness, 0) / toilets.length;

  nearbyCount.textContent = `${toilets.length}개`;
  availableCount.textContent = `${available}개`;
  avgCleanliness.textContent = `${average.toFixed(1)} / 5`;
}

function renderList() {
  const filtered = getFilteredToilets();
  listStatus.textContent = `${filtered.length}개 표시 중`;

  toiletList.innerHTML = filtered
    .map(
      (item) => `
        <article class="toilet-card ${selectedId === item.id ? 'active' : ''}" data-id="${item.id}">
          <h4>${item.name}</h4>
          <p>${item.location}</p>
          <div class="card-tags">
            <span class="tag ${statusClass(item.status)}">${statusLabel(item.status)}</span>
            <span class="tag clean">청결도 ${item.cleanliness}</span>
            <span class="tag ${item.passwordRequired ? 'password' : 'open'}">
              ${item.passwordRequired ? '비밀번호 필요' : '비밀번호 없음'}
            </span>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.toilet-card').forEach((card) => {
    card.addEventListener('click', () => {
      selectedId = Number(card.dataset.id);
      renderList();
      renderDetail(selectedId);
    });
  });
}

function renderDetail(id) {
  const item = toilets.find((toilet) => toilet.id === id);
  if (!item) {
    detailPanel.className = 'detail-panel empty-state';
    detailPanel.textContent = '왼쪽 목록에서 화장실을 선택하면 상세 정보가 표시됩니다.';
    return;
  }

  detailPanel.className = 'detail-panel';
  detailPanel.innerHTML = `
    <div>
      <h4>${item.name}</h4>
      <p>${item.location}</p>
    </div>
    <div class="detail-tags">
      <span class="tag ${statusClass(item.status)}">${statusLabel(item.status)}</span>
      <span class="tag clean">청결도 ${item.cleanliness} / 5</span>
      <span class="tag ${item.passwordRequired ? 'password' : 'open'}">
        ${item.passwordRequired ? '비밀번호 필요' : '비밀번호 없음'}
      </span>
    </div>
    <div class="detail-box">
      <strong>운영 시간</strong>
      <p>${item.open}</p>
    </div>
    <div class="detail-box">
      <strong>예상 대기 시간</strong>
      <p>${item.waitTime === null ? '현재 이용 불가' : `${item.waitTime}분`}</p>
    </div>
    <div class="detail-box">
      <strong>최근 후기 요약</strong>
      <p>${item.memo}</p>
      <p>총 ${item.reviews}개의 사용자 평가가 반영되었습니다.</p>
    </div>
  `;
}

function renderSelectOptions() {
  toiletSelect.innerHTML = toilets
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join('');
}

function bindFilters() {
  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      activeFilter = button.dataset.filter;
      renderList();
    });
  });
}

feedbackForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const id = Number(toiletSelect.value);
  const cleanliness = Number(document.getElementById('cleanlinessSelect').value);
  const availability = document.getElementById('availabilitySelect').value;
  const memo = document.getElementById('memoInput').value.trim();

  const target = toilets.find((item) => item.id === id);
  if (!target) return;

  target.cleanliness = Number(((target.cleanliness + cleanliness) / 2).toFixed(1));
  target.status = availability;
  if (memo) target.memo = memo;
  target.reviews += 1;

  formMessage.textContent = '후기가 등록되었습니다. 목록과 상세 정보가 업데이트되었어요.';
  selectedId = id;
  renderStats();
  renderList();
  renderDetail(id);
  feedbackForm.reset();
  renderSelectOptions();
});

findNearbyBtn.addEventListener('click', () => {
  selectedId = 1;
  renderList();
  renderDetail(1);
  window.scrollTo({ top: 420, behavior: 'smooth' });
});

refreshBtn.addEventListener('click', () => {
  listStatus.textContent = '최신 데이터를 반영하는 중...';
  setTimeout(() => {
    renderStats();
    renderList();
    if (selectedId) renderDetail(selectedId);
  }, 400);
});

openGuideBtn.addEventListener('click', () => guideModal.classList.remove('hidden'));
closeGuideBtn.addEventListener('click', () => guideModal.classList.add('hidden'));
guideModal.addEventListener('click', (event) => {
  if (event.target === guideModal) {
    guideModal.classList.add('hidden');
  }
});

loginBtn.addEventListener('click', () => {
  alert('현재는 MVP 화면 구현 단계입니다. 다음 단계에서 EarnLearning OAuth 로그인을 연결할 예정입니다.');
});

renderStats();
renderSelectOptions();
bindFilters();
renderList();
