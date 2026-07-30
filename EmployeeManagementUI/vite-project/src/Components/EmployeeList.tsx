import { useEffect, useState } from "react";

type Employee = {
  employeeId: number;
  name: string;
  email: string;
  role: string;
};

function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[role,setRole]=useState("");
  const loadEmployees = () => {
    fetch("https://localhost:7116/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const updateEmployee = (field: keyof Employee, value: string) => {
    if (selectedEmployee) {
      setSelectedEmployee({
        ...selectedEmployee,
        [field]: value,
      });
    }
  };

  const saveEmployee = () => {
    if(selectedEmployee && !selectedEmployee.email.includes("@")){
      alert("Please enter a valid email address.");
      return;
    }
    if (selectedEmployee) {
      fetch(
        `https://localhost:7116/employees/${selectedEmployee.employeeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedEmployee),
        }
      ).then(() => {
        loadEmployees();
        setSelectedEmployee(null);
      });
    }
  };
  const addEmployee=()=>{
    fetch("https://localhost:7116/employees",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        name,
        email,
        role,
      }).then(()=>{
        loadEmployees();
        setName("");
        setEmail("");
        setRole("");
      })
    })

  }
  const deleteEmployee = (id: number) => {
  if (window.confirm("Are you sure you want to delete this employee?")) {
    fetch(`https://localhost:7116/employees/${id}`, {
      method: "DELETE",
    }).then(() => loadEmployees());
  }
};

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Employee List</h3>
      <div className="mb-4">
  <input
    className="form-control mb-2"
    placeholder="Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  <input
    className="form-control mb-2"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <input
    className="form-control mb-2"
    placeholder="Role"
    value={role}
    onChange={(e) => setRole(e.target.value)}
  />

  <button
    className="btn btn-success"
    onClick={addEmployee}
  >
    Add Employee
  </button>
</div>

      <div className="table-responsive">

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.employeeId}>
              <td>{employee.employeeId}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteEmployee(employee.employeeId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>

      <div
        className="modal fade"
        id="editModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Employee</h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            

            <div className="modal-body">
              {selectedEmployee && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      value={selectedEmployee.name}
                      onChange={(e) =>
                        updateEmployee("name", e.target.value)
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      value={selectedEmployee.email}
                      onChange={(e) =>
                        updateEmployee("email", e.target.value)
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input
                      className="form-control"
                      value={selectedEmployee.role}
                      onChange={(e) =>
                        updateEmployee("role", e.target.value)
                      }
                    />
                  </div>
                  
                </>
              )}
            </div>
             <div className="modal-footer">
        <button
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Cancel
        </button>

        <button
          className="btn btn-primary"
          onClick={saveEmployee}
          data-bs-dismiss="modal"
        >
          Save Changes
        </button>
      </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;