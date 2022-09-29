export function jwtDecode(t) {
    if (!t) {
        console.error("t is undefined")
        return "";
    }
    let token = {};
    token.raw = t;
    token.header = JSON.parse(window.atob(t.split('.')[0]));
    token.payload = JSON.parse(window.atob(t.split('.')[1]));
    return token.payload
}
