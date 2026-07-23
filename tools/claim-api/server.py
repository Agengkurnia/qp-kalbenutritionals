"""
Claim API sidecar — Development Fund prototype
Run:  python server.py
Base: http://localhost:5055
"""
from __future__ import annotations

import csv
import json
import os
import re
import subprocess
import sys
import traceback
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

HOST = "127.0.0.1"
PORT = 5055

ROOT = Path(__file__).resolve().parents[2]  # QP Kalbe Nutritionals
AUTOMATE_DIR = ROOT / "tools" / "automate-claim-epm"
FILE_DIR = AUTOMATE_DIR / "file"
DATA_DIR = ROOT / "data" / "claims"
LATEST_JSON = DATA_DIR / "latest.json"
META_JSON = DATA_DIR / "meta.json"
PREVIOUS_SUMMARY_JSON = DATA_DIR / "previous-summary.json"
DOWNLOAD_PY = AUTOMATE_DIR / "download_claim.py"
DOWNLOAD_EXE = AUTOMATE_DIR / "download_claim.exe"

AMOUNT_FIELDS = ("RP_LUMPSUM", "RP_EDPH_PRIN", "RP_PROMOSI", "RP_EDHL", "RP_BONUS")


def ensure_dirs():
    FILE_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def to_float(v) -> float:
    if v is None:
        return 0.0
    s = str(v).strip().replace(",", "")
    if not s or s == "-":
        return 0.0
    try:
        return float(s)
    except ValueError:
        return 0.0


def list_claim_csvs() -> list[Path]:
    if not FILE_DIR.exists():
        return []
    files = [p for p in FILE_DIR.iterdir() if p.is_file() and p.suffix.lower() == ".csv" and "LISTING_CLAIM" in p.name.upper()]
    files.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    return files


def extract_date_from_name(name: str) -> str | None:
    m = re.search(r"(\d{6})", name)
    return m.group(1) if m else None


def run_download(target_date: str | None = None) -> dict:
    """Run download_claim (.py preferred, else .exe)."""
    ensure_dirs()
    env = os.environ.copy()
    cwd = str(AUTOMATE_DIR)

    if DOWNLOAD_PY.exists():
        cmd = [sys.executable, str(DOWNLOAD_PY)]
    elif DOWNLOAD_EXE.exists():
        cmd = [str(DOWNLOAD_EXE)]
    else:
        raise FileNotFoundError("download_claim.py / download_claim.exe tidak ditemukan di tools/automate-claim-epm")

    if target_date:
        cmd.append(target_date)

    proc = subprocess.run(
        cmd,
        cwd=cwd,
        capture_output=True,
        text=True,
        timeout=300,
        env=env,
    )
    return {
        "cmd": cmd,
        "returncode": proc.returncode,
        "stdout": (proc.stdout or "")[-4000:],
        "stderr": (proc.stderr or "")[-2000:],
        "ok": proc.returncode == 0,
    }


def parse_csv(path: Path) -> list[dict]:
    rows = []
    # EPM CSV often ANSI/Windows; try utf-8-sig then latin-1
    for encoding in ("utf-8-sig", "utf-8", "cp1252", "latin-1"):
        try:
            with path.open("r", encoding=encoding, newline="") as f:
                sample = f.read(4096)
                f.seek(0)
                delimiter = "~" if sample.count("~") > sample.count(",") else ","
                reader = csv.DictReader(f, delimiter=delimiter)
                for raw in reader:
                    row = { (k or "").strip(): (v.strip() if isinstance(v, str) else v) for k, v in raw.items() if k }
                    if not row:
                        continue
                    amounts = {k: to_float(row.get(k)) for k in AMOUNT_FIELDS}
                    row["_amounts"] = amounts
                    row["_totalRp"] = sum(amounts.values())
                    rows.append(row)
            break
        except UnicodeDecodeError:
            rows = []
            continue
    return rows


