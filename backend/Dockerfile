FROM node:18-alpine

WORKDIR /app

# 1️⃣ Copy only dependency files
COPY package*.json ./

# 2️⃣ Install deps (cached unless package.json changes)
RUN npm install

# 3️⃣ Copy rest of code
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
