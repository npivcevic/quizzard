using quizzard.Dto;

namespace quizzard.Service.AuthService
{
    public interface IAuthService
    {
        bool UserEmailExists(string userEmail);
        Task<AuthResponseDto> RegisterUser(UserDto request);
        Task<AuthResponseDto> SelectRole(string userEmail, string role);
        Task<AuthResponseDto> Login(UserDto request);
        Task<AuthResponseDto> RefreshToken();
        Task<AuthResponseDto> DeleteToken(string userEmail);
    }
}
