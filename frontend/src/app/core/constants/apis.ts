const MODULE_NAME = {
  APP: 'TicketApp',
  EVENTS: 'events',
  PUBLISHED_EVENTS: 'published-events',
  TICKETS: 'tickets',
  TICKET_TYPES: 'ticket-types',
  TICKET_VALIDATIONS: 'ticket-validations',
} as const;

type IdLike = string | number;

const sanitizeSegment = (segment: string): string => segment.replace(/^\/+|\/+$/g, '');

export const buildApiUrl = (
  ...segments: Array<string | number | null | undefined>
): string => {
  const parts = segments
    .filter(
      (segment): segment is string | number =>
        segment !== undefined && segment !== null && `${segment}`.length > 0,
    )
    .map((segment) => sanitizeSegment(`${segment}`));

  if (parts.length === 0) {
    return '';
  }

  return `/${parts.join('/')}`;
};

export const API_CONSTANTS = {
  MODULE_NAME,
  API_METHODS: {
    EVENTS: {
      CREATE_EVENT: () => MODULE_NAME.EVENTS,
      GET_EVENTS: () => MODULE_NAME.EVENTS,
      GET_EVENT_BY_ID: (id: IdLike) =>
        `${MODULE_NAME.EVENTS}/${encodeURIComponent(String(id))}`,
      UPDATE_EVENT: (id: IdLike) =>
        `${MODULE_NAME.EVENTS}/${encodeURIComponent(String(id))}`,
      DELETE_EVENT: (id: IdLike) =>
        `${MODULE_NAME.EVENTS}/${encodeURIComponent(String(id))}`,
    },
    PUBLISHED_EVENTS: {
      GET_PUBLISHED_EVENTS: () => MODULE_NAME.PUBLISHED_EVENTS,
      GET_PUBLISHED_EVENT_BY_ID: (id: IdLike) =>
        `${MODULE_NAME.PUBLISHED_EVENTS}/${encodeURIComponent(String(id))}`,
    },
    TICKETS: {
      GET_TICKETS: () => MODULE_NAME.TICKETS,
      GET_TICKET_BY_ID: (id: IdLike) =>
        `${MODULE_NAME.TICKETS}/${encodeURIComponent(String(id))}`,
      GET_TICKET_QR_CODE: (id: IdLike) =>
        `${MODULE_NAME.TICKETS}/${encodeURIComponent(String(id))}/qr-code`,
    },
    TICKET_TYPES: {
      PURCHASE_TICKETS: (ticketTypeId: IdLike) =>
        `${MODULE_NAME.TICKET_TYPES}/${encodeURIComponent(String(ticketTypeId))}`,
    },
    TICKET_VALIDATIONS: {
      VALIDATE_TICKET: () => MODULE_NAME.TICKET_VALIDATIONS,
    },
  },
  VALIDATION_MESSAGES: {
    REQUIRED: 'This field is required',
  },
} as const;
