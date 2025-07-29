# RSVP System API - Frontend Integration Guide

## Table of Contents
- [Authentication](#authentication)
- [API Base URL & Headers](#api-base-url--headers)
- [Error Handling](#error-handling)
- [RSVP Endpoints](#rsvp-endpoints)
- [Data Models](#data-models)
- [Role-Based Access Control](#role-based-access-control)
- [Notification System](#notification-system)
- [Best Practices](#best-practices)

## Authentication

All RSVP endpoints require authentication. Include the JWT token in requests:

```javascript
// Headers for authenticated requests
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}

// Or use cookies (if configured)
// Token will be automatically included from httpOnly cookies
```

### User Roles
- `ADMIN`: Full access to all events and management features
- `GUIDE`: Access to guide-specific events and general events
- `SCHOLAR`: Access to scholar-specific events and general events  
- `PARTNER`: Access to general events only

## API Base URL & Headers

```javascript
const API_BASE_URL = 'https://your-api-domain.com/api'
const RSVP_BASE_URL = `${API_BASE_URL}/rsvp`

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

## Error Handling

### Standard Error Response Format
```json
{
  "status": "fail" | "error",
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "errorCode": "BAD_REQUEST",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "details": ["Validation error details"] // Optional
  }
}
```

### Common Error Codes
- `400 BAD_REQUEST`: Invalid request data
- `401 UNAUTHORIZED`: Authentication required/invalid
- `403 FORBIDDEN`: Insufficient permissions
- `404 NOT_FOUND`: Resource not found
- `409 CONFLICT`: Resource conflict (e.g., duplicate RSVP)
- `422 VALIDATION_ERROR`: Request validation failed
- `429 TOO_MANY_REQUESTS`: Rate limit exceeded
- `500 INTERNAL_SERVER_ERROR`: Server error

### Frontend Error Handling Example
```javascript
const handleApiError = (error) => {
  if (error.response?.data?.error) {
    const { message, statusCode, errorCode } = error.response.data.error
    
    switch (statusCode) {
      case 401:
        // Redirect to login
        window.location.href = '/login'
        break
      case 403:
        // Show permission denied message
        showToast('You do not have permission to perform this action', 'error')
        break
      case 422:
        // Show validation errors
        const details = error.response.data.error.details || []
        showValidationErrors(details)
        break
      default:
        showToast(message || 'An error occurred', 'error')
    }
  }
}
```

## RSVP Endpoints

### 1. Create/Update RSVP
**POST** `/api/rsvp`

Creates or updates an RSVP for an event.

**Request Body:**
```json
{
  "eventId": "event-123",
  "status": "YES" | "NO" | "MAYBE",
  "notes": "Optional notes (max 500 chars)",
  "notificationPreferences": {
    "email": true,
    "inApp": true,
    "daysBefore": [7, 1]
  }
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "rsvp": {
      "_id": "rsvp-id",
      "eventId": "event-123",
      "eventType": "GENERAL_EVENT",
      "userId": "user-id",
      "status": "YES",
      "notificationPreferences": {
        "email": true,
        "inApp": true,
        "daysBefore": [7, 1]
      },
      "notes": "Looking forward to it!",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "user": {
        "email": "user@example.com",
        "roles": ["GUIDE"]
      }
    },
    "message": "RSVP confirmed for Event Title"
  }
}
```

**Frontend Implementation:**
```javascript
const createOrUpdateRSVP = async (rsvpData) => {
  try {
    const response = await fetch(`${RSVP_BASE_URL}`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(rsvpData)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    handleApiError(error)
    throw error
  }
}
```

### 2. Get User's RSVPs
**GET** `/api/rsvp/my-rsvps`

Retrieves the current user's RSVPs with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `upcoming` (optional): Filter for upcoming events only (boolean)

**Response (200):**
```json
{
  "status": "success",
  "results": 5,
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "totalRSVPs": 5,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "data": {
    "rsvps": [
      {
        "_id": "rsvp-id",
        "eventId": "event-123",
        "status": "YES",
        "event": {
          "title": "Event Title",
          "startDate": "2024-02-01T18:00:00.000Z",
          "location": "Conference Room A"
        }
      }
    ]
  }
}
```

**Frontend Implementation:**
```javascript
const getUserRSVPs = async (page = 1, limit = 20, upcoming = false) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(upcoming && { upcoming: 'true' })
  })
  
  const response = await fetch(`${RSVP_BASE_URL}/my-rsvps?${params}`, {
    headers: defaultHeaders
  })
  
  return await response.json()
}
```

### 3. Get Event RSVPs
**GET** `/api/rsvp/event/:eventId`

Retrieves all RSVPs for a specific event (requires appropriate permissions).

**Path Parameters:**
- `eventId`: The Sanity CMS event ID

**Query Parameters:**
- `status` (optional): Filter by RSVP status ("YES", "NO", "MAYBE")
- `includeUser` (optional): Include user details (boolean, default: false)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response (200):**
```json
{
  "status": "success",
  "results": 15,
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "totalRSVPs": 15,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "data": {
    "rsvps": [
      {
        "_id": "rsvp-id",
        "eventId": "event-123",
        "status": "YES",
        "user": {
          "email": "user@example.com",
          "roles": ["GUIDE"]
        }
      }
    ]
  }
}
```

### 4. Get User's RSVP for Specific Event
**GET** `/api/rsvp/event/:eventId/my-rsvp`

Retrieves the current user's RSVP for a specific event.

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "rsvp": {
      "_id": "rsvp-id",
      "eventId": "event-123",
      "status": "YES",
      "notes": "Looking forward to it!",
      "notificationPreferences": {
        "email": true,
        "inApp": true,
        "daysBefore": [7, 1]
      }
    }
  }
}
```

**Response (404) - No RSVP found:**
```json
{
  "status": "fail",
  "error": {
    "message": "RSVP not found",
    "statusCode": 404,
    "errorCode": "NOT_FOUND"
  }
}
```

### 5. Get Event Statistics
**GET** `/api/rsvp/event/:eventId/stats`

Retrieves RSVP statistics for an event.

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "stats": {
      "totalRSVPs": 25,
      "yesCount": 18,
      "noCount": 4,
      "maybeCount": 3,
      "attendanceRate": 72,
      "capacityInfo": {
        "maxAttendees": 30,
        "availableSpots": 12,
        "isAtCapacity": false
      }
    }
  }
}
```

### 6. Delete RSVP
**DELETE** `/api/rsvp/event/:eventId`

Deletes the current user's RSVP for an event.

**Response (200):**
```json
{
  "status": "success",
  "message": "RSVP deleted successfully"
}
```

### 7. Sync Event from Sanity (Admin Only)
**POST** `/api/rsvp/sync/:eventId`

Syncs event data from Sanity CMS (Admin only).

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "event": {
      "eventId": "event-123",
      "title": "Updated Event Title",
      "lastSyncedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## Data Models

### RSVP Status Enum
```typescript
enum RSVPStatus {
  YES = "YES",
  NO = "NO", 
  MAYBE = "MAYBE"
}
```

### Event Type Enum
```typescript
enum EventType {
  GUIDE_SESSION = "GUIDE_SESSION",
  GUIDE_IDEAS_LAB = "GUIDE_IDEAS_LAB", 
  SCHOLAR_SESSION = "SCHOLAR_SESSION",
  SCHOLAR_IDEAS_LAB = "SCHOLAR_IDEAS_LAB",
  GENERAL_EVENT = "GENERAL_EVENT"
}
```

### Notification Preferences Interface
```typescript
interface NotificationPreferences {
  email: boolean
  inApp: boolean
  daysBefore: number[] // Days before event to send notifications
}
```

### RSVP Interface
```typescript
interface RSVP {
  _id: string
  eventId: string
  eventType: EventType
  userId: string
  status: RSVPStatus
  notificationPreferences: NotificationPreferences
  notes?: string
  createdAt: string
  updatedAt: string
  user?: {
    email: string
    roles: string[]
  }
  event?: {
    title: string
    startDate: string
    endDate?: string
    location?: string
    maxAttendees?: number
  }
}
```

## Role-Based Access Control

### Event Access Mapping
```typescript
const EVENT_ACCESS_MAP = {
  GUIDE_SESSION: ['GUIDE', 'ADMIN'],
  GUIDE_IDEAS_LAB: ['GUIDE', 'ADMIN'],
  SCHOLAR_SESSION: ['SCHOLAR', 'ADMIN'], 
  SCHOLAR_IDEAS_LAB: ['SCHOLAR', 'ADMIN'],
  GENERAL_EVENT: ['GUIDE', 'SCHOLAR', 'ADMIN', 'PARTNER']
}
```

### Permission Checks
Before making RSVP requests, check user permissions:

```javascript
const canAccessEvent = (userRoles, eventType) => {
  const allowedRoles = EVENT_ACCESS_MAP[eventType]
  return userRoles.some(role => allowedRoles.includes(role))
}

// Usage
if (!canAccessEvent(user.roles, event.eventType)) {
  showToast('You do not have permission to RSVP to this event', 'error')
  return
}
```

## Notification System

### Notification Preferences
Users can configure when and how they receive event reminders:

```javascript
const defaultNotificationPreferences = {
  email: true,        // Email notifications
  inApp: true,        // In-app notifications  
  daysBefore: [7, 1]  // Send reminders 7 days and 1 day before event
}
```

### Valid daysBefore Values
- Must be positive integers
- Range: 1-365 days
- Common values: [7, 3, 1] or [14, 7, 1]

## Best Practices

### 1. Caching Strategy
The API implements Redis caching. Consider implementing client-side caching:

```javascript
// Cache user RSVPs for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const cache = new Map()

const getCachedUserRSVPs = (userId) => {
  const cacheKey = `user-rsvps-${userId}`
  const cached = cache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  
  return null
}
```

### 2. Optimistic Updates
Update UI immediately, then sync with server:

```javascript
const updateRSVPOptimistically = async (eventId, newStatus) => {
  // Update UI immediately
  updateLocalRSVPStatus(eventId, newStatus)
  
  try {
    // Sync with server
    await createOrUpdateRSVP({ eventId, status: newStatus })
  } catch (error) {
    // Revert on error
    revertLocalRSVPStatus(eventId)
    handleApiError(error)
  }
}
```

### 3. Real-time Updates
Consider implementing WebSocket connections for real-time RSVP updates:

```javascript
// WebSocket connection for real-time updates
const ws = new WebSocket('wss://your-api-domain.com/ws')

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  
  if (data.type === 'RSVP_UPDATED') {
    updateEventRSVPCount(data.eventId, data.stats)
  }
}
```

### 4. Form Validation
Validate RSVP data before submission:

```javascript
const validateRSVPData = (data) => {
  const errors = []
  
  if (!data.eventId || !/^[a-zA-Z0-9_-]+$/.test(data.eventId)) {
    errors.push('Invalid event ID')
  }
  
  if (!['YES', 'NO', 'MAYBE'].includes(data.status)) {
    errors.push('Invalid RSVP status')
  }
  
  if (data.notes && data.notes.length > 500) {
    errors.push('Notes cannot exceed 500 characters')
  }
  
  if (data.notificationPreferences?.daysBefore) {
    const invalidDays = data.notificationPreferences.daysBefore
      .filter(day => day < 1 || day > 365)
    
    if (invalidDays.length > 0) {
      errors.push('Notification days must be between 1 and 365')
    }
  }
  
  return errors
}
```

### 5. Loading States
Implement proper loading states for better UX:

```javascript
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState(null)

const handleRSVP = async (rsvpData) => {
  setIsLoading(true)
  setError(null)
  
  try {
    await createOrUpdateRSVP(rsvpData)
    showToast('RSVP updated successfully', 'success')
  } catch (err) {
    setError(err.message)
    handleApiError(err)
  } finally {
    setIsLoading(false)
  }
}
```

### 6. Pagination Handling
Implement efficient pagination for large datasets:

```javascript
const usePaginatedRSVPs = (initialPage = 1, limit = 20) => {
  const [rsvps, setRSVPs] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const loadPage = async (page) => {
    setLoading(true)
    try {
      const response = await getUserRSVPs(page, limit)
      setRSVPs(response.data.rsvps)
      setPagination(response.pagination)
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }
  
  return { rsvps, pagination, loading, loadPage }
}
```

---

This guide provides comprehensive information for integrating with the RSVP API system. For additional support or questions, please refer to the API documentation or contact the development team.
