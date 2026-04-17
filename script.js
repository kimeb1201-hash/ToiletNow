const toilets = [
  {
    id: 1,
    name: "스타필드 1층 화장실",
    distance: 2,
    cleanliness: 4.8,
    available: true,
    password: false,
    favorite: false,
    memo: "비밀번호 없이 바로 사용 가능하고 매우 깨끗했어요. 향기도 좋고 엄청 고급져요.",
    image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "중앙역 2번 출구 화장실",
    distance: 4,
    cleanliness: 4.2,
    available: false,
    password: true,
    favorite: false,
    memo: "휴지가 없는 칸이 몇 개 있어요.",
    image: "https://images.unsplash.com/photo-1564540574859-0dfb6398594d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "시청 공원 화장실",
    distance: 3,
    cleanliness: 3.9,
    available: true,
    password: false,
    favorite: true,
    memo: "비누가 없고 수압이 약하니 종이비누를 챙기세요.",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "롯데몰 3층 화장실",
    distance: 5,
    cleanliness: 4.5,
    available: true,
    password: true,
    favorite: false,
    memo: "청결도 높지만 양변기가 몇 개 없고 악취가 납니다 ㅠㅠ.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80"
  }
];
  },
  {
    
let currentFilter = "all";
let selectedToiletId = 1;

const listEl = document.getElementById("toiletList");
const detailEl = document.getElementById("detailPanel");
const mapCardListEl = document.getElementById("mapCardList");
const reviewListEl = document.getElementById("reviewList");
const favoriteListEl = document.getElementById("favoriteList");
const searchInput = document.getElementById("searchInput");
const form = document.getElementById("feedbackForm");
const toiletSelect = document.getElementById("toiletSelect");
const formMessage = document.getElementById("formMessage");
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const filterButtons = document.querySelectorAll(".filter-chip");

const guideModal = document.getElementById("guideModal");
const adModal = document.getElementById("adModal");

function getFilteredToilets() {
  const keyword = (searchInput?.value || "").trim().toLowerCase();

  return toilets.filter((t) => {
    const keywordMatch = t.name.toLowerCase().includes(keyword);

    let filterMatch = true;
    if (currentFilter === "available") filterMatch = t.available;
    if (currentFilter === "clean") filterMatch = t.cleanliness >= 4.3;
    if (currentFilter === "password") filterMatch = !t.password;

    return keywordMatch && filterMatch;
  });
}

function renderList() {
  if (!listEl) return;

  const data = getFilteredToilets();
  listEl.innerHTML = "";

  data.forEach((t) => {
    const card = document.createElement("div");
    card.className = "place-card";
    card.innerHTML = `
      <div class="place-top">
        <div class="place-left">
          <div class="place-icon">${t.available ? "🚻" : "⏳"}</div>
          <div class="place-info">
            <h4>${t.name}</h4>
            <p>도보 ${t.distance}분 · ${t.available ? "바로 이용 가능" : "현재 사용 중"}</p>
          </div>
        </div>
        <button type="button" class="favorite favorite-toggle" data-id="${t.id}">
          ${t.favorite ? "💙" : "🤍"}
        </button>
      </div>

      <div class="meta-row">
        <div class="meta-badge">📍 도보 ${t.distance}분</div>
        <div class="meta-badge">✨ 청결도 ${t.cleanliness}</div>
        <div class="meta-badge">${t.password ? "🔒 비밀번호 필요" : "🔓 비밀번호 없음"}</div>
        <div class="meta-badge">${t.available ? "🟢 이용 가능" : "🔴 사용중"}</div>
      </div>

      <div class="card-actions">
        <button type="button" class="gloss-btn detail-btn" data-id="${t.id}">상세보기</button>
        <button type="button" class="ghost-btn route-btn" data-id="${t.id}">길찾기</button>
      </div>
    `;
    listEl.appendChild(card);
  });

  const listStatus = document.getElementById("listStatus");
  if (listStatus) listStatus.textContent = `${data.length}개 표시 중`;
}

function renderDetail(id) {
  if (!detailEl) return;

  const t = toilets.find((x) => x.id === id);
  if (!t) return;

  selectedToiletId = id;

  detailEl.innerHTML = `
    <div class="detail-photo-wrap">
      <img class="detail-photo" src="${t.image}" alt="${t.name} 내부 사진" />
      <div class="detail-photo-badge">${t.available ? "🟢 바로 이용 가능" : "🔴 현재 사용 중"}</div>
    </div>

    <div class="detail-header">
      <div class="place-left">
        <div class="place-icon">${t.available ? "🚻" : "⏳"}</div>
        <div class="place-info">
          <h4>${t.name}</h4>
          <p>도보 ${t.distance}분 · ${t.available ? "바로 이용 가능" : "현재 사용 중"}</p>
        </div>
      </div>
    </div>

    <div class="detail-grid">
      <div class="detail-info-card">
        <span class="detail-label">📍 거리</span>
        <strong>${t.distance}분</strong>
      </div>
      <div class="detail-info-card">
        <span class="detail-label">✨ 청결도</span>
        <strong>${t.cleanliness}</strong>
      </div>
      <div class="detail-info-card">
        <span class="detail-label">🔐 비밀번호</span>
        <strong>${t.password ? "필요" : "없음"}</strong>
      </div>
      <div class="detail-info-card">
        <span class="detail-label">🚦 상태</span>
        <strong>${t.available ? "사용 가능" : "사용 중"}</strong>
      </div>
    </div>

    <div class="detail-review-box">
      <div class="section-head" style="margin-bottom: 8px;">
        <h3 style="font-size:16px;">이용 후기</h3>
        <span>review</span>
      </div>
      <p class="detail-review-text">${t.memo || "등록된 후기가 아직 없어요."}</p>
    </div>

    <div class="card-actions">
      <button type="button" class="gloss-btn route-btn" data-id="${t.id}">길찾기</button>
      <button type="button" class="ghost-btn favorite-toggle" data-id="${t.id}">
        ${t.favorite ? "💙 즐겨찾기됨" : "🤍 즐겨찾기"}
      </button>
    </div>
  `;

  updateMyPage();
}

function renderMapCards() {
  if (!mapCardListEl) return;

  mapCardListEl.innerHTML = "";
  toilets.forEach((t) => {
    const card = document.createElement("div");
    card.className = "place-card";
    card.innerHTML = `
      <div class="place-top">
        <div class="place-left">
          <div class="place-icon">🗺️</div>
          <div class="place-info">
            <h4>${t.name}</h4>
            <p>지도에서 선택 가능 · 도보 ${t.distance}분</p>
          </div>
        </div>
      </div>

      <div class="meta-row">
        <div class="meta-badge">📍 ${t.distance}분</div>
        <div class="meta-badge">✨ ${t.cleanliness}</div>
        <div class="meta-badge">${t.available ? "🟢 이용 가능" : "🔴 사용중"}</div>
      </div>

      <div class="card-actions">
        <button type="button" class="gloss-btn detail-btn" data-id="${t.id}">상세보기</button>
      </div>
    `;
    mapCardListEl.appendChild(card);
  });
}

function renderReviews() {
  if (!reviewListEl) return;

  reviewListEl.innerHTML = "";
  toilets.forEach((t) => {
    const card = document.createElement("div");
    card.className = "review-card";
    card.innerHTML = `
      <h4>${t.name}</h4>
      <p>${t.memo || "아직 등록된 후기가 없어요."}</p>
      <div class="review-meta">
        <div class="meta-badge">✨ ${t.cleanliness}</div>
        <div class="meta-badge">${t.available ? "🟢 이용 가능" : "🔴 사용중"}</div>
        <div class="meta-badge">${t.password ? "🔒 비밀번호 필요" : "🔓 비밀번호 없음"}</div>
      </div>
    `;
    reviewListEl.appendChild(card);
  });
}

function renderFavorites() {
  if (!favoriteListEl) return;

  const favorites = toilets.filter((t) => t.favorite);
  favoriteListEl.innerHTML = "";

  if (favorites.length === 0) {
    favoriteListEl.innerHTML = `
      <div class="place-card">
        <div class="place-info">
          <h4>아직 즐겨찾기가 없어요</h4>
          <p>홈에서 마음에 드는 화장실을 저장해보세요.</p>
        </div>
      </div>
    `;
    return;
  }

  favorites.forEach((t) => {
    const card = document.createElement("div");
    card.className = "place-card";
    card.innerHTML = `
      <div class="place-top">
        <div class="place-left">
          <div class="place-icon">💙</div>
          <div class="place-info">
            <h4>${t.name}</h4>
            <p>도보 ${t.distance}분 · 청결도 ${t.cleanliness}</p>
          </div>
        </div>
      </div>

      <div class="meta-row">
        <div class="meta-badge">${t.password ? "🔒 비밀번호 필요" : "🔓 비밀번호 없음"}</div>
        <div class="meta-badge">${t.available ? "🟢 이용 가능" : "🔴 사용중"}</div>
      </div>
    `;
    favoriteListEl.appendChild(card);
  });
}

function updateStats() {
  const nearby = document.getElementById("nearbyCount");
  const available = document.getElementById("availableCount");
  const avgClean = document.getElementById("avgCleanliness");

  if (nearby) nearby.innerText = toilets.length + "개";
  if (available) available.innerText = toilets.filter((t) => t.available).length + "개";

  const avg = toilets.reduce((sum, t) => sum + t.cleanliness, 0) / toilets.length;
  if (avgClean) avgClean.innerText = avg.toFixed(1);
}

function updateMyPage() {
  const favCount = document.getElementById("favCount");
  const reviewCount = document.getElementById("reviewCount");
  const recentToilet = document.getElementById("recentToilet");

  if (favCount) favCount.innerText = toilets.filter((t) => t.favorite).length;
  if (reviewCount) reviewCount.innerText = toilets.filter((t) => t.memo && t.memo.trim() !== "").length;

  const recent = toilets.find((t) => t.id === selectedToiletId);
  if (recentToilet) recentToilet.innerText = recent ? recent.name.split(" ")[0] : "-";
}

function initSelect() {
  if (!toiletSelect) return;

  toiletSelect.innerHTML = `<option value="">선택하세요</option>`;
  toilets.forEach((t) => {
    const option = document.createElement("option");
    option.value = t.id;
    option.innerText = t.name;
    toiletSelect.appendChild(option);
  });
}

function switchPage(pageName) {
  pages.forEach((page) => page.classList.remove("active"));
  navItems.forEach((item) => item.classList.remove("active"));

  document.getElementById(`page-${pageName}`)?.classList.add("active");
  document.querySelector(`.nav-item[data-page="${pageName}"]`)?.classList.add("active");
}

function toggleFavorite(id) {
  const t = toilets.find((x) => x.id === id);
  if (!t) return;

  t.favorite = !t.favorite;
  renderList();
  renderDetail(selectedToiletId || id);
  renderFavorites();
  updateMyPage();
}

function initLiveLocation() {
  const locationText = document.getElementById("currentLocationText");
  const coordsText = document.getElementById("currentCoords");
  const statusText = document.getElementById("locationStatus");
  const userMarker = document.getElementById("mapUserMarker");

  if (!navigator.geolocation) {
    if (statusText) statusText.textContent = "위치 지원 안 됨";
    if (locationText) locationText.textContent = "이 브라우저에서는 위치 정보를 사용할 수 없어요";
    if (coordsText) coordsText.textContent = "-";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(5);
      const lng = pos.coords.longitude.toFixed(5);

      if (statusText) statusText.textContent = "현재 위치 반영됨";
      if (locationText) locationText.textContent = "내 현재 위치 기준";
      if (coordsText) coordsText.textContent = `${lat}, ${lng}`;

      if (userMarker) {
        userMarker.innerHTML = "📍";
        userMarker.title = `현재 위치: ${lat}, ${lng}`;
      }
    },
    () => {
      if (statusText) statusText.textContent = "위치 권한 필요";
      if (locationText) locationText.textContent = "위치 권한을 허용하면 현재 위치를 표시할 수 있어요";
      if (coordsText) coordsText.textContent = "위치 접근 실패";
    }
  );
}

