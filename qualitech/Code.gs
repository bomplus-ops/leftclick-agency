// ── Qualitech Sales Dashboard ── Code.gs ─────────────────────────────────────
// Sheet: V2 Qualitech_Sales_Report_2026_YTD_Jan_Apr29
// ID:    1aDvDAPCGVkhYw8ZA44fIfwP662phHUz4a3s-pAviX0g
//
// Tabs used:
//   Executive Summary     → KPI summary + monthly breakdown
//   Salesperson Performance → by-person breakdown
//   Department Performance  → by-dept breakdown
//   Top Clients             → top client list
//   Pipeline (Waiting)      → active waiting deals
//   Raw Data (2026 Filtered)→ deal-level rows (fallback)
// ─────────────────────────────────────────────────────────────────────────────

var SSOT_ID = "1aDvDAPCGVkhYw8ZA44fIfwP662phHUz4a3s-pAviX0g";

function doGet(e) {
  var html = HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Qualitech Sales Dashboard")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return html;
}

function getSalesDashboardData() {
  var result = { ssot: null, error: null, fetchedAt: new Date().toISOString() };
  try { result.ssot = fetchAllTabs(SSOT_ID); }
  catch(e) { result.error = e.message + "\n" + e.stack; }
  return result;
}

// ── Main: read every relevant tab ────────────────────────────────────────────
function fetchAllTabs(id) {
  var ss         = SpreadsheetApp.openById(id);
  var sheetNames = ss.getSheets().map(function(s){ return s.getName(); });

  // ── 1. Executive Summary → KPIs + monthly ────────────────────────────────
  var execSheet  = ss.getSheetByName("Executive Summary") || ss.getSheets()[0];
  var exec       = parseExecutiveSummary(execSheet);

  // ── 2. Pre-aggregated tabs ────────────────────────────────────────────────
  var salesTab   = ss.getSheetByName("Salesperson Performance");
  var deptTab    = ss.getSheetByName("Department Performance");
  var clientTab  = ss.getSheetByName("Top Clients");
  var pipeTab    = ss.getSheetByName("Pipeline (Waiting)");
  var rawTab     = ss.getSheetByName("Raw Data (2026 Filtered)") || findLargestSheet(ss);

  var salesRows    = salesTab   ? sheetToObjects(salesTab)   : [];
  var deptRows     = deptTab    ? sheetToObjects(deptTab)    : [];
  var clientRows   = clientTab  ? sheetToObjects(clientTab)  : [];
  var pipelineRows = pipeTab    ? sheetToObjects(pipeTab)    : [];
  var rawRows      = rawTab     ? sheetToObjects(rawTab)     : [];

  // ── 3. Normalise salesperson rows ─────────────────────────────────────────
  var salespersons = normaliseSale(salesRows);

  // ── 4. Normalise top-client rows ──────────────────────────────────────────
  var topClients = normaliseClient(clientRows);

  // ── 5. Normalise dept rows ────────────────────────────────────────────────
  var departments = normaliseDept(deptRows);

  return {
    // debug: expose raw headers so we can verify column names
    debug: {
      sheetNames:       sheetNames,
      execKPI:          exec.kpi,
      salesHeaders:     salesRows.length  > 0 ? Object.keys(salesRows[0])    : [],
      deptHeaders:      deptRows.length   > 0 ? Object.keys(deptRows[0])     : [],
      clientHeaders:    clientRows.length > 0 ? Object.keys(clientRows[0])   : [],
      pipelineHeaders:  pipelineRows.length > 0 ? Object.keys(pipelineRows[0]) : [],
      rawHeaders:       rawRows.length    > 0 ? Object.keys(rawRows[0])      : [],
      rawSheetUsed:     rawTab ? rawTab.getName() : "none"
    },
    // KPI from Executive Summary
    totalRecords:    exec.kpi.totalDeals   || 0,
    wonCount:        exec.kpi.winDeals     || 0,
    lostCount:       exec.kpi.lostDeals    || 0,
    waitingCount:    exec.kpi.waiting      || 0,
    winRate:         exec.kpi.winRate      || 0,
    wonValue:        exec.kpi.winRevenue   || 0,
    lostValue:       exec.kpi.lostRevenue  || 0,
    waitingValue:    exec.kpi.pipeline     || 0,
    avgWinDeal:      exec.kpi.avgWinDeal   || 0,
    bestMonth:       exec.kpi.bestMonth    || "",
    topSalesperson:  exec.kpi.topSalesperson || "",
    // Monthly
    monthly:         exec.monthly,
    // Aggregated
    salespersons:    salespersons,
    topClients:      topClients,
    departments:     departments,
    pipelineRows:    pipelineRows,
    pipelineCount:   exec.kpi.waiting || pipelineRows.length,
    pipelineValue:   exec.kpi.pipeline || 0
  };
}

