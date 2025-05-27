// Task 1: MongoDB Setup

// Creating and switchint to a Database known as plp_bookstore with a collection of books
use plp_bookstore;


// Task 2: Basic CRUD Operations
// Creating a collection named books and inserting 10 books data
db.books.insertMany([
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "genre": "Historical Fiction",
    "published_year": 1958,
    "price": 1700.00,
    "in_stock": true,
    "pages": 209,
    "publisher": "William Heinemann Ltd"
  },
  {
    "title": "Half of a Yellow Sun",
    "author": "Chimamanda Ngozi Adichie",
    "genre": "Historical Fiction",
    "published_year": 2006,
    "price": 2050.00,
    "in_stock": false,
    "pages": 433,
    "publisher": "Alfred A. Knopf"
  },
  {
    "title": "Nervous Conditions",
    "author": "Tsitsi Dangarembga",
    "genre": "Coming-of-Age",
    "published_year": 1988,
    "price": 1800.00,
    "in_stock": true,
    "pages": 204,
    "publisher": "The Women's Press"
  },
  {
    "title": "The Joys of Motherhood",
    "author": "Buchi Emecheta",
    "genre": "Social Fiction",
    "published_year": 1979,
    "price": 1650.00,
    "in_stock": true,
    "pages": 224,
    "publisher": "George Braziller"
  },
  {
    "title": "The Secret Lives of Baba Segi's Wives",
    "author": "Lola Shoneyin",
    "genre": "Contemporary Fiction",
    "published_year": 2010,
    "price": 1900.00,
    "in_stock": true,
    "pages": 256,
    "publisher": "Serpent's Tail"
  },
  {
    "title": "Homegoing",
    "author": "Yaa Gyasi",
    "genre": "Historical Fiction",
    "published_year": 2016,
    "price": 2100.00,
    "in_stock": false,
    "pages": 320,
    "publisher": "Alfred A. Knopf"
  },
  {
    "title": "My Sister, the Serial Killer",
    "author": "Oyinkan Braithwaite",
    "genre": "Dark Comedy, Thriller",
    "published_year": 2018,
    "price": 1750.00,
    "in_stock": true,
    "pages": 240,
    "publisher": "Doubleday"
  },
  {
    "title": "Americanah",
    "author": "Chimamanda Ngozi Adichie",
    "genre": "Contemporary Fiction",
    "published_year": 2013,
    "price": 2000.00,
    "in_stock": false,
    "pages": 477,
    "publisher": "Alfred A. Knopf"
  },
  {
    "title": "We Need New Names",
    "author": "NoViolet Bulawayo",
    "genre": "Literary Fiction",
    "published_year": 2013,
    "price": 1850.00,
    "in_stock": true,
    "pages": 304,
    "publisher": "Little, Brown and Company"
  },
  {
    "title": "The Famished Road",
    "author": "Ben Okri",
    "genre": "Magical Realism",
    "published_year": 1991,
    "price": 1750.00,
    "in_stock": true,
    "pages": 500,
    "publisher": "Jonathan Cape"
  }
]);

// Finding all books in the genre "Historical Fiction"
db.books.find({ "genre": "Historical Fiction" });

// Finding all books published after 2000
db.books.find({ "published_year": { $gt: 2000 } });

// Finding books by the author "Chimamanda Ngozi Adichie"
db.books.find({ "author": "Chimamanda Ngozi Adichie" });

// Updating the price of "Things Fall Apart" by Chinua Achebe
db.books.updateOne(
  { "title": "Things Fall Apart", "author": "Chinua Achebe" }, // Filter for the specific book
  { $set: { "price": 1850.00 } } // Update the price field
);

// Deleting the bok "The Secret Lives of Baba Segi's Wives" by Lola Shoneyin
db.books.deleteOne({ "title": "The Secret Lives of Baba Segi's Wives" });


// Task 3: Advanced Queries
// Finding all books that are in stock and published after 2010
db.books.find({
  "in_stock": true,
  "published_year": { $gt: 2010 }
});

// Projecting only the title, author, and price of all books
db.books.find(
  {}, // all books
  { "title": 1, "author": 1, "price": 1, "_id": 0 } // Projection
);

// Sorting all books by price in ascending order
db.books.find().sort({ "price": 1 });

// Sorting all books by price in descending order
db.books.find().sort({ "price": -1 });

// Use the limit and skip methods to implement pagination
// Get the first 5 books sorted by title in ascending order
db.books.find({}).sort({ "title": 1 }).skip(0).limit(5);

// Get the next 5 books sorted by title in ascending order
db.books.find({}).sort({ "title": 1 }).skip(5).limit(5);


// Task 4: Aggregation Pipeline
// Aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([{$group: {_id: "$genre", averagePrice: { $avg: "$price" }, totalBooks: { $sum: 1 } }},{$project: {_id: 0, genre: "$_id", averagePrice: { $round: ["$averagePrice", 2] }, totalBooks: 1 }},{$sort: {genre: 1 }}]);

// aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([{$group: {_id: "$author", bookCount: { $sum: 1 } }},{$sort: {bookCount: -1 }},{$limit: 1 },{$project: {_id: 0, author: "$_id",bookCount: 1 }}]);

// pipeline that groups books by publication decade and counts them
db.books.aggregate([{$addFields: {publicationDecade: {$multiply: [{ $floor: { $divide: ["$published_year", 10] } },10]}}},{$group: {_id: "$publicationDecade", bookCount: { $sum: 1 } }},{$project: {_id: 0, decade: "$_id", bookCount: 1 }},{$sort: {decade: 1 }}]);


// Task 5: Indexing
// index on the title field for faster searches
db.books.createIndex({ "title": 1 });

// compound index on author and published_year
db.books.createIndex({ "author": 1, "published_year": -1 });

// Using the explain() method to demonstrate the performance improvement with your indexes
db.books.find({ "title": "We Need New Names" }).explain("executionStats");
