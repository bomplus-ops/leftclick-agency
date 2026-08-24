// ── Qualitech Sales Dashboard ── Code.gs ─────────────────────────────────────
// SSOT sheet tabs: Executive Summary | Salesperson Performance |
// Department Performance | Top Clients | Pipeline (Waiting) |
// Raw Data (2026 Filtered) | Key Insights (2026)
// ─────────────────────────────────────────────────────────────────────────────

var SSOT_ID   = "1aDvDAPCGVkhYw8ZA44fIfwP662phHUz4a3s-pAviX0g";
var REPORT_ID = "1PwMOaHk6QAt3ZJia9nV1J-fY5Av87HmVYtEZZSMqajM";

function doGet(e) {
  var html = HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Qualitech Sales Dashboard")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return html;
}

function getSalesDashboardData() {
  var result = { ssot: null, error: null, fetchedAt: new Date().toISOString() };
  try { result.ssot = fetchSsotSheet(SSOT_ID); }
  catch(e) { result.error = "SSOT: " + e.message; }
  return result;
}

// ── SSOT — reads all tabs ─────────────────────────────────────────────────────
function fetchSsotSheet(id) {
  var ss = SpreadsheetApp.openById(id);

  // ── Raw deal data ─────────────────────────────────────────────────────────
  // Priority: exact name → fallback to sheet with most rows
  var rawSheet = ss.getSheetByName("Raw Data (2026 Filtered)")
    || ss.getSheetByName("DB_DEALS")
    || ss.getSheetByName("SSOT")
    || findLargestSheet(ss);

  var rows = sheetToObjects(rawSheet);

  // Categorise by Status
  var bidding=[], waiting=[], won=[], lost=[], budgetary=[], backlog=[];
  rows.forEach(function(r) {
    var s = String(r["Status"] || "").trim().toLowerCase();
    if      (s === "bidding")              bidding.push(r);
    else if (s === "waiting")              waiting.push(r);
    else if (s === "win"  || s === "won")  won.push(r);
    else if (s === "lost" || s === "lose") lost.push(r);
    else if (s === "budgetary")            budgetary.push(r);
    else if (s === "backlog")              backlog.push(r);
  });

  // Aggregate by Sale (salesperson)
  var bySale = {};
  rows.forEach(function(r) {
    var sale = String(r["Sale"] || "Unknown").trim();
    var val  = toNum(r["Value"]);
    var s    = String(r["Status"] || "").trim().toLowerCase();
    if (!bySale[sale]) bySale[sale] = { sale: sale, bidding:0, waiting:0, win:0, lost:0, budgetary:0, backlog:0, total:0 };
    bySale[sale].total += val;
    if      (s === "bidding")              bySale[sale].bidding   += val;
    else if (s === "waiting")              bySale[sale].waiting   += val;
    else if (s === "win"  || s === "won")  bySale[sale].win       += val;
    else if (s === "lost" || s === "lose") bySale[sale].lost      += val;
    else if (s === "budgetary")            bySale[sale].budgetary += val;
    else if (s === "backlog")              bySale[sale].backlog   += val;
  });
  var salespersons = Object.keys(bySale)
    .map(function(k){ return bySale[k]; })
    .filter(function(s){ return s.sale && s.sale !== "Unknown"; })
    .sort(function(a,b){ return b.total - a.total; });

  // Aggregate by Client Name
  var byClient = {};
  rows.forEach(function(r) {
    var client = String(r["Client Name"] || "Unknown").trim();
    var val    = toNum(r["Value"]);
    var s      = String(r["Status"] || "").trim().toLowerCase();
    if (!byClient[client]) byClient[client] = { client: client, bidding:0, waiting:0, win:0, lost:0, total:0 };
    byClient[client].total += val;
    if      (s === "bidding")              byClient[client].bidding += val;
    else if (s === "waiting")              byClient[client].waiting += val;
    else if (s === "win"  || s === "won")  byClient[client].win     += val;
    else if (s === "lost" || s === "lose") byClient[client].lost    += val;
  });
  var topClients = Object.keys(byClient)
    .map(function(k){ return byClient[k]; })
    .filter(function(c){ return c.client && c.client !== "Unknown"; })
    .sort(function(a,b){ return b.total - a.total; })
    .slice(0, 10);

  // Aggregate by Dep Responsibility
  var byDept = {};
  rows.forEach(function(r) {
    var dept = String(r["Dep Responsibility"] || "Unknown").trim();
    var val  = toNum(r["Value"]);
    if (!byDept[dept]) byDept[dept] = { dept: dept, total: 0 };
    byDept[dept].total += val;
  });
  var departments = Object.keys(byDept)
    .map(function(k){ return byDept[k]; })
    .filter(function(d){ return d.dept && d.dept !== "Unknown"; })
    .sort(function(a,b){ return b.total - a.total; });

  // ── Pre-aggregated tabs (use directly if available) ───────────────────────
  var pipelineTab = ss.getSheetByName("Pipeline (Waiting)");
  var pipelineRows = pipelineTab ? sheetToObjects(pipelineTab) : waiting;

  return {
    rawSheetUsed:   rawSheet.getName(),          // debug: confirm which tab was read
    totalRecords:   rows.length,
    bidding:        bidding,
    waiting:        waiting,
    won:            won,
    lost:           lost,
    budgetary:      budgetary,
    backlog:        backlog,
    biddingValue:   sumField(bidding,   ["Value"]),
    waitingValue:   sumField(waiting,   ["Value"]),
    wonValue:       sumField(won,       ["Value"]),
    lostValue:      sumField(lost,      ["Value"]),
    budgetaryValue: sumField(budgetary, ["Value"]),
    backlogValue:   sumField(backlog,   ["Value"]),
    pipelineCount:  pipelineRows.length,
    pipelineValue:  sumField(pipelineRows, ["Value"]),
    salespersons:   salespersons,
    topClients:     topClients,
    departments:    departments,
    pipelineRows:   pipelineRows
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function findLargestSheet(ss) {
  var sheets = ss.getSheets(), largest = sheets[0], maxRows = 0;
  sheets.forEach(function(s) {
    var r = s.getLastRow();
    if (r > maxRows) { maxRows = r; largest = s; }
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
  if (v === null || v === undefined || v === "") return 0;
  var n = parseFloat(String(v).replace(/[,฿\s]/g, ""));
  return isNaN(n) ? 0 : n;
}

function sumField(rows, fieldCandidates) {
  var total = 0;
  rows.forEach(function(r) {
    for (var k = 0; k < fieldCandidates.length; k++) {
      var v = r[fieldCandidates[k]];
      if (v !== undefined && v !== null && v !== "") {
        var n = parseFloat(String(v).replace(/[,฿\s]/g, ""));
        if (!isNaN(n)) { total += n; break; }
      }
    }
  });
  return total;
}