// ── Parse Executive Summary ───────────────────────────────────────────────────
// Layout (from screenshot):
//   Row 1: merged title
//   Row 2: source note
//   Row 4: KPI headers  (Total Deals | Win Deals | Lost Deals | Waiting | Win Rate | Win Revenue THB | Pipeline THB | Avg Win Deal THB | Best Month | Top Salesperson)
//   Row 5: KPI values
//   Row 8: Monthly summary title
//   Row 9: Monthly column headers (Month | Win Deals | Lost Deals | Waiting | Win Rate % | Win Revenue THB | Lost Revenue THB | Pipeline THB | vs Prior Month | Cumulative)
//   Rows 10-13: Jan, Feb, Mar, Apr
//   Row 14: TOTAL
function parseExecutiveSummary(sheet) {
  if (!sheet) return { kpi: {}, monthly: [] };
  var values = sheet.getDataRange().getValues();
  var kpi     = {};
  var monthly = [];
  var monthlyHeaders = null;
  var MONTH_NAMES = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec","total"];

  for (var i = 0; i < values.length; i++) {
    var row   = values[i];
    var cell0 = String(row[0] || "").trim().toLowerCase();

    // KPI header row detection: first cell contains "total deals"
    if (cell0 === "total deals" || cell0.indexOf("total deals") !== -1) {
      if (i + 1 < values.length) {
        var v = values[i + 1];
        kpi.totalDeals     = toNum(v[0]);
        kpi.winDeals       = toNum(v[1]);
        kpi.lostDeals      = toNum(v[2]);
        kpi.waiting        = toNum(v[3]);
        kpi.winRate        = toNum(String(v[4]).replace("%",""));
        kpi.winRevenue     = toNum(v[5]);
        kpi.pipeline       = toNum(v[6]);
        kpi.avgWinDeal     = toNum(v[7]);
        kpi.bestMonth      = String(v[8] || "");
        kpi.topSalesperson = String(v[9] || "");
      }
    }

    // Monthly header row detection: first cell = "month"
    if (cell0 === "month") {
      monthlyHeaders = row.map(function(h){ return String(h).trim(); });
    }

    // Monthly data rows: first cell = month abbreviation or "TOTAL"
    if (monthlyHeaders && MONTH_NAMES.indexOf(cell0) !== -1) {
      var mRow = {};
      monthlyHeaders.forEach(function(h, j){ mRow[h] = row[j]; });
      monthly.push(mRow);
    }
  }

  // Also try to extract lostRevenue from monthly TOTAL row
  var totalRow = monthly.filter(function(r){ return String(r["Month"]||"").toLowerCase() === "total"; })[0];
  if (totalRow) {
    kpi.lostRevenue = toNum(totalRow["Lost Revenue (THB)"] || totalRow["Lost Revenue"] || 0);
  }

  return { kpi: kpi, monthly: monthly };
}