document.addEventListener("click", (e) => {
  const nav = e.target.closest(".nav-item");
  if (nav) {
    switchPage(nav.dataset.page);
    return;
  }

  const detailBtn = e.target.closest(".detail-btn");
  if (detailBtn) {
    const id = Number(detailBtn.dataset.id);
    renderDetail(id);
    switchPage("home");
    return;
  }

  const favoriteBtn = e.target.closest(".favorite-toggle");
  if (favoriteBtn) {
    const id = Number(favoriteBtn.dataset.id);
    toggleFavorite(id);
    return;
  }

  const routeBtn = e.target.closest(".route-btn");
  if (routeBtn) {
    alert("길찾기 기능은 MVP 데모용입니다.");
  }
});

searchInput?.addEventListener("input", () => {
  renderList();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderList();
  });
});

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = Number(document.getElementById("toiletSelect")?.value);
  const cleanliness = Number(document.getElementById("cleanlinessSelect")?.value);
  const availability = document.getElementById("availabilitySelect")?.value;
  const memo = document.getElementById("memoInput")?.value.trim();

  const t = toilets.find((x) => x.id === id);
  if (!t) return;

  if (cleanliness) t.cleanliness = cleanliness;
  if (availability === "available") t.available = true;
  if (availability === "busy" || availability === "closed") t.available = false;
  if (memo) t.memo = memo;

  if (formMessage) formMessage.textContent = "후기가 등록되었어요 💙";
  form.reset();

  renderList();
  renderDetail(id);
  renderReviews();
  renderMapCards();
  updateStats();
  updateMyPage();
});

