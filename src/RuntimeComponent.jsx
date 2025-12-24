import React, { useMemo } from 'react';
import * as Babel from '@babel/standalone';
import * as ReactModule from 'react';

const RuntimeComponent = ({ code }) => {
    const Component = useMemo(() => {
        try {
            // 1. Transpile JSX/ES6 to ES5
            const transpiled = Babel.transform(code, {
                presets: ['react', 'env'],
                filename: 'dynamic.js', // Helps with sourcemaps/debugging
            }).code;

            // 2. Create a function to execute the code
            // We need to provide 'React' and 'exports' to the scope
            const exports = {};
            const require = (moduleName) => {
                if (moduleName === 'react') return ReactModule;
                throw new Error(`Module '${moduleName}' not found in runtime.`);
            };

            // Wrap code in a function that mimics a CommonJS module
            // "exports" will be populated by the code
            const func = new Function('React', 'require', 'exports', transpiled);

            func(ReactModule, require, exports);

            // 3. Return the default export
            return exports.default || (() => <div style={{ color: 'red' }}>No default export found</div>);

        } catch (err) {
            console.error("Runtime Compilation Error:", err);
            return () => (
                <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
                    <h3>Compilation Error</h3>
                    <pre>{err.message}</pre>
                </div>
            );
        }
    }, [code]);

    return <Component />;
};

export default RuntimeComponent;
