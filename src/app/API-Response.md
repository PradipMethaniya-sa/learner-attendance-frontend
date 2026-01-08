Get students
curl --location 'http://192.168.2.142:5051/students' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBsZWFybmVyYXR0ZW5kYW5jZS5jb20iLCJ1c2VySWQiOiI4ZTE2M2M0Ni0wMDAwLTAwMDAtMDAwMC05M2Y3MDAwMDA4MzciLCJkZXZpY2VJZCI6ImRldmljZV9lNzZmMzhmMjQ4ZDY0OGE4XzkxNTIiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3Njc4NjIwNzQsImV4cCI6MTc2ODQ2Njg3NH0.8j_Iy26yshWo_n6vziwoq16-EFApeCJorTkoEywoS7Q' \
--header 'x-academic-year-id: 92c82f38-0000-0000-0000-8b04000003c6' \
--header 'x-academic-term-id: 92e93e02-0000-0000-0000-84350000054d' \
--header 'x-school-id: 986679fb-0000-0000-0000-b15500000f55'

Responce:
{
    "success": true,
    "message": "Students retrieved successfully",
    "data": {
        "students": [
            {
                "id": "9d24d478-0000-0000-0000-987400000dac",
                "studentUid": "STU-26-00000010",
                "generalUserId": "9d24d476-0000-0000-0000-9c130000056a",
                "schoolId": "986679fb-0000-0000-0000-b15500000f55",
                "firstName": "Jane Updated",
                "lastName": "Smith Updated",
                "email": "kane.smith@example.com",
                "countryCode": "+1",
                "mobileNumber": "1234567890",
                "gender": "MALE",
                "dob": "2005-05-15",
                "hasSpecialNeeds": false,
                "orphanCategory": "SINGLE_ORPHAN",
                "avatarUrl": null,
                "status": "ACTIVE",
                "guardians": [],
                "addressLine1": "Raw Avenur 1",
                "addressLine2": "Suite 100",
                "districtId": "550e8400-e29b-41d4-a716-446655440001",
                "parishId": "921b4c01-0000-0000-0000-a84a000007eb",
                "nationality": "Indian",
                "createdAt": "2026-01-08 15:56:35",
                "updatedAt": "2026-01-08 15:56:35"
            },
            {
                "id": "9d2468a3-0000-0000-0000-ab9100000f32",
                "studentUid": "STU-26-00000009",
                "generalUserId": "9d246874-0000-0000-0000-bfd6000002fa",
                "schoolId": "986679fb-0000-0000-0000-b15500000f55",
                "firstName": "Alex",
                "lastName": "Johnson",
                "email": "alex.johnson@example.com",
                "countryCode": "+1",
                "mobileNumber": "1234567890",
                "gender": "MALE",
                "dob": "2005-05-15",
                "hasSpecialNeeds": false,
                "orphanCategory": "SINGLE_ORPHAN",
                "avatarUrl": null,
                "status": "ACTIVE",
                "guardians": [],
                "addressLine1": "Raw Avenur 1",
                "addressLine2": "Suite 100",
                "districtId": "550e8400-e29b-41d4-a716-446655440001",
                "parishId": "921b4c01-0000-0000-0000-a84a000007eb",
                "nationality": "Indian",
                "createdAt": "2026-01-08 15:56:07",
                "updatedAt": "2026-01-08 15:56:07"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 20,
            "totalElements": 2,
            "totalPages": 1,
            "hasNext": false,
            "hasPrevious": false,
            "first": true,
            "last": true,
            "numberOfElements": 0
        }
    },
    "timestamp": "2026-01-08T11:39:42.995673Z",
    "traceId": "2b305a4b-8709-4089-8d97-01a572b6be10"
}


Create Student
curl --location 'http://192.168.2.142:5051/students' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBsZWFybmVyYXR0ZW5kYW5jZS5jb20iLCJ1c2VySWQiOiI4ZTE2M2M0Ni0wMDAwLTAwMDAtMDAwMC05M2Y3MDAwMDA4MzciLCJkZXZpY2VJZCI6ImRldmljZV9lNzZmMzhmMjQ4ZDY0OGE4XzkxNTIiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3Njc4NjIwNzQsImV4cCI6MTc2ODQ2Njg3NH0.8j_Iy26yshWo_n6vziwoq16-EFApeCJorTkoEywoS7Q' \
--header 'x-academic-year-id: 92c82f38-0000-0000-0000-8b04000003c6' \
--header 'x-academic-term-id: 92e93e02-0000-0000-0000-84350000054d' \
--header 'x-school-id: 986679fb-0000-0000-0000-b15500000f55' \
--data-raw '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "kane.smith@example.com",
    "countryCode": "+1",
    "mobileNumber": "1234567890",
    "gender": "MALE",
    "dob": "2005-05-15",
    "hasSpecialNeeds": false,
    "addressLine1": "Raw Avenur 1",
    "addressLine2": "Suite 100",
    "districtId": "550e8400-e29b-41d4-a716-446655440001",
    "parishId": "921b4c01-0000-0000-0000-a84a000007eb",
    "orphanCategory": "SINGLE_ORPHAN",
    "nationality": "Indian"
}'

