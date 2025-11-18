## API Documentation

### AUTH

---

**- Register**

_URL_ - `BASE_URL/auth/register-user`

_Method_ - `POST`

_Sample Request_

```json
{
  "name": "example",
  "email": "example@abc.com",
  "password": "xyz"
}
```

_Response_

`201- Created`

```json
{
  "message": "User registered successfully. Please log in."
}
```

**- Login**

_URL_ - `BASE_URL/auth/login`

_Method_ - `POST`

_Sample Request_

```json
{
  "email": "example@abc.com",
  "password": "example"
}
```

_Response_

`200- OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyb2hpdGhAYWJjLmNvbSIsInJvbGUiOiJbUk9MRV9BRE1JTl0iLCJpYXQiOjE3NjE3MzgzMzIsImV4cCI6MTc2MTc3NDMzMn0.dxcxpzmxPVKj-Ssq2gDJKEWmPYAyCRcvxcvTrr4k0E",
  "email": "example@abc.com",
  "role": "USER",
  "message": "Login successful"
}
```

---

### ADMIN

---

**- Create Room**

_URL_ - `BASE_URL/admin/rooms`

_Method_ - `POST`

_Sample Request_

```json
{
  "name": "Prayaga Inn",
  "capacity": 30,
  "location": "Trivandrum",
  "resources": ["AC", "Wifi"]
}
```

_Response_

`201- Created`

```json
{
  "id": "691c2ea1595851794245b4ec",
  "name": "Prayaga Inn",
  "capacity": 30,
  "location": "Trivandrum",
  "resources": ["AC", "Wifi"],
  "createdBy": "69084ba6c20df417c5a57cab"
}
```

---

**- Get Rooms for Admin**

_URL_ - `BASE_URL/admin/rooms`

_Method_ - `GET`

_Response_

`200- OK`

```json
[
  {
    "id": "691c2ea1595851794245b4ec",
    "name": "Prayaga Inn",
    "capacity": 30,
    "location": "Trivandrum",
    "resources": ["AC", "Wifi"],
    "createdBy": "69084ba6c20df417c5a57cab"
  }
]
```

---

**- Update a Room**

_URL_ - `BASE_URL/admin/rooms/{id}`

_Method_ - `PUT`

_Sample Request_

```json
{
  "name": "Prayaga Inn",
  "capacity": 30,
  "location": "Trivandrum",
  "resources": ["AC", "Wifi", "TV"]
}
```

_Response_

`200- OK`

```json
{
  "id": "691c2ea1595851794245b4ec",
  "name": "Prayaga Inn",
  "capacity": 30,
  "location": "Trivandrum",
  "resources": ["AC", "Wifi", "TV"],
  "createdBy": "69084ba6c20df417c5a57cab"
}
```

---

**- Delete a Room**

_URL_ - `BASE_URL/admin/rooms/{id}`

_Method_ - `DELETE`

_Response_

`204- No Content`

---

**- Update status of a booking**

_URL_ - `BASE_URL/admin/bookings/status/{id}?status=APPROVED`

_Method_ - `PATCH`

_Response_

`200- OK`

```json
{
  "id": "691acef9c801df89687723c4",
  "roomId": "691acbc6c801df89687723bc",
  "userId": "691ace0bc801df89687723c2",
  "startTime": "2026-01-21T05:00:00Z",
  "endTime": "2026-01-21T10:00:00Z",
  "status": "APPROVED",
  "purpose": "Birthday Party"
}
```

---

**- Get bookings for admin**

_URL_ - `BASE_URL/admin/bookings`

_Method_ - `GET`

_Response_

`200- OK`

```json
[
  {
    "id": "691acef9c801df89687723c4",
    "roomId": "691acbc6c801df89687723bc",
    "userId": "691ace0bc801df89687723c2",
    "startTime": "2026-01-21T05:00:00Z",
    "endTime": "2026-01-21T10:00:00Z",
    "status": "APPROVED",
    "purpose": "Birthday Party"
  },
  {
    "id": "691aed2c8391b93e97eda9b9",
    "roomId": "69145c265a3fa0a56915a1b0",
    "userId": "69084849c20df417c5a57caa",
    "startTime": "2025-12-22T05:30:00Z",
    "endTime": "2025-12-22T09:30:00Z",
    "status": "APPROVED",
    "purpose": "Christmas celebration"
  },
  {
    "id": "691c1d7023c52bcc88a94df6",
    "roomId": "691acbc6c801df89687723bc",
    "userId": "69084849c20df417c5a57caa",
    "startTime": "2026-01-30T06:00:00Z",
    "endTime": "2026-01-30T09:30:00Z",
    "status": "PENDING",
    "purpose": "Meeting"
  }
]
```

---

**- Get bookings stats for admin**

