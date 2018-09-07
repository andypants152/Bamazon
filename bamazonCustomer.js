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
    var items = listItems();
    inquirer.prompt([{
        message: "What product would you like to purchase?",
        name: "choice"
    },{
        message: "How many would you like to buy?",
        name: "num"
    }]).then(function(answer){
        buyItem(answer.choice, answer.num);
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

function buyItem(item, purchaseQuantity) {
    connection.query(
        "SELECT * FROM products WHERE item_id=" + item,
        function(err, res){
            if (err) throw err;
            if(res[0].stock_quantity >= purchaseQuantity){
                var cost = res[0].price * purchaseQuantity;
                var totalSales = res[0].product_sales + cost;
                console.log(totalSales);
                connection.query("UPDATE products SET stock_quantity=" + (res[0].stock_quantity - purchaseQuantity) + ", product_sales=" + totalSales + " WHERE item_id=" + item);
                console.log("Successfully purchased " + res[0].product_name +"\nTotal Cost: $" + cost);
            }
            else{
                console.log("Insufficent Stock for purchase!")
            }
            menu();
        }
    )
}