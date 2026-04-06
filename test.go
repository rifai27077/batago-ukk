
package main

import (
"bytes"
"encoding/json"
"fmt"
"io/ioutil"
"net/http"
)

func main() {
body := map[string]interface{}{
"room_type_id": 1,
"check_in":     "2026-04-10",
"check_out":    "2026-04-12",
"guests":       2,
}
b, _ := json.Marshal(body)
req, _ := http.NewRequest("POST", "http://localhost:8080/v1/bookings/hotel", bytes.NewBuffer(b))
req.Header.Set("Content-Type", "application/json")
// Using the mock token that I can bypass with by removing auth middleware just for a test, or I can just use my DB token
// Wait, I am not sending a token!
res, _ := http.DefaultClient.Do(req)
defer res.Body.Close()
respBody, _ := ioutil.ReadAll(res.Body)
fmt.Println(res.StatusCode, string(respBody))
}

