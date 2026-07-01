
let D = null;

const LS = {
  fav: "caffelito_favorites_v5",
  mistakes: "caffelito_mistakes_v5",
  history: "caffelito_history_v5",
  theme: "caffelito_theme_v5",
  lang: "caffelito_lang_v5"
};

const app = document.getElementById("app");
let quiz = null;

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
  const favs = load(LS.fav, []);
  const mistakes = load(LS.mistakes, []);
  const hist = load(LS.history, []);
  shell(`
    <div class="stats">
      <div class="stat"><b>${D.recipes.length}</b><span>${t("drinks")}</span></div>
      <div class="stat"><b>${D.recipes.filter(r=>r.verified).length}</b><span>${t("verified")}</span></div>
      <div class="stat"><b>${favs.length}</b><span>${t("favorites")}</span></div>
      <div class="stat"><b>${mistakes.length}</b><span>${t("mistakes")}</span></div>
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
  shell(`
    <div class="toolbar">
      <input class="search" id="search" placeholder="${escapeHtml(t("searchPh"))}" autocomplete="off">
      <select class="select" id="cat">${cats.map(c=>`<option>${escapeHtml(c)}</option>`).join("")}</select>
      <select class="select" id="ver"><option value="all">${t("allDrinks")}</option><option value="verified">${t("onlyChecked")}</option><option value="check">${t("onlyCheck")}</option></select>
    </div>
    <div id="recipeList" class="recipe-list"></div>
  `);
  const renderList = () => {
    const q = $("#search").value.trim().toLowerCase();
    const cat = $("#cat").value;
    const ver = $("#ver").value;
    const favs = load(LS.fav, []);
    let list = D.recipes.filter(r => {
      const hay = recipeSearchText(r).toLowerCase();
      if(filterFav && !favs.includes(r.id)) return false;
      if(cat !== t("all") && L(r.category) !== cat) return false;
      if(ver === "verified" && !r.verified) return false;
      if(ver === "check" && r.verified) return false;
      return !q || hay.includes(q);
    });
    $("#recipeList").innerHTML = list.length ? list.map(recipeCard).join("") : `<div class="card empty">${t("notFound")}</div>`;
  };
  ["input","change"].forEach(ev=>{
    $("#search").addEventListener(ev, renderList);
    $("#cat").addEventListener(ev, renderList);
    $("#ver").addEventListener(ev, renderList);
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
  return `<div class="recipe" id="r-${r.id}">
    <div class="recipe-head" onclick="toggleRecipe('${r.id}')">
      <div class="recipe-title">
        <h3>${escapeHtml(L(r.name))}</h3>
        <small>${escapeHtml(L(r.glass))}</small>
        <div class="badges"><span class="badge">${escapeHtml(L(r.category))}</span><span class="badge ${r.verified?'green':'warn'}">${r.verified?t("checked"):t("toCheck")}</span></div>
      </div>
      <button class="star ${on?'on':''}" onclick="event.stopPropagation();toggleFav('${r.id}')">★</button>
    </div>
    <div class="recipe-body">
      <div class="rule"><b>${t("volumes")}:</b> ${escapeHtml(volumesText(r))}</div>
      ${tableFor(r)}
      <ol class="steps">${listL(r.steps).map(s=>`<li>${escapeHtml(s)}</li>`).join("")}</ol>
      ${listL(r.notes).length ? `<div class="note-box">${listL(r.notes).map(escapeHtml).join("<br>")}</div>` : ""}
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
function toggleRecipe(id){
  const el = document.getElementById("r-"+id);
  if(!el) return;
  const willOpen = !el.classList.contains("open");
  $$(".recipe.open").forEach(item => {
    if(item !== el) item.classList.remove("open");
  });
  el.classList.toggle("open", willOpen);
}
function toggleFav(id){
  let favs = load(LS.fav, []);
  favs = favs.includes(id) ? favs.filter(x=>x!==id) : [...favs, id];
  save(LS.fav, favs);
  render();
}
function renderFavorites(){
  shell(`<div class="card"><div class="flex"><button class="btn secondary" onclick="go('learn')">${t("allRecipes")}</button></div></div><div style="height:12px"></div><div class="recipe-list" id="recipeList"></div>`);
  const favs = load(LS.fav, []);
  const list = D.recipes.filter(r=>favs.includes(r.id));
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
      <div class="rules">
        <div class="rule"><b>Espresso:</b> ${isUz() ? "kirish 17,8–18,3 g · chiqish 36–40 g · ekstraksiya 23–28 soniya." : "вход 17,8–18,3 г · выход 36–40 г · экстракция 23–28 сек."}</div>
        <div class="rule"><b>${isUz() ? "Sut harorati" : "Температура молока"}:</b> 65–70°C.</div>
        <div class="rule"><b>${isUz() ? "Ko‘pik" : "Пена"}:</b> ${isUz() ? "kapuchino 1,5–2 sm · latte 1–1,5 sm · flat white < 1 sm." : "капучино 1,5–2 см · латте 1–1,5 см · флэт уайт < 1 см."}</div>
        <div class="rule"><b>${isUz() ? "JSON" : "JSON"}:</b> ${isUz() ? "Barcha texkartalar techcards.json faylida turadi." : "Все техкарты лежат в файле techcards.json."}</div>
      </div>
    </div>
    <div style="height:12px"></div>
    <div class="card">
      <h2>${t("categories")}</h2>
      <div class="recipe-list">${byCat.map(item => `<div class="recipe"><div class="recipe-head"><div class="recipe-title"><h3>${escapeHtml(item.cat)}</h3><small>${item.count} ${t("drinkCount")}</small></div></div><div class="recipe-body" style="display:block"><div class="badges">${item.names.map(n => `<span class="badge gray">${escapeHtml(n)}</span>`).join("")}</div></div></div>`).join("")}</div>
    </div>
  `);
}

function allQuestionPool(onlyVerified=true){
  const recipes = D.recipes.filter(r=>!onlyVerified || r.verified);
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
      qs.push({type:"tech", recipe:L(r.name), question:tmpl(t("milkTempQ"), {recipe:L(r.name)}), answer:"65–70°C", options:makeOptions("65–70°C", ["60–65°C","65–70°C","70–75°C","75–80°C"]), explain:t("milkTempExplain")});
    }
    if(r.id === "espresso-classic"){
      qs.push({type:"tech", recipe:L(r.name), question:t("espressoExtractionQ"), answer:isUz()?"23–28 soniya":"23–28 сек", options:makeOptions(isUz()?"23–28 soniya":"23–28 сек", isUz()?["18–22 soniya","23–28 soniya","30–35 soniya","40–45 soniya"]:["18–22 сек","23–28 сек","30–35 сек","40–45 сек"]), explain:t("espressoExplain")});
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
    recipe:L(r.name),
    question:tmpl(t("volumeQ"), {recipe:L(r.name)}),
    answer,
    options:makeOptions(answer, volumePool),
    explain:`${L(r.name)}: ${answer}.`
  };
}

function renderQuizSetup(){
  shell(`<div class="card quiz-card">
    <h2>${t("quiz")}</h2>
    <p class="mini">${t("chooseMode")}</p>
    <div class="mode-row">
      <button class="btn" onclick="startQuiz({mode:'mixed',count:15,onlyVerified:true})">15 · ${t("exact")}</button>
      <button class="btn secondary" onclick="startQuiz({mode:'mixed',count:20,onlyVerified:false})">20 · ${t("allQuestions")}</button>
      <button class="btn secondary" onclick="startQuiz({mode:'amount',count:15,onlyVerified:true})">${t("grams")}</button>
      <button class="btn secondary" onclick="startQuiz({mode:'steps',count:15,onlyVerified:true})">${t("steps")}</button>
    </div>
  </div>`);
}
function startQuiz(cfg){
  clearInterval(quiz?.timer);
  const all = allQuestionPool(cfg.onlyVerified);
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
    mistakes.unshift({date:new Date().toISOString(), question:q.question, answer:q.answer, picked, explain:q.explain, recipe:q.recipe});
    save(LS.mistakes, mistakes.slice(0,100));
  }
  $("#explain").innerHTML = `<div class="explain">${correct ? t("correct") : t("wrong")}<br>${q.explain}</div><div class="next-wrap"><button class="btn full" onclick="nextQuiz()">${quiz.i+1 === quiz.questions.length ? t("finish") : t("next")}</button></div>`;
}
function nextQuiz(){ if(!quiz) return; quiz.i++; quiz.locked = false; renderQuizQuestion(); }
function finishQuiz(){
  if(!quiz) return go("home");
  clearInterval(quiz.timer);
  const total = quiz.questions.length;
  const pct = total ? Math.round(quiz.score/total*100) : 0;
  const hist = load(LS.history, []);
  hist.push({date:new Date().toISOString(), score:quiz.score, total, pct, mode:quiz.cfg.exam ? t("exam") : t("training")});
  save(LS.history, hist.slice(-30));
  shell(`<div class="card quiz-card result">
    <h2>${pct}%</h2>
    <div class="kpi"><div><b>${quiz.score}</b><span>${t("right")}</span></div><div><b>${total-quiz.score}</b><span>${t("mistakes")}</span></div><div><b>${total}</b><span>${t("total")}</span></div></div>
    <div class="flex" style="justify-content:center"><button class="btn" onclick="go('quiz')">${t("moreTest")}</button><button class="btn secondary" onclick="go('mistakes')">${t("err")}</button><button class="btn secondary" onclick="go('learn')">${t("study")}</button></div>
  </div>`);
  quiz = null;
}
function formatTime(sec){ const m = Math.floor(sec/60), s = sec%60; return `${m}:${String(s).padStart(2,"0")}`; }

function renderMistakes(){
  const mistakes = load(LS.mistakes, []);
  shell(`<div class="card"><div class="flex"><button class="btn secondary" onclick="go('home')">${t("back")}</button><button class="btn bad" onclick="clearMistakes()">${t("clearMistakes")}</button></div></div>
    <div style="height:12px"></div>
    ${mistakes.length ? `<div class="recipe-list">${mistakes.map(m=>`<div class="recipe"><div class="recipe-head"><div><h3>${escapeHtml(m.recipe)}</h3><small>${escapeHtml(fmtDate(m.date))}</small></div></div><div class="recipe-body" style="display:block"><div class="question" style="font-size:17px">${escapeHtml(m.question)}</div><div class="note-box">${t("yourAnswer")}: ${escapeHtml(m.picked)}<br>${t("correctAnswer")}: ${escapeHtml(m.answer)}</div><p>${m.explain||""}</p></div></div>`).join("")}</div>` : `<div class="card empty">${t("noMistakes")}</div>`}
  `);
}
function clearMistakes(){ save(LS.mistakes, []); renderMistakes(); }

function renderStorage(){
  shell(`<div class="card">
    <h2>${t("storageTitle")}</h2>
    <div class="rules">${D.storageRules.map(x=>`<div class="rule">${escapeHtml(L(x))}</div>`).join("")}</div>
    <div class="storage-wrap"><table class="storage-table"><thead><tr><th>${t("name")}</th><th>${t("primary")}</th><th>${t("secondary")}</th><th>${t("temp")}</th><th>${t("conditions")}</th><th>${t("marking")}</th></tr></thead><tbody>${D.storage.map(s=>`<tr><td><b>${escapeHtml(L(s.item))}</b></td><td>${escapeHtml(L(s.primary))}</td><td>${escapeHtml(L(s.secondary))}</td><td>${escapeHtml(s.temp)}</td><td>${escapeHtml(L(s.place))}</td><td>${escapeHtml(L(s.marking))}</td></tr>`).join("")}</tbody></table></div>
  </div>`);
}

function renderFlashcards(){
  let current = sample(D.recipes);
  const draw = (show=false) => {
    shell(`<div class="card quiz-card">
      <div class="badges"><span class="badge">${escapeHtml(L(current.category))}</span><span class="badge ${current.verified?'green':'warn'}">${current.verified?t("checked"):t("toCheck")}</span></div>
      <h2 style="font-size:30px;margin-bottom:4px">${escapeHtml(L(current.name))}</h2>
      <p class="mini">${escapeHtml(L(current.glass))}</p>
      ${show ? `<div><div class="rule"><b>${t("volumes")}:</b> ${escapeHtml(volumesText(current))}</div>${tableFor(current)}<ol class="steps">${listL(current.steps).map(s=>`<li>${escapeHtml(s)}</li>`).join("")}</ol>${listL(current.notes).length?`<div class="note-box">${listL(current.notes).map(escapeHtml).join("<br>")}</div>`:""}</div>` : `<div class="empty">${t("flashHint")}</div>`}
      <div class="flex" style="justify-content:center;margin-top:12px"><button class="btn" id="showBtn">${show?t("hide"):t("showAnswer")}</button><button class="btn secondary" id="nextBtn">${t("nextCard")}</button></div>
    </div>`);
    $("#showBtn").onclick = () => draw(!show);
    $("#nextBtn").onclick = () => { current = sample(D.recipes); draw(false); };
  };
  draw(false);
}

window.go = go;
window.toggleTheme = toggleTheme;
window.toggleLang = toggleLang;
window.setLang = setLang;
window.toggleRecipe = toggleRecipe;
window.toggleFav = toggleFav;
window.startQuiz = startQuiz;
window.answerQuiz = answerQuiz;
window.nextQuiz = nextQuiz;
window.clearMistakes = clearMistakes;

init();
