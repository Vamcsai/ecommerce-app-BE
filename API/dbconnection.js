import mysql from "mysql";
import FileReader from "filereader";

const connection = mysql.createConnection(
  'mysql://crjaysel6z19h1jdagx1:pscale_pw_152livSFE8cyGya1bJpab22bMkQLRBubQC8K2QfX8wi@aws.connect.psdb.cloud/ecommerce-app?ssl={"rejectUnauthorized":true}'
);

const q1 =
  "CREATE TABLE Books (bookid int PRIMARY KEY AUTO_INCREMENT, bookname varchar(255) NOT NULL, bookauthor varchar(255) NOT NULL, bookprice DOUBLE NOT NULL, bookimage LONGBLOB )";
const q2 =
  "INSERT INTO Books (bookname, bookauthor, bookprice, bookimage) values ('vamshi', 'vamshi', 500, 'adsdsds')";
const q3 = "SELECT bookimage FROM Books where bookname = 'vamcc';";
connection.query(q3, function (error, results, fields) {
  if (error) {
    console.log(error.sqlMessage);
  } else {
    const blob = results[0].bookimage;
    console.log(blob);
    const buff = Buffer.from(blob, "binary").toString("base64");
    console.log(buff);
  }
});
