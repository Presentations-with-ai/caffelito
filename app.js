
let D = null;

const LS = {
  fav: "caffelito_favorites_v5",
  progress: "caffelito_progress_v5",
  mistakes: "caffelito_mistakes_v5",
  history: "caffelito_history_v5",
  theme: "caffelito_theme_v5",
  lang: "caffelito_lang_v5"
};

const app = document.getElementById("app");
let quiz = null;
let activeRecipeId = null;

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const load = (k, fallback) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; }
};
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const shuffle = arr => arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
const sample = arr => arr[Math.floor(Math.random()*arr.length)];
const escapeHtml = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
const lang = () => load(LS.lang, "ru");
const isUz = () => lang() === "uz";
const L = value => {
  if(value && typeof value === "object" && !Array.isArray(value) && ("ru" in value || "uz" in value)){
    return value[lang()] ?? value.ru ?? value.uz ?? "";
  }
  return String(value ?? "");
};
const listL = obj => (obj?.[lang()] || obj?.ru || []);

const UI = {
  ru: {
    trainer:"Тренажёр техкарты", home:"Главная", dark:"🌙 Тёмная", light:"☀️ Светлая", langBtn:"UZ",
    drinks:"напитков", verified:"проверено", favorites:"избранных", mistakes:"ошибок", checked:"проверено", toCheck:"сверить",
    learn:"Учить техкарту", learnDesc:"Поиск, категории, граммовки и порядок приготовления.",
    quiz:"Тест по рецептам", quizDesc:"Вопросы по граммовкам, шагам и технологии.",
    exam:"Экзамен", examDesc:"25 случайных вопросов, как быстрая проверка перед сменой.",
    flash:"Карточки", flashDesc:"Показывает напиток, ты вспоминаешь состав и открываешь ответ.",
    fav:"Избранное", favDesc:"Твои сложные напитки для повторения.",
    err:"Ошибки", errDesc:"Все вопросы, на которых ошибался.",
    storage:"Сроки хранения", storageDesc:"Зоны, сроки, температура и маркировка.",
    guide:"Шпаргалка", guideDesc:"Короткие правила по эспрессо, молоку и категориям напитков.",
    lastResults:"Последние результаты", all:"Все", allDrinks:"Все напитки", onlyChecked:"Проверенные", onlyCheck:"Для сверки",
    notFound:"Ничего не найдено", composition:"Состав", volumes:"Объёмы", exact:"точные", allQuestions:"все", grams:"Граммовки", steps:"Шаги", technology:"Технология",
    chooseMode:"Выбери режим: смешанный тест, граммовки или порядок приготовления.",
    question:"Вопрос", correct:"✅ Верно.", wrong:"❌ Неверно.", finish:"Завершить", next:"Дальше",
    moreTest:"Ещё тест", study:"Учить", training:"Тренировка", total:"всего", right:"верно",
    clearMistakes:"Очистить ошибки", back:"← Назад", noMistakes:"Ошибок пока нет.", yourAnswer:"Твой ответ", correctAnswer:"Правильно",
    allRecipes:"← Все рецепты", showFav:"Показать избранное", noFav:"Избранного пока нет. Нажми ★ возле напитка.",
    quickGuide:"Быстрая шпаргалка", categories:"Категории напитков", drinkCount:"напитков",
    flashHint:"Вспомни состав и порядок. Потом нажми «Показать ответ».", showAnswer:"Показать ответ", hide:"Скрыть", nextCard:"Следующая",
    storageTitle:"Сроки и условия хранения", primary:"Первичный срок", secondary:"Вторичный срок", temp:"Температура", conditions:"Условия", marking:"Маркировка", name:"Наименование",
    searchPh:"Поиск: латте, лёд, сироп, 400...", amountTag:"граммовка", stepTag:"шаги", volumeTag:"объёмы", techTag:"технология",
    firstStep:"Какой первый шаг у «{recipe}»?", lastStep:"Какой последний шаг у «{recipe}»?", amountQ:"Сколько «{ingredient}» нужно для «{recipe}» ({size})?", volumeQ:"Какие объёмы есть у «{recipe}»?", milkTempQ:"До какой температуры нагревают молоко для «{recipe}»?", espressoExtractionQ:"Какая экстракция у классического эспрессо?",
    milkTempExplain:"В техкарте указано нагреть молоко до 65–70°C.", espressoExplain:"Рецепт: вход 17,8–18,3 г, выход 36–40 г, экстракция 23–28 сек.",
    loadError:"Не удалось загрузить techcards.json. Запусти сайт через локальный сервер или хостинг.", noQuestions:"Вопросы не найдены. Проверь techcards.json."
  },
  uz: {
    trainer:"Texkarta trenajyori", home:"Bosh sahifa", dark:"🌙 Qorong‘i", light:"☀️ Yorug‘", langBtn:"RU",
    drinks:"ichimlik", verified:"tekshirilgan", favorites:"tanlangan", mistakes:"xato", checked:"tekshirildi", toCheck:"solishtirish kerak",
    learn:"Texkartani o‘rganish", learnDesc:"Qidiruv, kategoriyalar, miqdorlar va tayyorlash tartibi.",
    quiz:"Retseptlar testi", quizDesc:"Miqdorlar, qadamlar va texnologiya bo‘yicha savollar.",
    exam:"Imtihon", examDesc:"Smenadan oldin tez tekshiruv uchun 25 ta tasodifiy savol.",
    flash:"Kartochkalar", flashDesc:"Ichimlik ko‘rsatiladi, tarkibini eslab javobni ochasan.",
    fav:"Tanlanganlar", favDesc:"Takrorlash uchun qiyin ichimliklar.",
    err:"Xatolar", errDesc:"Xato qilingan barcha savollar.",
    storage:"Saqlash muddatlari", storageDesc:"Zona, muddat, harorat va markirovka.",
    guide:"Shpargalka", guideDesc:"Espresso, sut va ichimlik kategoriyalari bo‘yicha qisqa qoidalar.",
    lastResults:"Oxirgi natijalar", all:"Hammasi", allDrinks:"Barcha ichimliklar", onlyChecked:"Tekshirilgan", onlyCheck:"Solishtirish kerak",
    notFound:"Hech narsa topilmadi", composition:"Tarkib", volumes:"Hajmlar", exact:"aniq", allQuestions:"hammasi", grams:"Miqdorlar", steps:"Qadamlar", technology:"Texnologiya",
    chooseMode:"Rejimni tanla: aralash test, miqdorlar yoki tayyorlash tartibi.",
    question:"Savol", correct:"✅ To‘g‘ri.", wrong:"❌ Noto‘g‘ri.", finish:"Yakunlash", next:"Keyingi",
    moreTest:"Yana test", study:"O‘rganish", training:"Mashq", total:"jami", right:"to‘g‘ri",
    clearMistakes:"Xatolarni tozalash", back:"← Orqaga", noMistakes:"Hozircha xato yo‘q.", yourAnswer:"Sening javobing", correctAnswer:"To‘g‘ri javob",
    allRecipes:"← Barcha retseptlar", showFav:"Tanlanganlarni ko‘rsatish", noFav:"Tanlanganlar yo‘q. Ichimlik yonidagi ★ ni bos.",
    quickGuide:"Tezkor shpargalka", categories:"Ichimlik kategoriyalari", drinkCount:"ichimlik",
    flashHint:"Tarkib va tartibni esla. Keyin «Javobni ko‘rsatish» ni bos.", showAnswer:"Javobni ko‘rsatish", hide:"Yashirish", nextCard:"Keyingisi",
    storageTitle:"Saqlash muddati va sharoitlari", primary:"Birlamchi muddat", secondary:"Ikkilamchi muddat", temp:"Harorat", conditions:"Sharoit", marking:"Markirovka", name:"Nomi",
    searchPh:"Qidiruv: latte, muz, sirop, 400...", amountTag:"miqdor", stepTag:"qadamlar", volumeTag:"hajmlar", techTag:"texnologiya",
    firstStep:"«{recipe}» uchun birinchi qadam qaysi?", lastStep:"«{recipe}» uchun oxirgi qadam qaysi?", amountQ:"«{recipe}» ({size}) uchun «{ingredient}» qancha kerak?", volumeQ:"«{recipe}» uchun qanday hajmlar bor?", milkTempQ:"«{recipe}» uchun sut nechchi darajagacha isitiladi?", espressoExtractionQ:"Klassik espressoning ekstraksiyasi qancha?",
    milkTempExplain:"Texkartada sutni 65–70°C gacha isitish ko‘rsatilgan.", espressoExplain:"Retsept: kirish 17,8–18,3 g, chiqish 36–40 g, ekstraksiya 23–28 soniya.",
    loadError:"techcards.json yuklanmadi. Saytni lokal server yoki hosting orqali ishga tushir.", noQuestions:"Savollar topilmadi. techcards.json faylini tekshir."
  }
};
function t(k){ return UI[lang()][k] || UI.ru[k] || k; }
function tmpl(str, vars){ return String(str).replace(/\{(\w+)\}/g, (_,k)=>vars[k] ?? ""); }
const fmtDate = iso => new Date(iso).toLocaleString(isUz() ? "uz-UZ" : "ru-RU");

