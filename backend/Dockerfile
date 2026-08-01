FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo pdo_mysql zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install dependencies first, separately from source code, so Docker
# can cache this layer — only reinstalls when composer.json/lock change.
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-interaction

COPY . .

RUN composer dump-autoload --optimize

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]