Responce:
{
    "success": true,
    "message": "Student registered successfully",
    "data": {
        "id": "9d24d478-0000-0000-0000-987400000dac",
        "studentUid": "STU-26-00000010",
        "generalUserId": "9d24d476-0000-0000-0000-9c130000056a",
        "schoolId": "986679fb-0000-0000-0000-b15500000f55",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "kane.smith@example.com",
        "countryCode": "+1",
        "mobileNumber": "1234567890",
        "gender": "MALE",
        "dob": "2005-05-15",
        "hasSpecialNeeds": false,
        "orphanCategory": "SINGLE_ORPHAN",
        "avatarUrl": null,
        "status": "ACTIVE",
        "guardians": [],
        "createdAt": "2026-01-08 15:56:35",
        "updatedAt": "2026-01-08 15:56:35"
    },
    "timestamp": "2026-01-08T10:26:35.271565Z",
    "traceId": "241a9a43-aa26-409d-86ce-d22178e0b846"
}

Update Student
curl --location --request PUT 'http://192.168.2.142:5051/students/9d24d478-0000-0000-0000-987400000dac' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBsZWFybmVyYXR0ZW5kYW5jZS5jb20iLCJ1c2VySWQiOiI4ZTE2M2M0Ni0wMDAwLTAwMDAtMDAwMC05M2Y3MDAwMDA4MzciLCJkZXZpY2VJZCI6ImRldmljZV9lNzZmMzhmMjQ4ZDY0OGE4XzkxNTIiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3Njc4NjIwNzQsImV4cCI6MTc2ODQ2Njg3NH0.8j_Iy26yshWo_n6vziwoq16-EFApeCJorTkoEywoS7Q' \
--header 'x-academic-year-id: 92c82f38-0000-0000-0000-8b04000003c6' \
--header 'x-academic-term-id: 92e93e02-0000-0000-0000-84350000054d' \
--header 'x-school-id: 986679fb-0000-0000-0000-b15500000f55' \
--data-raw '{
    "firstName": "Jane Updated",
    "lastName": "Smith Updated",
    "email": "kane.smith@example.com",
    "countryCode": "+1",
    "mobileNumber": "1234567890",
    "gender": "MALE",
    "dob": "2005-05-15",
    "hasSpecialNeeds": false,
    "orphanCategory": "SINGLE_ORPHAN",
    "addressLine1": "Raw Avenur 1",
    "addressLine2": "Suite 100",
    "districtId": "550e8400-e29b-41d4-a716-446655440001",
    "parishId": "921b4c01-0000-0000-0000-a84a000007eb",
    "nationality": "Indian"
}'

Responce:
{
    "success": true,
    "message": "Student updated successfully",
    "data": {
        "id": "9d24d478-0000-0000-0000-987400000dac",
        "studentUid": "STU-26-00000010",
        "generalUserId": "9d24d476-0000-0000-0000-9c130000056a",
        "schoolId": "986679fb-0000-0000-0000-b15500000f55",
        "firstName": "Jane Updated",
        "lastName": "Smith Updated",
        "email": "kane.smith@example.com",
        "countryCode": "+1",
        "mobileNumber": "1234567890",
        "gender": "MALE",
        "dob": "2005-05-15",
        "hasSpecialNeeds": false,
        "orphanCategory": "SINGLE_ORPHAN",
        "avatarUrl": null,
        "status": "ACTIVE",
        "guardians": [],
        "addressLine1": "Raw Avenur 1",
        "addressLine2": "Suite 100",
        "districtId": "550e8400-e29b-41d4-a716-446655440001",
        "parishId": "921b4c01-0000-0000-0000-a84a000007eb",
        "nationality": "Indian",
        "createdAt": "2026-01-08 15:56:35",
        "updatedAt": "2026-01-08 15:56:35"
    },
    "timestamp": "2026-01-08T11:39:35.365864Z",
    "traceId": "e3136e82-4775-47da-afab-b25c97546735"
}

