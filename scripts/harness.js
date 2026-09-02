#!/usr/bin/env node
/**
 * DUSTGUARD VN — AGY ENGINEERING HARNESS CLI
 * Unified command orchestrator for AI-assisted development and automated quality gates.
 * 
 * Usage:
 *   node scripts/harness.js <command> [args]
 * 
 * Commands:
 *   audit          - Inspect current codebase map, routes, and D1 database state.
 *   spec           - Inspect and validate feature specs in specs/.
 *   implement      - Guidance and dependency graph for vertical slice execution.
 *   verify         - Run fast multi-level verification pipeline (< 7s).
 *   fix            - Run autonomous root-cause repair helper.
 *   review         - Perform Human-Centric, UI/UX, and architectural diff review.
 *   journey <role> - Execute full end-to-end browser + D1 journey (staff/citizen/contractor).
 *   release-check  - Execute complete production release verification suite.
 */

import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const appDir = path.resolve(rootDir, 'app');

const command = process.argv[2] || 'help';
const arg = process.argv[3] || '';

// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const red = '\x1b[31m';
const bold = '\x1b[1m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

function banner(title) {
  console.log(`\n${bold}${cyan}🛡️  DUSTGUARD HARNESS — ${title}${reset}`);
  console.log(`${dim}────────────────────────────────────────────────────────────${reset}`);
}

function runCmd(cmd, cwd = rootDir) {
  console.log(`${dim}> ${cmd}${reset}`);
  return execSync(cmd, { cwd, stdio: 'inherit', env: process.env });
}

