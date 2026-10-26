(() => {
  "use strict";
  const STORE_KEY = "vjViralStudio.v1";
  const $ = (id) => document.getElementById(id);
  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));
  let data = load();
  let toastTimer;

  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      return {
        ideas: Array.isArray(parsed.ideas) ? parsed.ideas : [],
        posts: Array.isArray(parsed.posts) ? parsed.posts : [],
        metrics: Array.isArray(parsed.metrics) ? parsed.metrics : []
      };
    } catch (_) { return {ideas: [], posts: [], metrics: []}; }
  }
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
      render();
    } catch (_) {
      showToast("Storage is full. Export a backup and remove large items.");
    }
  }
  function id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function showToast(message) {
    const el = $("toast"); el.textContent = message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }
  function dateLabel(value) {
    try { return new Date(value).toLocaleDateString(); } catch (_) { return ""; }
  }
  function tagsFor(niche, topic) {
    const base = ["#Shorts", "#Reels", "#ContentCreator"];
    const lower = (niche + " " + topic).toLowerCase();
    if (/marketing|seo|business|ai|tech|digital/.test(lower)) base.push("#DigitalMarketing", "#AITools", "#CreatorTips");
    else if (/sanatan|devotional|god|bhakti|spiritual/.test(lower)) base.push("#Bhakti", "#SanatanDharma", "#Devotional");
    else if (/education|learn|fact|study/.test(lower)) base.push("#LearnOnSocial", "#DidYouKnow", "#Education");
    else base.push("#TrendingTopics", "#VideoIdeas", "#Discover");
    return [...new Set(base)].slice(0, 7).join(" ");
  }
  const hooks = [
    "Stop scrolling—here is one thing worth knowing about",
    "Most people overlook this simple point about",
    "Try this beginner-friendly approach to",
    "Before you spend time on this, understand",
    "Here are three things to know about",
    "A common mistake people make with",
    "Can you explain this in 30 seconds? Let's break down",
    "Save this idea for the next time you need",
    "The quick guide to understanding",
    "One useful takeaway about"
  ];
  const structures = [
    "Open with the main problem, show one clear example, and finish with a practical takeaway.",
    "Use a quick before-and-after, explain what changed, and close with one useful lesson.",
    "Share three concise points with a visual change between each point.",
    "Start with a question, answer it simply, and invite viewers to share their experience.",
    "Show the process step by step and end with the result or key lesson."
  ];
  function makeConcepts(topic, niche, audience, count) {
    const created = [];
    for (let i = 0; i < count; i++) {
      const title = `${hooks[i]} ${topic}`.replace(/\s+/g, " ").trim();
      const script = `${title}.\n\n${structures[i % structures.length]}\n\nAudience: ${audience || "general viewers"}.\n\nKeep it original, accurate, visually clear, and concise. Use footage you own or have permission to use.`;
      const caption = `${topic}: ${structures[i % structures.length]} What would you add?`;
      const post = {
        id: id(), topic, niche, title, script, caption,
        hashtags: tagsFor(niche, topic),
        platform: "All selected platforms",
        status: "Review needed",
        createdAt: new Date().toISOString()
      };
      data.posts.unshift(post); created.push(post);
    }
    return created;
  }
  function renderStats() {
    $("ideaCount").textContent = data.ideas.length;
    $("draftCount").textContent = data.posts.filter(p => p.status !== "Published (tracked)").length;
    $("reviewCount").textContent = data.posts.filter(p => p.status === "Review needed").length;
    $("publishedCount").textContent = data.posts.filter(p => p.status === "Published (tracked)").length;
  }
  function renderGenerated() {
    const host = $("generated");
    if (!data.posts.length) { host.innerHTML = '<div class="empty">Your generated concepts will appear here. Start with a topic above.</div>'; return; }
    host.innerHTML = data.posts.slice(0, 10).map(p => `
      <article class="idea-card">
        <span class="tag">${safe(p.niche)}</span>
        <h3>${safe(p.title)}</h3>
        <p>${safe(p.script)}</p>
        <p><strong>Caption:</strong> ${safe(p.caption)}</p>
        <p>${safe(p.hashtags)}</p>
        <div class="card-actions">
          <button class="primary" data-action="approve" data-id="${safe(p.id)}">Approve draft</button>
          <button class="secondary" data-action="copy" data-id="${safe(p.id)}">Copy text</button>
        </div>
      </article>`).join("");
  }
  function renderQueue() {
    const host = $("queueList");
    if (!data.posts.length) { host.innerHTML = '<div class="empty">No drafts yet. Generate concepts first.</div>'; return; }
    host.innerHTML = data.posts.map(p => `
      <article class="queue-card">
        <div class="queue-top"><h3>${safe(p.title)}</h3><span class="status ${p.status.startsWith("Approved") ? "approved" : p.status.startsWith("Published") ? "published" : ""}">${safe(p.status)}</span></div>
        <p>${safe(p.caption)}</p><p>${safe(p.hashtags)}</p>
        <p class="muted">Created ${safe(dateLabel(p.createdAt))} · ${safe(p.platform)}</p>
        <div class="card-actions">
          ${p.status === "Review needed" ? `<button class="primary" data-action="approve" data-id="${safe(p.id)}">Approve for manual posting</button>` : ""}
          <button class="secondary" data-action="copy" data-id="${safe(p.id)}">Copy caption & tags</button>
          ${p.status.startsWith("Approved") ? `<button class="secondary" data-action="published" data-id="${safe(p.id)}">Mark as posted</button>` : ""}
          <button class="danger" data-action="delete" data-id="${safe(p.id)}">Delete</button>
        </div>
      </article>`).join("");
  }
  function renderMetrics() {
    const host = $("metricsList");
    if (!data.metrics.length) { host.innerHTML = '<div class="empty">No performance data yet. Add the numbers after you publish a video.</div>'; return; }
    host.innerHTML = data.metrics.map(m => `
      <article class="metric-card">
        <div class="queue-top"><h3>${safe(m.title)}</h3><span class="status">${safe(m.platform)}</span></div>
        <p>Views: <strong>${Number(m.views).toLocaleString()}</strong> · Likes: <strong>${Number(m.likes).toLocaleString()}</strong> · Shares: <strong>${Number(m.shares).toLocaleString()}</strong> · Followers gained: <strong>${Number(m.followers).toLocaleString()}</strong></p>
        <p class="muted">Recorded ${safe(dateLabel(m.createdAt))}</p>
        <button class="danger" data-action="deleteMetric" data-id="${safe(m.id)}">Delete metric</button>
      </article>`).join("");
  }
  function render() { renderStats(); renderGenerated(); renderQueue(); renderMetrics(); }

  document.querySelectorAll(".tab").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b === btn));
    document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === `panel-${btn.dataset.tab}`));
  }));
  $("ideaForm").addEventListener("submit", event => {
    event.preventDefault();
    const topic = $("topic").value.trim();
    if (!topic) return;
    const niche = $("niche").value, audience = $("audience").value.trim(), count = Number($("count").value);
    data.ideas.unshift({id:id(), topic, niche, audience, createdAt:new Date().toISOString()});
    const made = makeConcepts(topic, niche, audience, count);
    save(); showToast(`Created ${made.length} draft concepts. Review before use.`);
    $("generated").scrollIntoView({behavior:"smooth", block:"start"});
  });
  document.addEventListener("click", async event => {
    const btn = event.target.closest("[data-action]");
    if (!btn) return;
    const p = data.posts.find(x => x.id === btn.dataset.id);
    if (btn.dataset.action === "approve" && p) {
      p.status = "Approved for manual posting";
      save(); showToast("Approved locally. Nothing was published.");
    } else if (btn.dataset.action === "copy" && p) {
      const text = `${p.title}\n\n${p.caption}\n\n${p.hashtags}\n\n${p.script}`;
      try { await navigator.clipboard.writeText(text); showToast("Draft copied."); }
      catch (_) { window.prompt("Copy your draft text:", text); }
    } else if (btn.dataset.action === "published" && p) {
      p.status = "Published (tracked)";
      p.publishedAt = new Date().toISOString();
      save(); showToast("Marked as posted. This did not publish it.");
    } else if (btn.dataset.action === "delete" && p) {
      if (confirm("Delete this draft?")) { data.posts = data.posts.filter(x => x.id !== p.id); save(); }
    } else if (btn.dataset.action === "deleteMetric") {
      if (confirm("Delete this performance record?")) { data.metrics = data.metrics.filter(x => x.id !== btn.dataset.id); save(); }
    }
  });
  $("metricsForm").addEventListener("submit", event => {
    event.preventDefault();
    data.metrics.unshift({
      id:id(), title:$("metricPost").value.trim(), platform:$("platform").value,
      views:Math.max(0, Number($("views").value)||0), likes:Math.max(0, Number($("likes").value)||0),
      shares:Math.max(0, Number($("shares").value)||0), followers:Math.max(0, Number($("followers").value)||0),
      createdAt:new Date().toISOString()
    });
    save(); event.target.reset(); $("views").value = $("likes").value = $("shares").value = $("followers").value = 0;
    showToast("Performance saved.");
  });
  $("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({app:"VJ Viral AI Studio",version:1,exportedAt:new Date().toISOString(),...data}, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = "vj-viral-ai-studio-backup.json"; a.click(); URL.revokeObjectURL(url);
  });
  $("importFile").addEventListener("change", async event => {
    const file = event.target.files && event.target.files[0]; if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed.posts) || !Array.isArray(parsed.ideas) || !Array.isArray(parsed.metrics)) throw new Error("invalid");
      if (!confirm("Replace the current local workspace with this backup?")) return;
      data = {posts:parsed.posts, ideas:parsed.ideas, metrics:parsed.metrics}; save(); showToast("Backup imported.");
    } catch (_) { showToast("Could not import. Choose a valid VJ Studio JSON backup."); }
    event.target.value = "";
  });
  $("clearBtn").addEventListener("click", () => {
    if (!confirm("Clear all ideas, drafts and metrics from this browser? Export a backup first if needed.")) return;
    data = {ideas:[],posts:[],metrics:[]}; save(); showToast("Local workspace cleared.");
  });
  render();
})();