import * as Babel from '@babel/standalone';

/**
 * The Virtual Bundler
 * 
 * Responsibilities:
 * 1. Transpile JSX/ES6 to ES5/ESM using Babel.
 * 2. Resolve imports:
 *    - Relative imports ('./utils') -> Blob URLs of other virtual files.
 *    - External imports ('react', 'framer-motion') -> CDN URLs (esm.sh).
 * 3. Create Blob URLs for each file to allow the browser to import them.
 */

export const bundle = async (files) => {
    const blobs = {}; // Map of filename -> Blob URL

    // 1. Pre-process: Create a map of all available files
    const fileMap = new Map(Object.entries(files));

    // 2. Transpile and Resolve
    // We process files to rewrite their import statements.
    // This is a simplified bundler. A real one would build a dependency graph.
    // Here we assume a flat structure or simple relative paths for the MVP.

    const processedFiles = {};

    for (const [filename, content] of Object.entries(files)) {
        if (filename.endsWith('.css')) {
            // Handle CSS: Inject into head
            const css = content;
            const blob = new Blob([css], { type: 'text/css' });
            blobs[filename] = URL.createObjectURL(blob);
            // We'll need a way to inject this, or we can wrap it in JS
            processedFiles[filename] = `
        const style = document.createElement('style');
        style.textContent = \`${css}\`;
        document.head.appendChild(style);
      `;
            continue;
        }

        if (!filename.endsWith('.js') && !filename.endsWith('.jsx')) {
            continue;
        }

        try {
            // Transpile with Babel
            const { code } = Babel.transform(content, {
                presets: ['react', 'env'],
                filename: filename,
            });

            processedFiles[filename] = code;
        } catch (err) {
            console.error(`Error transpiling ${filename}:`, err);
            processedFiles[filename] = `console.error("Transpile error in ${filename}: ${err.message}");`;
        }
    }

    // 3. Link (Rewrite Imports)
    // Now that we have transpiled code, we need to rewrite 'import ... from ...'
    // We use a regex for the MVP. A robust solution would use Babel AST.

    const linkedFiles = {};

    for (const [filename, code] of Object.entries(processedFiles)) {
        // Regex to find import sources: import ... from "SOURCE"
        // This captures: import ... from '...' or "..."
        const importRegex = /from\s+['"]([^'"]+)['"]/g;

        const linkedCode = code.replace(importRegex, (match, importPath) => {
            // 3a. Handle External Imports (Dependencies)
            if (!importPath.startsWith('.')) {
                // It's a package (e.g., 'react', 'lodash')
                // Use esm.sh for CDN
                // Special case for React to ensure we use the same version as the runtime if needed,
                // but for a pure ESM approach, loading from CDN is cleaner.
                return `from "https://esm.sh/${importPath}"`;
            }

            // 3b. Handle Internal Imports (Relative)
            // Resolve path: ./Button -> src/Button.jsx
            // This is tricky without a full path resolver.
            // MVP Assumption: Flat structure or exact match.

            // Simple resolver:
            // If we are in 'src/App.jsx' and import './Button', we look for 'src/Button.jsx' or 'src/Button.js'

            // Normalize path (very basic)
            let targetPath = importPath;
            if (targetPath.startsWith('./')) targetPath = targetPath.slice(2);

            // Try to find the file in our fileMap
            // We might need to prepend the current directory if we had folders.
            // For now, let's assume all files are in the root of the VFS for simplicity, 
            // or we do a simple lookup.

            let foundFile = Object.keys(files).find(f => {
                // Check exact match
                if (f === targetPath) return true;
                // Check with extensions
                if (f === targetPath + '.jsx') return true;
                if (f === targetPath + '.js') return true;
                // Check if it was a full path match relative to root (naive)
                return f.endsWith(targetPath) || f.endsWith(targetPath + '.jsx');
            });

            if (foundFile && blobs[foundFile]) {
                return `from "${blobs[foundFile]}"`;
            }

            // If not found yet, we can't link it. 
            // But wait! We haven't created blobs for the JS files yet because we are editing the code.
            // We need a 2-pass system or lazy resolution.

            // Better approach for MVP:
            // We can't rewrite to Blob URL *before* the Blob exists.
            // But we can't create the Blob *before* we rewrite the code (circular dependency if A imports B and B imports A).

            // Solution: ES Modules support circular dependencies naturally if we use URLs.
            // We need to generate the Blob URLs *first* as placeholders? No, the content changes.

            // Actually, we can use a Service Worker to intercept requests, but that's too complex.
            // For MVP: We will assume NO circular dependencies or we use a specific order? 
            // No, standard bundlers use a registry.

            // Let's use the "Blob URL Map" approach.
            // We assign a Blob URL to every file *before* we put content in it? No, Blob is immutable.

            // OK, simplified approach for MVP:
            // 1. Rewrite imports to use a custom protocol or just keep them relative?
            // Browser can't resolve relative imports in Blob URLs easily without a base.

            // Let's try to resolve to the *filename* and then we will create a "Module Loader" 
            // that uses `URL.createObjectURL` at the end.

            return match; // Placeholder, we will fix this logic below.
        });

        linkedFiles[filename] = linkedCode;
    }

    // REVISED STRATEGY:
    // We will use Babel to transform imports to absolute CDN URLs for externals.
    // For internals, we will bundle everything into a SINGLE file (like Webpack) for the MVP.
    // This avoids the complex Blob URL linking problem for now.

    // ... Wait, the user wants "Many file code folders".
    // Single bundle is easier.

    // Let's build a "Simple Packer":
    // Concatenate all modules into a string, wrapped in a module registry.
    // Use a tiny runtime loader.

    const modules = [];
    let entryPoint = null;

    for (const [filename, content] of Object.entries(files)) {
        if (filename.endsWith('.css')) {
            modules.push({
                name: filename,
                code: `
             const style = document.createElement('style');
             style.textContent = ${JSON.stringify(content)};
             document.head.appendChild(style);
             module.exports = {};
           `
            });
            continue;
        }

        // Skip non-code files (.env, .html, .json, .md, .txt, etc.)
        // Only process JavaScript and JSX files
        if (!filename.endsWith('.js') && !filename.endsWith('.jsx')) {
            continue;
        }

        // Transpile to CJS (CommonJS)
        // We remove 'env' preset to rely on native browser support for ES6+ (const, async, etc.)
        // This reduces the chance of Babel injecting conflicting helpers.
        const { code } = Babel.transform(content, {
            presets: ['react'],
            filename: filename,
            plugins: ['transform-modules-commonjs']
        });

        modules.push({
            name: filename,
            code: code
        });

        if (filename === 'src/index.jsx' || filename === 'src/App.jsx' || filename === 'App.jsx') {
            entryPoint = filename;
        }
    }

    if (!entryPoint && modules.length > 0) entryPoint = modules[0].name;

    // Extract dependencies (simple regex for MVP)
    const dependencies = new Set();
    const importRegex = /import\s+(?:[\w\s{},*]+from\s+)?['"]([^'"]+)['"]/g;
    const requireRegex = /require\(['"]([^'"]+)['"]\)/g;

    for (const content of Object.values(files)) {
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            const dep = match[1];
            if (!dep.startsWith('.') && !dep.startsWith('/') && dep !== 'react' && dep !== 'react-dom') {
                dependencies.add(dep);
            }
        }
        while ((match = requireRegex.exec(content)) !== null) {
            const dep = match[1];
            if (!dep.startsWith('.') && !dep.startsWith('/') && dep !== 'react' && dep !== 'react-dom') {
                dependencies.add(dep);
            }
        }
    }

    // Create a map of filename -> code string
    const modulesMap = {};
    modules.forEach(m => {
        modulesMap[m.name] = m.code;
    });

    // Create the bundle string
    // We use JSON.stringify to safely serialize the code strings, avoiding all escaping issues.
    const bundleCode = `
    const modulesSource = ${JSON.stringify(modulesMap)};
    const modules = {};
    
    // Compile functions
    for (const [name, code] of Object.entries(modulesSource)) {
        modules[name] = new Function('module', 'exports', 'require', code);
    }

    const require = (moduleName) => {
      // 1. External Dependencies (Pre-loaded)
      if (moduleName === 'react') return window.React;
      if (moduleName === 'react-dom') return window.ReactDOM;
      if (externalModules && externalModules[moduleName]) return externalModules[moduleName];
      
      // 2. Internal File Resolution
      let resolvedName = moduleName;
      if (moduleName.startsWith('./')) resolvedName = moduleName.slice(2);
      
      const key = Object.keys(modules).find(k => 
          k === resolvedName || 
          k.endsWith('/' + resolvedName) || 
          k === resolvedName + '.jsx' || 
          k === resolvedName + '.js' ||
          k.endsWith('/' + resolvedName + '.jsx') || 
          k.endsWith('/' + resolvedName + '.js')
      );
      
      if (!key) throw new Error(\`Cannot find module '\${moduleName}'\`);
      
      const module = { exports: {} };
      modules[key](module, module.exports, require);
      return module.exports;
    };

    // Start the app
    require('${entryPoint}');
  `;

    return { code: bundleCode, dependencies: Array.from(dependencies) };
};