Get Orphan categories list
curl --location 'http://192.168.2.142:5051/students/orphan-categories' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBsZWFybmVyYXR0ZW5kYW5jZS5jb20iLCJ1c2VySWQiOiI4ZTE2M2M0Ni0wMDAwLTAwMDAtMDAwMC05M2Y3MDAwMDA4MzciLCJkZXZpY2VJZCI6ImRldmljZV9lNzZmMzhmMjQ4ZDY0OGE4XzkxNTIiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3Njc4NjIwNzQsImV4cCI6MTc2ODQ2Njg3NH0.8j_Iy26yshWo_n6vziwoq16-EFApeCJorTkoEywoS7Q' \
--header 'x-academic-year-id: 92c82f38-0000-0000-0000-8b04000003c6' \
--header 'x-academic-term-id: 92e93e02-0000-0000-0000-84350000054d' \
--header 'x-school-id: 986679fb-0000-0000-0000-b15500000f55'

Get Student detail by ID
curl --location 'http://192.168.2.142:5051/students/9d24d478-0000-0000-0000-987400000dac' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBsZWFybmVyYXR0ZW5kYW5jZS5jb20iLCJ1c2VySWQiOiI4ZTE2M2M0Ni0wMDAwLTAwMDAtMDAwMC05M2Y3MDAwMDA4MzciLCJkZXZpY2VJZCI6ImRldmljZV9lNzZmMzhmMjQ4ZDY0OGE4XzkxNTIiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3Njc4NjIwNzQsImV4cCI6MTc2ODQ2Njg3NH0.8j_Iy26yshWo_n6vziwoq16-EFApeCJorTkoEywoS7Q' \
--header 'x-academic-year-id: 92c82f38-0000-0000-0000-8b04000003c6' \
--header 'x-academic-term-id: 92e93e02-0000-0000-0000-84350000054d' \
--header 'x-school-id: 986679fb-0000-0000-0000-b15500000f55'

Responce
{
    "success": true,
    "message": "Student retrieved successfully",
    "data": {
        "id": "9d24d478-0000-0000-0000-987400000dac",
        "studentUid": "STU-26-00000010",
        "generalUserId": "9d24d476-0000-0000-0000-9c130000056a",
        "schoolId": "986679fb-0000-0000-0000-b15500000f55",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "kane.smith@example.com",
        "countryCode": "+1",
        "mobileNumber": "1234567890",
        "gender": "MALE",
        "dob": "2005-05-15",
        "hasSpecialNeeds": false,
        "orphanCategory": "SINGLE_ORPHAN",
        "avatarUrl": null,
        "status": "ACTIVE",
        "guardians": [],
        "addressLine1": "Raw Avenur 1",
        "addressLine2": "Suite 100",
        "districtId": "550e8400-e29b-41d4-a716-446655440001",
        "parishId": "921b4c01-0000-0000-0000-a84a000007eb",
        "nationality": "Indian",
        "createdAt": "2026-01-08 15:56:35",
        "updatedAt": "2026-01-08 15:56:35"
    },
    "timestamp": "2026-01-08T11:38:41.468451Z",
    "traceId": "3e46d109-b86f-4075-b439-721649d27394"
}

Get Guardian List
curl --location 'http://192.168.2.142:5051/guardians?page=1&limit=20&sortBy=firstName&orderBy=asc' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBsZWFybmVyYXR0ZW5kYW5jZS5jb20iLCJ1c2VySWQiOiI4ZTE2M2M0Ni0wMDAwLTAwMDAtMDAwMC05M2Y3MDAwMDA4MzciLCJkZXZpY2VJZCI6ImRldmljZV9lNzZmMzhmMjQ4ZDY0OGE4XzkxNTIiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3Njc4NjIwNzQsImV4cCI6MTc2ODQ2Njg3NH0.8j_Iy26yshWo_n6vziwoq16-EFApeCJorTkoEywoS7Q' \
--header 'x-academic-year-id: 92c82f38-0000-0000-0000-8b04000003c6' \
--header 'x-academic-term-id: 92e93e02-0000-0000-0000-84350000054d' \
--header 'x-school-id: 986679fb-0000-0000-0000-b15500000f55'

