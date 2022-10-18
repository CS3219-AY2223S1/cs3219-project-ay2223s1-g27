-- nginx-jwt.lua
local cjson = require "cjson"
local jwt = require "resty.jwt"
--your secret
local secret = os.getenv("JWT_ACCESS_SECRET")
-- No authentication required api detailed list
local no_need_token_api_list = {'/api/user/login', '/api/user/createuser', '/api/user/renewtokens', '/api/user/resetpassword', '/api/user/logout', '/api/user/sendresetlink'}
local function ignore_url (val)
for index, value in ipairs(no_need_token_api_list) do
if (value == val) then
return true
end
end
return false
end
local M = {}
function M.auth()
if ignore_url(ngx.var.request_uri) then
return
else
end
-- require Authorization request header
local auth_header = ngx.var.http_Authorization
if auth_header == nil then
ngx.log(ngx.WARN, "No Authorization header")
ngx.exit(ngx.HTTP_UNAUTHORIZED)
end
-- require Bearer token
local _, _, token = string.find(auth_header, "Bearer%s+(.+)")
if token == nil then
ngx.log(ngx.ERR, "Missing token")
ngx.exit(ngx.HTTP_UNAUTHORIZED)
end
-- Consistent with the back end
local jwt_obj = jwt:verify(secret, token)
if jwt_obj.verified == false then
ngx.log(ngx.ERR, "Invalid token: ".. jwt_obj.reason)
ngx.status = ngx.HTTP_UNAUTHORIZED
ngx.say(cjson.encode(jwt_obj))
ngx.header.content_type = "application/json; charset=utf-8"
ngx.exit(ngx.HTTP_UNAUTHORIZED)
end
end
return M