document.getElementById("findNearbyBtn")?.addEventListener("click", () => {
  switchPage("map");
});

document.getElementById("openGuideBtn")?.addEventListener("click", () => {
  guideModal?.classList.remove("hidden");
  adModal?.classList.add("hidden");
});

document.getElementById("closeGuideBtn")?.addEventListener("click", () => {
  guideModal?.classList.add("hidden");
  adModal?.classList.remove("hidden");
});

document.getElementById("closeAdBtn")?.addEventListener("click", () => {
  adModal?.classList.add("hidden");
});

document.getElementById("adLaterBtn")?.addEventListener("click", () => {
  adModal?.classList.add("hidden");
});

document.getElementById("adVisitBtn")?.addEventListener("click", () => {
  alert("티앙팡: 오후의 홍차\nToilet Now 앱을 통해 방문하면 다과를 서비스로 제공합니다.");
});

window.showDetail = function (id) {
  renderDetail(id);
  switchPage("home");
  document.getElementById("adVisitBtnFixed")?.addEventListener("click", () => {
  alert("티앙팡: 오후의 홍차\nToilet Now 앱 방문 시 다과 50% 할인 혜택 제공");
});
};

renderList();
renderMapCards();
renderReviews();
renderFavorites();
updateStats();
updateMyPage();
initSelect();
renderDetail(1);
initLiveLocation();
switchPage("home");