Responce:
{
    "success": true,
    "message": "Guardians retrieved successfully",
    "data": {
        "guardians": [
            {
                "id": "9d894657-0000-0000-0000-bec100000155",
                "guardianUid": "GRD-26-00000003",
                "generalUserInfoId": "9d89462c-0000-0000-0000-be200000075b",
                "schoolId": "986679fb-0000-0000-0000-b15500000f55",
                "firstName": "guard Updated",
                "lastName": "last 1767864195176",
                "email": "guardian17678641951761@example.com",
                "countryCode": "+1",
                "mobileNumber": "12345678955",
                "nationalId": "NAT1234567895",
                "gender": "MALE",
                "dob": null,
                "addressLine1": "123 Main Street",
                "addressLine2": "Apt 4B",
                "districtId": "550e8400-e29b-41d4-a716-446655440001",
                "parishId": "921b4c01-0000-0000-0000-a84a000007eb",
                "nationality": "American",
                "avatarUrl": null,
                "status": "ACTIVE",
                "createdAt": "2026-01-08 17:46:18",
                "updatedAt": "2026-01-08 17:46:18"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 20,
            "totalElements": 1,
            "totalPages": 1,
            "hasNext": false,
            "hasPrevious": false,
            "first": true,
            "last": true,
            "numberOfElements": 0
        }
    },
    "timestamp": "2026-01-08T12:19:10.772182Z",
    "traceId": "d612360d-b560-4b04-a203-49a104c772e4"
}

Get Guardian details by ID
curl --location 'http://192.168.2.142:5051/guardians/9d894657-0000-0000-0000-bec100000155' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBsZWFybmVyYXR0ZW5kYW5jZS5jb20iLCJ1c2VySWQiOiI4ZTE2M2M0Ni0wMDAwLTAwMDAtMDAwMC05M2Y3MDAwMDA4MzciLCJkZXZpY2VJZCI6ImRldmljZV9lNzZmMzhmMjQ4ZDY0OGE4XzkxNTIiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3Njc4NjIwNzQsImV4cCI6MTc2ODQ2Njg3NH0.8j_Iy26yshWo_n6vziwoq16-EFApeCJorTkoEywoS7Q' \
--header 'x-academic-year-id: 92c82f38-0000-0000-0000-8b04000003c6' \
--header 'x-academic-term-id: 92e93e02-0000-0000-0000-84350000054d' \
--header 'x-school-id: 986679fb-0000-0000-0000-b15500000f55'

Responce:
{
    "success": true,
    "message": "Guardian retrieved successfully",
    "data": {
        "id": "9d894657-0000-0000-0000-bec100000155",
        "guardianUid": "GRD-26-00000003",
        "generalUserInfoId": "9d89462c-0000-0000-0000-be200000075b",
        "schoolId": "986679fb-0000-0000-0000-b15500000f55",
        "firstName": "guard Updated",
        "lastName": "last 1767864195176",
        "email": "guardian17678641951761@example.com",
        "countryCode": "+1",
        "mobileNumber": "12345678955",
        "nationalId": "NAT1234567895",
        "gender": "MALE",
        "dob": null,
        "addressLine1": "123 Main Street",
        "addressLine2": "Apt 4B",
        "districtId": "550e8400-e29b-41d4-a716-446655440001",
        "parishId": "921b4c01-0000-0000-0000-a84a000007eb",
        "nationality": "American",
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-01-08 17:46:18",
        "updatedAt": "2026-01-08 17:46:18"
    },
    "timestamp": "2026-01-08T12:19:06.264181Z",
    "traceId": "5cb43c6e-6a8b-4189-adcf-829f91ea2b71"
}

Create Guardian
curl --location 'http://192.168.2.142:5051/guardians' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBsZWFybmVyYXR0ZW5kYW5jZS5jb20iLCJ1c2VySWQiOiI4ZTE2M2M0Ni0wMDAwLTAwMDAtMDAwMC05M2Y3MDAwMDA4MzciLCJkZXZpY2VJZCI6ImRldmljZV9lNzZmMzhmMjQ4ZDY0OGE4XzkxNTIiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3Njc4NjIwNzQsImV4cCI6MTc2ODQ2Njg3NH0.8j_Iy26yshWo_n6vziwoq16-EFApeCJorTkoEywoS7Q' \
--header 'x-academic-year-id: 92c82f38-0000-0000-0000-8b04000003c6' \
--header 'x-academic-term-id: 92e93e02-0000-0000-0000-84350000054d' \
--header 'x-school-id: 986679fb-0000-0000-0000-b15500000f55' \
--data-raw '{
    "firstName": "Guarding 1",
    "lastName": "last 1767864195176",
    "email": "guardian17678641951761@example.com",
    "countryCode": "+1",
    "mobileNumber": "12345678955",
    "nationalId": "NAT1234567895",
    "gender": "MALE",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apt 4B",
    "districtId": "550e8400-e29b-41d4-a716-446655440001",
    "parishId": "921b4c01-0000-0000-0000-a84a000007eb",
    "nationality": "American"
}'

Response:
{
    "success": true,
    "message": "Guardian added successfully",
    "data": {
        "id": "9d894657-0000-0000-0000-bec100000155",
        "guardianUid": "GRD-26-00000003",
        "generalUserInfoId": "9d89462c-0000-0000-0000-be200000075b",
        "schoolId": "986679fb-0000-0000-0000-b15500000f55",
        "firstName": "Guarding 1",
        "lastName": "last 1767864195176",
        "email": "guardian17678641951761@example.com",
        "countryCode": "+1",
        "mobileNumber": "12345678955",
        "nationalId": "NAT1234567895",
        "gender": "MALE",
        "dob": null,
        "addressLine1": "123 Main Street",
        "addressLine2": "Apt 4B",
        "districtId": "550e8400-e29b-41d4-a716-446655440001",
        "parishId": "921b4c01-0000-0000-0000-a84a000007eb",
        "nationality": "American",
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": null,
        "updatedAt": null
    },
    "timestamp": "2026-01-08T12:16:18.015047Z",
    "traceId": "acb7ba11-3a4b-4ea6-bd3e-f25339e2c0e7"
}


Update Guardian
curl --location --request PUT 'http://192.168.2.142:5051/guardians/9d894657-0000-0000-0000-bec100000155' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBsZWFybmVyYXR0ZW5kYW5jZS5jb20iLCJ1c2VySWQiOiI4ZTE2M2M0Ni0wMDAwLTAwMDAtMDAwMC05M2Y3MDAwMDA4MzciLCJkZXZpY2VJZCI6ImRldmljZV9lNzZmMzhmMjQ4ZDY0OGE4XzkxNTIiLCJ0b2tlblR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3Njc4NjIwNzQsImV4cCI6MTc2ODQ2Njg3NH0.8j_Iy26yshWo_n6vziwoq16-EFApeCJorTkoEywoS7Q' \
--header 'x-academic-year-id: 92c82f38-0000-0000-0000-8b04000003c6' \
--header 'x-academic-term-id: 92e93e02-0000-0000-0000-84350000054d' \
--header 'x-school-id: 986679fb-0000-0000-0000-b15500000f55' \
--data-raw '{
    "firstName": "guard Updated",
    "lastName": "Doe Updated",
    "email": "john.updated@example.com",
    "countryCode": "+1",
    "mobileNumber": "1234567891",
    "nationalId": "NAT123456789",
    "gender": "MALE",
    "addressLine1": "456 Updated Street",
    "addressLine2": "Suite 100",
    "districtId": "550e8400-e29b-41d4-a716-446655440001",
    "parishId": "{{parishId}}",
    "nationality": "American"
}'

Response:
{
    "success": true,
    "message": "Guardian updated successfully",
    "data": {
        "id": "9d894657-0000-0000-0000-bec100000155",
        "guardianUid": "GRD-26-00000003",
        "generalUserInfoId": "9d89462c-0000-0000-0000-be200000075b",
        "schoolId": "986679fb-0000-0000-0000-b15500000f55",
        "firstName": "guard Updated",
        "lastName": "last 1767864195176",
        "email": "guardian17678641951761@example.com",
        "countryCode": "+1",
        "mobileNumber": "12345678955",
        "nationalId": "NAT1234567895",
        "gender": "MALE",
        "dob": null,
        "addressLine1": "123 Main Street",
        "addressLine2": "Apt 4B",
        "districtId": "550e8400-e29b-41d4-a716-446655440001",
        "parishId": "921b4c01-0000-0000-0000-a84a000007eb",
        "nationality": "American",
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-01-08 17:46:18",
        "updatedAt": "2026-01-08 17:46:18"
    },
    "timestamp": "2026-01-08T12:17:31.924019Z",
    "traceId": "40177075-5357-432d-b9b3-3edb2ea1cecd"
}

