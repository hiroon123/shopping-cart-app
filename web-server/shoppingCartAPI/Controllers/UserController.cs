using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using MimeKit;
using shoppingCartAPI;
using shoppingCartAPI.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using NuGet.Common;
using Microsoft.AspNetCore.Identity;

namespace shoppingCartAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public UserController(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<user>>> GetUsers()
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            return await _context.Users.ToListAsync();
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<user>> Getuser(int id)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/User/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> Putuser(int id, user user)
        {
            if (id != user.id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!userExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/User/Register
        //api/post
        [HttpPost("Register")]
        public async Task<ActionResult> Register(user_register_request request)
        {
            if (_context.Users.Any(u => u.email == request.email))
            {
                return BadRequest("User already exists");
            }

            createPasswordHash(request.password, out byte[] passwordHash, out byte[] passwordSalt);

            var user = new user
            {
                email = request.email,
                passwordHash = passwordHash,
                passwordSalt = passwordSalt,
                first_name = request.first_name,
                last_name = request.last_name,
                dob = request.dob,
                gender = request.gender,
                created = DateTime.UtcNow,
                modified = DateTime.UtcNow
            };

            _context.Users.Add(user);
            
            await _context.SaveChangesAsync();

            return Ok();
        }

        //Generate Password Hash and Salt
        private void createPasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        //Generate Random Token
        private string createToken(int size)
        {
            var random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, size)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        //Send Email Verification Code
        [HttpPost("SendVerificationEmail")]
        public async Task<ActionResult> SendEmailVerification(string email_address)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email_address);

            if (user == null)
            {
                return BadRequest("User Not Found");
            }

            var generated_verification_token = createToken(6);

            user.verification_token = generated_verification_token;
            user.verfied_at = null;

            _context.SaveChanges();

            string fromMail = "createsyhotline@gmail.com";
            string fromPwd = "prwxuhdttdeumxyb";

            MailMessage message = new MailMessage();
            message.From = new MailAddress(fromMail);
            message.Subject = "Shopsy - Verification Code";
            message.To.Add(new MailAddress(email_address));
            message.Body = "<html><body><h4>Your Verification Code: </h4><h4>" + generated_verification_token + "</h4></body></html>";
            message.IsBodyHtml = true;

            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(fromMail, fromPwd),
                EnableSsl = true
            };

            smtpClient.Send(message);
            return Ok();
        }

        //Verify Authentication Token
        //api/post
        [HttpPost("VerifyToken")]
        public async Task<ActionResult> VerifyToken(string email, string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email && u.verification_token == token);
            if (user == null)
            {
                return BadRequest("Invalid Token");
            }
            user.verfied_at = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // POST: api/User/Login
        //api/post
        [HttpPost("Login")]
        public async Task<ActionResult> Login(user_login_request request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == request.email);

            if (user == null)
            {
                return BadRequest("User Not Found");
            }

            if (!verifyPasswordHash(request.password, user.passwordHash, user.passwordSalt))
            {
                return BadRequest("Wrong Password");
            }

            if (user.verfied_at == null)
            {
                return BadRequest("Not Verified");
            }

            var out_user = new user
            {
                id= user.id,
                email = user.email,
                first_name = user.first_name,
                last_name = user.last_name,
                dob = user.dob,
                gender = user.gender,
                created = user.created
            };

            //string token = createJWT(user);

            //Create cookie containing auth token
            /*Response.Cookies.Append("shopsyLoggedInUser",token, new CookieOptions()
             {
                 Expires = DateTimeOffset.Now.AddHours(2),
                 Path = "/",
                 HttpOnly = false,
                 Secure = false,
             });*/


            return Ok(out_user);
        }

        //Get logged in user data
        // GET: api/User/Login
        [HttpGet("Authenticate")]
        public async Task<ActionResult<user>> GetUserProfile()
        {
            user user_;
            var token = Request.Cookies["shopsyLoggedInUser"];

            if (token == null && token == "")
            {

                return BadRequest();
            }
            else
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.ReadToken(token) as JwtSecurityToken;
                var stringClaimValue = securityToken.Claims.First(claim => claim.Type == "UserID").Value;

                user_ = await _context.Users.FindAsync(Int32.Parse(stringClaimValue));

                if (user_ == null)
                {
                    return NotFound();
                }

            }

            return user_;
        }


        //Check Password Hash and Salt
        private bool verifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedPasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedPasswordHash.SequenceEqual(passwordHash);
            }
        }

        //Create JSON Web Token
        private string createJWT(user user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim("UserID", user.id.ToString())
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:JWTkey").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims:claims,
                expires:DateTime.Now.AddDays(1),
                signingCredentials:cred);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        //Forgot Password -> Send Password Reset Code
        //api/post
        [HttpPost("ForgotPassword")]
        public async Task<ActionResult> ForgotPassword(string email_address)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email_address);

            if (user == null)
            {
                return BadRequest("User Not Found");
            }

            var generated_reset_token = createToken(15).ToString();

            user.password_reset_token = generated_reset_token;
            user.reset_token_expires = DateTime.UtcNow.AddDays(1);

            await _context.SaveChangesAsync();


            /* var email = new MimeMessage();
             email.From.Add(MailboxAddress.Parse("desiree.ankunding43@ethereal.email"));
             email.To.Add(MailboxAddress.Parse(email_address));
             email.Subject = "Password verification code";

             string body = "<h4>Your Password Reset Code: </h4><h6>" + generated_reset_token + "</h6>";

             email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = body };

             using var smtp = new SmtpClient();
             smtp.Connect("smtp.ethereal.email", 587, MailKit.Security.SecureSocketOptions.StartTlsWhenAvailable);
             smtp.Authenticate("desiree.ankunding43@ethereal.email", "vy2FzdxKuRepQgAz8z");
             smtp.Send(email);
             smtp.Disconnect(true);
            */

            return Ok();
        }

        //Reset Password
        //api/post
        [HttpPost("ResetPassword")]
        public async Task<ActionResult> ResetPassword(reset_password_request request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == request.email && u.password_reset_token == request.token);
            if (user == null)
            {
                return BadRequest("Invalid Token");
            }

            createPasswordHash(request.password, out byte[] passwrodHash, out byte[] passwordSalt);
            user.passwordHash = passwrodHash;
            user.passwordSalt = passwordSalt;
            user.password_reset_token = null;
            user.reset_token_expires = null;

            await _context.SaveChangesAsync();
            return Ok("Password Reset");
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deleteuser(int id)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool userExists(int id)
        {
            return (_context.Users?.Any(e => e.id == id)).GetValueOrDefault();
        }
    }
}