switch (command.toLowerCase()) {
  case 'audit': {
    banner('CURRENT SYSTEM AUDIT (Phase 0)');
    console.log(`${bold}1. Database SSoT Check:${reset}`);
    const dbPath = path.resolve(appDir, 'prisma/dev.db');
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      console.log(`  ${green}✓${reset} D1 SQLite Database exists: ${dbPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    } else {
      console.log(`  ${red}✗ D1 SQLite Database not found at ${dbPath}!${reset}`);
    }

    console.log(`\n${bold}2. Core System Map:${reset}`);
    const mapPath = path.resolve(rootDir, 'docs/engineering/current-system-map.md');
    if (fs.existsSync(mapPath)) {
      console.log(`  ${green}✓${reset} System map available at: ${mapPath}`);
    } else {
      console.log(`  ${yellow}! System map not created yet.${reset}`);
    }

    console.log(`\n${bold}3. Git Working Tree Status:${reset}`);
    try {
      execSync('git status --short', { stdio: 'inherit' });
    } catch {}
    break;
  }

  case 'spec': {
    banner('FEATURE SPEC SYSTEM (Phase 5)');
    const specsDir = path.resolve(rootDir, 'specs');
    if (fs.existsSync(specsDir)) {
      const roles = ['staff', 'citizen', 'contractor', 'admin', 'executive', 'shared'];
      for (const r of roles) {
        const rDir = path.resolve(specsDir, r);
        const count = fs.existsSync(rDir) ? fs.readdirSync(rDir).length : 0;
        console.log(`  ${green}•${reset} specs/${r.padEnd(12)}: ${count} spec(s) defined`);
      }
    } else {
      console.log(`  ${red}✗ specs/ directory does not exist.${reset}`);
    }
    break;
  }

  case 'implement': {
    banner('VERTICAL SLICE IMPLEMENTATION (Stage 2)');
    console.log(`
${bold}Quy tắc triển khai lát cắt tối thiểu (Minimum Working Set):${reset}
1. Đọc code hiện có trước khi sửa (Read before editing).
2. Tái sử dụng tối đa component trong ${cyan}app/src/shared/components/${reset} và ${cyan}packages/ui${reset}.
3. Mutation phải nối trực tiếp vào Cloudflare D1 SQLite (${dim}prisma/dev.db${reset}).
4. Chạy kiểm thử mục tiêu ngay sau khi sửa:
   ${yellow}node --test app/tests/<file>.test.js${reset} (< 0.5s)
    `);
    break;
  }

  case 'verify': {
    banner('QUICK QUALITY GATE (< 7s)');
    try {
      runCmd('npm --prefix app run verify:quick');
      console.log(`\n${green}${bold}✓ TẤT CẢ TEST TRONG QUICK GATE ĐÃ ĐẠT!${reset}`);
    } catch (err) {
      console.error(`\n${red}${bold}✗ QUICK GATE THẤT BẠI! Vui lòng sửa lỗi trước khi commit.${reset}`);
      process.exit(1);
    }
    break;
  }

  case 'fix': {
    banner('AUTONOMOUS ROOT CAUSE FIX LOOP');
    console.log(`
${bold}Vòng lặp sửa lỗi 7 bước:${reset}
1. ${cyan}REPRODUCE${reset}     - Tái hiện chính xác lỗi qua test đơn lẻ hoặc DevTools.
2. ${cyan}ISOLATE${reset}       - Định vị tầng phát sinh: Frontend State / API Router / D1 SQL.
3. ${cyan}ROOT CAUSE${reset}    - Tìm nguyên nhân gốc rễ (không sửa screenshot).
4. ${cyan}SAFE FIX${reset}      - Áp dụng thay đổi tối thiểu, phẫu thuật chính xác.
5. ${cyan}FOCUSED TEST${reset}  - Chạy lại test đơn lẻ: ${yellow}node --test app/tests/<target>.test.js${reset}
6. ${cyan}REAL APP${reset}      - Kiểm chứng trên màn hình thật, console 0 error.
7. ${cyan}REGRESSION${reset}    - Chạy ${yellow}node scripts/harness.js verify${reset}
    `);
    break;
  }

  case 'review': {
    banner('HUMAN-CENTRIC & ARCHITECTURAL REVIEW');
    console.log(`${bold}1. Rà soát git diff phẫu thuật:${reset}`);
    try {
      execSync('git diff --stat', { stdio: 'inherit' });
    } catch {}
    console.log(`\n${bold}2. Kiểm tra 4 câu hỏi định vị vị nhân sinh:${reset}`);
    console.log(`  [ ] Tôi đang ở đâu?`);
    console.log(`  [ ] Việc chính tôi cần làm là gì?`);
    console.log(`  [ ] Trạng thái hiện tại là gì?`);
    console.log(`  [ ] Tôi nên làm gì tiếp theo?`);
    console.log(`  [ ] Nút bấm 1-3 từ, 0% jargon kỹ thuật.`);
    console.log(`  [ ] Touch target >= 44px, không tràn viền ngang trên 375px.`);
    break;
  }

  case 'journey': {
    const role = arg || 'staff';
    banner(`ROLE JOURNEY E2E VERIFICATION: ${role.toUpperCase()}`);
    if (role === 'staff') {
      try {
        runCmd('node --test app/tests/harness-staff-pilot.test.js');
        console.log(`\n${green}${bold}✓ HÀNH TRÌNH TÁC NGHIỆP CÁN BỘ HIỆN TRƯỜNG (STAFF PILOT) ĐẠT 100%!${reset}`);
      } catch (err) {
        console.error(`\n${red}${bold}✗ HÀNH TRÌNH STAFF THẤT BẠI!${reset}`);
        process.exit(1);
      }
    } else {
      console.log(`Hành trình ${role} đang được hỗ trợ qua route crawler.`);
      runCmd('node --test app/tests/playwright-route-crawler.test.js');
    }
    break;
  }

  case 'release-check': {
    banner('FULL RELEASE VERIFICATION GATE');
    runCmd('npm --prefix app run verify');
    break;
  }

  default: {
    banner('LỆNH HỖ TRỢ AGY CLI / HARNESS');
    console.log(`
Cú pháp: node scripts/harness.js <lệnh>

Các lệnh khả dụng:
  ${bold}audit${reset}          - Khảo sát hệ thống, CSDL D1 và trạng thái mã nguồn.
  ${bold}spec${reset}           - Kiểm tra các bản đặc tả trong specs/.
  ${bold}implement${reset}      - Hướng dẫn triển khai lát cắt tối thiểu.
  ${bold}verify${reset}         - Chạy bộ kiểm thử nhanh (< 7s).
  ${bold}fix${reset}            - Hướng dẫn vòng lặp sửa lỗi tận gốc rễ.
  ${bold}review${reset}         - Kiểm toán UI/UX vị nhân sinh và diff trước khi commit.
  ${bold}journey staff${reset}  - Kiểm chứng hành trình cán bộ hiện trường (Staff Pilot E2E).
  ${bold}release-check${reset}  - Chạy toàn bộ kiểm thử trước khi phát hành.
    `);
    break;
  }
}
