# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:5176)
npm run build      # Production build (with Sentry source maps)
npm run type-check # TypeScript type checking (tsc --noEmit)
npm run lint       # ESLint with auto-fix
npm run format     # Prettier formatting
```

There are no automated tests in this project.

## Environment Variables

Required in `.env`:
```
VITE_JSON_SERVER_URL=         # Backend API base URL
VITE_APP_GOOGLE_CLIENT_ID=    # Google OAuth client ID
VITE_APP_BUCKET_NAME=         # AWS S3 bucket for media
VITE_APP_AWS_REGION=          # AWS region
VITE_APP_ACCESS_KEY_ID=       # AWS access key
VITE_APP_SECRET_ACCESS_KEY=   # AWS secret key
VITE_APP_SENTRY=              # Sentry DSN (optional)
```

## Architecture

This is a **React Admin** (`react-admin` v4) frontend for the Faithfishart e-commerce platform. It connects to a JSON Server-compatible REST API at `VITE_JSON_SERVER_URL`.

### Authentication

Google OAuth via `@react-oauth/google`. On login, the raw Google JWT credential is stored in `localStorage` under the key `auth` and sent as a `Bearer` token on every API request. The `dataProvider` listens for 401/network errors and clears `auth`, triggering a re-render to the login page via a `storage` event.

### Data Provider (`src/dataProvider.ts`)

Extends `ra-data-json-server` with custom methods:
- `getList` — custom pagination/sorting query params (`sort`, `order`, `page`, `limit`)
- `multiCreate` / `multiUpdate` / `multiDelete` — bulk operations via POST/PUT/DELETE to a resource URL with `{ items: [...] }`
- `updateItem` — PUT to `/:id` with full data body
- `publishToSocialMedia` — POST to `api/v1/socialmedia/admin/publish`

### Resource → API mapping

| Resource name in `<Resource>` | API endpoint prefix |
|---|---|
| Items | `api/v1/item/admin` |
| Pages | `api/v1/page/admin` |
| Orders | `api/v1/order/admin` |
| Social Media | `api/v1/socialmedia/admin` |
| Users | `api/v1/user/admin` |
| Countries | `api/v1/country/admin` |
| Shipping Profiles | `api/v1/shippingprofile/admin` |
| Shipping Rates | `api/v1/shippingrate/admin` |
| Reviews | `api/v1/review/admin` |
| Financial Details | `api/v1/financialdetails/admin` |
| Tags | `api/v1/tag/admin/items` (bulk ops only) |
| Media | `api/v1/media/admin/items` (bulk ops only) |

### Item save flow (`src/items/HandleSubmit.tsx`)

Items have a complex save flow that coordinates three separate concerns:
1. Upsert the item record itself
2. Bulk create/update/delete tags via `api/v1/tag/admin/items`
3. Upload/delete files to S3 directly from the browser, then bulk create/update/delete media records via `api/v1/media/admin/items`

S3 uploads happen via `@aws-sdk/client-s3` directly from the browser (`src/clients/storage.tsx`, `src/clients/s3Client.ts`). Image files are validated to be ≤ 15 MB before upload.

### Media paths

Media `src` values are stored as S3 keys in the format `items/{item_id}/{filename}.{ext}`. When updating existing media, the key is re-extracted by splitting on `items` and stripping query strings.

### Adding a new resource

1. Create a directory under `src/` with `List`, `Edit`, `Create`, and `index.ts` files following the pattern of existing resources (e.g., `src/pages/`).
2. The `*EditDetails` component holds all form fields, shared between Edit and Create via a `SimpleForm`.
3. Register in `src/App.tsx` with `<Resource name="api/v1/yourresource/admin" {...yourModule} />`.

### Code style

- Prettier: single quotes, no semicolons, 4-space indent, trailing commas
- All shared types in `src/types.ts`
- `src/utils.tsx` contains `slugify`, `validatePositive`, `getFileExtension`, `getMimeType`
- Rich text editor (`ra-input-rich-text`) is lazy-loaded where used
