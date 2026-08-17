# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm/Turbo TypeScript monorepo. Runtime NestJS services live in `apps/*`:
`ai`, `api-gateway`, `assets`, `iam`, and `knowledge-base`. Service code is under each
app's `src/`, grouped by feature, for example `apps/iam/src/auth` and
`apps/knowledge-base/src/storage`.

Shared packages live in `packages/*`: `common` for backend utilities, `rpc-protos` for
RPC/protobuf code and `proto/` files, and shared ESLint/TypeScript configuration packages.
Generated build output goes to `dist/`; do not edit it directly.

## Build, Test, and Development Commands

- `pnpm install` installs workspace dependencies using `pnpm-lock.yaml`.
- `pnpm dev` runs Turbo development tasks for packages that define `dev`.
- `pnpm build` runs `turbo run build` across the workspace.
- `pnpm lint` runs workspace lint tasks; package scripts use ESLint with autofix.
- `pnpm check-types` runs configured type-check tasks through Turbo.
- `pnpm format` formats TypeScript, TSX, and Markdown with Prettier.
- `pnpm --filter ./apps/iam test` runs Jest for one app; replace the path as needed.
- `pnpm --filter ./apps/knowledge-base test:cov` runs coverage for one app.

## Coding Style & Naming Conventions

Use TypeScript ES modules and NestJS conventions. Keep modules, controllers, services,
DTOs, entities, and providers in domain folders. Follow existing filename patterns:
`auth.service.ts`, `storage.module.ts`, `register.dto.ts`, `chunk.entity.ts`.

Prettier uses 4-space indentation, single quotes, semicolons, 100-character print width,
ES5 trailing commas, and always-parenthesized arrow parameters. ESLint extends
`@cntx/eslint-config` and TypeScript checked rules; avoid new `any` unless justified.

## Testing Guidelines

Services and `packages/common` are configured for Jest with `ts-jest`, Node environment,
and `*.spec.ts` files under `src/`. Current tests are sparse, so new features should add
unit tests beside the code they cover, for example `auth.service.spec.ts`. Use `test:cov`
before larger changes. Mock PostgreSQL, RabbitMQ, MinIO, Google AI, Cohere, and other
external systems.

## Commit & Pull Request Guidelines

Recent history uses short Conventional Commit-style messages, including
`feat:add ai service` and `feat(knowledgeBase):add process uploaded files module`. Prefer
`type(scope): summary`, for example `fix(iam): validate login payload`.

Pull requests should describe the change, list affected apps/packages, include test/lint
results, link issues, and call out required environment or migration changes.

## Security & Configuration Tips

Keep secrets out of git. Local service configuration uses app-level `.env.development`
files; document new required keys in the relevant app README or PR description.
