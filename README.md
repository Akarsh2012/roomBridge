# RoomBridge

RoomBridge is a room booking platform that connects property owners with travelers looking for comfortable stays across India. Owners can list their rooms, apartments, villas, or unique properties, while guests can discover, compare, and book the perfect stay for their trip.

## What is RoomBridge?

Think of it as a platform where anyone who has a spare room, apartment, or property can list it for short-term or long-term stays. Travelers can browse these listings, filter by city, price, amenities, and number of guests, and book directly through the platform. The entire experience is designed to be seamless - from discovering a room to completing a booking.

## Who is it for?

**Guests (Travelers)**
- Solo travelers looking for budget-friendly stays
- Families planning vacations across India
- Business travelers who need short-term accommodations
- Anyone looking for an alternative to traditional hotels

**Hosts (Property Owners)**
- Homeowners with spare rooms or vacant properties
- Property managers handling multiple listings
- Anyone who wants to earn from their unused space

**Admins**
- Platform administrators who manage users, listings, and bookings
- Ensure quality and safety across all properties

## Features

### Account & Authentication
- Sign up as a Guest or Host with email and password
- Email verification through OTP (one-time password sent to your email)
- Secure login with JWT-based authentication
- Guests can upgrade to Host anytime through "Become a Host"
- Google OAuth login (coming soon)

### For Guests
- Browse curated room listings from across India
- Search rooms by location, price range, number of guests, and amenities
- View detailed room pages with photos, descriptions, amenities, and host info
- Book rooms by selecting check-in/check-out dates
- Leave reviews and ratings after completing a stay
- Track all bookings with status updates (Pending, Confirmed, Cancelled, Completed)
- Receive real-time notifications for booking confirmations and updates

### For Hosts
- List properties with title, description, pricing, location, amenities, and photos
- Manage listings - edit details, update pricing, deactivate rooms
- View and manage incoming booking requests (confirm or cancel)
- Host dashboard with analytics on bookings, revenue, and occupancy
- Receive notifications when guests book or review properties

### For Admins
- Full platform oversight - manage all users, rooms, and bookings
- User management - view, update roles, ban/unban users
- Room management - review listings, remove inappropriate content
- Platform analytics - total users, rooms, bookings, revenue stats

### Smart Features (Coming Soon)
- **AI-Powered Search** - Search rooms using natural language ("cozy cabin near beach under 5000/night")
- **Smart Chatbot** - AI assistant that helps guests find rooms and answers questions about properties
- **Review Summaries** - AI-generated summaries of guest reviews for quick insights
- **Smart Pricing** - Dynamic pricing suggestions for hosts based on demand and season
- **Image Analysis** - Auto-tag amenities from room photos

### Platform Features
- Responsive design - works on desktop, tablet, and mobile
- Real-time notifications for booking events
- Branded email notifications (OTP, welcome, booking confirmations)
- Role-based access control across the entire platform
- Redis caching for fast search results (coming soon)
- Payment integration with Razorpay/Stripe (coming soon)

## How It Works

### For Guests
1. **Sign Up** - Create an account with your email
2. **Verify Email** - Enter the OTP sent to your email
3. **Browse Rooms** - Explore listings or search with filters
4. **Book a Stay** - Select dates, confirm guests, and book
5. **Check In** - Arrive and enjoy your stay
6. **Review** - Share your experience to help other travelers

### For Hosts
1. **Sign Up** - Create an account and click "Become a Host"
2. **List Your Property** - Add photos, description, pricing, and amenities
3. **Receive Bookings** - Guests book your room, you get notified
4. **Confirm or Decline** - Review the booking and respond
5. **Host Your Guest** - Provide a great experience
6. **Earn** - Receive payment for completed stays

## Cities We Cover

RoomBridge currently features properties across major Indian cities including Mumbai, Delhi, Goa, Bangalore, Jaipur, Pondicherry, Manali, Alleppey, and more. We are expanding to cover Tier 2 and Tier 3 cities as well.

## Safety & Trust

- All user emails are verified through OTP before they can book or list
- Passwords are hashed using bcrypt (never stored in plain text)
- JWT tokens with short expiry (15 min access + 7 day refresh) for session security
- Role-based access ensures guests, hosts, and admins only see what they should
- Reviews are only allowed from guests who have completed a stay at that property
- Room listings can be reported and reviewed by admins

## License

MIT
