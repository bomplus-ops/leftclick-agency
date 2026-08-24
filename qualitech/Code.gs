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

// ── SSOT ──────────────────────────────────────────────────────────────────────
function fetchSsotSheet(id) {
  var ss = SpreadsheetApp.openById(id);
  var allSheetNames = ss.getSheets().map(function(s){ return s.getName(); });

  // Raw deal data — try named tabs then largest sheet
  var rawSheet = ss.getSheetByName("Raw Data (2026 Filtered)")
    || ss.getSheetByName("DB_DEALS")
    || ss.getSheetByName("SSOT")
    || findLargestSheet(ss);

  var rows = sheetToObjects(rawSheet);

  // ── DEBUG: expose real column names and sample values ─────────────────────
  var sampleHeaders = rows.length > 0 ? Object.keys(rows[0]) : [];
  var sampleRow     = rows.length > 0 ? rows[0] : {};

  // Unique status values (first 20)
  var statusSet = {};
  rows.forEach(function(r) {
    var sv = String(r["Status"] || r["status"] || r["STATUS"] || "").trim();
    if (sv) statusSet[sv] = (statusSet[sv] || 0) + 1;
  });

  // Unique Sale values (first 10)
  var saleSet = {};
  rows.forEach(function(r) {
    var sv = String(r["Sale"] || r["sale"] || r["SALE"] || r["Salesperson"] || "").trim();
    if (sv) saleSet[sv] = (saleSet[sv] || 0) + 1;
  });

  // ── Detect actual column names by scanning variants ───────────────────────
  var statusCol = detectCol(rows, ["Status","status","STATUS","Deal Status","Pipeline Status"]);
  var saleCol   = detectCol(rows, ["Sale","sale","SALE","Salesperson","Sales Rep","Rep","Agent"]);
  var valueCol  = detectCol(rows, ["Value","value","VALUE","Amount","amount","Revenue","Deal Value"]);
  var clientCol = detectCol(rows, ["Client Name","client name","Client","Customer","Company","Account"]);
  var deptCol   = detectCol(rows, ["Dep Responsibility","Department","Dept","Department Responsibility"]);

  // ── Categorise by Status ──────────────────────────────────────────────────
  var bidding=[], waiting=[], won=[], lost=[], budgetary=[], backlog=[];
  rows.forEach(function(r) {
    var s = String(r[statusCol] || "").trim().toLowerCase();
    if      (s === "bidding")              bidding.push(r);
    else if (s === "waiting")              waiting.push(r);
    else if (s === "win"  || s === "won")  won.push(r);
    else if (s === "lost" || s === "lose") lost.push(r);
    else if (s === "budgetary")            budgetary.push(r);
    else if (s === "backlog")              backlog.push(r);
  });

  // ── Aggregate by Salesperson ──────────────────────────────────────────────
  var bySale = {};
  rows.forEach(function(r) {
    var sale = String(r[saleCol] || "Unknown").trim();
    var val  = toNum(r[valueCol]);
    var s    = String(r[statusCol] || "").trim().toLowerCase();
    if (!bySale[sale]) bySale[sale] = { sale:sale, bidding:0, waiting:0, win:0, lost:0, budgetary:0, backlog:0, total:0 };
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

  // ── Aggregate by Client ───────────────────────────────────────────────────
  var byClient = {};
  rows.forEach(function(r) {
    var client = String(r[clientCol] || "Unknown").trim();
    var val    = toNum(r[valueCol]);
    var s      = String(r[statusCol] || "").trim().toLowerCase();
    if (!byClient[client]) byClient[client] = { client:client, bidding:0, waiting:0, win:0, lost:0, total:0 };
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

  // ── Aggregate by Dept ─────────────────────────────────────────────────────
  var byDept = {};
  rows.forEach(function(r) {
    var dept = String(r[deptCol] || "Unknown").trim();
    var val  = toNum(r[valueCol]);
    if (!byDept[dept]) byDept[dept] = { dept:dept, total:0 };
    byDept[dept].total += val;
  });
  var departments = Object.keys(byDept)
    .map(function(k){ return byDept[k]; })
    .filter(function(d){ return d.dept && d.dept !== "Unknown"; })
    .sort(function(a,b){ return b.total - a.total; });

  // Pipeline tab (pre-filtered)
  var pipelineTab  = ss.getSheetByName("Pipeline (Waiting)");
  var pipelineRows = pipelineTab ? sheetToObjects(pipelineTab) : waiting;

  return {
    // Debug info
    debug: {
      allSheetNames:  allSheetNames,
      rawSheetUsed:   rawSheet.getName(),
      sampleHeaders:  sampleHeaders,
      sampleRow:      JSON.stringify(sampleRow).slice(0, 500),
      statusValues:   statusSet,
      saleValues:     saleSet,
      detectedCols:   { status: statusCol, sale: saleCol, value: valueCol, client: clientCol, dept: deptCol }
    },
    // Data
    totalRecords:   rows.length,
    bidding:        bidding,
    waiting:        waiting,
    won:            won,
    lost:           lost,
    budgetary:      budgetary,
    backlog:        backlog,
    biddingValue:   sumField(bidding,   [valueCol]),
    waitingValue:   sumField(waiting,   [valueCol]),
    wonValue:       sumField(won,       [valueCol]),
    lostValue:      sumField(lost,      [valueCol]),
    budgetaryValue: sumField(budgetary, [valueCol]),
    backlogValue:   sumField(backlog,   [valueCol]),
    pipelineCount:  pipelineRows.length,
    pipelineValue:  sumField(pipelineRows, [valueCol]),
    salespersons:   salespersons,
    topClients:     topClients,
    departments:    departments,
    pipelineRows:   pipelineRows
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function detectCol(rows, candidates) {
  if (!rows || rows.length === 0) return candidates[0];
  var keys = Object.keys(rows[0]);
  for (var c = 0; c < candidates.length; c++) {
    for (var k = 0; k < keys.length; k++) {
      if (keys[k].trim().toLowerCase() === candidates[c].toLowerCase()) return keys[k];
    }
  }
  return candidates[0]; // fallback to first candidate
}

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
