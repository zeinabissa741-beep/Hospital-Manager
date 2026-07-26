using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Text;
using UserManagementDataLayer;
using UserManagementRole;  
using UserManagementRole.Models;
using UserRoleManagement;
using UserRoleManagement.Interfaces;
using UserRoleManagement.Repository;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
    throw new InvalidOperationException("JWT Key is not configured. Please set 'Jwt:Key' in your configuration.");
var key = Encoding.UTF8.GetBytes(jwtKey);


// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddCors();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<InterUserRep, UserRepository>();
builder.Services.AddScoped<InterRoleRep, RoleRepository>();
builder.Services.AddScoped<InterUserRoleRep, UserRoleRepository>();
builder.Services.AddScoped<InterTaskRep, TaskRepository>();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen(
    c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });
        // Add JWT Bearer Auth
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.Http,
            Scheme = "Bearer"
        });

        c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
    }
);

builder.Services.AddDbContext<UserManagementContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });
builder.Services.AddScoped<TokenGenerator>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<UserManagementContext>();
    var userService = new UserService();

    if (!context.Users.Any())
    {
        var users = new List<User>
        {
            new User
            {
                Name = "Alice",
                Email = "Alic@outlook.com",
                PasswordHash = userService.HashPassword("123AL45ICE"),
                CreationDate = new DateOnly(2023, 12, 12)
            },
            new User
            {
                Name = "Charlie",
                Email = "charlie111@outlook.com",
                PasswordHash = userService.HashPassword("123charlie123"),
                CreationDate = new DateOnly(2013, 10, 02)
            },
            new User
            {
                Name = "Malak",
                Email = "MalakM@gmail.com",
                PasswordHash = userService.HashPassword("456pass444"),
                CreationDate = new DateOnly(2010, 02, 28)
            }
        }; 
    context.Users.AddRange(users);
    context.SaveChanges();  
    }

    if (!context.UserRoles.Any())
        {
        var userroles = new List<UserRole>
        {
            new UserRole { UserId = 1, RoleId = 1 },
            new UserRole { UserId = 1, RoleId = 2 },
            new UserRole { UserId = 2, RoleId = 2 }
        };
        context.UserRoles.AddRange(userroles);
        context.SaveChanges();
        }
};        
   


app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT Key is not configured. Please set 'Jwt:Key' in your configuration.");
}

app.MapControllers();

app.Run();
