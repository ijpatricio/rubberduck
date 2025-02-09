## Rubber Duck Debugging - with AI

Your rubber duck is a good listener. You can talk to it about your code, line by line.
Provide file contents, in bulk, file trees, give it custom operations, and it will listen to you!


## Installation

```bash
cp .env.example .env
composer install
php artisan key:generate
touch database/database.sqlite
php artisan migrate:fresh --seed
npm install

# Run the development environment
composer dev
```
