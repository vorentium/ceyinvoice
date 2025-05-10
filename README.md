# CeyInvoice UI

A modern invoice management system with a clean UI that helps businesses create, manage, and track invoices efficiently.

## Features

- **User Authentication**: Secure login and account management
- **Dashboard Overview**: Get a quick summary of your invoicing status
- **Invoice Management**: Create, edit, and track invoices
- **Client Management**: Maintain a database of your clients
- **Template System**: Create and use custom invoice templates
- **Payment Tracking**: Monitor paid, pending, and overdue invoices

## UTM Parameter Tracking

CeyInvoice now supports UTM parameter tracking to help you analyze your marketing campaigns and user journeys.

### Supported Parameters

The following UTM parameters are supported:

- `utm_source`: Identifies which site sent the traffic (e.g., google, newsletter)
- `utm_medium`: Identifies what type of link was used (e.g., cpc, email, social)
- `utm_campaign`: Identifies a specific campaign (e.g., spring_sale, product_launch)
- `utm_content`: Identifies what specifically was clicked (e.g., banner_ad, text_link)
- `utm_term`: Identifies search terms used (typically for paid search)

### Route Parameters

In addition to standard UTM parameters, the application supports:

- Source tracking via URL path parameter: `/dashboard/:source`
- Page selection parameter: `?page=invoices` (or clients, templates, etc.)

### Example URLs

```
# Track a user coming from an email campaign
/dashboard?utm_source=newsletter&utm_medium=email&utm_campaign=monthly_update

# Track a user coming from a specific marketing source
/dashboard/facebook?utm_medium=social&utm_campaign=launch

# Open the dashboard directly to the invoices page from an ad
/dashboard?page=invoices&utm_source=google&utm_medium=cpc&utm_campaign=invoice_tool
```

### Implementation Notes

The tracking system records:
- All UTM parameters
- Current page being viewed
- User actions within the application
- Additional contextual data

Data is stored in the `user_analytics` table in the database for later analysis.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/ceyinvoice-ui.git
cd ceyinvoice-ui
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
Create a `.env` file in the root directory and add:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Tech Stack

- React.js
- Material UI
- Tailwind CSS
- Supabase (Authentication & Database)
- Vite (Build Tool)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
"# CeyAIinvoice" 
