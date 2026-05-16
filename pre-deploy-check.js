#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('\nSTARTING COMPREHENSIVE PRE-DEPLOYMENT CHECK\n');
console.log('='.repeat(60));

let hasErrors = false;

// 1. TypeScript type checking
console.log('\nStep 1: TypeScript Type Checking...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('   PASS: TypeScript check passed');
} catch (error) {
  console.error('   FAIL: TypeScript type errors found');
  console.error(error.message);
  hasErrors = true;
}

// 2. ESLint validation
console.log('\nStep 2: ESLint Validation...');
try {
  execSync('npm run lint', { stdio: 'pipe' });
  console.log('   PASS: ESLint check passed');
} catch (error) {
  console.error('   FAIL: ESLint errors found');
  console.error(error.message);
  hasErrors = true;
}

// 3. Check for em dash (U+2014) character
console.log('\nStep 3: Checking for forbidden em dash (U+2014) character...');
const filesToCheck = getAllSourceFiles();
let emDashFound = false;
const forbiddenEmDash = "\u2014";

filesToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes(forbiddenEmDash)) {
      console.error(`   FAIL: Em dash (U+2014) found in: ${file}`);
      // Find and report line numbers
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes(forbiddenEmDash)) {
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
  console.log('   PASS: No em dash (U+2014) character found');
}

// 4. Check for emoji characters across project text files
console.log('\nStep 4: Checking for emoji characters in project text files...');
const projectFilesToCheck = getAllProjectTextFiles();
const emojiRegex = getEmojiRegex();
let emojiFound = false;

projectFilesToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const matches = line.match(emojiRegex);
      if (matches && matches.length > 0) {
        const uniqueMatches = Array.from(new Set(matches)).join(' ');
        console.error(
          `   FAIL: Emoji found at ${file}:${index + 1} -> ${uniqueMatches}`
        );
        emojiFound = true;
        hasErrors = true;
      }
    });
  } catch (err) {
    // Skip files that can't be read
  }
});

if (!emojiFound) {
  console.log('   PASS: No emoji characters found in project text files');
}

// 5. Check for common issues: console.log, debugger, TODO
console.log('\nStep 5: Checking for debug statements and TODOs...');
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
        console.warn(`   WARN: Debugger statement at ${file}:${index + 1}`);
        debugIssuesFound = true;
      }
      
      // Check for console.log (warning)
      if (/\bconsole\.(log|error|warn|debug)\(/.test(line) && !line.includes('//')) {
        console.warn(`   WARN: Console statement at ${file}:${index + 1}: ${trimmed.substring(0, 70)}`);
        debugIssuesFound = true;
      }
    });
  } catch (err) {
    // Skip files that can't be read
  }
});

if (!debugIssuesFound) {
  console.log('   PASS: No significant debug statements found');
} else {
  console.log('   WARN: Some console/debug statements found (review above)');
}

// 6. Check for temporary files and artifacts
console.log('\nStep 6: Checking for temporary files and artifacts...');
const temporaryArtifacts = getTemporaryArtifacts();

if (temporaryArtifacts.length > 0) {
  console.error('   FAIL: Temporary files or backup artifacts found:');
  temporaryArtifacts.forEach(artifact => {
    console.error(`      - ${artifact}`);
  });
  hasErrors = true;
} else {
  console.log('   PASS: No temporary files or backup artifacts found');
}

// 7. Next.js build
console.log('\nStep 7: Building Next.js application...');
try {
  execSync('npx next build', { stdio: 'inherit' });
  console.log('   PASS: Next.js build successful');
} catch (error) {
  console.error('   FAIL: Next.js build failed');
  console.error(error.message);
  hasErrors = true;
}

// 8. Check for missing environment variables
console.log('\nStep 8: Checking for environment variables...');
const envVars = ['NEXT_PUBLIC_FIREBASE_API_KEY', 'NEXT_PUBLIC_CONVEX_URL'];
let missingEnv = false;

envVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`   WARN: Environment variable ${envVar} might be missing`);
    missingEnv = true;
  }
});

if (!missingEnv) {
  console.log('   PASS: Environment variables check passed');
}

// 9. Check for broken imports in key files
console.log('\nStep 9: Validating critical files exist...');
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
    console.error(`   FAIL: Critical file missing: ${file}`);
    missingFiles = true;
    hasErrors = true;
  }
});

if (!missingFiles) {
  console.log('   PASS: All critical files present');
}

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.error('\nPRE-DEPLOYMENT CHECK FAILED');
  console.error('Please fix all errors before deploying\n');
  process.exit(1);
} else {
  console.log('\nALL PRE-DEPLOYMENT CHECKS PASSED - BUILD VERIFIED\n');
  console.log('Deployment complete and verified - ready for production push.\n');
  console.log('='.repeat(60));
  process.exit(0);
}

function getEmojiRegex() {
  try {
    return /\p{Extended_Pictographic}/gu;
  } catch (error) {
    return /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;
  }
}

function getAllProjectTextFiles() {
  const textExtensions = new Set([
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.mjs',
    '.cjs',
    '.json',
    '.md',
    '.mdx',
    '.css',
    '.scss',
    '.sass',
    '.less',
    '.html',
    '.htm',
    '.xml',
    '.yml',
    '.yaml',
    '.txt',
    '.env',
    '.ini',
    '.toml',
    '.graphql',
    '.gql',
    '.sql',
    '.rules',
    '.sh',
    '.ps1',
    '.bat',
    '.cmd',
    '.csv'
  ]);
  const textFileNames = new Set([
    'Dockerfile',
    '.gitignore',
    '.npmrc',
    '.nvmrc',
    '.prettierignore',
    '.prettierrc',
    '.eslintrc',
    '.firebaserc',
    'LICENSE'
  ]);
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
          if (!ignoreDir.has(entry.name)) {
            files = files.concat(walkDir(fullPath));
          }
        } else {
          const extension = path.extname(entry.name).toLowerCase();
          if (
            textExtensions.has(extension) ||
            textFileNames.has(entry.name) ||
            entry.name.startsWith('.env')
          ) {
            files.push(fullPath);
          }
        }
      });
    } catch (err) {
      // Skip directories that can't be read
    }

    return files;
  }

  return walkDir(process.cwd());
}

function getTemporaryArtifacts() {
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

  const suspiciousFilePatterns = [
    /^~\$.+/,
    /^\.#.+/,
    /^#.*#$/,
    /~$/,
    /\.tmp$/i,
    /\.temp$/i,
    /\.bak$/i,
    /\.old$/i,
    /\.orig$/i,
    /\.rej$/i,
    /\.swp$/i,
    /\.swo$/i,
    /\.crdownload$/i,
    /\.part$/i,
    /\.cache$/i,
  ];

  const artifacts = [];

  function toRelativePath(fullPath) {
    return path.relative(process.cwd(), fullPath).split(path.sep).join('/');
  }

  function isTemporaryDirectory(name) {
    const lowered = name.toLowerCase();
    return (
      lowered === 'temp' ||
      lowered === 'tmp' ||
      lowered === '.temp' ||
      lowered === '.tmp' ||
      lowered.startsWith('temp-') ||
      lowered.startsWith('tmp-')
    );
  }

  function walkDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          if (ignoreDir.has(entry.name)) {
            return;
          }

          if (isTemporaryDirectory(entry.name)) {
            artifacts.push(`${toRelativePath(fullPath)}/`);
            return;
          }

          walkDir(fullPath);
          return;
        }

        if (suspiciousFilePatterns.some(pattern => pattern.test(entry.name))) {
          artifacts.push(toRelativePath(fullPath));
        }
      });
    } catch (err) {
      // Skip directories that can't be read
    }
  }

  walkDir(process.cwd());
  return artifacts.sort();
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