_URL_ - `BASE_URL/admin/bookingStats`

_Method_ - `GET`

_Response_

`200- OK`

```json
{
  "totalBookings": 5,
  "pending": 1,
  "approved": 2,
  "cancelled": 1,
  "rejected": 1
}
```

---

### AVAILABILITY

---

**- Create rule**

_URL_ - `BASE_URL/availability`

_Method_ - `POST`

_Sample Request_

```json
{
  "roomId": "691c395dbd6e349f94b83f92",
  "ruleType": "WEEKLY_CLOSED",
  "dayOfWeek": "SUNDAY",
  "reason": "Weekly off"
}
```

_Response_

`201- Created`

```json
{
  "id": "691c3e0abd6e349f94b83f93",
  "roomId": "691c395dbd6e349f94b83f92",
  "ruleType": "WEEKLY_CLOSED",
  "createdBy": "69084ba6c20df417c5a57cab",
  "date": null,
  "dayOfWeek": "SUNDAY",
  "startTime": null,
  "endTime": null,
  "reason": "Weekly off"
}
```

---

**Get rules for the room**

_URL_ - `BASE_URL/availability/{roomId}`

_Method_ - `GET`

_Response_

`200- OK`

```json
[
  {
    "id": "691c3e0abd6e349f94b83f93",
    "roomId": "691c395dbd6e349f94b83f92",
    "ruleType": "WEEKLY_CLOSED",
    "createdBy": "69084ba6c20df417c5a57cab",
    "date": null,
    "dayOfWeek": "SUNDAY",
    "startTime": null,
    "endTime": null,
    "reason": "Weekly off"
  }
]
```

---

**Get rules for the room**

_URL_ - `BASE_URL/availability/{ruleId}`

_Method_ - `DELETE`

_Response_

`200- OK`

```json
Rule deleted successfully
```

---

### USER

---

**- Create Booking**

_URL_ - `BASE_URL/user/bookings`

_Method_ - `POST`

_Sample Request_

```json
{
  "roomId": "691c395dbd6e349f94b83f92",
  "startTime": "2025-12-21T10:00:00Z",
  "endTime": "2025-12-21T12:00:00Z",
  "purpose": "Birthday Party"
}
```

_Response_

`201- Created`

```json
{
  "id": "691c40bfbd6e349f94b83f94",
  "roomId": "691c395dbd6e349f94b83f92",
  "userId": "69084849c20df417c5a57caa",
  "startTime": "2025-12-21T10:00:00Z",
  "endTime": "2025-12-21T12:00:00Z",
  "status": "PENDING",
  "purpose": "Birthday Party"
}
```

---

**- Get bookings for the user**

_URL_ - `BASE_URL/user/bookings`

_Method_ - `GET`

_Response_

`200- OK`

```json
[
  {
    "id": "691c1d7023c52bcc88a94df6",
    "roomId": "691acbc6c801df89687723bc",
    "userId": "69084849c20df417c5a57caa",
    "startTime": "2026-01-30T06:00:00Z",
    "endTime": "2026-01-30T09:30:00Z",
    "status": "PENDING",
    "purpose": "Meeting"
  },
  {
    "id": "691c40bfbd6e349f94b83f94",
    "roomId": "691c395dbd6e349f94b83f92",
    "userId": "69084849c20df417c5a57caa",
    "startTime": "2025-12-21T10:00:00Z",
    "endTime": "2025-12-21T12:00:00Z",
    "status": "PENDING",
    "purpose": "Birthday Party"
  }
]
```

---

**- Get all available rooms**

_URL_ - `BASE_URL/user/rooms`

_Method_ - `GET`

_Response_

`200- OK`

```json
[
  {
    "id": "690d87ec959d8bf81212002d",
    "name": "Leads Library",
    "capacity": 60,
    "location": "Kollam",
    "resources": ["WiFi", "AC", "Projector"],
    "createdBy": "69084ba6c20df417c5a57cab"
  },
  {
    "id": "69145c265a3fa0a56915a1b0",
    "name": "Kerala University Opera hall",
    "capacity": 200,
    "location": "Trivandrum",
    "resources": ["WiFi", "AC"],
    "createdBy": "69084ba6c20df417c5a57cab"
  }
]
```

---

**- Cancel Booking**

_URL_ - `BASE_URL/user/bookings/cancel/{id}`

_Method_ - `PATCH`

_Response_

`200- OK`

```json
{
  "id": "691c40bfbd6e349f94b83f94",
  "roomId": "691c395dbd6e349f94b83f92",
  "userId": "69084849c20df417c5a57caa",
  "startTime": "2025-12-21T10:00:00Z",
  "endTime": "2025-12-21T12:00:00Z",
  "status": "CANCELLED",
  "purpose": "Birthday Party"
}
```

---
