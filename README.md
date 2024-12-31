# Redis using docker
docker run --name my-redis -d -p 6379:6379 redis:latest

# install packages
npm install

# Run dev mode
npm run dev

# Run like production
npm run build
npm run start

# Home page
http://localhost
or
http://127.0.0.1
here listing users

# User availability
http://localhost/user/availability/user_id
or
http://127.0.0.1/user/availability/user_id