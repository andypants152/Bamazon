var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    menu()
});

function menu(){
    listItems();
    inquirer.prompt([{

    }]).then(function(answer){

    })
}

function listItems() {
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;

            var table = new Table({
                head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity']
                });
            var itemList = [];
                res.forEach(elem => {
                    table.push([elem.item_id, elem.product_name, elem.department_name, elem.price, elem.stock_quantity]);
                    itemList.push(elem.item_id);
                });
            table.push();

            console.log("\n" + table.toString());
            return itemList;

        }
    );
}