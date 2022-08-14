using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shoppingCartAPI.Migrations
{
    public partial class migration6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Carts_Products_product_id",
                table: "Carts");

            migrationBuilder.DropForeignKey(
                name: "FK_Carts_Users_user_id",
                table: "Carts");

            migrationBuilder.DropIndex(
                name: "IX_Carts_product_id",
                table: "Carts");

            migrationBuilder.DropIndex(
                name: "IX_Carts_user_id",
                table: "Carts");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Carts_product_id",
                table: "Carts",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_Carts_user_id",
                table: "Carts",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Carts_Products_product_id",
                table: "Carts",
                column: "product_id",
                principalTable: "Products",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Carts_Users_user_id",
                table: "Carts",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "id");
        }
    }
}
