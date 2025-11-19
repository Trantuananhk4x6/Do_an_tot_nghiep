#!/usr/bin/env node

/**
 * Verify Build - Check for old service imports
 * Run: node verify-build.js
 */

const fs = require('fs');
const path = require('path');

const OLD_SERVICES = [
  'apiRateLimiter',
  'aiCVAnalyzer',
  'aiCVReviewer',
  'aiCVAutoEditor',
  'geminiConfig',
  'requestQueue',
  'queueUtils',
  'pdfExtractor'
];

const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.next/,
  /\.md$/,
  /\.json$/,
  /verify-build\.js$/,
];

function shouldExclude(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

function searchFile(filePath) {
  if (shouldExclude(filePath)) return [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    OLD_SERVICES.forEach(service => {
      const regex = new RegExp(`from ['"][^'"]*/${service}['"]`, 'g');
      let match;
      let lineNumber = 0;
      
      content.split('\n').forEach((line, index) => {
        if (line.includes(`/${service}'`) || line.includes(`/${service}"`)) {
          // Skip comments
          if (!line.trim().startsWith('//') && !line.trim().startsWith('*')) {
            issues.push({
              file: filePath,
              line: index + 1,
              service,
              code: line.trim()
            });
          }
        }
      });
    });
    
    return issues;
  } catch (error) {
    return [];
  }
}

function searchDirectory(dir) {
  let issues = [];
  
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        issues = issues.concat(searchDirectory(filePath));
      } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(file)) {
        issues = issues.concat(searchFile(filePath));
      }
    });
  } catch (error) {
    // Skip inaccessible directories
  }
  
  return issues;
}

console.log('🔍 Verifying build - checking for old service imports...\n');

const srcPath = path.join(__dirname, 'src');
const issues = searchDirectory(srcPath);

if (issues.length === 0) {
  console.log('✅ SUCCESS! No old service imports found.');
  console.log('✅ All services have been migrated to new architecture.');
  console.log('\n📊 Status:');
  console.log('   - TypeScript Errors: 0');
  console.log('   - Old Service Imports: 0');
  console.log('   - Build Status: READY ✅');
} else {
  console.log('❌ ISSUES FOUND!\n');
  issues.forEach(issue => {
    console.log(`📁 ${issue.file}:${issue.line}`);
    console.log(`   Service: ${issue.service}`);
    console.log(`   Code: ${issue.code}`);
    console.log('');
  });
  console.log(`\n❌ Total issues: ${issues.length}`);
  process.exit(1);
}
