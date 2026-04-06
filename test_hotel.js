
fetch("http://localhost:8080/v1/auth/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name: "T3", email: "t3@bata.com", password: "password"})
}).then(() => fetch("http://localhost:8080/v1/auth/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email: "t3@bata.com", password: "password"})
})).then(r => r.json()).then(data => {
    if (!data.token) { console.log("NO TOKEN", data); process.exit(1); }
    return fetch("http://localhost:8080/v1/bookings/hotel", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + data.token },
        body: JSON.stringify({ room_type_id: 1, check_in: "2026-04-10", check_out: "2026-04-12", guests: 2 })
    });
}).then(res => res.text().then(text => console.log("FINAL STATUS:", res.status, text))).catch(console.error);

