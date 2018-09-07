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

function menu() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
        name: "choice"
    }]).then(function (answer) {
        switch (answer.choice) {
            case "View Products for Sale":
                viewItems();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addStock();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
                connection.end();
                break;
        }
    })
}

function listItems(next) {
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;

            var table = new Table({ head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity'] });
            res.forEach(elem => {
                table.push([elem.item_id, elem.product_name, elem.department_name, elem.price, elem.stock_quantity]);
            });
            console.log("\n" + table.toString());
        }
    );
}

function viewItems() {
    listItems();
    menu();
}

function lowInventory() {
    connection.query(
        "SELECT * FROM products WHERE stock_quantity < 5",
        function (err, res) {
            if (err) throw err;
            var table = new Table({ head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity'] });
            res.forEach(elem => {
                table.push([elem.item_id, elem.product_name, elem.department_name, elem.price, elem.stock_quantity]);
            });
            console.log("\n" + table.toString());
            menu();
        }
    );
}

function addStock() {
    inquirer.prompt([{
        message: "What product? (ID)",
        name: "id"
    }, {
        message: "How many would you like to add?",
        name: "quantity"
    }]).then(function (answer) {

        connection.query(
            "SELECT * FROM products WHERE item_id =" + answer.id,
            function (err, resp) {
                if (err) throw err;
                var updatedStock = parseInt(resp[0].stock_quantity) + parseInt(answer.quantity);
                connection.query("UPDATE products SET stock_quantity=" + updatedStock + " WHERE item_id=" + answer.id,
                    function (err, res) {
                        if (err) throw err;
                        console.log("Stock Updated!")
                        menu();
                    })
            })
    })

}

function addProduct() {
    connection.query("SELECT department_name FROM departments", function (err, resp) {
        if (err) throw err;
        var departments = [];
        resp.forEach(function (elem) {
            departments.push(elem.department_name);
        })

        inquirer.prompt([{
            message: "What's the name of the new product?",
            name: "productName",
        }, {
            type: "list",
            message: "What's the department?",
            choices: departments,
            name: "departmentName"
        }, {
            message: "What's the price?",
            name: "price"
        }, {
            message: "What's the initial stock?",
            name: "stock"
        }]).then(function (answers) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answers.productName,
                    department_name: answers.departmentName,
                    price: answers.price,
                    stock_quantity: answers.stock
                },
                function (err, resp) {
                    if (err) throw err;
                    console.log("Product Added!");
                    menu();
                }
            )
        })
    })
}