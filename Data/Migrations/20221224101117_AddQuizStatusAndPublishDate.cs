using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace quizzard.Data.Migrations
{
    public partial class AddQuizStatusAndPublishDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "PublishDate",
                table: "Quizzes",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "QuizStatus",
                table: "Quizzes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PublishDate",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "QuizStatus",
                table: "Quizzes");
        }
    }
}
