-- nginx-jwt.lua
local cjson = require "cjson"
local jwt = require "resty.jwt"
--your secret
local secret = "MTc2MTY5ZGVkNmQwMzQzNjkwODhiZWQ2ZWU5Njg3YmQ5MWJkNDE5MzlmMDVlODQyMDQ5YTVkYmRiNDFjZTE0OGU3ZjI4ZjZmODMyY2ZhZDQxMjc2NmI3ODUxYjU2MDliMmJlYWNlYWJkYzVmNmIzNWE2YTBhNjllYWZkZDY4NWE="
-- No authentication required api detailed list
local no_need_token_api_list = {'/api/user/register', '/api/user/login'}
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
--decode_base64 Consistent with the back end
local jwt_obj = jwt:verify(ngx.decode_base64(secret), token)
if jwt_obj.verified == false then
ngx.log(ngx.ERR, "Invalid token: ".. jwt_obj.reason)
ngx.status = ngx.HTTP_UNAUTHORIZED
ngx.say(cjson.encode(jwt_obj))
ngx.header.content_type = "application/json; charset=utf-8"
ngx.exit(ngx.HTTP_UNAUTHORIZED)
end
end
return M
