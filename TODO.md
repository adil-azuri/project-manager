# API Fix Plan - Make API Run Smoothly on Vercel

## Steps:

- [x] Update vercel.json to route /api/\* to the serverless handler (/api/dist/index.js).
- [ ] Test the updated configuration locally if possible, or push to Vercel for redeploy.
- [ ] Verify API endpoints (e.g., /api/users) return data instead of 404.
- [ ] Check frontend API calls (login/register) work without errors.
- [ ] If issues persist, configure Vercel env vars (CORS_ORIGIN, DATABASE_URL, etc.).

## Information Gathered:

- Mono-repo with Next.js frontend and Express API.
- Issue: 404 on API routes due to incorrect routing in vercel.json.
- API builds to /api/dist/index.js using tsc.

## Dependent Files:

- None.

## Followup:

- After push to GitHub/Vercel, test the deployed site.