// ── Normalise Salesperson Performance tab ────────────────────────────────────
// Tries common column name variants; debug.salesHeaders will show actual names
function normaliseSale(rows) {
  return rows.map(function(r) {
    var keys = Object.keys(r);
    return {
      sale:      pick(r, ["Salesperson","Sale","Name","Rep","Agent","Employee","sales rep"]),
      win:       toNum(pick(r, ["Win Revenue","Win Revenue (THB)","Win","Won Revenue","Won"])),
      lost:      toNum(pick(r, ["Lost Revenue","Lost Revenue (THB)","Lost","Lose Revenue"])),
      waiting:   toNum(pick(r, ["Pipeline","Pipeline (THB)","Waiting","Pipeline Value"])),
      winDeals:  toNum(pick(r, ["Win Deals","Won Deals","Win Count","Wins"])),
      lostDeals: toNum(pick(r, ["Lost Deals","Lost Count","Losses"])),
      winRate:   toNum(String(pick(r, ["Win Rate","Win Rate %","Win%","Ach%"]) || "0").replace("%","")),
      total:     toNum(pick(r, ["Total Revenue","Total","Grand Total","Total Value"]))
    };
  }).filter(function(s){ return s.sale && s.sale !== "—"; })
    .sort(function(a,b){ return (b.win + b.waiting) - (a.win + a.waiting); });
}

// ── Normalise Top Clients tab ─────────────────────────────────────────────────
function normaliseClient(rows) {
  return rows.map(function(r) {
    return {
      client:  pick(r, ["Client Name","Client","Customer","Company","Account","Name"]),
      win:     toNum(pick(r, ["Win Revenue","Win Revenue (THB)","Win","Won","Won Revenue"])),
      lost:    toNum(pick(r, ["Lost Revenue","Lost Revenue (THB)","Lost"])),
      waiting: toNum(pick(r, ["Pipeline","Pipeline (THB)","Waiting"])),
      total:   toNum(pick(r, ["Total Revenue","Total","Grand Total","Total Value","Volume"]))
    };
  }).filter(function(c){ return c.client && c.client !== "—"; })
    .sort(function(a,b){ return b.total - a.total; })
    .slice(0, 10);
}

// ── Normalise Department Performance tab ─────────────────────────────────────
function normaliseDept(rows) {
  return rows.map(function(r) {
    return {
      dept:    pick(r, ["Department","Dep Responsibility","Dept","Division","Team","Unit"]),
      win:     toNum(pick(r, ["Win Revenue","Win Revenue (THB)","Win","Won"])),
      lost:    toNum(pick(r, ["Lost Revenue","Lost Revenue (THB)","Lost"])),
      waiting: toNum(pick(r, ["Pipeline","Pipeline (THB)","Waiting"])),
      total:   toNum(pick(r, ["Total Revenue","Total","Grand Total","Total Value"]))
    };
  }).filter(function(d){ return d.dept && d.dept !== "—"; })
    .sort(function(a,b){ return b.total - a.total; });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function pick(obj, candidates) {
  if (!obj) return "—";
  var keys = Object.keys(obj);
  for (var c = 0; c < candidates.length; c++) {
    for (var k = 0; k < keys.length; k++) {
      if (keys[k].trim().toLowerCase() === candidates[c].toLowerCase()) {
        var v = obj[keys[k]];
        return (v !== null && v !== undefined && v !== "") ? v : "—";
      }
    }
  }
  return "—";
}

function findLargestSheet(ss) {
  var sheets = ss.getSheets(), largest = sheets[0], maxRows = 0;
  sheets.forEach(function(s){
    var r = s.getLastRow();
    if (r > maxRows){ maxRows = r; largest = s; }
  });
  return largest;
}

function sheetToObjects(sheet) {
  if (!sheet) return [];
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0].map(function(h){ return String(h).trim(); });
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var row = {};
    headers.forEach(function(h, j){ row[h] = values[i][j]; });
    rows.push(row);
  }
  return rows;
}

function toNum(v) {
  if (v === null || v === undefined || v === "" || v === "—") return 0;
  var n = parseFloat(String(v).replace(/[,฿%\s]/g,""));
  return isNaN(n) ? 0 : n;
}
