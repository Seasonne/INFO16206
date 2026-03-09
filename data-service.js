const fs = require('fs');
const employeeData = require('./data/employees.json');
const deptData = require('./data/departments.json');
const { get } = require('http');

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
            employeeNum: 0, // will be assigned later
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
function getEmployeesByNumber(value) {
    return new Promise(function (resolve, reject) {
    var foundEmployee = null;

    for (let i = 0; i < employees.length; i++) {
      if (employees[i].employeeNum == value) {
        foundEmployee = employees[i];
      }
    }

    if (!foundEmployee) {
      reject("query returned 0 results");
      return;
    }

    resolve(foundEmployee);
  });
};
    function getEmployeesByStatus(status) {
        return new Promise(function (resolve, reject) {
    var filteredEmployeees = [];

    for (let i = 0; i < employees.length; i++) {
      if (employees[i].status == status) {
        filteredEmployeees.push(employees[i]);
      }
    }

    if (filteredEmployeees.length == 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(filteredEmployeees);
  });
};
    function getEmployeesByDepartment(department) {
        return new Promise(function (resolve, reject) {
    var filteredEmployeees = [];

    for (let i = 0; i < employees.length; i++) {
      if (employees[i].department == department) {
        filteredEmployeees.push(employees[i]);
      }
    }

    if (filteredEmployeees.length == 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(filteredEmployeees);
  });
};
    function getEmployeesByManager(manager) {
        return new Promise(function (resolve, reject) {
    var filteredEmployeees = [];

    for (let i = 0; i < employees.length; i++) {
      if (employees[i].employeeManagerNum == manager) {
        filteredEmployeees.push(employees[i]);
      }
    }

    if (filteredEmployeees.length == 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(filteredEmployeees);
  });
};
    

module.exports = {
    initialize,
    getAllEmployees,
    getManagers,
    getDepartments,
    addEmployee,
    getEmployeesByStatus,
    getEmployeesByDepartment,
    getEmployeesByManager,
    getEmployeesByNumber
};