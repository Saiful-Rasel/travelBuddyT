set -o errexit

pnpm install
npx prisma generate
pnpm run build
npx prisma migrate deploy
