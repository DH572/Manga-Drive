# Manga-Drive

Keep track of all the manga you have every read in your life (as well your opinion of them) with this simple tracker.

Use this tracker to search for manga you have read, add them to your list, and edit your rating and review for them. Additionally, you can choose the order you want to display your list and can always delete or add items at any time. The list will be kept in a database on your computer so it will stay saved even if you leave the site.

To get started:

1. Fork a copy of the repository.
2. In the bash terminal direct to this repository and run "npm i" to install all node modules
3. Create a database (recommended to use PostgreSQL)
4. In that database run in Query Tool the query.sql file to create the table used
5. Connect to your database in index.js by changing updating the information of variable declaration of "db"
6. Run "node index.js" or "nodemon index.js"
7. Go to "http://localhost:3000/"

Now you should be able to get started with adding and tracking your reading list!
