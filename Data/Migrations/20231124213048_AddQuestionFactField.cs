using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace quizzard.Data.Migrations
{
    public partial class AddQuestionFactField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Fact",
                table: "Questions",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Fact",
                table: "Questions");
        }
    }
}