def parse_trx_date(raw: str):
    """Parse Oracle-style TRX_DATE e.g. 16-JUL-26 → date, else None."""
    s = (raw or "").strip()
    if not s:
        return None
    for fmt in ("%d-%b-%y", "%d-%b-%Y", "%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    return None


def format_trx_date(d) -> str:
    if not d:
        return ""
    return d.strftime("%d-%b-%y").upper()


def build_payload(rows: list[dict], source_file: str) -> dict:
    by_branch: dict[str, dict] = {}
    for r in rows:
        branch = (r.get("BRANCH") or "").strip() or "UNKNOWN"
        code = (r.get("BRANCH_SPC_CODE") or "").strip()
        key = f"{code}|{branch}"
        if key not in by_branch:
            by_branch[key] = {
                "key": key,
                "branchCode": code,
                "branchName": branch,
                "trxCount": 0,
                "totals": {k: 0.0 for k in AMOUNT_FIELDS},
                "totalRp": 0.0,
                "_minDate": None,
                "_maxDate": None,
            }
        b = by_branch[key]
        b["trxCount"] += 1
        for k in AMOUNT_FIELDS:
            b["totals"][k] += r["_amounts"][k]
        b["totalRp"] += r["_totalRp"]
        d = parse_trx_date(r.get("TRX_DATE") or "")
        if d:
            if b["_minDate"] is None or d < b["_minDate"]:
                b["_minDate"] = d
            if b["_maxDate"] is None or d > b["_maxDate"]:
                b["_maxDate"] = d

    summary = sorted(by_branch.values(), key=lambda x: (-x["totalRp"], x["branchName"]))
    for s in summary:
        for k in AMOUNT_FIELDS:
            s["totals"][k] = round(s["totals"][k], 2)
        s["totalRp"] = round(s["totalRp"], 2)
        min_d, max_d = s.pop("_minDate", None), s.pop("_maxDate", None)
        s["trxDateMin"] = format_trx_date(min_d)
        s["trxDateMax"] = format_trx_date(max_d)
        if min_d and max_d and min_d != max_d:
            s["trxDateLabel"] = f"{s['trxDateMin']} s/d {s['trxDateMax']}"
        else:
            s["trxDateLabel"] = s["trxDateMax"] or s["trxDateMin"] or "—"


    # Slim detail rows for UI (avoid huge payload fields)
    detail = []
    for r in rows:
        detail.append({
            "branchCode": (r.get("BRANCH_SPC_CODE") or "").strip(),
            "branchName": (r.get("BRANCH") or "").strip(),
            "custNumber": r.get("CUST_NUMBER") or "",
            "custName": r.get("CUST_NAME") or "",
            "trxNumber": r.get("TRX_NUMBER") or "",
            "trxDate": r.get("TRX_DATE") or "",
            "itemCode": r.get("ITEM_CODE") or "",
            "itemName": r.get("ITEM_NAME") or "",
            "suratReferensi": r.get("SURAT_REFERENSI") or "",
            "amounts": {k: round(r["_amounts"][k], 2) for k in AMOUNT_FIELDS},
            "totalRp": round(r["_totalRp"], 2),
        })

    grand = {k: round(sum(s["totals"][k] for s in summary), 2) for k in AMOUNT_FIELDS}
    return {
        "sourceFile": source_file,
        "fileDate": extract_date_from_name(source_file),
        "rowCount": len(rows),
        "branchCount": len(summary),
        "grandTotals": grand,
        "grandTotalRp": round(sum(grand.values()), 2),
        "summary": summary,
        "detail": detail,
    }


def summary_branch_key(s: dict) -> str:
    return f"{(s.get('branchCode') or '').strip()}|{(s.get('branchName') or '').strip()}"


def snapshot_from_payload(payload: dict) -> dict:
    by_key = {}
    for s in payload.get("summary") or []:
        by_key[summary_branch_key(s)] = float(s.get("totalRp") or 0)
    return {
        "sourceFile": payload.get("sourceFile"),
        "fileDate": payload.get("fileDate"),
        "lastUpdated": datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
        "byKey": by_key,
    }


def promote_latest_to_previous():
    """Sebelum overwrite latest: simpan summary file exec sebelumnya (file vs file)."""
    current = load_json(LATEST_JSON)
    if not current or not current.get("summary"):
        return
    snap = snapshot_from_payload(current)
    ensure_dirs()
    with PREVIOUS_SUMMARY_JSON.open("w", encoding="utf-8") as f:
        json.dump(snap, f, ensure_ascii=False, indent=2)


def enrich_summary_with_previous(summary: list) -> list:
    prev = load_json(PREVIOUS_SUMMARY_JSON) or {}
    by_key = prev.get("byKey") or {}
    for s in summary:
        key = summary_branch_key(s)
        if key not in by_key:
            s["previousTotalRp"] = None
            s["selisihRp"] = None
            s["previousSourceFile"] = prev.get("sourceFile")
            continue
        prev_amt = float(by_key[key])
        cur = float(s.get("totalRp") or 0)
        s["previousTotalRp"] = round(prev_amt, 2)
        s["selisihRp"] = round(cur - prev_amt, 2)
        s["previousSourceFile"] = prev.get("sourceFile")
    return summary


def write_extract(payload: dict) -> dict:
    ensure_dirs()
    # Rotasi: latest lama → previous (file exec sebelumnya)
    promote_latest_to_previous()
    now = datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")
    meta = {
        "lastUpdated": now,
        "sourceFile": payload["sourceFile"],
        "fileDate": payload.get("fileDate"),
        "rowCount": payload["rowCount"],
        "branchCount": payload["branchCount"],
        "grandTotalRp": payload["grandTotalRp"],
    }
    with LATEST_JSON.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    with META_JSON.open("w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    return meta


def extract_latest_csv(path: Path | None = None) -> tuple[dict, dict]:
    files = list_claim_csvs()
    if path is None:
        if not files:
            raise FileNotFoundError(f"Tidak ada CSV LISTING_CLAIM di {FILE_DIR}")
        path = files[0]
    rows = parse_csv(path)
    if not rows:
        raise ValueError(f"CSV kosong / gagal parse: {path.name}")
    payload = build_payload(rows, path.name)
    meta = write_extract(payload)
    return payload, meta


def load_json(path: Path):
    if not path.exists():
        return None
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def cors(handler: BaseHTTPRequestHandler):
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")


def send_json(handler: BaseHTTPRequestHandler, status: int, data):
    body = json.dumps(data, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    cors(handler)
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        sys.stderr.write("[claim-api] " + (fmt % args) + "\n")

    def do_OPTIONS(self):
        self.send_response(204)
        cors(self)
        self.end_headers()

    def do_GET(self):
        try:
            parsed = urlparse(self.path)
            path = parsed.path.rstrip("/") or "/"
            qs = parse_qs(parsed.query)

            if path in ("/", "/api/health"):
                return send_json(self, 200, {"ok": True, "service": "claim-api", "port": PORT})

            if path == "/api/claims/meta":
                meta = load_json(META_JSON)
                if not meta:
                    return send_json(self, 404, {"ok": False, "message": "Belum ada data. Klik Refresh."})
                return send_json(self, 200, {"ok": True, "meta": meta})

            if path == "/api/claims/summary":
                data = load_json(LATEST_JSON)
                meta = load_json(META_JSON)
                if not data:
                    return send_json(self, 404, {"ok": False, "message": "Belum ada data. Klik Refresh."})
                return send_json(self, 200, {
                    "ok": True,
                    "meta": meta,
                    "rowCount": data.get("rowCount"),
                    "branchCount": data.get("branchCount"),
                    "grandTotals": data.get("grandTotals"),
                    "grandTotalRp": data.get("grandTotalRp"),
                    "sourceFile": data.get("sourceFile"),
                    "previousMeta": load_json(PREVIOUS_SUMMARY_JSON),
                    "summary": enrich_summary_with_previous(list(data.get("summary") or [])),
                })

            if path == "/api/claims/detail":
                data = load_json(LATEST_JSON)
                if not data:
                    return send_json(self, 404, {"ok": False, "message": "Belum ada data. Klik Refresh."})
                branch = (qs.get("branch") or [""])[0].strip()
                code = (qs.get("code") or [""])[0].strip()
                q = (qs.get("q") or [""])[0].strip().lower()
                limit = int((qs.get("limit") or ["5000"])[0])
                rows = data.get("detail", [])
                if code:
                    rows = [r for r in rows if r.get("branchCode") == code]
                if branch:
                    rows = [r for r in rows if r.get("branchName") == branch]
                if q:
                    rows = [r for r in rows if q in json.dumps(r, ensure_ascii=False).lower()]
                return send_json(self, 200, {
                    "ok": True,
                    "count": len(rows[:limit]),
                    "totalMatched": len(rows),
                    "detail": rows[:limit],
                })

            if path == "/api/claims/files":
                files = [
                    {
                        "name": p.name,
                        "mtime": datetime.fromtimestamp(p.stat().st_mtime).isoformat(timespec="seconds"),
                        "size": p.stat().st_size,
                        "fileDate": extract_date_from_name(p.name),
                    }
                    for p in list_claim_csvs()
                ]
                return send_json(self, 200, {"ok": True, "files": files})

            return send_json(self, 404, {"ok": False, "message": "Not found"})
        except Exception as e:
            return send_json(self, 500, {"ok": False, "message": str(e), "trace": traceback.format_exc()[-1500:]})

    def do_POST(self):
        try:
            parsed = urlparse(self.path)
            path = parsed.path.rstrip("/")
            length = int(self.headers.get("Content-Length") or 0)
            raw = self.rfile.read(length) if length else b"{}"
            try:
                body = json.loads(raw.decode("utf-8") or "{}")
            except json.JSONDecodeError:
                body = {}

            if path == "/api/claims/refresh":
                # 1) optional download from aries
                skip_download = bool(body.get("skipDownload"))
                target_date = body.get("date")  # yymmdd optional
                download_result = None
                if not skip_download:
                    try:
                        download_result = run_download(target_date)
                    except Exception as e:
                        download_result = {"ok": False, "error": str(e)}

                # 2) always extract latest local CSV (works even if download failed but file exists)
                try:
                    payload, meta = extract_latest_csv()
                except Exception as e:
                    return send_json(self, 500, {
                        "ok": False,
                        "message": f"Extract gagal: {e}",
                        "download": download_result,
                    })

                ok = True
                msg = "Data di-refresh dari CSV lokal"
                if download_result is not None:
                    if download_result.get("ok"):
                        msg = "Download + extract berhasil"
                    else:
                        msg = "Download gagal/terlewat; extract pakai CSV lokal terbaru"
                        # still ok if we have data
                return send_json(self, 200, {
                    "ok": ok,
                    "message": msg,
                    "download": download_result,
                    "meta": meta,
                    "branchCount": payload["branchCount"],
                    "rowCount": payload["rowCount"],
                    "grandTotalRp": payload["grandTotalRp"],
                })

            if path == "/api/claims/extract":
                payload, meta = extract_latest_csv()
                return send_json(self, 200, {
                    "ok": True,
                    "message": "Extract OK",
                    "meta": meta,
                    "rowCount": payload["rowCount"],
                    "branchCount": payload["branchCount"],
                })

            return send_json(self, 404, {"ok": False, "message": "Not found"})
        except Exception as e:
            return send_json(self, 500, {"ok": False, "message": str(e), "trace": traceback.format_exc()[-1500:]})


def main():
    ensure_dirs()
    # Bootstrap extract if CSV exists but JSON belum
    if not LATEST_JSON.exists() and list_claim_csvs():
        print("Bootstrapping extract from existing CSV...")
        extract_latest_csv()
        print(f"Wrote {LATEST_JSON}")

    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Claim API listening on http://{HOST}:{PORT}")
    print(f"Automate dir: {AUTOMATE_DIR}")
    print(f"Data dir:     {DATA_DIR}")
    print("Endpoints: GET /api/health | /api/claims/meta | /api/claims/summary | /api/claims/detail")
    print("           POST /api/claims/refresh | /api/claims/extract")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
