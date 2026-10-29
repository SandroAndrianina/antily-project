# without a token: 401 expected
curl -i http://localhost:3000/member

# with a token: [] or the list expected (paste the token from your login)
curl http://localhost:3000/member -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMDI4ZGUxZC02NTQ3LTRmYWMtYThmZi0wZmZjZThkNTU3ZGQiLCJlbWFpbCI6ImFAYS5jb20iLCJpYXQiOjE3OTI3NDYyMDEsImV4cCI6MTc5MjgzMjYwMX0.-SQLzK5a8im5GDZdzc9PV28V3oZmzdw_xpzvI29IktY"