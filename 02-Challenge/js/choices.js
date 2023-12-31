const inquirer = require('inquirer');
const db = require('./connection');
const prompt = require('./questions');
const fs = require('fs');

const viewDepartments = () => {
 const sql = `SELECT department.id AS ID, department.name AS Departments FROM department`;
      
 db.query(sql, (err, results) => {
    if(err){
        console.log(err)
    }else{     
    console.table(results);
    }
    
    fs.writeFile('../db/departments.json', JSON.stringify(results, null, 4), 'utf8', err => {
      if (err) {
      console.log(`err with creating file`)
      } else {
      console.log(`Departments file successful`)
      }

   })
 })
};

function viewRoles(){
    const sql = `SELECT role.title AS Role, role.id AS RoleID, role.salary AS Salary, department.name AS Department FROM role JOIN department ON role.department_id = department.id;`;
  
    db.query(sql, (err, results) => {
        if(err){
            console.log(err)
        }else{     
        console.table(results);
        }

        fs.writeFile('../db/roles.json', JSON.stringify(results, null, 4), 'utf8', err => {
            if (err) {
            console.log(`err with creating file`)
            } else {
            console.log(`roles file successful`)
            }
         })

       })
    };
  
function viewEmployees(){
    const sql = `SELECT employee.id AS ID, employee.first_name AS FIrstName, employee.last_name AS LastName, department.name AS Department, role.title AS Role, role.salary AS Salary, employee.manager_id AS ManagerID FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY role_id;`;
  
    db.query(sql, (err, results) => {
          
        if(err){
            console.log(err)
        }else{     
        console.table(results);
        }

        fs.writeFile('../db/employees.json', JSON.stringify(results, null, 4), 'utf8', err => {
            if (err) {
            console.log(`err with creating file`)
            } else {
            console.log(`employees file successful`)
            choices()
            }
         })

      })
    }

function addDepartment(){
    const addDepartment = prompt[0];
        
        inquirer
          .prompt(addDepartment)
      
          .then((response) => {
            const sql = `INSERT INTO department(name) VALUES ('${response.name}');`
         
          db.query(sql, (err, results) => {
            if(err){
            console.log('\n did not add Department');
            }else{
            viewDepartments();
            console.log(results)
            }
          }
          )}
          )
        }
        
function addRole(){
    const addRole = prompt[1];
        inquirer
          .prompt(addRole)
      
          .then((response) => {
            const sql = `INSERT INTO role(title, salary, department_id) VALUES ('${response.title}', '${response.salary}', '${response.department}');`
         
          db.query(sql, (err, results) => {
            if(err){
              console.log('\n did not add Roles');
            }else{
            viewRoles();
            console.log(results)
            }
          }
          )}
          )
        }

function addEmployee(){
    const addEmployee = prompt[2];
        inquirer
            .prompt(addEmployee)

            .then((response) => {
             //the if statement below uses user input to place a null or int(EX. 001) into the manager variable
                if(response.managerID === null) {
                  var manager = null;
                }else{
                  var manager = response.managerID;
                }
              console.log(`${response.manager}`);

              const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES 
              ('${response.firstName}', '${response.lastName}', ${response.roleID}, ${manager});`
           
            db.query(sql, (err, results) => {
              if(err) {
                console.log('\n did not add Employee');
              }else{
              viewEmployees();
              console.log(results)
              }
            }
            )}
            )
          } 
          
async function updateEmployeeRole(){
    const updateEmployeeRoleData = prompt[3];
    const response = await inquirer.prompt(updateEmployeeRoleData);
    console.log(response)

    if(response.managerID === null) {
        var manager = null;
      }else{
        var manager = response.managerID;
      }

    const sql = ` UPDATE employee 
                 SET role_id = '${response.updateRole}', manager_id = '${manager}' 
                WHERE first_name = '${response.firstName}' AND last_name = '${response.lastName}';`
          
          
    db.query(sql, (err, results) => {
        if(err) {
            console.log('\n did not update employee');
        }else{
            viewEmployees();
        }
    })
}
    //async makes function return a promise      
async function deleteRow(){
    const deleteRowData = prompt[4];
    //await, waits until user inputs data to create the response and continue
    const response = await inquirer.prompt(deleteRowData);
    console.log(response);
    
    //can only delete from children to parent, not parent to children.
    //Ex. if the user wants to delete the HR Manager role, the employee with the role
    //HR Manager must be deleted and then the the actual role itself can be deleted 
    //because it not longer has a child to rely on it.
    const sql = `DELETE FROM ${response.tables} WHERE id = ${response.id};`
          
    console.log(`DELETE FROM ${response.tables} WHERE id = ${response.id};`)
            
        db.query(sql, (err, results) => {
        //uses an if statement with user inputed table to display matched table function.
            if(err){
                console.log(err)
            }else{
            console.log('\n deleted row');
            if(response.tables === 'department'){
                return viewDepartments();
            }else if (response.tables === 'role'){
                return viewRoles();
            }else{
                return viewEmployees();
            }
        }
    })
}  


module.exports = {viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, deleteRow};