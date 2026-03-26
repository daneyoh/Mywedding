/**
 * 청첩장 이미지 압축 스크립트
 * 사용법: node compress.js
 * 
 * 필요한 패키지 설치 먼저:
 * npm install sharp
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ===== 설정 =====
const INPUT_DIR = './public';        // 원본 이미지 폴더
const OUTPUT_DIR = './public_compressed'; // 압축된 이미지 저장 폴더
const QUALITY = 75;                  // 품질 (0~100, 75 추천)
const MAX_WIDTH = 1200;              // 최대 가로 픽셀 (모바일 청첩장이라 1200이면 충분)
// ================

// 출력 폴더 없으면 생성
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// public 폴더의 jpg 파일만 가져오기
const files = fs.readdirSync(INPUT_DIR).filter(f => 
  /\.(jpg|jpeg|png)$/i.test(f)
);

console.log(`\n🔍 총 ${files.length}개 이미지 발견\n`);

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const inputPath = path.join(INPUT_DIR, file);
  // 출력은 항상 .jpg로 저장
  const outputFile = file.replace(/\.(png|jpeg)$/i, '.jpg');
  const outputPath = path.join(OUTPUT_DIR, outputFile);

  const sizeBefore = fs.statSync(inputPath).size;
  totalBefore += sizeBefore;

  try {
    await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true }) // 최대 너비 제한
      .jpeg({ quality: QUALITY, mozjpeg: true })              // mozjpeg로 더 강력한 압축
      .toFile(outputPath);

    const sizeAfter = fs.statSync(outputPath).size;
    totalAfter += sizeAfter;

    const ratio = Math.round((1 - sizeAfter / sizeBefore) * 100);
    console.log(`✅ ${file.padEnd(20)} ${(sizeBefore/1024).toFixed(0).padStart(6)}KB → ${(sizeAfter/1024).toFixed(0).padStart(5)}KB  (${ratio}% 감소)`);
  } catch (err) {
    console.error(`❌ ${file} 처리 실패:`, err.message);
  }
}

console.log('\n==============================');
console.log(`📦 전체 용량: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB`);
console.log(`🎉 총 ${Math.round((1 - totalAfter/totalBefore) * 100)}% 감소!`);
console.log('==============================');
console.log('\n✨ 압축 완료! public_compressed 폴더 확인하세요.');
console.log('   확인 후 public 폴더에 덮어쓰기 하시면 됩니다.\n');
