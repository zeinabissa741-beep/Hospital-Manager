using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Diagnostics.Metrics;
using UserManagementRole.Models;

namespace UserManagementDataLayer
{
    public class UserManagementContext : DbContext
    {
        public UserManagementContext(DbContextOptions<UserManagementContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserManagementRole.Models.Task> Tasks { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(u => u.Id);
            modelBuilder.Entity<Role>().HasKey(r => r.Id);
            modelBuilder.Entity<UserManagementRole.Models.Task>().HasKey(r => r.Id);

            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRole>()
                    .HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRole)
                    .HasForeignKey(ur => ur.RoleId);

            modelBuilder.Entity<UserRole>()
                    .HasOne(ur => ur.User)
                    .WithMany(u => u.UserRole)
                    .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserManagementRole.Models.Task>()
                .HasOne(t => t.User)
                .WithMany(u => u.Task)
                .HasForeignKey(t => t.UserId);

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, RoleName = "Admin" },
                new Role { Id = 2, RoleName = "User" },
                new Role { Id = 3, RoleName = "Moderator" }
                );

            var dateOnlyConverter = new ValueConverter<DateOnly, DateTime>(
                d => d.ToDateTime(TimeOnly.MinValue),
                d => DateOnly.FromDateTime(d)
                );

            modelBuilder.Entity<User>()
                .Property(u => u.CreationDate)
                .HasConversion(dateOnlyConverter);
        }
    }
}

    