async function init(){
  if(load(LS.theme, "") === "dark") document.body.classList.add("dark");
  app.innerHTML = `<div class="card loader-card"><h2>Caffelito Coffee</h2><p class="mini">Loading...</p></div>`;
  try{
    const res = await fetch("techcards.json", {cache:"no-store"});
    if(!res.ok) throw new Error("HTTP " + res.status);
    D = await res.json();
  }catch(e){
    app.innerHTML = `<div class="card loader-card"><h2>Caffelito Coffee</h2><p>${escapeHtml(t("loadError"))}</p></div>`;
    return;
  }
  window.addEventListener("hashchange", render);
  render();
}

function header(){
  const cur = lang();
  return `<div class="header">
    <div class="brand" onclick="go('home')" role="button">
      <div class="logo">☕</div>
      <div><h1>${escapeHtml(D.brand)}</h1><p>${t("trainer")} · ${escapeHtml(D.updated)}</p></div>
    </div>
    <div class="header-actions">
      <button class="pill-btn" onclick="go('home')">${t("home")}</button>
      <div class="lang-switch" aria-label="Language switch">
        <button class="${cur === 'ru' ? 'active' : ''}" onclick="setLang('ru')">RU</button>
        <button class="${cur === 'uz' ? 'active' : ''}" onclick="setLang('uz')">UZ</button>
      </div>
      <button class="pill-btn" onclick="toggleTheme()">${document.body.classList.contains("dark") ? t("light") : t("dark")}</button>
    </div>
  </div>`;
}
function shell(content){ app.innerHTML = header() + content; }
function go(view){ location.hash = view === "home" ? "" : view; }
function toggleTheme(){
  document.body.classList.toggle("dark");
  save(LS.theme, document.body.classList.contains("dark") ? "dark" : "light");
  render();
}
function setLang(value){
  save(LS.lang, value === "uz" ? "uz" : "ru");
  document.documentElement.lang = lang();
  clearInterval(quiz?.timer);
  quiz = null;
  render();
}
function toggleLang(){ setLang(isUz() ? "ru" : "uz"); }
function route(){ return location.hash.replace(/^#/,"") || "home"; }
function render(){
  const r = route();
  document.body.classList.toggle("home-page", r === "home");
  if(r === "home") window.scrollTo(0, 0);
  if(r === "learn") return renderLearn();
  if(r === "quiz") return renderQuizSetup();
  if(r === "exam") return quiz?.cfg?.exam ? renderQuizQuestion() : startQuiz({mode:"mixed", count:25, exam:true, onlyVerified:true});
  if(r === "favorites") return renderFavorites();
  if(r === "mistakes") return renderMistakes();
  if(r === "storage") return renderStorage();
  if(r === "guide") return renderGuide();
  if(r === "flash") return renderFlashcards();
  renderHome();
}

function renderHome(){
  const hist = load(LS.history, []);
  const progress = progressStats();
  const learnedPct = D.recipes.length ? Math.round(progress.learned / D.recipes.length * 100) : 0;
  shell(`
    <section class="study-panel">
      <div>
        <span class="eyebrow">${isUz() ? "O'quv paneli" : "Панель обучения"}</span>
        <h2>${isUz() ? "Texkartalar bo'yicha real progress" : "Реальный прогресс по техкартам"}</h2>
        <p>${isUz() ? "Yangi, takrorlash kerak va o'rganilgan ichimliklar alohida yuritiladi." : "Новые, проблемные и изученные напитки теперь ведутся отдельно."}</p>
      </div>
      <div class="study-meter">
        <b>${learnedPct}%</b>
        <span>${isUz() ? "o'rganildi" : "изучено"}</span>
        <div class="meter"><i style="width:${learnedPct}%"></i></div>
      </div>
    </section>
    <div class="stats">
      <div class="stat"><b>${D.recipes.length}</b><span>${t("drinks")}</span></div>
      <div class="stat"><b>${D.recipes.filter(r=>r.verified).length}</b><span>${t("verified")}</span></div>
      <div class="stat"><b>${progress.learned}</b><span>${progressText("learned")}</span></div>
      <div class="stat"><b>${progress.repeat}</b><span>${progressText("repeat")}</span></div>
    </div>
    <section class="grid">
      ${menuCard("📚",t("learn"),t("learnDesc"),"learn")}
      ${menuCard("🎯",t("quiz"),t("quizDesc"),"quiz")}
      ${menuCard("⏱️",t("exam"),t("examDesc"),"exam")}
      ${menuCard("🧠",t("flash"),t("flashDesc"),"flash")}
      ${menuCard("⭐",t("fav"),t("favDesc"),"favorites")}
      ${menuCard("❌",t("err"),t("errDesc"),"mistakes")}
      ${menuCard("📦",t("storage"),t("storageDesc"),"storage")}
      ${menuCard("📝",t("guide"),t("guideDesc"),"guide")}
    </section>
    ${hist.length ? `<div class="card last-results"><h2>${t("lastResults")}</h2>${hist.slice(-5).reverse().map(h=>`<div class="rule"><b>${h.score}/${h.total}</b> · ${escapeHtml(h.mode)} · ${fmtDate(h.date)}</div>`).join("")}</div>` : ""}
  `);
}
function menuCard(icon,title,desc,view){
  return `<button class="menu-card" onclick="go('${view}')"><div class="menu-icon">${icon}</div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(desc)}</p></button>`;
}

function renderLearn(filterFav=false){
  const cats = [t("all"), ...unique(D.recipes.map(r=>L(r.category)))];
  const progressOptions = ["all","new","repeat","learned"];
  shell(`
    <div class="toolbar">
      <input class="search" id="search" placeholder="${escapeHtml(t("searchPh"))}" autocomplete="off">
      <select class="select" id="cat">${cats.map(c=>`<option>${escapeHtml(c)}</option>`).join("")}</select>
      <select class="select" id="ver"><option value="all">${t("allDrinks")}</option><option value="verified">${t("onlyChecked")}</option><option value="check">${t("onlyCheck")}</option></select>
      <select class="select" id="prog">${progressOptions.map(p=>`<option value="${p}">${escapeHtml(progressText(p))}</option>`).join("")}</select>
    </div>
    <div class="learn-meta" id="learnMeta"></div>
    <div id="recipeList" class="recipe-list"></div>
  `);
  const renderList = () => {
    const q = $("#search").value.trim().toLowerCase();
    const cat = $("#cat").value;
    const ver = $("#ver").value;
    const prog = $("#prog").value;
    const favs = load(LS.fav, []);
    const progress = progressMap();
    let list = D.recipes.filter(r => {
      const hay = recipeSearchText(r).toLowerCase();
      if(filterFav && !favs.includes(r.id)) return false;
      if(cat !== t("all") && L(r.category) !== cat) return false;
      if(ver === "verified" && !r.verified) return false;
      if(ver === "check" && r.verified) return false;
      if(prog !== "all" && (progress[r.id]?.status || "new") !== prog) return false;
      return !q || hay.includes(q);
    });
    const stats = progressStats();
    $("#learnMeta").innerHTML = `
      <span>${isUz() ? "Topildi" : "Найдено"}: <b>${list.length}</b></span>
      <span>${progressText("new")}: <b>${stats.new}</b></span>
      <span>${progressText("repeat")}: <b>${stats.repeat}</b></span>
      <span>${progressText("learned")}: <b>${stats.learned}</b></span>
    `;
    $("#recipeList").innerHTML = list.length ? list.map(recipeCard).join("") : `<div class="card empty">${t("notFound")}</div>`;
  };
  ["input","change"].forEach(ev=>{
    $("#search").addEventListener(ev, renderList);
    $("#cat").addEventListener(ev, renderList);
    $("#ver").addEventListener(ev, renderList);
    $("#prog").addEventListener(ev, renderList);
  });
  renderList();
}
function recipeSearchText(r){
  return [
    L(r.name), L(r.category), L(r.glass), ...(r.volumes?.[lang()]||[]),
    ...r.sizes.flatMap(s=>[L(s.size), ...s.ingredients.flatMap(i=>[L(i.name), L(i.amount)])]),
    ...listL(r.steps), ...listL(r.notes)
  ].join(" ");
}
function recipeCard(r){
  const favs = load(LS.fav, []);
  const on = favs.includes(r.id);
  const progress = recipeProgress(r.id);
  return `<div class="recipe progress-${progress} ${activeRecipeId === r.id ? "open" : ""}" id="r-${r.id}">
    <div class="recipe-head" onclick="toggleRecipe('${r.id}')">
      <div class="recipe-title">
        <h3>${escapeHtml(L(r.name))}</h3>
        <small>${escapeHtml(L(r.glass))}</small>
        <div class="badges"><span class="badge">${escapeHtml(L(r.category))}</span><span class="badge ${r.verified?'green':'warn'}">${r.verified?t("checked"):t("toCheck")}</span><span class="badge progress-badge">${escapeHtml(progressText(progress))}</span></div>
      </div>
      <button class="star ${on?'on':''}" onclick="event.stopPropagation();toggleFav('${r.id}')">★</button>
    </div>
    <div class="recipe-body">
      <div class="rule"><b>${t("volumes")}:</b> ${escapeHtml(volumesText(r))}</div>
      ${tableFor(r)}
      <ol class="steps">${listL(r.steps).map(s=>`<li>${escapeHtml(s)}</li>`).join("")}</ol>
      ${listL(r.notes).length ? `<div class="note-box">${listL(r.notes).map(escapeHtml).join("<br>")}</div>` : ""}
      <div class="recipe-actions">
        <button class="btn small secondary" onclick="event.stopPropagation();setRecipeProgress('${r.id}','new')">${escapeHtml(progressText("new"))}</button>
        <button class="btn small secondary" onclick="event.stopPropagation();setRecipeProgress('${r.id}','repeat')">${escapeHtml(progressText("repeat"))}</button>
        <button class="btn small good" onclick="event.stopPropagation();setRecipeProgress('${r.id}','learned')">${escapeHtml(progressText("learned"))}</button>
      </div>
    </div>
  </div>`;
}
function tableFor(r){
  const names = unique(r.sizes.flatMap(s=>s.ingredients.map(i=>L(i.name))));
  return `<table class="size-table"><thead><tr><th>${t("composition")}</th>${r.sizes.map(s=>`<th>${escapeHtml(L(s.size))}</th>`).join("")}</tr></thead>
    <tbody>${names.map(n=>`<tr><td><b>${escapeHtml(n)}</b></td>${r.sizes.map(s=>{
      const found = s.ingredients.find(i=>L(i.name)===n);
      return `<td>${escapeHtml(found ? L(found.amount) : "—")}</td>`;
    }).join("")}</tr>`).join("")}</tbody></table>`;
}
function volumesText(r){ return (r.volumes?.[lang()] || r.sizes.map(s=>L(s.size))).join(" / "); }
function unique(arr){ return [...new Set(arr.filter(Boolean))]; }
function progressMap(){ return load(LS.progress, {}); }
function recipeProgress(id){ return progressMap()[id]?.status || "new"; }
function progressText(status){
  const ru = {new:"новая", repeat:"повторить", learned:"изучено", all:"все статусы"};
  const uz = {new:"yangi", repeat:"takrorlash", learned:"o'rganildi", all:"barcha statuslar"};
  return (isUz() ? uz : ru)[status] || status;
}
function progressStats(){
  const progress = progressMap();
  return D.recipes.reduce((acc, r) => {
    acc[progress[r.id]?.status || "new"]++;
    return acc;
  }, {new:0, repeat:0, learned:0});
}
function recipeByName(name){
  return D.recipes.find(r=>L(r.name) === name);
}
function mistakeRecipeIds(){
  const mistakes = load(LS.mistakes, []);
  return unique(mistakes.map(m => m.recipeId || recipeByName(m.recipe)?.id).filter(Boolean));
}
function applyQuizProgress(answers, cfg={}){
  const progress = progressMap();
  const byRecipe = {};
  answers.forEach(a => {
    if(!a.q.recipeId) return;
    byRecipe[a.q.recipeId] ??= [];
    byRecipe[a.q.recipeId].push(a.correct);
  });
  Object.entries(byRecipe).forEach(([id, results]) => {
    if(results.some(x=>!x)){
      progress[id] = {status:"repeat", updated:new Date().toISOString()};
    }else if(cfg.progressStatus || cfg.favoriteOnly || cfg.mistakesOnly){
      progress[id] = {status:"learned", updated:new Date().toISOString()};
    }
  });
  save(LS.progress, progress);
}
function quizModeTitle(cfg){
  if(cfg.exam) return t("exam");
  if(cfg.favoriteOnly) return isUz() ? "Tanlanganlar" : "Избранное";
  if(cfg.mistakesOnly) return isUz() ? "Xatolar" : "Ошибки";
  if(cfg.progressStatus) return progressText(cfg.progressStatus);
  if(cfg.mode === "amount") return t("grams");
  if(cfg.mode === "steps") return t("steps");
  if(cfg.mode === "tech") return t("technology");
  return t("training");
}
function questionTypeText(type){
  return type === "amount" ? t("grams") : type === "steps" ? t("steps") : type === "volume" ? t("volumes") : t("technology");
}
function setRecipeProgress(id, status){
  const progress = progressMap();
  if(status === "new") delete progress[id];
  else progress[id] = {status, updated:new Date().toISOString()};
  save(LS.progress, progress);
  activeRecipeId = id;
  render();
}
function toggleRecipe(id){
  const el = document.getElementById("r-"+id);
  if(!el) return;
  const willOpen = !el.classList.contains("open");
  $$(".recipe.open").forEach(item => {
    if(item !== el) item.classList.remove("open");
  });
  activeRecipeId = willOpen ? id : null;
  el.classList.toggle("open", willOpen);
}
function toggleFav(id){
  let favs = load(LS.fav, []);
  favs = favs.includes(id) ? favs.filter(x=>x!==id) : [...favs, id];
  save(LS.fav, favs);
  render();
}
function renderFavorites(){
  const favs = load(LS.fav, []);
  const list = D.recipes.filter(r=>favs.includes(r.id));
  shell(`<div class="card section-head">
      <div>
        <h2>${t("fav")}</h2>
        <p class="mini">${isUz() ? "Takrorlash uchun alohida ichimliklar ro'yxati." : "Отдельная очередь напитков, которые нужно держать под рукой."}</p>
      </div>
      <div class="flex">
        <button class="btn secondary" onclick="go('learn')">${t("allRecipes")}</button>
        <button class="btn" ${list.length ? "" : "disabled"} onclick="startQuiz({mode:'mixed',count:15,onlyVerified:false,favoriteOnly:true})">${t("quiz")}</button>
      </div>
    </div>
    <div style="height:12px"></div>
    <div class="learn-meta"><span>${t("favorites")}: <b>${list.length}</b></span><span>${progressText("repeat")}: <b>${list.filter(r=>recipeProgress(r.id)==="repeat").length}</b></span></div>
    <div class="recipe-list" id="recipeList"></div>`);
  $("#recipeList").innerHTML = list.length ? list.map(recipeCard).join("") : `<div class="card empty">${t("noFav")}</div>`;
}

function renderGuide(){
  const byCat = unique(D.recipes.map(r=>L(r.category))).map(cat => {
    const list = D.recipes.filter(r=>L(r.category)===cat);
    return {cat, count:list.length, names:list.map(r=>L(r.name))};
  });
  shell(`
    <div class="card">
      <h2>${t("quickGuide")}</h2>
      <div class="guide-grid">
        <div class="guide-card"><b>Espresso</b><span>${isUz() ? "kirish 17,8–18,3 g · chiqish 36–40 g · ekstraksiya 23–28 soniya." : "вход 17,8–18,3 г · выход 36–40 г · экстракция 23–28 сек."}</span></div>
        <div class="guide-card"><b>${isUz() ? "Sut" : "Молоко"}</b><span>${isUz() ? "Harorat 65–70°C. Ko'pik ichimlik turiga qarab nazorat qilinadi." : "Температура 65–70°C. Пена контролируется по типу напитка."}</span></div>
        <div class="guide-card"><b>${isUz() ? "Ko'pik" : "Пена"}</b><span>${isUz() ? "kapuchino 1,5–2 sm · latte 1–1,5 sm · flat white < 1 sm." : "капучино 1,5–2 см · латте 1–1,5 см · флэт уайт < 1 см."}</span></div>
        <div class="guide-card"><b>${isUz() ? "O'qish tartibi" : "Как учить"}</b><span>${isUz() ? "Avval hajmlar, keyin grammlar, keyin qadamlar. Xatolarni alohida takrorla." : "Сначала объёмы, потом граммовки, потом шаги. Ошибки отдельно гоняй через повторение."}</span></div>
      </div>
    </div>
    <div style="height:12px"></div>
    <div class="card">
      <h2>${t("categories")}</h2>
      <div class="recipe-list">${byCat.map(item => `<div class="recipe"><div class="recipe-head"><div class="recipe-title"><h3>${escapeHtml(item.cat)}</h3><small>${item.count} ${t("drinkCount")}</small></div></div><div class="recipe-body" style="display:block"><div class="badges">${item.names.map(n => `<span class="badge gray">${escapeHtml(n)}</span>`).join("")}</div></div></div>`).join("")}</div>
    </div>
  `);
}

function allQuestionPool(onlyVerified=true, recipeIds=null){
  const allowed = recipeIds ? new Set(recipeIds) : null;
  const recipes = D.recipes.filter(r=>(!onlyVerified || r.verified) && (!allowed || allowed.has(r.id)));
  const qs = [];
  const amountPool = unique(recipes.flatMap(r=>r.sizes.flatMap(s=>s.ingredients.map(i=>L(i.amount)))));
  const volumePool = unique(recipes.map(volumesText));
  const stepPool = unique(recipes.flatMap(r=>listL(r.steps)));
  for(const r of recipes){
    qs.push(makeVolumeQ(r, volumePool));
    for(const s of r.sizes){
      for(const ing of s.ingredients){
        if(!L(ing.amount) || L(ing.amount)==="—") continue;
        qs.push(makeAmountQ(r, s, ing, recipes, amountPool));
      }
    }
    const steps = listL(r.steps);
    if(steps.length){
      qs.push(makeStepQ(r, "first", stepPool));
      if(steps.length > 2) qs.push(makeStepQ(r, "last", stepPool));
    }
    if(steps.some(x=>x.includes("65–70°C"))){
      qs.push({type:"tech", recipeId:r.id, recipe:L(r.name), question:tmpl(t("milkTempQ"), {recipe:L(r.name)}), answer:"65–70°C", options:makeOptions("65–70°C", ["60–65°C","65–70°C","70–75°C","75–80°C"]), explain:t("milkTempExplain")});
    }
    if(r.id === "espresso-classic"){
      qs.push({type:"tech", recipeId:r.id, recipe:L(r.name), question:t("espressoExtractionQ"), answer:isUz()?"23–28 soniya":"23–28 сек", options:makeOptions(isUz()?"23–28 soniya":"23–28 сек", isUz()?["18–22 soniya","23–28 soniya","30–35 soniya","40–45 soniya"]:["18–22 сек","23–28 сек","30–35 сек","40–45 сек"]), explain:t("espressoExplain")});
    }
  }
  // Guarantee all generated questions are valid.
  return qs.filter(q => q.answer && q.options.includes(q.answer) && q.options.length >= 2);
}
function normalizeAnswer(v){
  return String(v ?? "").replace(/\s+/g," ").replace(/ё/g,"е").trim().toLowerCase();
}
function makeOptions(answer, pool){
  const opts = [];
  const push = v => {
    const val = String(v ?? "").trim();
    if(!val) return;
    if(!opts.some(x => normalizeAnswer(x) === normalizeAnswer(val))) opts.push(val);
  };
  push(answer);
  shuffle(unique(pool)).forEach(push);
  const fillers = isUz()
    ? ["10 ml","20 ml","30 ml","50 ml","100 ml","150 ml","200 ml","250 ml","300 ml","100 g","150 g","200 g","36–40 g","1 dona"]
    : ["10 мл","20 мл","30 мл","50 мл","100 мл","150 мл","200 мл","250 мл","300 мл","100 г","150 г","200 г","36–40 г","1 шт"];
  fillers.forEach(push);
  const result = shuffle(opts.slice(1)).slice(0,3);
  result.push(String(answer).trim());
  return shuffle(result);
}
function makeAmountQ(r, s, ing, recipes, amountPool){
  const ingName = L(ing.name);
  const answer = L(ing.amount);
  const sameIngPool = unique(recipes.flatMap(rr=>rr.sizes.flatMap(ss=>ss.ingredients.filter(ii=>L(ii.name)===ingName).map(ii=>L(ii.amount)))));
  const pool = unique([...sameIngPool, ...amountPool]);
  return {
    type:"amount",
    recipeId:r.id,
    recipe:L(r.name),
    question:tmpl(t("amountQ"), {ingredient:ingName, recipe:L(r.name), size:L(s.size)}),
    answer,
    options:makeOptions(answer, pool),
    explain:`${escapeHtml(L(r.name))}, ${escapeHtml(L(s.size))}: ${escapeHtml(ingName)} — ${escapeHtml(answer)}.`
  };
}
function makeStepQ(r, kind, stepPool){
  const steps = listL(r.steps);
  const answer = kind === "first" ? steps[0] : steps[steps.length-1];
  return {
    type:"steps",
    recipeId:r.id,
    recipe:L(r.name),
    question:tmpl(kind === "first" ? t("firstStep") : t("lastStep"), {recipe:L(r.name)}),
    answer,
    options:makeOptions(answer, stepPool),
    explain:`${isUz() ? "To‘g‘ri" : "Правильно"}: ${answer}`
  };
}
function makeVolumeQ(r, volumePool){
  const answer = volumesText(r);
  return {
    type:"volume",
    recipeId:r.id,
    recipe:L(r.name),
    question:tmpl(t("volumeQ"), {recipe:L(r.name)}),
    answer,
    options:makeOptions(answer, volumePool),
    explain:`${L(r.name)}: ${answer}.`
  };
}

function renderQuizSetup(){
  const stats = progressStats();
  const favs = load(LS.fav, []);
  const mistakeIds = mistakeRecipeIds();
  shell(`<div class="card quiz-card">
    <h2>${t("quiz")}</h2>
    <p class="mini">${t("chooseMode")}</p>
    <div class="quiz-summary">
      <div><b>${stats.new}</b><span>${progressText("new")}</span></div>
      <div><b>${stats.repeat}</b><span>${progressText("repeat")}</span></div>
      <div><b>${favs.length}</b><span>${t("favorites")}</span></div>
      <div><b>${mistakeIds.length}</b><span>${t("mistakes")}</span></div>
    </div>
    <div class="mode-row">
      <button class="btn" onclick="startQuiz({mode:'mixed',count:15,onlyVerified:true})">15 · ${t("exact")}</button>
      <button class="btn secondary" onclick="startQuiz({mode:'mixed',count:20,onlyVerified:false})">20 · ${t("allQuestions")}</button>
      <button class="btn secondary" onclick="startQuiz({mode:'amount',count:15,onlyVerified:true})">${t("grams")}</button>
      <button class="btn secondary" onclick="startQuiz({mode:'steps',count:15,onlyVerified:true})">${t("steps")}</button>
      <button class="btn secondary" onclick="startQuiz({mode:'tech',count:12,onlyVerified:true})">${t("technology")}</button>
      <button class="btn secondary" ${stats.repeat ? "" : "disabled"} onclick="startQuiz({mode:'mixed',count:15,onlyVerified:false,progressStatus:'repeat'})">${escapeHtml(progressText("repeat"))} · ${stats.repeat}</button>
      <button class="btn secondary" ${stats.new ? "" : "disabled"} onclick="startQuiz({mode:'mixed',count:15,onlyVerified:false,progressStatus:'new'})">${escapeHtml(progressText("new"))} · ${stats.new}</button>
      <button class="btn secondary" ${favs.length ? "" : "disabled"} onclick="startQuiz({mode:'mixed',count:15,onlyVerified:false,favoriteOnly:true})">${t("favorites")} · ${favs.length}</button>
      <button class="btn secondary" ${mistakeIds.length ? "" : "disabled"} onclick="startQuiz({mode:'mixed',count:15,onlyVerified:false,mistakesOnly:true})">${t("mistakes")} · ${mistakeIds.length}</button>
    </div>
  </div>`);
}
function startQuiz(cfg){
  clearInterval(quiz?.timer);
  let recipeIds = cfg.progressStatus ? D.recipes.filter(r=>recipeProgress(r.id) === cfg.progressStatus).map(r=>r.id) : null;
  if(cfg.favoriteOnly) recipeIds = load(LS.fav, []);
  if(cfg.mistakesOnly) recipeIds = mistakeRecipeIds();
  const all = allQuestionPool(cfg.onlyVerified, recipeIds);
  let pool = all;
  if(cfg.mode && cfg.mode !== "mixed") pool = all.filter(q=>q.type === cfg.mode);
  pool = shuffle(pool).slice(0, cfg.count || 15);
  if(!pool.length){
    shell(`<div class="card quiz-card empty">${escapeHtml(t("noQuestions"))}</div>`);
    return;
  }
  quiz = { cfg, questions: pool, i:0, score:0, answers:[], started:Date.now(), timeLeft: cfg.exam ? 30*60 : null, timer:null, locked:false };
  renderQuizQuestion();
  if(quiz.timeLeft){
    quiz.timer = setInterval(()=>{
      if(!quiz) return;
      quiz.timeLeft--;
      const tleft = $("#timeLeft");
      if(tleft) tleft.textContent = formatTime(quiz.timeLeft);
      if(quiz.timeLeft <= 0){ clearInterval(quiz.timer); finishQuiz(); }
    },1000);
  }
}
function renderQuizQuestion(){
  const q = quiz.questions[quiz.i];
  if(!q) return finishQuiz();
  const tag = q.type === "amount" ? t("amountTag") : q.type === "steps" ? t("stepTag") : q.type === "volume" ? t("volumeTag") : t("techTag");
  shell(`<div class="card quiz-card">
    <div class="qtop"><span>${t("question")} ${quiz.i+1}/${quiz.questions.length}</span><span id="timeLeft">${quiz.timeLeft ? formatTime(quiz.timeLeft) : ""}</span></div>
    <div class="progress"><div class="bar" style="width:${(quiz.i/quiz.questions.length)*100}%"></div></div>
    <div class="badges"><span class="badge">${escapeHtml(tag)}</span><span class="badge gray">${escapeHtml(q.recipe)}</span></div>
    <div class="question">${escapeHtml(q.question)}</div>
    <div class="options">${q.options.map((o,idx)=>`<button type="button" class="option" data-idx="${idx}" onclick="answerQuiz(${idx})">${escapeHtml(o)}</button>`).join("")}</div>
    <div id="explain"></div>
  </div>`);
}
function answerQuiz(idx){
  if(!quiz || quiz.locked) return;
  const q = quiz.questions[quiz.i];
  const picked = q.options[idx];
  const correct = normalizeAnswer(picked) === normalizeAnswer(q.answer);
  quiz.locked = true;
  if(correct) quiz.score++;
  quiz.answers.push({q, picked, correct});
  $$(".option").forEach((btn, i)=>{
    btn.disabled = true;
    if(normalizeAnswer(q.options[i]) === normalizeAnswer(q.answer)) btn.classList.add("correct");
    if(i === idx && !correct) btn.classList.add("wrong");
  });
  if(!correct){
    const mistakes = load(LS.mistakes, []);
    mistakes.unshift({date:new Date().toISOString(), question:q.question, answer:q.answer, picked, explain:q.explain, recipe:q.recipe, recipeId:q.recipeId, type:q.type});
    save(LS.mistakes, mistakes.slice(0,100));
    if(q.recipeId){
      const progress = progressMap();
      progress[q.recipeId] = {status:"repeat", updated:new Date().toISOString()};
      save(LS.progress, progress);
    }
  }
  $("#explain").innerHTML = `<div class="explain">${correct ? t("correct") : t("wrong")}<br>${q.explain}</div><div class="next-wrap"><button class="btn full" onclick="nextQuiz()">${quiz.i+1 === quiz.questions.length ? t("finish") : t("next")}</button></div>`;
}
function nextQuiz(){ if(!quiz) return; quiz.i++; quiz.locked = false; renderQuizQuestion(); }
function finishQuiz(){
  if(!quiz) return go("home");
  clearInterval(quiz.timer);
  const total = quiz.questions.length;
  const pct = total ? Math.round(quiz.score/total*100) : 0;
  applyQuizProgress(quiz.answers, quiz.cfg);
  const hist = load(LS.history, []);
  hist.push({date:new Date().toISOString(), score:quiz.score, total, pct, mode:quizModeTitle(quiz.cfg)});
  save(LS.history, hist.slice(-30));
  const byType = {};
  quiz.answers.forEach(a => {
    byType[a.q.type] ??= {ok:0,total:0};
    byType[a.q.type].total++;
    if(a.correct) byType[a.q.type].ok++;
  });
  const wrong = quiz.answers.filter(a=>!a.correct);
  const typeRows = Object.entries(byType).map(([type, s]) => `<div><b>${s.ok}/${s.total}</b><span>${escapeHtml(questionTypeText(type))}</span></div>`).join("");
  const reviewRows = wrong.slice(0,6).map(a => `<div class="review-row"><b>${escapeHtml(a.q.recipe)}</b><span>${escapeHtml(a.q.question)}</span><small>${t("correctAnswer")}: ${escapeHtml(a.q.answer)}</small></div>`).join("");
  shell(`<div class="card quiz-card result">
    <h2>${pct}%</h2>
    <div class="kpi"><div><b>${quiz.score}</b><span>${t("right")}</span></div><div><b>${total-quiz.score}</b><span>${t("mistakes")}</span></div><div><b>${total}</b><span>${t("total")}</span></div></div>
    <div class="kpi type-kpi">${typeRows}</div>
    ${wrong.length ? `<div class="review-list"><h3>${isUz() ? "Tahlil" : "Разбор ошибок"}</h3>${reviewRows}</div>` : `<div class="explain">${isUz() ? "Xatolar yo'q. Shu tempda davom et." : "Ошибок нет. Этот набор можно считать закрытым."}</div>`}
    <div class="flex" style="justify-content:center"><button class="btn" onclick="go('quiz')">${t("moreTest")}</button><button class="btn secondary" onclick="go('mistakes')">${t("err")}</button><button class="btn secondary" onclick="go('learn')">${t("study")}</button></div>
  </div>`);
  quiz = null;
}
function formatTime(sec){ const m = Math.floor(sec/60), s = sec%60; return `${m}:${String(s).padStart(2,"0")}`; }

function renderMistakes(){
  const mistakes = load(LS.mistakes, []);
  const recipeIds = mistakeRecipeIds();
  shell(`<div class="card section-head">
      <div>
        <h2>${t("err")}</h2>
        <p class="mini">${isUz() ? "Xatolar avtomatik ravishda takrorlash rejasiga tushadi." : "Ошибки автоматически превращаются в план повторения."}</p>
      </div>
      <div class="flex">
        <button class="btn secondary" onclick="go('home')">${t("back")}</button>
        <button class="btn" ${recipeIds.length ? "" : "disabled"} onclick="startQuiz({mode:'mixed',count:15,onlyVerified:false,mistakesOnly:true})">${t("quiz")}</button>
        <button class="btn secondary" ${recipeIds.length ? "" : "disabled"} onclick="markMistakesRepeat()">${escapeHtml(progressText("repeat"))}</button>
        <button class="btn bad" onclick="clearMistakes()">${t("clearMistakes")}</button>
      </div>
    </div>
    <div style="height:12px"></div>
    <div class="learn-meta"><span>${t("mistakes")}: <b>${mistakes.length}</b></span><span>${t("drinks")}: <b>${recipeIds.length}</b></span></div>
    ${mistakes.length ? `<div class="review-list mistake-list">${mistakes.map(m=>`<div class="review-row"><b>${escapeHtml(m.recipe)}</b><span>${escapeHtml(m.question)}</span><small>${escapeHtml(fmtDate(m.date))} · ${t("yourAnswer")}: ${escapeHtml(m.picked)} · ${t("correctAnswer")}: ${escapeHtml(m.answer)}</small></div>`).join("")}</div>` : `<div class="card empty">${t("noMistakes")}</div>`}
  `);
}
function clearMistakes(){ save(LS.mistakes, []); renderMistakes(); }
function markMistakesRepeat(){
  const progress = progressMap();
  mistakeRecipeIds().forEach(id => progress[id] = {status:"repeat", updated:new Date().toISOString()});
  save(LS.progress, progress);
  renderMistakes();
}

function renderStorage(){
  shell(`<div class="card">
    <div class="section-head compact">
      <div>
        <h2>${t("storageTitle")}</h2>
        <p class="mini">${isUz() ? "Mahsulot nomi, harorat, zona yoki markirovka bo'yicha tez qidiruv." : "Быстрый поиск по продукту, температуре, зоне или маркировке."}</p>
      </div>
      <input class="search storage-search" id="storageSearch" placeholder="${isUz() ? "Qidiruv..." : "Поиск по срокам..."}">
    </div>
    <div class="rules">${D.storageRules.map(x=>`<div class="rule">${escapeHtml(L(x))}</div>`).join("")}</div>
    <div class="learn-meta" id="storageMeta"></div>
    <div class="storage-wrap"><table class="storage-table"><thead><tr><th>${t("name")}</th><th>${t("primary")}</th><th>${t("secondary")}</th><th>${t("temp")}</th><th>${t("conditions")}</th><th>${t("marking")}</th></tr></thead><tbody id="storageRows"></tbody></table></div>
  </div>`);
  const renderRows = () => {
    const q = $("#storageSearch").value.trim().toLowerCase();
    const rows = D.storage.filter(s => [L(s.item), L(s.primary), L(s.secondary), s.temp, L(s.place), L(s.marking)].join(" ").toLowerCase().includes(q));
    $("#storageMeta").innerHTML = `<span>${isUz() ? "Topildi" : "Найдено"}: <b>${rows.length}</b></span>`;
    $("#storageRows").innerHTML = rows.map(s=>`<tr><td><b>${escapeHtml(L(s.item))}</b></td><td>${escapeHtml(L(s.primary))}</td><td>${escapeHtml(L(s.secondary))}</td><td>${escapeHtml(s.temp)}</td><td>${escapeHtml(L(s.place))}</td><td>${escapeHtml(L(s.marking))}</td></tr>`).join("");
  };
  $("#storageSearch").addEventListener("input", renderRows);
  renderRows();
}

function renderFlashcards(){
  const deck = shuffle(D.recipes);
  let index = 0;
  let current = deck[index] || sample(D.recipes);
  const grade = status => {
    const progress = progressMap();
    if(status === "new") delete progress[current.id];
    else progress[current.id] = {status, updated:new Date().toISOString()};
    save(LS.progress, progress);
    index = (index + 1) % deck.length;
    current = deck[index] || sample(D.recipes);
    draw(false);
  };
  const draw = (show=false) => {
    shell(`<div class="card quiz-card">
      <div class="qtop"><span>${index+1}/${deck.length}</span><span>${escapeHtml(progressText(recipeProgress(current.id)))}</span></div>
      <div class="badges"><span class="badge">${escapeHtml(L(current.category))}</span><span class="badge ${current.verified?'green':'warn'}">${current.verified?t("checked"):t("toCheck")}</span></div>
      <h2 style="font-size:30px;margin-bottom:4px">${escapeHtml(L(current.name))}</h2>
      <p class="mini">${escapeHtml(L(current.glass))}</p>
      ${show ? `<div><div class="rule"><b>${t("volumes")}:</b> ${escapeHtml(volumesText(current))}</div>${tableFor(current)}<ol class="steps">${listL(current.steps).map(s=>`<li>${escapeHtml(s)}</li>`).join("")}</ol>${listL(current.notes).length?`<div class="note-box">${listL(current.notes).map(escapeHtml).join("<br>")}</div>`:""}</div>` : `<div class="empty">${t("flashHint")}</div>`}
      <div class="flash-actions">
        <button class="btn" id="showBtn">${show?t("hide"):t("showAnswer")}</button>
        ${show ? `<button class="btn secondary" id="repeatBtn">${escapeHtml(progressText("repeat"))}</button><button class="btn good" id="learnedBtn">${escapeHtml(progressText("learned"))}</button>` : ""}
        <button class="btn secondary" id="nextBtn">${t("nextCard")}</button>
      </div>
    </div>`);
    $("#showBtn").onclick = () => draw(!show);
    if(show){
      $("#repeatBtn").onclick = () => grade("repeat");
      $("#learnedBtn").onclick = () => grade("learned");
    }
    $("#nextBtn").onclick = () => {
      index = (index + 1) % deck.length;
      current = deck[index] || sample(D.recipes);
      draw(false);
    };
  };
  draw(false);
}

window.go = go;
window.toggleTheme = toggleTheme;
window.toggleLang = toggleLang;
window.setLang = setLang;
window.toggleRecipe = toggleRecipe;
window.toggleFav = toggleFav;
window.setRecipeProgress = setRecipeProgress;
window.startQuiz = startQuiz;
window.answerQuiz = answerQuiz;
window.nextQuiz = nextQuiz;
window.clearMistakes = clearMistakes;
window.markMistakesRepeat = markMistakesRepeat;

init();
