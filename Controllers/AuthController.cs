using quizzard.Service.AuthService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using quizzard.Models;
using quizzard.Dto;

namespace AuthentificationJwtRefreshToken.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> RegisterUser(UserDto request)
        {
            var response = await _authService.RegisterUser(request);
            if (response.Success)
                return Ok(response);
            return BadRequest(response);
        }

        [HttpPost("selectRole")]
        public async Task<ActionResult<AuthResponseDto>> SelectRole (string userEmail, string role)
        {
            var response = await _authService.SelectRole(userEmail,role);
            if (response.Success)
                return Ok(response);
            return BadRequest(response);
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> LoginUser([FromForm] string username, [FromForm] string password)
        {
            var response = await _authService.Login(username, password);
            if(response.Success)
                return Ok(response);
            return BadRequest(response);
        }

        [HttpPost("logout")]
        public async Task<ActionResult<User>> LogoutUser([FromForm] string username)
        {
            var response = await _authService.Logout(username);
            if (response.Success)
                return Ok(response);
            return BadRequest(response);
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<string>> RefreshToken()
        {
            var response = await _authService.RefreshToken();
            if (response.Success)
                return Ok(response);
            return Unauthorized(response);
        }

        [HttpDelete("remove-token")]
        public async Task<ActionResult> DeleteToken([FromForm] string userEmail)
        {
            var response = await _authService.DeleteToken(userEmail);
            if (response.Success)
                return Ok(response);
            return BadRequest(response);
        }

        [HttpGet("get-user-role"),Authorize]
        public async Task<ActionResult> GetUserRole(string username)
        {
            var response = await _authService.GetUserRole(username);
            if (response.Success)
                return Ok(response);
            return BadRequest(response);
        }

        [HttpGet, Authorize(Roles ="Host,Player")]
        public ActionResult AuthorizationCheck()
        {
            return Ok("User is authorized");
        }
    }
}
