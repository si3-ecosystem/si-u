# Vercel Cron Jobs & Admin Dashboard Setup

## 🚀 Quick Setup

### 1. Environment Variables
Add to your Vercel environment variables or `.env.local`:

```env
# Required for Vercel Cron Jobs
CRON_SECRET=your-super-secret-cron-key-here

# Optional: API URL (auto-detected in most cases)
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

### 2. Deploy to Vercel
The `vercel.json` file is already configured with cron jobs:

```json
{
  "crons": [
    {
      "path": "/api/cron/process-notifications",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/cron/cleanup-expired-rsvps", 
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/health-check",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

## 📅 Cron Schedule Explained

- **Process Notifications**: Every 5 minutes - handles pending notifications
- **Cleanup Expired RSVPs**: Daily at midnight - removes old data
- **Send Reminders**: Daily at 9 AM - sends session reminders
- **Health Check**: Every 6 hours - monitors system health

## 🔧 API Endpoints Created

### Cron Endpoints (Protected)
- `GET /api/cron/process-notifications` - Process pending notifications
- `GET /api/cron/cleanup-expired-rsvps` - Clean up old data
- `GET /api/cron/send-reminders` - Send session reminders
- `GET /api/cron/health-check` - System health monitoring

### Admin Endpoints
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/rsvps` - List RSVPs with filters
- `POST /api/admin/send-reminder` - Send manual reminders
- `POST /api/admin/bulk-action` - Bulk operations (delete, remind, export)

## 🎛️ Admin Dashboard Features

### Access
Navigate to: `/admin/dashboard`

### Features
- **System Overview**: Total sessions, RSVPs, upcoming events
- **Cron Job Monitoring**: Status and last run times
- **RSVP Management**: View, filter, and manage all RSVPs
- **Bulk Actions**: Send reminders, delete, or export RSVPs
- **Real-time Stats**: Auto-refreshing dashboard data

### RSVP Management
- ✅ View all RSVPs in a table format
- ✅ Filter by status (attending, maybe, not attending)
- ✅ Search users and sessions
- ✅ Select multiple RSVPs for bulk actions
- ✅ Send reminders to selected users
- ✅ Delete RSVPs
- ✅ Export RSVP data

## 🧪 Testing Cron Jobs

### Manual Testing
```bash
# Test notification processing
curl -X GET "https://your-app.vercel.app/api/cron/process-notifications" \
     -H "Authorization: Bearer YOUR_CRON_SECRET"

# Test reminder sending
curl -X GET "https://your-app.vercel.app/api/cron/send-reminders" \
     -H "Authorization: Bearer YOUR_CRON_SECRET"

# Test health check
curl -X GET "https://your-app.vercel.app/api/cron/health-check" \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Monitoring
- Check Vercel Function logs for cron execution
- Monitor admin dashboard for cron job status
- Set up error alerts for failed cron jobs

## 🔒 Security

### Cron Job Protection
All cron endpoints require the `CRON_SECRET` in the Authorization header:
```
Authorization: Bearer YOUR_CRON_SECRET
```

### Admin Access
Currently using mock authentication. In production:
1. Add proper user authentication
2. Check for admin role/permissions
3. Implement session management

## 📊 Mock Data

The system currently uses mock data for demonstration:
- Sample RSVPs with different statuses
- Mock session data
- Simulated cron job statistics

### Replace with Real Data
Update these files to connect to your actual database:
- `/api/admin/rsvps/route.ts` - Real RSVP queries
- `/api/admin/stats/route.ts` - Real statistics
- Cron job endpoints - Real notification/cleanup logic

## 🚀 Next Steps

1. **Deploy to Vercel** with the `CRON_SECRET` environment variable
2. **Test cron endpoints** manually first
3. **Access admin dashboard** at `/admin/dashboard`
4. **Monitor cron execution** in Vercel function logs
5. **Replace mock data** with real database connections
6. **Add authentication** for admin access
7. **Set up monitoring** and alerts

## 📝 File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard/page.tsx     # Admin dashboard page
│   │   └── layout.tsx             # Admin layout
│   └── api/
│       ├── admin/                 # Admin API routes
│       └── cron/                  # Cron job endpoints
├── components/
│   ├── atoms/admin/               # Admin UI atoms
│   └── molecules/admin/           # Admin UI molecules
├── hooks/
│   └── useAdminDashboard.ts       # Admin dashboard hook
└── types/
    └── admin.ts                   # Admin type definitions
```

## 🎯 Benefits

- ✅ **Automated Notifications**: Reliable reminder system
- ✅ **Data Cleanup**: Automatic removal of old data
- ✅ **System Monitoring**: Health checks and alerts
- ✅ **Admin Control**: Complete RSVP management interface
- ✅ **Scalable**: Vercel-native cron job implementation
- ✅ **Secure**: Protected endpoints with secret authentication
