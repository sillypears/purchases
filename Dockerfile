FROM node:24-alpine

# Install Python + build tools + MariaDB client dev libs
RUN apk add --no-cache \
    python3 \
    py3-pip \
    python3-dev \
    build-base \
    mariadb-connector-c-dev \
    musl-dev

WORKDIR /app

# Copy Python requirements
COPY requirements.txt .

# Install into a virtualenv to avoid PEP 668 errors
RUN python3 -m venv /app/venv \
    && . /app/venv/bin/activate \
    && pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy Node package files
COPY package*.json ./

RUN npm install

COPY . .

COPY .env .

EXPOSE 3003

CMD ["npm", "start"]

