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
        choices: ["View Product Sales by Department", "Create New Department", "Exit"],
        name: "choice"
    }]).then(function (answer) {
        switch (answer.choice){
            case "View Product Sales by Department":
                departmentSales();
                break;
            case "Create New Department":
                newDepartment();
                break;
            case "Exit":
                connection.end();
                break;
        }
    });

}

function departmentSales(){
    connection.query(
        "SELECT departments.*, SUM(products.product_sales) AS department_sales, (SUM(products.product_sales) - departments.over_head_cost) AS department_profit FROM departments LEFT OUTER JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name;",
        function (err, res) {
            if (err) throw err;

            var table = new Table({ head: ['Department ID', 'Department Name', 'Over Head Costs', 'Product Sales', 'Total Profit'] });
            res.forEach(elem => {
                table.push([elem.department_id, elem.department_name, elem.over_head_cost, String(elem.department_sales), String(elem.department_profit)]);
            });
            console.log("\n" + table.toString());
            menu();
        }
    );
}

function newDepartment(){
    inquirer.prompt([{
        message: "What's the name of the new department?",
        name: "departmentName",
    },{
        message: "What's the over head costs?",
        name: "overHeadCost"
    }]).then(function(answers){
        connection.query(
            "INSERT INTO departments SET ?",
            {
                department_name: answers.departmentName, 
                over_head_cost: answers.overHeadCost
            },
            function(err, resp){
                if (err) throw err;
                console.log("Department Added!");
                menu();
            }
        )
    })
}