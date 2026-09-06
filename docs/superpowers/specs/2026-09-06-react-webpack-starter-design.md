# React Webpack Starter Design

## Goal

Create a minimal React project without Create React App. The project uses TypeScript, Yarn Classic, Webpack, SCSS-based CSS Modules, and `classnames/bind`.

## Scope

The initial application renders only a small starter screen with a heading and short description. The project includes the configuration required for development, type checking, and production builds, but no routing, state library, test framework, or application-specific features.

## Toolchain

- React and React DOM provide the UI runtime.
- Webpack 5 bundles the application from `src/index.tsx` into `dist/`.
- Babel transpiles TypeScript and JSX with `@babel/preset-env`, `@babel/preset-react`, and `@babel/preset-typescript`.
- TypeScript performs static type checking separately with `tsc --noEmit`.
- `webpack-dev-server` serves the development build and supports browser history fallback.
- `HtmlWebpackPlugin` creates the output HTML from `public/index.html`.
- `MiniCssExtractPlugin` extracts styles into a CSS file for production builds.

## Styling

Webpack has separate SCSS rules so module and global styles cannot be confused.

- Files matching `*.module.scss` use `css-loader` with CSS Modules enabled, followed by `sass-loader`.
- Other `*.scss` files use `css-loader` without CSS Modules, followed by `sass-loader`.
- Development injects both kinds of styles through `style-loader` for immediate updates.
- Production extracts both kinds of styles through `MiniCssExtractPlugin.loader`.
- Module class names are readable in development and content-hashed in production.
- A TypeScript declaration allows imports of `*.module.scss` files.
- React components bind imported module classes with `classnames/bind`.

## Project Structure

```text
.
├── public/
│   └── index.html
├── src/
│   ├── App.module.scss
│   ├── App.tsx
│   ├── global.scss
│   ├── index.tsx
│   └── styles.d.ts
├── .babelrc.json
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
└── webpack.config.cjs
```

## Build Behavior

The development configuration uses source maps, `style-loader`, and the Webpack development server. The production configuration enables Webpack optimizations, extracts CSS with content hashes, cleans `dist/` before emitting, and uses content-hashed JavaScript filenames. Source code is resolved from `.ts`, `.tsx`, and `.js` imports.

## Commands

- `yarn start` starts the development server.
- `yarn build` produces a production bundle in `dist/`.
- `yarn typecheck` runs TypeScript without emitting files.
- `yarn check` runs type checking followed by the production build.

## Error Handling

Webpack surfaces module, loader, and Sass compilation failures during development and exits with a nonzero status in production. Type errors are reported by the dedicated type-check command because Babel deliberately transpiles without checking types.

## Verification

After dependencies are installed with Yarn Classic:

1. Run `yarn typecheck` and confirm that TypeScript reports no errors.
2. Run `yarn build` and confirm that Webpack emits HTML, JavaScript, and extracted CSS into `dist/`.
3. Inspect the generated assets to confirm that module styles and global styles are both included.

