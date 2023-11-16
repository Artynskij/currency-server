http://localhost:3000/rank/updatesall - обновление курсов( GET )
http://localhost:3000/rank/byn - получение курсов белок( GET )
http://localhost:3000/bank/addbase - добавление банков в базу.( GET )

Для обновления:
на локалке (1) на сервере (2)
1. git add. / git commit -m 'something' / git push -u origin main - запушить с локалки на гит. 
2. cd /var/www/html/jsoncur024.by/currency-server
3. git pull - После Запулить на сервере. 
4. npm run start:dev - и сбилдидь заново в папке с проектом. должно обновиться
5. pm2 delete main:prod - удаляем прошлый запуск
<!-- 6. cd dist - заходим в папку с билдом -->
7. .env в dist  
8. sudo pm2 start dist/main.js --name "main:prod" --watch - запускаем приложение



Задачи: 
1. Swagger
2. журнал
3. Добить парсинг банков
4. обезопасить вторым парсингом

