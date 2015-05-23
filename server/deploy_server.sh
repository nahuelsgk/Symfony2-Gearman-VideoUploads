git pull origin develop-queues
rm -rf app/cache/*
php app/console cache:clear
chmod -R 777 app/cache/

