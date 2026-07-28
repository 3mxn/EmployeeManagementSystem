import {useEffect,useState} from "react";

type Employee={
    employeeId:number;
    name:string;
    email:string;
    role:string
};
function EmployeeList(){
    const[employees,setEmployees]=useState<Employee[]>([]);
    const loadEmployees=()=>{
      fetch("https://localhost:7116/employees")
      .then((response)=>response.json())
      .then((data)=>setEmployees(data));
    };
    useEffect(()=>{
        loadEmployees();
    },[])
    return(
        <div>
            <h3>Employee List</h3>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee)=>(
                        <tr key={employee.employeeId}>
                            <td>{employee.employeeId}</td>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.role}</td>

                        </tr>

                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeeList;