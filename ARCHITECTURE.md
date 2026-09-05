# System Architecture & Real-Time Flow
## Technical Blueprint: PulseChat Infrastructure

---

### 1. High-Level System Architecture Diagram

```
[ Frontend: Next.js 15 (App Router) / React 19 + TailwindCSS + Zustand + TanStack Query ]
                                  │
                 HTTPS / REST     │    WebSocket (WSS) / WebTransport
                                  ▼
[ API Gateway / Reverse Proxy: Nginx / Envoy / Cloudflare ]
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
[ Auth & Core REST API ]                         [ Real-Time Message Gateway ]
(Node.js Fastify / Go Gin)                       (Node.js ws / Socket.io / Go Gorilla)
         │                                                 │
         │                                                 ├──► [ Redis Cluster / PubSub ]
         ▼                                                 │    (Presence, Message Broadcast)
[ PostgreSQL Database ]                                    │
(Users, Relationships, Metadata)                           ▼
                                                 [ MongoDB / Cassandra / ScyllaDB ]
                                                 (Message History Store / Messages)
```

---

### 2. Component Architecture Summary
- **Client Frontend:** Next.js 15 with App Router, TailwindCSS for layout/styling, Zustand for client state management, TanStack Query for server state caching, and WebSocket client for real-time messaging.
- **API Gateway:** Cloudflare / Nginx handling SSL termination, rate limiting, and routing traffic to downstream REST services or WebSocket clusters.
- **Core REST API:** Service built with Fastify / Go Gin handling user management, authentication (JWT/OAuth), contact lookup, media URL pre-signing, and session settings.
- **Real-Time Gateway:** Scalable WebSocket server cluster managing persistent client connections, real-time message routing, typing indicators, and delivery acknowledgments.
- **Redis Cluster:** High-performance in-memory key-value store powering WebSocket Pub/Sub broadcasting and presence status tracking (online/offline/typing).
- **Primary Persistent Store:** PostgreSQL database storing core structured relational data (users, conversations, participants, message metadata, reactions).

---

### 3. Real-Time Message Delivery Flow (Sequence Diagram)

```
[Client A]                    [WS Server]                [Redis PubSub]          [Client B]
    │                              │                           │                      │
    ├── 1. Tampilkan di UI (Local) ┤                           │                      │
    ├── 2. Emit 'send_message' ───►│                           │                      │
    │                              ├── 3. Simpan ke Database   │                      │
    │                              ├── 4. Publish ke Channel ─►│                      │
    │                              │                           ├── 5. Forward pesan ─►│
    │◄── 6. Ack: Status 'SENT' ────┤                           │                      ├── 7. Ring UI
    │                              │                           │                      ├── 8. Emit 'read'
    │◄── 9. Notif: Status 'READ' ──┴───────────────────────────┴──────────────────────┤
```

#### Detailed Message Flow Steps:
1. **Optimistic UI Update:** Client A immediately renders the outgoing message in `Pending` state.
2. **WebSocket Emit:** Client A transmits `send_message` event payload over WSS.
3. **Persistence:** Real-time WS Server saves message record to database with timestamp.
4. **Pub/Sub Dispatch:** WS Server publishes message payload to Redis Pub/Sub channel assigned to conversation ID.
5. **Real-time Forwarding:** Redis delivers message to WS Server node holding active connection of Client B, which forwards it to Client B.
6. **Acknowledgment ('SENT'):** WS Server sends ACK to Client A updating message status to `Sent` (single checkmark).
7. **Incoming Notification:** Client B receives payload, updates active conversation window, rings tone/vibration, and emits delivery status.
8. **Read Receipt:** When Client B views the conversation window, Client B emits `read_message` event.
9. **Status Broadcast:** WS Server broadcasts `READ` status update back to Client A (double blue checkmarks / avatar badge).
