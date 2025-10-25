#!/usr/bin/env node

/**
 * Script to fetch an OAuth2 access token using the Resource Owner Password Credentials grant
 * and seed the Event API with a predefined list of events.
 */

const config = {
  tokenUrl: 'http://localhost:9090/realms/event-ticket-platform/protocol/openid-connect/token',
  username: 'organizer1',
  password: 'password',
  clientId: 'event-ticket-platform-app',
  eventUrl: 'http://localhost:8080/api/v1/events',
};

const events = [
  {
    name: 'Summer Rock Festival 2025',
    description: 'Join us for an unforgettable night of rock music featuring top bands from around the world. Food and beverages available.',
    status: 'PUBLISHED',
    type: 'CONCERT',
    start: '2025-07-15T18:00:00',
    end: '2025-07-15T23:59:00',
    salesStart: '2025-05-01T00:00:00',
    salesEnd: '2025-07-15T17:00:00',
    venue: 'Madison Square Garden, New York, NY',
    ticketTypes: [
      {
        name: 'General Admission',
        description: 'Standing room only, access to main floor',
        price: 89.99,
        totalAvailable: 5000,
      },
      {
        name: 'VIP Seating',
        description: 'Reserved seating with premium view and VIP lounge access',
        price: 249.99,
        totalAvailable: 500,
      },
      {
        name: 'Backstage Pass',
        description: 'Meet and greet with performers, exclusive merchandise',
        price: 599.99,
        totalAvailable: 50,
      },
    ],
  },
  {
    name: 'DevCon 2025: Future of AI',
    description: 'Three-day conference exploring the latest developments in artificial intelligence, machine learning, and neural networks. Includes workshops, keynotes, and networking sessions.',
    status: 'PUBLISHED',
    type: 'CONFERENCE',
    start: '2025-11-08T09:00:00',
    end: '2025-11-10T18:00:00',
    salesStart: '2025-08-01T00:00:00',
    salesEnd: '2025-11-07T23:59:00',
    venue: 'San Francisco Convention Center, CA',
    ticketTypes: [
      {
        name: 'Early Bird - Full Access',
        description: 'All sessions, workshops, and networking events (Limited time offer)',
        price: 499,
        totalAvailable: 200,
      },
      {
        name: 'Standard Pass',
        description: 'Access to all sessions and main conference areas',
        price: 699,
        totalAvailable: 1500,
      },
      {
        name: 'Workshop Only',
        description: 'Access to workshop sessions only',
        price: 299,
        totalAvailable: 300,
      },
    ],
  },
  {
    name: 'JavaScript Developers Monthly Meetup',
    description: 'Monthly gathering for JavaScript enthusiasts. This month featuring talks on React 19 and the future of frontend development. Pizza and drinks provided!',
    status: 'PUBLISHED',
    type: 'MEETUP',
    start: '2025-11-15T18:30:00',
    end: '2025-11-15T21:00:00',
    salesStart: '2025-10-25T00:00:00',
    salesEnd: '2025-11-15T12:00:00',
    venue: 'Tech Hub Coworking Space, 123 Innovation Street, Austin, TX',
    ticketTypes: [
      {
        name: 'Free Admission',
        description: 'Free entry to meetup, includes pizza and networking',
        price: 0,
        totalAvailable: 80,
      },
    ],
  },
  {
    name: 'Digital Photography Masterclass',
    description: 'Learn professional photography techniques in this intensive 6-hour workshop. Covers composition, lighting, post-processing, and more. Bring your camera!',
    status: 'PUBLISHED',
    type: 'WORKSHOP',
    start: '2025-12-05T10:00:00',
    end: '2025-12-05T16:00:00',
    salesStart: '2025-10-28T00:00:00',
    salesEnd: '2025-12-04T23:59:00',
    venue: 'Creative Arts Studio, 456 Gallery Lane, Portland, OR',
    ticketTypes: [
      {
        name: 'Workshop Ticket',
        description: 'Includes all materials, lunch, and take-home guide',
        price: 149,
        totalAvailable: null,
      },
    ],
  },
  {
    name: 'Coachella Valley Music Festival 2025',
    description: 'The premier music and arts festival returns with three days of incredible performances across multiple stages. Featuring 100+ artists spanning all genres.',
    status: 'PUBLISHED',
    type: 'FESTIVAL',
    start: '2025-04-11T12:00:00',
    end: '2025-04-13T23:00:00',
    salesStart: '2025-01-15T10:00:00',
    salesEnd: '2025-04-10T23:59:00',
    venue: 'Empire Polo Club, Indio, CA',
    ticketTypes: [
      {
        name: '3-Day General Admission',
        description: 'Access to all stages for all three days',
        price: 549,
        totalAvailable: 50000,
      },
      {
        name: '3-Day VIP Pass',
        description: 'VIP viewing areas, exclusive lounges, premium restrooms',
        price: 1199,
        totalAvailable: 5000,
      },
      {
        name: 'Single Day Pass - Friday',
        description: 'General admission for Friday only',
        price: 199,
        totalAvailable: 10000,
      },
    ],
  },
  {
    name: 'NBA Finals Game 7',
    description: 'Witness history! The championship-deciding game 7 of the NBA Finals. Don\'t miss this once-in-a-lifetime event!',
    status: 'PUBLISHED',
    type: 'SPORTS',
    start: '2025-06-20T20:00:00',
    end: '2025-06-20T23:00:00',
    salesStart: '2025-06-15T10:00:00',
    salesEnd: '2025-06-20T19:00:00',
    venue: 'Staples Center, Los Angeles, CA',
    ticketTypes: [
      {
        name: 'Upper Level',
        description: 'Upper bowl seating sections 300-400',
        price: 299,
        totalAvailable: 8000,
      },
      {
        name: 'Lower Level',
        description: 'Lower bowl seating sections 100-200',
        price: 799,
        totalAvailable: 4000,
      },
      {
        name: 'Courtside',
        description: 'Premium courtside seats with exclusive access',
        price: 5000,
        totalAvailable: 100,
      },
    ],
  },
  {
    name: 'Hamilton - Broadway Musical',
    description: 'The revolutionary musical about Alexander Hamilton comes to life on stage. Winner of 11 Tony Awards including Best Musical. An unmissable theatrical experience!',
    status: 'PUBLISHED',
    type: 'THEATER',
    start: '2025-10-30T19:30:00',
    end: '2025-10-30T22:00:00',
    salesStart: '2025-08-01T00:00:00',
    salesEnd: '2025-10-30T18:00:00',
    venue: 'Richard Rodgers Theatre, 226 W 46th Street, New York, NY',
    ticketTypes: [
      {
        name: 'Orchestra',
        description: 'Premium floor seating, rows A-M',
        price: 299,
        totalAvailable: 350,
      },
      {
        name: 'Mezzanine',
        description: 'Elevated seating with excellent view',
        price: 199,
        totalAvailable: 250,
      },
      {
        name: 'Balcony',
        description: 'Upper level seating',
        price: 89,
        totalAvailable: 200,
      },
    ],
  },
  {
    name: 'Impressionism: Masters of Light',
    description: 'A rare collection featuring works by Monet, Renoir, Degas, and Cézanne. Over 100 paintings on display from private collections worldwide. Guided tours available.',
    status: 'PUBLISHED',
    type: 'EXHIBITION',
    start: '2025-09-01T10:00:00',
    end: '2026-01-15T18:00:00',
    salesStart: '2025-07-01T00:00:00',
    salesEnd: '2026-01-15T17:00:00',
    venue: 'Metropolitan Museum of Art, 1000 Fifth Avenue, New York, NY',
    ticketTypes: [
      {
        name: 'General Admission',
        description: 'Self-guided tour access during open hours',
        price: 35,
        totalAvailable: null,
      },
      {
        name: 'Guided Tour',
        description: '90-minute expert-led tour (Limited spots per day)',
        price: 65,
        totalAvailable: 5000,
      },
      {
        name: 'Family Pass',
        description: 'Admission for 2 adults and up to 3 children',
        price: 85,
        totalAvailable: null,
      },
    ],
  },
  {
    name: "NYE Rooftop Bash 2025",
    description: "Ring in the New Year with stunning city views, premium open bar, gourmet appetizers, and live DJ. Champagne toast at midnight! Dress code: Cocktail attire.",
    status: "PUBLISHED",
    type: "PARTY",
    start: "2025-12-31T21:00:00",
    end: "2026-01-01T02:00:00",
    salesStart: "2025-11-01T00:00:00",
    salesEnd: "2025-12-31T18:00:00",
    venue: "SkyBar Rooftop, Downtown Hotel, Chicago, IL",
    ticketTypes: [
      {
        name: "Standard Entry",
        description: "General admission with open bar (21+ only)",
        price: 125,
        totalAvailable: 200,
      },
      {
        name: "VIP Table for 4",
        description: "Reserved table, bottle service, priority entry",
        price: 800,
        totalAvailable: 15,
      },
    ],
  },
  {
    name: "Annual Children's Hospital Charity Gala",
    description: "Join us for an elegant evening supporting children's healthcare. Features silent auction, three-course dinner, live entertainment, and keynote speech. Black tie optional.",
    status: "PUBLISHED",
    type: "OTHER",
    start: "2025-11-22T18:00:00",
    end: "2025-11-22T23:00:00",
    salesStart: "2025-09-01T00:00:00",
    salesEnd: "2025-11-20T23:59:00",
    venue: "Grand Ballroom, Ritz-Carlton Hotel, Boston, MA",
    ticketTypes: [
      {
        name: "Individual Ticket",
        description: "Dinner and entertainment for one guest",
        price: 250,
        totalAvailable: 300,
      },
      {
        name: "Couple Ticket",
        description: "Dinner and entertainment for two guests",
        price: 450,
        totalAvailable: 100,
      },
      {
        name: "Platinum Sponsor Table",
        description: "Table for 10, premium placement, recognition in program",
        price: 5000,
        totalAvailable: 20,
      },
    ],
  },
  {
    name: 'Summer Music Festival 2025',
    description: 'Join us for a weekend of incredible live music featuring top artists from around the world. Experience multiple stages, food vendors, and an unforgettable atmosphere.',
    status: 'PUBLISHED',
    type: 'FESTIVAL',
    start: '2025-07-15T14:00:00',
    end: '2025-07-17T23:00:00',
    salesStart: '2025-05-01T10:00:00',
    salesEnd: '2025-07-14T23:59:59',
    venue: 'Central Park Grounds, New York',
    ticketTypes: [
      {
        name: 'General Admission',
        description: 'Access to all stages and common areas',
        price: 199.99,
        totalAvailable: 5000,
      },
      {
        name: 'VIP Pass',
        description: 'Premium viewing areas, exclusive lounge access, and complimentary drinks',
        price: 499.99,
        totalAvailable: 500,
      },
      {
        name: 'Early Bird Special',
        description: 'Limited early bird discount for general admission',
        price: 149.99,
        totalAvailable: 1000,
      },
    ],
  },
  {
    name: 'DevCon 2025: Future of Software Development',
    description: 'A premier technology conference featuring keynotes from industry leaders, hands-on workshops, and networking opportunities. Learn about AI, cloud computing, and the latest development trends.',
    status: 'PUBLISHED',
    type: 'CONFERENCE',
    start: '2025-11-20T09:00:00',
    end: '2025-11-22T18:00:00',
    salesStart: '2025-08-01T00:00:00',
    salesEnd: '2025-11-19T23:59:59',
    venue: 'Tech Convention Center, San Francisco, CA',
    ticketTypes: [
      {
        name: 'Full Conference Pass',
        description: 'Access to all sessions, workshops, and expo hall for 3 days',
        price: 899,
        totalAvailable: 2000,
      },
      {
        name: 'Single Day Pass',
        description: 'Access for one day of your choice',
        price: 349,
        totalAvailable: 1500,
      },
      {
        name: 'Student Ticket',
        description: 'Discounted full access for students (ID required)',
        price: 299,
        totalAvailable: 300,
      },
      {
        name: 'Workshop Only',
        description: 'Access to workshops only, no keynote sessions',
        price: 199,
        totalAvailable: 500,
      },
    ],
  },
  {
    name: 'Romeo and Juliet - Opening Night',
    description: "Experience Shakespeare's timeless classic performed by the acclaimed Metropolitan Theater Company. A stunning production featuring award-winning actors and breathtaking stage design.",
    status: 'PUBLISHED',
    type: 'THEATER',
    start: '2025-12-05T19:30:00',
    end: '2025-12-05T22:00:00',
    salesStart: '2025-10-15T12:00:00',
    salesEnd: '2025-12-05T18:00:00',
    venue: 'Metropolitan Theater, 234 Broadway, New York, NY',
    ticketTypes: [
      {
        name: 'Orchestra Seating',
        description: 'Premium seats in rows A-M',
        price: 125,
        totalAvailable: 200,
      },
      {
        name: 'Mezzanine',
        description: 'Elevated seating with excellent view',
        price: 85,
        totalAvailable: 150,
      },
      {
        name: 'Balcony',
        description: 'Upper level seating',
        price: 55,
        totalAvailable: 100,
      },
    ],
  },
];

async function fetchAccessToken() {
  const body = new URLSearchParams({
    grant_type: 'password',
    username: config.username,
    password: config.password,
    client_id: config.clientId,
  });

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Token request failed (${response.status}): ${message}`);
  }

  const payload = await response.json();
  if (!payload.access_token) {
    throw new Error('Token response did not include access_token');
  }

  return payload.access_token;
}

async function postEvent(event, token) {
  const response = await fetch(config.eventUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Event "${event.name}" failed (${response.status}): ${message}`);
  }

  const payload = await response.json();
  return payload;
}

async function main() {
  try {
    console.log('Fetching access token...');
    const token = await fetchAccessToken();
    console.log('Access token acquired.');

    for (const event of events) {
      process.stdout.write(`Creating event: ${event.name}... `);
      const result = await postEvent(event, token);
      console.log(`done (id: ${result.id ?? 'unknown'})`);
    }

    console.log('All events processed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();

