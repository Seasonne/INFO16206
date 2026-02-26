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

function addEmployee(employeeData) {
    return new Promise((res, rej) => {
        if (!employeeData) {
            rej("Employee data is required.");
            return;
        }

        // normalize/convert incoming values
        const emp = {
            firstName: employeeData.firstName || "",
            lastName: employeeData.lastName || "",
            email: employeeData.email || "",
            SSN: employeeData.SSN || "",
            addressStreet: employeeData.addressStreet || "",
            addressCity: employeeData.addressCity || "",
            addressState: employeeData.addressState || "",
            addressPostal: employeeData.addressPostal || "",
            maritalStatus: employeeData.maritalStatus || "single",
            isManager: employeeData.isManager === "on" || employeeData.isManager === true,
            employeeManagerNum: employeeData.employeeManagerNum ? parseInt(employeeData.employeeManagerNum) : null,
            status: employeeData.status || "",
            department: employeeData.department ? parseInt(employeeData.department) : null,
            hireDate: employeeData.hireDate || ""
        };

        // assign a new employeeNum (max existing + 1)
        const maxNum = employees.reduce((max, e) => {
            return e.employeeNum > max ? e.employeeNum : max;
        }, 0);
        emp.employeeNum = maxNum + 1;

        employees.push(emp);

        // persist the updated list back to the JSON file
        fs.writeFile('./data/employees.json', JSON.stringify(employees, null, 2), (err) => {
            if (err) {
                rej("Unable to save new employee");
            } else {
                res();
            }
        });
    });
}

module.exports = {
    initialize,
    getAllEmployees,
    getManagers,
    getDepartments,
    addEmployee
};