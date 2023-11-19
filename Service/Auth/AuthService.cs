using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using quizzard.Data;
using quizzard.Dto;
using quizzard.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace quizzard.Service.AuthService
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(ApplicationDbContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<AuthResponseDto> RegisterUser(UserDto request)
        {
            if(UserEmailExists(request.Email))
            {
                var responseF = new AuthResponseDto{ Success = false, Message = "User with this email alreday exists." };
                return responseF;
            }

            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
            var user = new User
            {
                Email = request.Email,
                PasswordHash= passwordHash,
                PasswordSalt= passwordSalt,
                Role = request.Role,
            };
             
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var responseS = new AuthResponseDto { Success = true,Message = "Succesfully registered." };

            return responseS;
        }


        public async Task<AuthResponseDto> Login(UserDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);  
            if(user == null) 
            {
                return new AuthResponseDto { Message="User not found."};
            }
            if (!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
            {
                return new AuthResponseDto { Message = "Wrong Password." };
            }

            string token = CreateToken(user);
            var refreshToken = CreateRefreshToken();
            SetRefreshToken(refreshToken, user);

            return new AuthResponseDto { 
                Success = true, 
                Token = token,
                RefreshToken = refreshToken.Token,
                TokenExpires = refreshToken.Expires,
            };
        }

        private bool VerifyPasswordHash(string password,byte[] passwordHash,byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt) 
        {
            using(var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, user.Role),

            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private RefreshToken CreateRefreshToken()
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.Now.AddDays(7),
                Created = DateTime.Now
            };

            return refreshToken;
        }

        private void SetRefreshToken(RefreshToken refreshToken,User user)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = refreshToken.Expires,
            };
            _httpContextAccessor?.HttpContext?.Response
                .Cookies.Append("refreshToken", refreshToken.Token,cookieOptions);

            user.RefreshToken = refreshToken.Token;
            user.TokenCreated = refreshToken.Created;
            user.TokenExpires = refreshToken.Expires;

            _context.SaveChanges();
        }

        public async Task<AuthResponseDto> RefreshToken()
        {
            var resfreshToken = _httpContextAccessor?.HttpContext?.Request.Cookies["refreshToken"];
            var user =  _context.Users.Where(u=>u.RefreshToken == resfreshToken).FirstOrDefault();
            if (user == null)
            {
                return new AuthResponseDto { Message = "Invalid refresh token."};
            }
            else if (user.TokenExpires < DateTime.Now)
            {
                return new AuthResponseDto { Message = "Token expired." };
            }

            string token = CreateToken(user);
            var newRefreshToken = CreateRefreshToken();
            SetRefreshToken(newRefreshToken, user);
            return new AuthResponseDto
            {
                Success = true,
                Token = token,
                RefreshToken = newRefreshToken.Token,
                TokenExpires = newRefreshToken.Expires,
            };
        }

        public bool UserEmailExists(string userEmail)
        {
            return _context.Users.Any(u => u.Email == userEmail);
        }

        public async Task<AuthResponseDto> SelectRole(string userEmail, string role)
        {
            var user = _context.Users.Where(u => u.Email == userEmail).FirstOrDefault();
            user.Role = role;
            _context.Update(user);
            var saved = _context.SaveChanges();
            if(saved >0)
                return new AuthResponseDto { Success = true, Message = "Succesfully selected plan." };
            else
                return new AuthResponseDto { Success = false, Message = "Selecting plan failed." };


        }
    }
}
