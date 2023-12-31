const inquirer = require('inquirer');
const {viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, deleteRow} = require('./choices.js');

choices()
function choices() {
   inquirer
    .prompt([{
        type: 'list',
        name: 'directory',
        message: 'Choose a directory',
        choices:["View Departments", "View Roles", "View Employees",
    "Add Department", "Add A Role", "Add Employee", "Update Employee Role", "Delete Row"]
      },
    ])
   .then((response) => {
        switch (response.directory) {
          case "View Departments":
            viewDepartments();
            break;
            case "View Roles":
            viewRoles();
            break;
            case "View Employees":
            viewEmployees();
            break;
            case "Add Department":
            addDepartment();
            break;
            case "Add A Role":
            addRole();
            break;
            case "Add Employee":
            addEmployee();
            break;
            case "Update Employee Role":
            updateEmployeeRole();
            break;
            case "Delete Row":
            deleteRow();
            break;
        }
        async function loop(){
          const directory = await response.directory;
          console.log(directory)
          if(directory === "View Departments"){
             viewDepartments();
             choices();
          }else if(directory === "view Roles"){
            viewRoles();
            choices();
          }else if(directory === "View Employees"){
            viewEmployees();
            choices();
          }else{
            return directory;
          }
        }
        loop()
      })

    .catch((err) => {
      if (err) {
        console.log('problem with loading prompt')
      } else {
        console.log('another problem occurred')
      }
    });
  }

module.exports = choices;
