-- Create the table to track what you have read --
CREATE TABLE mangas (
  id SERIAL,
  title VARCHAR(100) PRIMARY KEY,
  review VARCHAR(2000),
  rating INT,
  image VARCHAR(500) NOT NULL
);

-- An example of inserting to test data --
INSERT INTO mangas (title, review, rating, image) VALUES ('One Piece', 'I loved it', 9, 'https://upload.wikimedia.org/wikipedia/en/9/90/One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg');