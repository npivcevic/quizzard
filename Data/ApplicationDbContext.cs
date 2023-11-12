using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Duende.IdentityServer.EntityFramework.Options;
using quizzard.Models;

namespace quizzard.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions options)
        : base(options)
    {
        
    }

    public DbSet<Question>? Questions { get; set; }
    public DbSet<Answer>? Answers { get; set; }
    public DbSet<QuestionSet>? QuestionSets { get; set; }
    public DbSet<Quiz>? Quizzes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Answer>()
            .HasOne<Question>()
            .WithMany(g => g.Answers)
            .IsRequired();
        
        modelBuilder.Entity<Question>()
            .HasOne<QuestionSet>(q => q.QuestionSet)
            .WithMany(g => g.Questions)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<QuestionSet>()
            .HasOne<Quiz>(s => s.Quiz)
            .WithMany(g => g.QuestionSets)
            .IsRequired();

        base.OnModelCreating(modelBuilder);
    }
}
