const fs = require('fs');
const employeeData = require('./data/employees.json');
const deptData = require('./data/departments.json');

let employees = [];
let departments = [];

 

async function initialize() {
    return new Promise((res, rej) => {
        fs.readFile('./data/employees.json', 'utf8', (err, data) => {
            if(err){
                rej("Could not read file");
                return;
            }
            employees = JSON.parse(data);
         

                fs.readFile('./data/departments.json', 'utf8', (err, data) => {
                if(err){
                    rej("Could not read file");
                    return;
                }
                departments = JSON.parse(data);
                res();
            });
        });
    });           
}
    


function getAllEmployees() {
    return new Promise((res, rej) => {
        if(employees.length === 0){
            rej("Employees could not be resolved.");
        }
        res(employees);
    });
}

function getManagers() {
    return new Promise((res, rej) => {
        const managers = employees.filter(employee => {
            return employee.isManager === true;
        });
        if(managers.length === 0){
            rej("Managers could not be resolved.")
        }
        else {
            res(managers);
        }

    });
}

function getDepartments() {
    return new Promise((res, rej) => {
        if(departments.length === 0){
            rej("Departments could not be resolved.")
        }
        else {
            res(departments);
        }
    });
}
        
module.exports = {
    initialize,
    getAllEmployees,
    getManagers,
    getDepartments
};