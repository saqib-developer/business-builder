# Admin Panel - Messages Dashboard

This is the admin interface for managing user support conversations.

## Access

**URL**: `/admin/messages`

> **Note**: Currently there's no authentication. In production, this should be protected with admin-only access.

## Features

### Left Sidebar - Active Conversations
- List of all users with active support tickets
- Search functionality to filter conversations
- Online/offline status indicators
- Unread message badges
- Last message preview
- Timestamp of last activity

### Main Chat Area
- Full conversation history with selected user
- Message bubbles (admin messages in blue, user messages in white)
- Timestamps for each message
- User avatar and online status in header
- Message input field
- Send button

## Mock Data

Currently showing 4 mock conversations:

1. **John Doe** - Having logo upload issues
2. **Sarah Startups** - Asking about template customization
3. **Ali Khan** - Website loading problems
4. **Emma Wilson** - Interested in upgrading

## Usage

1. Click on any user in the left sidebar
2. Their conversation loads in the main area
3. Type a response in the input field
4. Click Send (currently shows an alert as no backend is connected)

## Future Enhancements

- [ ] Real-time messaging with WebSocket
- [ ] Admin authentication
- [ ] Message status (sent, delivered, read)
- [ ] File attachments
- [ ] Canned responses
- [ ] Conversation assignment to team members
- [ ] Analytics (response time, satisfaction scores)
- [ ] Search within conversations
- [ ] Export conversation history
- [ ] Integration with email support

## Screenshot Placeholder

```
┌─────────────────────────────────────────────────────┐
│  Messages                                           │
│  ┌─────────────────────────────┐                   │
│  │ Search conversations...     │                   │
│  └─────────────────────────────┘                   │
│                                                     │
│  ┌──────────────────────────┐  ┌─────────────────┐│
│  │ JD John Doe         2m  2│  │ John Doe        ││
│  │ Thanks for the help! ●   │  │                 ││
│  ├──────────────────────────┤  │ Hi! I'm having  ││
│  │ SS Sarah Startups  15m   │  │ trouble with... ││
│  │ How do I change...       │  │                 ││
│  ├──────────────────────────┤  │ [Admin]: Hello  ││
│  │ AK Ali Khan       1h   1 │  │ John! I can...  ││
│  │ My website isn't...      │  │                 ││
│  └──────────────────────────┘  │ [Type message]  ││
│                                 │ [Send]          ││
│                                 └─────────────────┘│
└─────────────────────────────────────────────────────┘
```

## Technical Details

**Component**: `app/admin/messages/page.tsx`
**Framework**: Next.js 16 App Router
**Styling**: Tailwind CSS
**Icons**: react-icons (Feather Icons)
**State Management**: React useState (local)

## Security Considerations

⚠️ **Important**: This page should be protected in production:

1. Add authentication middleware
2. Check for admin role
3. Rate limit API calls
4. Encrypt sensitive messages
5. Implement CSRF protection
6. Add audit logging
