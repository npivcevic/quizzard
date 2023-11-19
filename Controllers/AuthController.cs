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
        public async Task<ActionResult<User>> LoginUser(UserDto request)
        {
            var response = await _authService.Login(request);
            if(response.Success)
                return Ok(response);
            return BadRequest(response);
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<string>> RefreshToken()
        {
            var response = await _authService.RefreshToken();
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
