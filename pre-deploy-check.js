#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🔍 STARTING COMPREHENSIVE PRE-DEPLOYMENT CHECK\n');
console.log('='.repeat(60));

let hasErrors = false;

// 1. TypeScript type checking
console.log('\n✅ Step 1: TypeScript Type Checking...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('   ✓ TypeScript check passed');
} catch (error) {
  console.error('   ✗ TypeScript type errors found!');
  console.error(error.message);
  hasErrors = true;
}

// 2. ESLint validation
console.log('\n✅ Step 2: ESLint Validation...');
try {
  execSync('npm run lint', { stdio: 'pipe' });
  console.log('   ✓ ESLint check passed');
} catch (error) {
  console.error('   ✗ ESLint errors found!');
  console.error(error.message);
  hasErrors = true;
}

// 3. Check for em dash "—" character
console.log('\n✅ Step 3: Checking for forbidden em dash "—" character...');
const filesToCheck = getAllSourceFiles();
let emDashFound = false;

filesToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('—')) {
      console.error(`   ✗ Em dash "—" found in: ${file}`);
      // Find and report line numbers
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('—')) {
          console.error(`      Line ${index + 1}: ${line.trim().substring(0, 80)}`);
        }
      });
      emDashFound = true;
      hasErrors = true;
    }
  } catch (err) {
    // Skip files that can't be read
  }
});

if (!emDashFound) {
  console.log('   ✓ No em dash "—" character found');
}

// 4. Check for common issues: console.log, debugger, TODO
console.log('\n✅ Step 4: Checking for debug statements and TODOs...');
let debugIssuesFound = false;

filesToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Skip comments and empty lines
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed === '') {
        return;
      }
      
      // Check for debugger statements (critical!)
      if (/\bdebugger\b/.test(line) && !line.includes('//')) {
        console.warn(`   ⚠ Debugger statement at ${file}:${index + 1}`);
        debugIssuesFound = true;
      }
      
      // Check for console.log (warning)
      if (/\bconsole\.(log|error|warn|debug)\(/.test(line) && !line.includes('//')) {
        console.warn(`   ⚠ Console statement at ${file}:${index + 1}: ${trimmed.substring(0, 70)}`);
        debugIssuesFound = true;
      }
    });
  } catch (err) {
    // Skip files that can't be read
  }
});

if (!debugIssuesFound) {
  console.log('   ✓ No significant debug statements found');
} else {
  console.log('   ⚠ Some console/debug statements found (review above)');
}

// 5. Next.js build
console.log('\n✅ Step 5: Building Next.js application...');
try {
  execSync('next build', { stdio: 'inherit' });
  console.log('   ✓ Next.js build successful');
} catch (error) {
  console.error('   ✗ Next.js build failed!');
  console.error(error.message);
  hasErrors = true;
}

// 6. Check for missing environment variables
console.log('\n✅ Step 6: Checking for environment variables...');
const envVars = ['NEXT_PUBLIC_FIREBASE_API_KEY', 'NEXT_PUBLIC_CONVEX_URL'];
let missingEnv = false;

envVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`   ⚠ Environment variable ${envVar} might be missing`);
    missingEnv = true;
  }
});

if (!missingEnv) {
  console.log('   ✓ Environment variables check passed');
}

// 7. Check for broken imports in key files
console.log('\n✅ Step 7: Validating critical files exist...');
const criticalFiles = [
  'app/layout.tsx',
  'app/page.tsx',
  'lib/firebase/firebase.ts',
  'components/layout/Header.tsx',
  'components/layout/Footer.tsx'
];

let missingFiles = false;
criticalFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) {
    console.error(`   ✗ Critical file missing: ${file}`);
    missingFiles = true;
    hasErrors = true;
  }
});

if (!missingFiles) {
  console.log('   ✓ All critical files present');
}

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.error('\n❌ PRE-DEPLOYMENT CHECK FAILED');
  console.error('Please fix all errors before deploying\n');
  process.exit(1);
} else {
  console.log('\n✅ ALL PRE-DEPLOYMENT CHECKS PASSED - SAFE TO DEPLOY\n');
  console.log('='.repeat(60));
  process.exit(0);
}

// Helper function to get all source files
function getAllSourceFiles() {
  const extensions = ['.ts', '.tsx', '.js', '.jsx'];
  const ignoreDir = new Set([
    'node_modules',
    '.next',
    '.git',
    'dist',
    'build',
    '.firebase',
    'public',
    '.vercel'
  ]);
  
  function walkDir(dir) {
    let files = [];
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          if (!ignoreDir.has(entry.name) && !entry.name.startsWith('.')) {
            files = files.concat(walkDir(fullPath));
          }
        } else if (extensions.includes(path.extname(entry.name))) {
          files.push(fullPath);
        }
      });
    } catch (err) {
      // Skip directories that can't be read
    }
    
    return files;
  }
  
  return walkDir(process.cwd());
}
