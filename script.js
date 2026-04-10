const toilets = [
  {
    id: 1,
    name: "스타필드 1층 화장실",
    distance: 2,
    cleanliness: 4.8,
    available: true,
    password: false,
    favorite: false,
    memo: ""
  },
  {
    id: 2,
    name: "중앙역 2번 출구 화장실",
    distance: 4,
    cleanliness: 4.2,
    available: false,
    password: true,
    favorite: false,
    memo: ""
  },
  {
    id: 3,
    name: "시청 공원 화장실",
    distance: 3,
    cleanliness: 3.9,
    available: true,
    password: false,
    favorite: false,
    memo: ""
  },
  {
    id: 4,
    name: "롯데몰 3층 화장실",
    distance: 5,
    cleanliness: 4.5,
    available: true,
    password: true,
    favorite: false,
    memo: ""
  }
];

const listEl = document.getElementById("toiletList");
const detailEl = document.getElementById("detailPanel");
const searchInput = document.querySelector("input");
const form = document.getElementById("feedbackForm");

function renderList(data) {
  listEl.innerHTML = "";

  data.forEach(t => {
    const card = document.createElement("div");
    card.className = "place-card";

    card.innerHTML = `
      <div class="place-top">
        <div class="place-left">
          <div class="place-icon">🚻</div>
          <div class="place-info">
            <h4>${t.name}</h4>
            <p>도보 ${t.distance}분</p>
          </div>
        </div>
        <div class="favorite" data-id="${t.id}">
          ${t.favorite ? "💙" : "🤍"}
        </div>
      </div>

      <div class="meta-row">
        <div class="meta-badge">✨ ${t.cleanliness}</div>
        <div class="meta-badge">${t.available ? "🟢 이용 가능" : "🔴 사용중"}</div>
        <div class="meta-badge">${t.password ? "🔒 비밀번호" : "🔓 없음"}</div>
      </div>

      <div class="card-actions">
        <button onclick="showDetail(${t.id})" class="gloss-btn">상세보기</button>
      </div>
    `;

    listEl.appendChild(card);
  });
}

function showDetail(id) {
  const t = toilets.find(x => x.id === id);

  detailEl.innerHTML = `
    <div class="place-top">
      <div class="place-left">
        <div class="place-icon">🚻</div>
        <div class="place-info">
          <h4>${t.name}</h4>
          <p>도보 ${t.distance}분</p>
        </div>
      </div>
    </div>

    <div class="meta-row">
      <div class="meta-badge">✨ ${t.cleanliness}</div>
      <div class="meta-badge">${t.available ? "🟢 이용 가능" : "🔴 사용중"}</div>
      <div class="meta-badge">${t.password ? "🔒 비밀번호" : "🔓 없음"}</div>
    </div>

    <p style="margin-top:10px">${t.memo || "후기 없음"}</p>
  `;
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("favorite")) {
    const id = Number(e.target.dataset.id);
    const t = toilets.find(x => x.id === id);
    t.favorite = !t.favorite;
    renderList(toilets);
  }
});

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();

  const filtered = toilets.filter(t =>
    t.name.toLowerCase().includes(value)
  );

  renderList(filtered);
});

form.addEventListener("submit", e => {
  e.preventDefault();

  const id = Number(document.getElementById("toiletSelect").value);
  const memo = document.getElementById("memoInput").value;

  const t = toilets.find(x => x.id === id);
  t.memo = memo;

  alert("후기 등록 완료!");
  renderList(toilets);
});

function updateStats() {
  document.getElementById("nearbyCount").innerText = toilets.length + "개";

  document.getElementById("availableCount").innerText =
    toilets.filter(t => t.available).length + "개";

  const avg =
    toilets.reduce((sum, t) => sum + t.cleanliness, 0) / toilets.length;

  document.getElementById("avgCleanliness").innerText =
    avg.toFixed(1);
}

function initSelect() {
  const select = document.getElementById("toiletSelect");

  toilets.forEach(t => {
    const option = document.createElement("option");
    option.value = t.id;
    option.innerText = t.name;
    select.appendChild(option);
  });
}

renderList(toilets);
updateStats();
initSelect();
