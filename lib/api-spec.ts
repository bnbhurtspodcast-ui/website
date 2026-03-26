export const apiSpec = {
  openapi: "3.0.3",
  info: {
    title: "BNB Hurts Podcast — Internal API Reference",
    version: "1.0.0",
    description:
      "Internal API reference for the BNB Hurts Podcast admin panel.\n\n" +
      "**Note on Server Actions:** Paths prefixed with a `#` fragment (e.g. `/contact#submitContactForm`) " +
      "are Next.js Server Actions — they are **not** callable REST endpoints. They are documented here " +
      "for developer reference only. Invocation is handled automatically by Next.js via form submissions " +
      "or programmatic calls from client components.",
  },
  tags: [
    { name: "Cron", description: "Automated background jobs triggered by a scheduler" },
    { name: "Auth", description: "Supabase Auth — callback handling and password management" },
    { name: "OAuth Callbacks", description: "OAuth 2.0 redirect callback handlers for social platforms" },
    { name: "OAuth URL Builders", description: "Server Actions that generate OAuth authorization URLs and set state cookies" },
    { name: "Public Forms", description: "Server Actions for public-facing contact, guest, and sponsorship forms" },
    { name: "Admin - Contacts", description: "Server Actions for managing contact form submissions" },
    { name: "Admin - Guests", description: "Server Actions for managing guest/speaker applications" },
    { name: "Admin - Sponsorships", description: "Server Actions for managing sponsorship inquiries" },
    { name: "Admin - Tasks", description: "Server Actions for the Kanban task board — tasks and columns" },
    { name: "Admin - Hosts", description: "Server Actions for managing podcast hosts and team members" },
    { name: "Admin - Affiliate Links", description: "Server Actions for managing affiliate links and promo codes" },
    { name: "Admin - Social Media", description: "Server Actions for scheduling and managing social media posts and OAuth tokens" },
    { name: "Admin - Content", description: "Server Actions for managing homepage and site content settings" },
    { name: "Admin - Users", description: "Server Actions for user account management" },
    { name: "Admin - EDMTrain", description: "Server Actions for searching events via the EDMTrain API" },
  ],
  paths: {
    // ─── Real HTTP Route Handlers ────────────────────────────────────────────

    "/api/cron/sync-events": {
      get: {
        tags: ["Cron"],
        summary: "Sync events from EDMTrain",
        description:
          "Fetches upcoming events from the EDMTrain API for the Toronto, ON area and upserts them into the `events` database table. Does not overwrite manually set `hosts` or `notes` fields.",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Sync completed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    synced: { type: "integer", example: 42, description: "Number of events upserted" },
                    ts: { type: "string", format: "date-time", description: "Timestamp of sync completion" },
                  },
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid Authorization bearer token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/auth/callback": {
      get: {
        tags: ["Auth"],
        summary: "Supabase Auth callback",
        description:
          "Handles password recovery token verification. Verifies the `token_hash` from the email link. On success, redirects to `/admin/reset-password`. On failure, redirects to `/admin/signin?error=invalid_reset_link`.",
        parameters: [
          {
            name: "token_hash",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Token hash from the Supabase recovery email",
          },
          {
            name: "type",
            in: "query",
            required: true,
            schema: { type: "string", enum: ["recovery"] },
            description: "Token type — only `recovery` is handled",
          },
        ],
        responses: {
          "302": {
            description: "Redirect to `/admin/reset-password` (success) or `/admin/signin?error=invalid_reset_link` (failure)",
          },
        },
      },
    },

    "/oauth/youtube": {
      get: {
        tags: ["OAuth Callbacks"],
        summary: "YouTube OAuth callback",
        description:
          "Handles the OAuth 2.0 redirect from Google after YouTube authorization. Validates state cookie, exchanges code for tokens, and upserts into `social_tokens`. Redirects to `/admin/social-media?connected=youtube`.",
        parameters: [
          { name: "code", in: "query", required: false, schema: { type: "string" } },
          { name: "state", in: "query", required: true, schema: { type: "string" } },
          { name: "error", in: "query", required: false, schema: { type: "string" } },
        ],
        responses: {
          "302": {
            description: "Redirect to admin social-media page with `connected=youtube` or `oauth_error` query param",
          },
        },
      },
    },

    "/oauth/tiktok": {
      get: {
        tags: ["OAuth Callbacks"],
        summary: "TikTok OAuth callback (PKCE)",
        description:
          "Handles the OAuth 2.0 + PKCE redirect from TikTok. Validates state cookie and `oauth_code_verifier` cookie, exchanges code for tokens, and upserts into `social_tokens`.",
        parameters: [
          { name: "code", in: "query", required: false, schema: { type: "string" } },
          { name: "state", in: "query", required: true, schema: { type: "string" } },
          { name: "error", in: "query", required: false, schema: { type: "string" } },
        ],
        responses: {
          "302": {
            description: "Redirect to admin social-media page with `connected=tiktok` or `oauth_error` query param",
          },
        },
      },
    },

    "/oauth/meta": {
      get: {
        tags: ["OAuth Callbacks"],
        summary: "Meta / Instagram OAuth callback",
        description:
          "Handles the OAuth 2.0 redirect from Meta for Instagram. Validates state cookie, exchanges code for tokens, and upserts into `social_tokens` with `platform='instagram'`.",
        parameters: [
          { name: "code", in: "query", required: false, schema: { type: "string" } },
          { name: "state", in: "query", required: true, schema: { type: "string" } },
          { name: "error", in: "query", required: false, schema: { type: "string" } },
        ],
        responses: {
          "302": {
            description: "Redirect to admin social-media page with `connected=meta` or `oauth_error` query param",
          },
        },
      },
    },

    "/oauth/threads": {
      get: {
        tags: ["OAuth Callbacks"],
        summary: "Threads OAuth callback",
        description:
          "Handles the OAuth 2.0 redirect from Threads. Validates state cookie, exchanges code for tokens, and upserts into `social_tokens` with `platform='threads'`.",
        parameters: [
          { name: "code", in: "query", required: false, schema: { type: "string" } },
          { name: "state", in: "query", required: true, schema: { type: "string" } },
          { name: "error", in: "query", required: false, schema: { type: "string" } },
        ],
        responses: {
          "302": {
            description: "Redirect to admin social-media page with `connected=threads` or `oauth_error` query param",
          },
        },
      },
    },

    // ─── Server Actions: OAuth URL Builders ─────────────────────────────────

    "/admin/social-media#getYouTubeOAuthUrl": {
      post: {
        tags: ["OAuth URL Builders"],
        summary: "getYouTubeOAuthUrl — generate YouTube OAuth URL",
        description:
          "**Server Action.** Generates a YouTube OAuth 2.0 authorization URL. Sets `oauth_state` and `oauth_return` cookies (5 min, httpOnly, secure) as CSRF protection.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  returnTo: {
                    type: "string",
                    enum: ["admin", "demo"],
                    description: "Where to redirect after OAuth completes",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Authorization URL",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { url: { type: "string", format: "uri" } },
                },
              },
            },
          },
        },
      },
    },

    "/admin/social-media#getTikTokOAuthUrl": {
      post: {
        tags: ["OAuth URL Builders"],
        summary: "getTikTokOAuthUrl — generate TikTok OAuth URL (PKCE)",
        description:
          "**Server Action.** Generates a TikTok OAuth 2.0 + PKCE authorization URL. Sets `oauth_state`, `oauth_code_verifier`, and `oauth_return` cookies.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  returnTo: { type: "string", enum: ["admin", "demo"] },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Authorization URL",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { url: { type: "string", format: "uri" } },
                },
              },
            },
          },
        },
      },
    },

    "/admin/social-media#getMetaOAuthUrl": {
      post: {
        tags: ["OAuth URL Builders"],
        summary: "getMetaOAuthUrl — generate Meta / Instagram OAuth URL",
        description:
          "**Server Action.** Generates a Meta OAuth 2.0 authorization URL for Instagram. Sets `oauth_state` and `oauth_return` cookies.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  returnTo: { type: "string", enum: ["admin", "demo"] },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Authorization URL",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { url: { type: "string", format: "uri" } },
                },
              },
            },
          },
        },
      },
    },

    "/admin/social-media#getThreadsOAuthUrl": {
      post: {
        tags: ["OAuth URL Builders"],
        summary: "getThreadsOAuthUrl — generate Threads OAuth URL",
        description:
          "**Server Action.** Generates a Threads OAuth 2.0 authorization URL. Sets `oauth_state` and `oauth_return` cookies.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  returnTo: { type: "string", enum: ["admin", "demo"] },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Authorization URL",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { url: { type: "string", format: "uri" } },
                },
              },
            },
          },
        },
      },
    },

    // ─── Server Actions: Public Forms ────────────────────────────────────────

    "/contact#submitContactForm": {
      post: {
        tags: ["Public Forms"],
        summary: "submitContactForm — submit contact form",
        description:
          "**Server Action.** Validates and inserts a contact form submission into `contact_submissions`. " +
          "Includes honeypot, timing-token CSRF, per-IP/email rate limiting, and keyword spam checks. " +
          "Sends a Discord notification on success.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["name", "email", "subject", "message", "form_token"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  subject: { type: "string" },
                  message: { type: "string" },
                  website_url: { type: "string", description: "Honeypot — must be empty" },
                  form_token: { type: "string", description: "Base64-encoded timestamp for timing-based CSRF" },
                },
              },
            },
          },
        },
        responses: {
          "302": { description: "Redirect to `/contact?success=true` or `/contact?error=<code>`" },
        },
      },
    },

    "/guest-submission#submitGuestApplication": {
      post: {
        tags: ["Public Forms"],
        summary: "submitGuestApplication — submit guest/speaker application",
        description:
          "**Server Action.** Validates and inserts a guest application into `guest_applications`. " +
          "Same security layers as contact form. Sends a Discord notification on success.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["name", "email", "expertise", "topicIdea", "bio", "form_token"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  expertise: { type: "string" },
                  topicIdea: { type: "string" },
                  bio: { type: "string" },
                  phone: { type: "string" },
                  socialMedia: { type: "string" },
                  availability: { type: "string" },
                  website_url: { type: "string", description: "Honeypot — must be empty" },
                  form_token: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "302": { description: "Redirect to `/guest-submission?success=true` or `?error=<code>`" },
        },
      },
    },

    "/sponsorship#submitSponsorshipInquiry": {
      post: {
        tags: ["Public Forms"],
        summary: "submitSponsorshipInquiry — submit sponsorship inquiry",
        description:
          "**Server Action.** Validates and inserts a sponsorship inquiry into `sponsorship_inquiries`. " +
          "Same security layers. Sends a Discord notification that includes the budget field.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["companyName", "contactName", "email", "goals", "form_token"],
                properties: {
                  companyName: { type: "string" },
                  contactName: { type: "string" },
                  email: { type: "string", format: "email" },
                  budget: { type: "string" },
                  goals: { type: "string" },
                  message: { type: "string" },
                  phone: { type: "string" },
                  website: { type: "string", format: "uri" },
                  website_url: { type: "string", description: "Honeypot — must be empty" },
                  form_token: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "302": { description: "Redirect to `/sponsorship?success=true` or `?error=<code>`" },
        },
      },
    },

    // ─── Server Actions: Admin - Contacts ────────────────────────────────────

    "/admin/contacts#updateContactStatus": {
      post: {
        tags: ["Admin - Contacts"],
        summary: "updateContactStatus — update status of a contact submission",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "status"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  status: { type: "string", enum: ["new", "reviewed", "responded"] },
                  reviewedBy: { type: "string", description: "Name of the admin who reviewed" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Status updated; page revalidated" } },
      },
    },

    "/admin/contacts#reviewContactSubmission": {
      post: {
        tags: ["Admin - Contacts"],
        summary: "reviewContactSubmission — mark as reviewed",
        description: "Sets status to `reviewed` and records `reviewed_by` with a timestamp.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "reviewedBy"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  reviewedBy: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Marked as reviewed" } },
      },
    },

    "/admin/contacts#deleteContactSubmission": {
      post: {
        tags: ["Admin - Contacts"],
        summary: "deleteContactSubmission — delete a contact submission",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: { id: { type: "string", format: "uuid" } },
              },
            },
          },
        },
        responses: { "200": { description: "Row deleted from `contact_submissions`" } },
      },
    },

    // ─── Server Actions: Admin - Guests ──────────────────────────────────────

    "/admin/guests#updateGuestStatus": {
      post: {
        tags: ["Admin - Guests"],
        summary: "updateGuestStatus — update guest application status",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "status"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  status: { type: "string", enum: ["pending", "reviewing", "approved", "rejected", "scheduled"] },
                  reviewedBy: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Status updated" } },
      },
    },

    "/admin/guests#reviewGuestApplication": {
      post: {
        tags: ["Admin - Guests"],
        summary: "reviewGuestApplication — mark application as reviewing",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "reviewedBy"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  reviewedBy: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Marked as reviewing" } },
      },
    },

    "/admin/guests#deleteGuestApplication": {
      post: {
        tags: ["Admin - Guests"],
        summary: "deleteGuestApplication — delete a guest application",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: { id: { type: "string", format: "uuid" } },
              },
            },
          },
        },
        responses: { "200": { description: "Row deleted" } },
      },
    },

    // ─── Server Actions: Admin - Sponsorships ────────────────────────────────

    "/admin/sponsorships#updateSponsorshipStatus": {
      post: {
        tags: ["Admin - Sponsorships"],
        summary: "updateSponsorshipStatus — update sponsorship inquiry status",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "status"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  status: { type: "string", enum: ["new", "reviewing", "negotiating", "accepted", "declined"] },
                  reviewedBy: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Status updated" } },
      },
    },

    "/admin/sponsorships#reviewSponsorshipInquiry": {
      post: {
        tags: ["Admin - Sponsorships"],
        summary: "reviewSponsorshipInquiry — mark as reviewing",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "reviewedBy"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  reviewedBy: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Marked as reviewing" } },
      },
    },

    "/admin/sponsorships#deleteSponsorshipInquiry": {
      post: {
        tags: ["Admin - Sponsorships"],
        summary: "deleteSponsorshipInquiry — delete a sponsorship inquiry",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: { id: { type: "string", format: "uuid" } },
              },
            },
          },
        },
        responses: { "200": { description: "Row deleted" } },
      },
    },

    // ─── Server Actions: Admin - Tasks ───────────────────────────────────────

    "/admin/tasks#createTask": {
      post: {
        tags: ["Admin - Tasks"],
        summary: "createTask — create a new Kanban task",
        description: "Inserts a task with default `sort_order=0` and empty `tags`. Sends a Discord notification.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TaskCreatePayload" },
            },
          },
        },
        responses: { "200": { description: "Task created" } },
      },
    },

    "/admin/tasks#updateTask": {
      post: {
        tags: ["Admin - Tasks"],
        summary: "updateTask — update an existing task",
        description: "Partial update of task fields. Sends a Discord notification listing changed fields.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  data: { $ref: "#/components/schemas/TaskUpdatePayload" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Task updated" } },
      },
    },

    "/admin/tasks#deleteTask": {
      post: {
        tags: ["Admin - Tasks"],
        summary: "deleteTask — delete a task",
        description: "Deletes the task and sends a Discord notification.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: { id: { type: "string", format: "uuid" } },
              },
            },
          },
        },
        responses: { "200": { description: "Task deleted" } },
      },
    },

    "/admin/tasks#updateTaskColumn": {
      post: {
        tags: ["Admin - Tasks"],
        summary: "updateTaskColumn — move a task to a different column",
        description: "Updates the task's `column_id`. Sets `done_at` if the target column is 'Done'. Sends a Discord notification.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "columnId"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  columnId: { type: "string", format: "uuid" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Task moved" } },
      },
    },

    "/admin/tasks#archiveDoneTasks": {
      post: {
        tags: ["Admin - Tasks"],
        summary: "archiveDoneTasks — archive completed tasks older than 7 days",
        description: "Sets `archived_at` on tasks in the 'Done' column that were completed more than 7 days ago.",
        responses: {
          "200": {
            description: "Archive complete",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { archivedCount: { type: "integer" } },
                },
              },
            },
          },
        },
      },
    },

    "/admin/tasks#createColumn": {
      post: {
        tags: ["Admin - Tasks"],
        summary: "createColumn — create a Kanban column",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "color", "sort_order"],
                properties: {
                  name: { type: "string" },
                  color: { type: "string", description: "Color key e.g. 'blue', 'green', 'gray'" },
                  sort_order: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Column created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/admin/tasks#updateColumn": {
      post: {
        tags: ["Admin - Tasks"],
        summary: "updateColumn — update a Kanban column",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  name: { type: "string" },
                  color: { type: "string" },
                  sort_order: { type: "integer" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Column updated or `{ error }` on failure" } },
      },
    },

    "/admin/tasks#deleteColumn": {
      post: {
        tags: ["Admin - Tasks"],
        summary: "deleteColumn — delete a Kanban column",
        description: "Deletes the column. Returns an error if the column still has tasks (FK constraint).",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: { id: { type: "string", format: "uuid" } },
              },
            },
          },
        },
        responses: { "200": { description: "Column deleted or `{ error }` if tasks remain" } },
      },
    },

    // ─── Server Actions: Admin - Hosts ───────────────────────────────────────

    "/admin/hosts#createHost": {
      post: {
        tags: ["Admin - Hosts"],
        summary: "createHost — add a host or team member",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HostPayload" },
            },
          },
        },
        responses: { "200": { description: "Host created; `/admin/hosts` and `/about` revalidated" } },
      },
    },

    "/admin/hosts#updateHost": {
      post: {
        tags: ["Admin - Hosts"],
        summary: "updateHost — update host info",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  payload: { $ref: "#/components/schemas/HostPayload" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Host updated" } },
      },
    },

    "/admin/hosts#deleteHost": {
      post: {
        tags: ["Admin - Hosts"],
        summary: "deleteHost — delete a host",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: { id: { type: "string", format: "uuid" } },
              },
            },
          },
        },
        responses: { "200": { description: "Host deleted" } },
      },
    },

    "/admin/hosts#getHosts": {
      post: {
        tags: ["Admin - Hosts"],
        summary: "getHosts — list all hosts",
        description: "Returns all hosts ordered by `sort_order`. Used to populate assignee dropdowns in task creation.",
        responses: {
          "200": {
            description: "List of hosts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", format: "uuid" },
                      name: { type: "string" },
                      user_id: { type: "string", format: "uuid", nullable: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/admin/calendar#updateEventHosts": {
      post: {
        tags: ["Admin - Hosts"],
        summary: "updateEventHosts — assign hosts to a calendar event",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "hosts"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  hosts: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Event hosts updated" } },
      },
    },

    "/admin/calendar#getEvents": {
      post: {
        tags: ["Admin - Hosts"],
        summary: "getEvents — search events by name",
        description: "Case-insensitive name search, max 20 results ordered by `event_date` descending.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["query"],
                properties: { query: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Matching events",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", format: "uuid" },
                      name: { type: "string" },
                      event_date: { type: "string", format: "date" },
                      venue_name: { type: "string", nullable: true },
                      hosts: { type: "array", items: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ─── Server Actions: Admin - Affiliate Links ─────────────────────────────

    "/admin/affiliate-links#createAffiliateLink": {
      post: {
        tags: ["Admin - Affiliate Links"],
        summary: "createAffiliateLink — create an affiliate link or promo code",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AffiliateLinkPayload" },
            },
          },
        },
        responses: {
          "200": {
            description: "Link created or error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    link: { $ref: "#/components/schemas/AffiliateLink" },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/admin/affiliate-links#updateAffiliateLink": {
      post: {
        tags: ["Admin - Affiliate Links"],
        summary: "updateAffiliateLink — update an affiliate link",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  data: { $ref: "#/components/schemas/AffiliateLinkPayload" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Link updated or `{ error }`" } },
      },
    },

    "/admin/affiliate-links#deleteAffiliateLink": {
      post: {
        tags: ["Admin - Affiliate Links"],
        summary: "deleteAffiliateLink — delete an affiliate link",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: { id: { type: "string", format: "uuid" } },
              },
            },
          },
        },
        responses: { "200": { description: "Link deleted or `{ error }`" } },
      },
    },

    "/admin/affiliate-links#toggleAffiliateLinkActive": {
      post: {
        tags: ["Admin - Affiliate Links"],
        summary: "toggleAffiliateLinkActive — activate or deactivate a link",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "is_active"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  is_active: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Active state toggled or `{ error }`" } },
      },
    },

    // ─── Server Actions: Admin - Social Media ────────────────────────────────

    "/admin/social-media#createSocialPost": {
      post: {
        tags: ["Admin - Social Media"],
        summary: "createSocialPost — schedule a new social media post",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SocialPostInsert" },
            },
          },
        },
        responses: {
          "200": {
            description: "Post created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/admin/social-media#updateSocialPost": {
      post: {
        tags: ["Admin - Social Media"],
        summary: "updateSocialPost — update a scheduled post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  data: { $ref: "#/components/schemas/SocialPostInsert" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Post updated or `{ error }`" } },
      },
    },

    "/admin/social-media#deleteSocialPost": {
      post: {
        tags: ["Admin - Social Media"],
        summary: "deleteSocialPost — delete a post and its media files",
        description: "Deletes the post from `social_posts` and removes any associated media files from storage.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: { id: { type: "string", format: "uuid" } },
              },
            },
          },
        },
        responses: { "200": { description: "Post deleted or `{ error }`" } },
      },
    },

    "/admin/social-media#markPostAsPosted": {
      post: {
        tags: ["Admin - Social Media"],
        summary: "markPostAsPosted — mark a scheduled post as published",
        description: "Sets `status='posted'` and clears `media_paths` (files already deleted from storage after posting).",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: { id: { type: "string", format: "uuid" } },
              },
            },
          },
        },
        responses: { "200": { description: "Post marked as posted or `{ error }`" } },
      },
    },

    "/admin/social-media#getSocialPostsForDateRange": {
      post: {
        tags: ["Admin - Social Media"],
        summary: "getSocialPostsForDateRange — fetch posts in a date range",
        description: "Returns scheduled and posted posts within the given date range (treated as full UTC days). Ordered by `scheduled_at` ascending.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["from", "to"],
                properties: {
                  from: { type: "string", format: "date", description: "Start date YYYY-MM-DD" },
                  to: { type: "string", format: "date", description: "End date YYYY-MM-DD" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Array of social posts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/SocialPost" },
                },
              },
            },
          },
        },
      },
    },

    "/admin/social-media#getSocialTokens": {
      post: {
        tags: ["Admin - Social Media"],
        summary: "getSocialTokens — list all connected platform tokens",
        description: "Returns all rows from `social_tokens` ordered by platform.",
        responses: {
          "200": {
            description: "Array of social tokens",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/SocialToken" },
                },
              },
            },
          },
        },
      },
    },

    "/admin/social-media#disconnectSocialPlatform": {
      post: {
        tags: ["Admin - Social Media"],
        summary: "disconnectSocialPlatform — revoke OAuth token for a platform",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["platform"],
                properties: {
                  platform: { type: "string", enum: ["youtube", "tiktok", "instagram", "threads"] },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Token deleted or `{ error }`" } },
      },
    },

    // ─── Server Actions: Admin - Content ─────────────────────────────────────

    "/admin/content#saveHighlightedEpisode": {
      post: {
        tags: ["Admin - Content"],
        summary: "saveHighlightedEpisode — set the featured YouTube episode URL",
        description: "Upserts `site_settings` with key `highlighted_youtube_url`. Revalidates `/` and `/admin/content`.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["youtubeUrl"],
                properties: {
                  youtubeUrl: { type: "string", format: "uri", description: "Full YouTube video URL" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Setting saved or `{ error }`" } },
      },
    },

    // ─── Server Actions: Admin - Users ────────────────────────────────────────

    "/admin/settings#changePassword": {
      post: {
        tags: ["Admin - Users"],
        summary: "changePassword — change the authenticated user's password",
        description: "Re-authenticates with the current password before updating. Returns `{ success: true }` or `{ error }`.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["currentPassword", "newPassword"],
                properties: {
                  currentPassword: { type: "string", format: "password" },
                  newPassword: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Success or error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/admin/tasks#getUsers": {
      post: {
        tags: ["Admin - Users"],
        summary: "getUsers — list all Supabase Auth users",
        description: "Uses the admin Supabase client. Resolves display name from metadata (`full_name` > `name` > email).",
        responses: {
          "200": {
            description: "Array of users or `{ error }`",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    users: {
                      type: "array",
                      items: { $ref: "#/components/schemas/AuthUser" },
                    },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ─── Server Actions: Admin - EDMTrain ────────────────────────────────────
    "/admin/calendar#searchEdmtrainByName": {
      post: {
        tags: ["Admin - EDMTrain"],
        summary: "searchEdmtrainByName — search EDMTrain events by event/artist name",
        description: "Proxies the EDMTrain Event Search API using the server-side `EDMTRAIN_API_KEY`. Returns upcoming events matching the provided name.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["eventName"],
                properties: {
                  eventName: { type: "string", description: "Festival or artist name to search for" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Array of matching EDMTrain events or `{ error }`",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    events: {
                      type: "array",
                      items: { $ref: "#/components/schemas/EdmtrainEvent" },
                    },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/admin/calendar#searchEdmtrainLocations": {
      post: {
        tags: ["Admin - EDMTrain"],
        summary: "searchEdmtrainLocations — find EDMTrain locations by city name",
        description: "Step 1 of the city search flow. Calls the EDMTrain Locations API with a city string and returns matching location objects (including their `id`). The UI shows these as a dropdown for the user to select.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["city"],
                properties: {
                  city: { type: "string", description: "City name to search (e.g. Toronto)" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Array of matching locations or `{ error }`",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    locations: {
                      type: "array",
                      items: { $ref: "#/components/schemas/EdmtrainLocation" },
                    },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/admin/calendar#searchEdmtrainByLocationId": {
      post: {
        tags: ["Admin - EDMTrain"],
        summary: "searchEdmtrainByLocationId — fetch events for a specific EDMTrain location",
        description: "Step 2 of the city search flow. Takes the `id` from a selected `EdmtrainLocation` and returns all upcoming events at that location.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["locationId"],
                properties: {
                  locationId: { type: "integer", description: "EDMTrain location ID" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Array of upcoming events or `{ error }`",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    events: {
                      type: "array",
                      items: { $ref: "#/components/schemas/EdmtrainEvent" },
                    },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        description: "CRON_SECRET env var passed as `Authorization: Bearer <token>`",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: { error: { type: "string" } },
      },

      AuthUser: {
        type: "object",
        required: ["id", "email", "name"],
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          name: { type: "string" },
        },
      },

      ContactSubmission: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          subject: { type: "string" },
          message: { type: "string" },
          status: { type: "string", enum: ["new", "reviewed", "responded"] },
          reviewed_by: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },

      GuestApplication: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          expertise: { type: "string" },
          topic_idea: { type: "string" },
          bio: { type: "string" },
          social_media: { type: "string" },
          availability: { type: "string" },
          status: { type: "string", enum: ["pending", "reviewing", "approved", "rejected", "scheduled"] },
          reviewed_by: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },

      SponsorshipInquiry: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          company_name: { type: "string" },
          contact_name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          website: { type: "string", format: "uri" },
          budget: { type: "string" },
          goals: { type: "string" },
          message: { type: "string" },
          package_interest: { type: "string" },
          status: { type: "string", enum: ["new", "reviewing", "negotiating", "accepted", "declined"] },
          reviewed_by: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },

      KanbanColumn: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          color: { type: "string", description: "Color key: 'blue', 'green', 'gray', etc." },
          sort_order: { type: "integer" },
        },
      },

      TaskCreatePayload: {
        type: "object",
        required: ["title", "description", "column_id", "priority"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          column_id: { type: "string", format: "uuid" },
          priority: { type: "string", enum: ["low", "medium", "high"] },
          assignee_names: { type: "array", items: { type: "string" } },
          assignee_ids: { type: "array", items: { type: "string", format: "uuid" } },
          due_date: { type: "string", format: "date", description: "YYYY-MM-DD" },
          label_color: { type: "string", description: "Color key" },
          event_id: { type: "string", format: "uuid", nullable: true },
        },
      },

      TaskUpdatePayload: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          priority: { type: "string", enum: ["low", "medium", "high"] },
          assignee_names: { type: "array", items: { type: "string" } },
          assignee_ids: { type: "array", items: { type: "string", format: "uuid" } },
          due_date: { type: "string", format: "date" },
          label_color: { type: "string" },
          column_id: { type: "string", format: "uuid" },
          tags: { type: "array", items: { type: "string" } },
        },
      },

      HostPayload: {
        type: "object",
        required: ["name", "role"],
        properties: {
          name: { type: "string" },
          interests: { type: "string", nullable: true },
          description: { type: "string", nullable: true },
          social_links: {
            type: "array",
            items: {
              type: "object",
              properties: {
                platform: { type: "string" },
                url: { type: "string", format: "uri" },
              },
            },
          },
          photo_url: { type: "string", format: "uri" },
          user_id: { type: "string", format: "uuid" },
          role: { type: "string", enum: ["host", "team"] },
        },
      },

      AffiliateLinkPayload: {
        type: "object",
        required: ["name", "description", "image_url", "type", "value", "is_active"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          image_url: { type: "string", format: "uri" },
          type: { type: "string", enum: ["link", "code"] },
          value: { type: "string", description: "URL if type=link; promo code if type=code" },
          tracking_url: { type: "string", format: "uri", nullable: true },
          terms: { type: "string", nullable: true },
          website_link: { type: "string", format: "uri", nullable: true },
          expires_at: { type: "string", format: "date-time", nullable: true },
          is_active: { type: "boolean" },
        },
      },

      AffiliateLink: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          description: { type: "string" },
          image_url: { type: "string", format: "uri" },
          type: { type: "string", enum: ["link", "code"] },
          value: { type: "string" },
          tracking_url: { type: "string", nullable: true },
          terms: { type: "string", nullable: true },
          website_link: { type: "string", nullable: true },
          expires_at: { type: "string", format: "date-time", nullable: true },
          is_active: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },

      SocialPostInsert: {
        type: "object",
        required: ["description", "post_type", "scheduled_at", "status", "platforms", "platform_settings"],
        properties: {
          title: { type: "string", nullable: true },
          description: { type: "string" },
          post_type: { type: "string", enum: ["video", "photo", "multi"] },
          scheduled_at: { type: "string", format: "date-time" },
          status: { type: "string", enum: ["draft", "scheduled", "posted", "failed"] },
          platforms: {
            type: "array",
            items: { type: "string", enum: ["youtube", "instagram", "tiktok"] },
          },
          media_paths: {
            type: "array",
            items: { type: "string" },
            nullable: true,
          },
          platform_settings: { $ref: "#/components/schemas/PlatformSettings" },
        },
      },

      SocialPost: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string", nullable: true },
          description: { type: "string" },
          post_type: { type: "string", enum: ["video", "photo", "multi"] },
          scheduled_at: { type: "string", format: "date-time" },
          status: { type: "string", enum: ["draft", "scheduled", "posted", "failed"] },
          platforms: { type: "array", items: { type: "string" } },
          media_paths: { type: "array", items: { type: "string" }, nullable: true },
          platform_settings: { $ref: "#/components/schemas/PlatformSettings" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },

      PlatformSettings: {
        type: "object",
        properties: {
          youtube: {
            type: "object",
            properties: {
              visibility: { type: "string", enum: ["public", "unlisted", "private"] },
            },
          },
          instagram: {
            type: "object",
            properties: {
              hashtags: { type: "string", description: "e.g. '#edm #rave'" },
              location_tag: { type: "string" },
            },
          },
          tiktok: {
            type: "object",
            properties: {
              privacy: { type: "string", enum: ["public", "friends", "private"] },
              allow_duet: { type: "boolean" },
              allow_stitch: { type: "boolean" },
            },
          },
        },
      },

      SocialToken: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          platform: { type: "string", enum: ["youtube", "tiktok", "instagram", "threads"] },
          access_token: { type: "string" },
          refresh_token: { type: "string", nullable: true },
          expires_at: { type: "string", format: "date-time", nullable: true },
          platform_user_id: { type: "string", nullable: true },
          platform_username: { type: "string", nullable: true },
          platform_avatar_url: { type: "string", nullable: true },
          scopes: { type: "array", items: { type: "string" }, nullable: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },

      EdmtrainLocation: {
        type: "object",
        properties: {
          id: { type: "integer", description: "EDMTrain location ID" },
          city: { type: "string" },
          state: { type: "string" },
          country: { type: "string" },
        },
      },

      EdmtrainEvent: {
        type: "object",
        properties: {
          id: { type: "integer", description: "EDMTrain event ID" },
          name: { type: "string", nullable: true },
          link: { type: "string", format: "uri" },
          date: { type: "string", format: "date" },
          startTime: { type: "string", nullable: true },
          endTime: { type: "string", nullable: true },
          ages: { type: "string", nullable: true },
          festivalInd: { type: "boolean" },
          livestreamInd: { type: "boolean" },
          venue: {
            type: "object",
            properties: {
              name: { type: "string" },
              location: { type: "string" },
              address: { type: "string" },
              lat: { type: "number" },
              lng: { type: "number" },
            },
          },
          artistList: {
            type: "array",
            nullable: true,
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                link: { type: "string", format: "uri" },
                b2bInd: { type: "boolean" },
              },
            },
          },
        },
      },
    },
  },
}
