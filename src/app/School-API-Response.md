Create Scool
curl --location 'http://192.168.2.142:5051/schools' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBsZWFybmVyYXR0ZW5kYW5jZS5jb20iLCJ1c2VySWQiOiI4ZTE2M2M0Ni0wMDAwLTAwMDAtMDAwMC05M2Y3MDAwMDA4MzciLCJkZXZpY2VJZCI6ImRldmljZV81NzY1ZWM4YWQ3ZGE0N2M0XzkxNTIiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3Njc3NzA2NDUsImV4cCI6MTc2ODM3NTQ0NX0.nXwxV_uM9lc707kYuhTuc4xiOnp_yzQlC_lWgQuoqj8' \
--data-raw '{
    "name": "Global International School",
    "email": "office@global.edu",
    "countryCode": "+91",
    "mobileNo": "9000101011",
    "website": "www.harmony.edu",
    "addressLine1": "101 Unity Avenue",
    "addressLine2": "Global Block",
    "parishId": "921b4c01-0000-0000-0000-a84a000007eb",
    "logoUrl": "https://example.com/harmony-logo.png",
    "registrationNo": "REG100011"
  }'

Update

  curl --location --request PUT 'http://192.168.2.142:5051/schools/97171cd3-0000-0000-0000-afe500000b01' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBsZWFybmVyYXR0ZW5kYW5jZS5jb20iLCJ1c2VySWQiOiI4ZTE2M2M0Ni0wMDAwLTAwMDAtMDAwMC05M2Y3MDAwMDA4MzciLCJkZXZpY2VJZCI6ImRldmljZV81NzY1ZWM4YWQ3ZGE0N2M0XzkxNTIiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3Njc3NzA2NDUsImV4cCI6MTc2ODM3NTQ0NX0.nXwxV_uM9lc707kYuhTuc4xiOnp_yzQlC_lWgQuoqj8' \
--data-raw '{
  "name": "Updated St. Mary'\''s Primary School 01",
  "email": "updated@stmarys.edu 1",
  "countryCode": "+256",
  "mobileNo": "0987654321",
  "website": "",
  "addressLine1": "456 Updated Street",
  "addressLine2": "Updated Area",
  "parishId": "{{parishId}}",
  "logoUrl": "https://example.com/updated-logo.png",
  "registrationNo": "REG789012"
}'



Activate School
curl --location --request PATCH 'http://192.168.2.142:5051/schools/97171cd3-0000-0000-0000-afe500000b01/activate' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBsZWFybmVyYXR0ZW5kYW5jZS5jb20iLCJ1c2VySWQiOiI4ZTE2M2M0Ni0wMDAwLTAwMDAtMDAwMC05M2Y3MDAwMDA4MzciLCJkZXZpY2VJZCI6ImRldmljZV81NzY1ZWM4YWQ3ZGE0N2M0XzkxNTIiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3Njc3NzA2NDUsImV4cCI6MTc2ODM3NTQ0NX0.nXwxV_uM9lc707kYuhTuc4xiOnp_yzQlC_lWgQuoqj8'

Deactivate School
curl --location --request PATCH 'http://192.168.2.142:5051/schools/97171cd3-0000-0000-0000-afe500000b01/deactivate' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBsZWFybmVyYXR0ZW5kYW5jZS5jb20iLCJ1c2VySWQiOiI4ZTE2M2M0Ni0wMDAwLTAwMDAtMDAwMC05M2Y3MDAwMDA4MzciLCJkZXZpY2VJZCI6ImRldmljZV81NzY1ZWM4YWQ3ZGE0N2M0XzkxNTIiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3Njc3NzA2NDUsImV4cCI6MTc2ODM3NTQ0NX0.nXwxV_uM9lc707kYuhTuc4xiOnp_yzQlC_lWgQuoqj8'

Delete School
curl --location --request DELETE 'http://192.168.2.142:5051/schools/97171cd3-0000-0000-0000-afe500000b01' \
--header 'Authorization: Bearer '

Global Filter APIs for District,County,SubCounty and Parish

curl --location 'http://192.168.2.142:5051/filters?type=parish&districtId=92194a5a-0000-0000-0000-b8e9000005c6&countyId=9219c180-0000-0000-0000-b060000006ba&subCountyId=921b1249-0000-0000-0000-94c9000003e9' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBsZWFybmVyYXR0ZW5kYW5jZS5jb20iLCJ1c2VySWQiOiI4ZTE2M2M0Ni0wMDAwLTAwMDAtMDAwMC05M2Y3MDAwMDA4MzciLCJkZXZpY2VJZCI6ImRldmljZV81NzY1ZWM4YWQ3ZGE0N2M0XzkxNTIiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3Njc3NzA2NDUsImV4cCI6MTc2ODM3NTQ0NX0.nXwxV_uM9lc707kYuhTuc4xiOnp_yzQlC_lWgQuoqj8'