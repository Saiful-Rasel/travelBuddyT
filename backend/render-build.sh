set -0 errexit

npm install 
npm rub build
npx prisma generate 
npx prisma migrate deploy