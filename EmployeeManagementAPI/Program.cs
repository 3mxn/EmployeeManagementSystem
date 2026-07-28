using EmployeeManagementAPI.Data;
using Microsoft.EntityFrameworkCore;
using EmployeeManagementAPI.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<EmployeeDbContext>(options => options.UseSqlite("Data Source=employees.db"));
var app= builder.Build();
app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/employees", async (EmployeeDbContext db) =>
{
    return await db.Employees.ToListAsync();
});
app.MapPost("/employees", async (Employee employee, EmployeeDbContext db) =>
{
    db.Employees.Add(employee);
    await db.SaveChangesAsync();
    return Results.Ok(employee);
});

app.MapPut("/employees/{id}",async(int id,Employee updatedEmployee,EmployeeDbContext db)=>
    {
        var employee = await db.Employees.FindAsync(id);
        if(employee==null)
        {
            return Results.NotFound();
        }
        employee.Name = updatedEmployee.Name;
        employee.Email = updatedEmployee.Email;
        employee.Role = updatedEmployee.Role;
        await db.SaveChangesAsync();

        return Results.Ok(employee);



});
app.MapDelete("/employees/{id}", async (int id, EmployeeDbContext db) =>
{
    var employee = await db.Employees.FindAsync(id);
    if (employee==null)
    {
        return Results.NotFound();
    }
    db.Employees.Remove(employee);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.Run();
