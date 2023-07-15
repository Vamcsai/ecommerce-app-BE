import mysql from "mysql";
const connection = mysql.createConnection(
  'mysql://crjaysel6z19h1jdagx1:pscale_pw_152livSFE8cyGya1bJpab22bMkQLRBubQC8K2QfX8wi@aws.connect.psdb.cloud/ecommerce-app?ssl={"rejectUnauthorized":true}'
);

export function getUsers(res) {
  const insert = connection.query(
    "select * from Users",
    function (error, results, fields) {
      if (error) {
        res.status(500).json({ result: error.sqlMessage });
      } else {
        res.status(200).json({ result: results });
      }
    }
  );
}

export function signUp(userData, res) {
  const signUpQuery =
    "INSERT INTO Users (username, password, role) VALUES (?, ?, ?);";
  connection.query(
    signUpQuery,
    [userData.username, userData.password, userData.role],
    function (error, results, fields) {
      if (error) {
        if (error.errno === 1062) {
          res.status(500).json({ result: "Username Already Exists!" });
        } else {
          res.status(500).json({ result: "Something went Wrong! Try Again.." });
        }
      } else {
        res.status(200).json({ result: "Success" });
      }
    }
  );
}

export function login(req, userData, res) {
  const loginQuery = "SELECT password FROM Users WHERE username = ?";
  connection.query(
    loginQuery,
    [userData.username],
    function (error, results, fields) {
      if (error) {
        res.status(500).json({ result: "Username or Password Incorrect!" });
      } else {
        if (userData.password !== results[0].password) {
          res.status(401).json({ result: "Username or Password Incorrect!" });
        } else {
          req.session.user = {
            username: userData.username,
            userrole: "admin",
          };
          res.status(200).json({
            result: {
              username: userData.username,
              userrole: "admin",
            },
          });
        }
      }
    }
  );
}

export function addBook(bookData, res) {
  console.log(bookData.bookName);
  const insertBookQuery =
    "INSERT INTO Books (bookname, bookauthor, bookprice, bookimage) VALUES (?, ?, ?, BINARY(?))";
  connection.query(
    insertBookQuery,
    [
      bookData.bookName,
      bookData.bookAuthor,
      bookData.bookPrice,
      bookData.bookImage,
    ],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ result: "Something went wrong, Try Again!" });
      } else {
        res.status(200).json({ result: "Success" });
      }
    }
  );
}

export function getbooks(req, res) {
  const selectBooksQuery =
    "SELECT bookid, bookname, bookauthor, bookprice, bookimage FROM Books where bookid >= 10005;";
  connection.query(selectBooksQuery, (error, results, fields) => {
    if (error) {
      res.status(500).json({ result: error.sqlMessage });
    } else {
      const allBooks = results.map((row) => {
        const bookImageBuffer = Buffer.from(row.bookimage, "binary").toString(
          "base64"
        );
        return {
          ...row,
          bookimage: bookImageBuffer,
        };
      });
      res.status(200).json({ result: allBooks });
    }
  });
}
