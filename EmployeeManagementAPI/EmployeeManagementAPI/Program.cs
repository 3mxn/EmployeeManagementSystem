using EmployeeManagementAPI.Data;
using Microsoft.EntityFrameworkCore;
using EmployeeManagementAPI.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<EmployeeDbContext>(options => options.UseSqlite("Data Source=employees.db"));
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
var app= builder.Build();
app.UseCors("ReactApp");

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
app.MapPost("/employees", async (Employee employee, EmployeeDbContext db) =>
{
    db.Employees.Add(employee);
    await db.SaveChangesAsync();

    return Results.Ok(employee);
});

app.MapPost("/employees/fill", async (EmployeeDbContext db) =>
{
    foreach (var employee in db.Employees)
    {
        employee.Name = $"Employee {employee.EmployeeId}";
        employee.Email = $"employee{employee.EmployeeId}@gmail.com";
        employee.Role = "Developer";
    }

    await db.SaveChangesAsync();

    return Results.Ok();
});
app.Run();
