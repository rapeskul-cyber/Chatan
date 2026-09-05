# Database Schema & API Contract Specification
## PulseChat Data & Interface Specifications

---

### 1. PostgreSQL Database Schema (DDL)

```sql
-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(32) UNIQUE NOT NULL,
    display_name VARCHAR(64) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    avatar_url TEXT,
    about TEXT DEFAULT 'Hey there! I am using PulseChat.',
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_online BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CONVERSATIONS TABLE
CREATE TYPE conversation_type AS ENUM ('DIRECT', 'GROUP');

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type conversation_type DEFAULT 'DIRECT',
    title VARCHAR(100), -- Diisi jika GROUP
    avatar_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PARTICIPANTS TABLE
CREATE TYPE member_role AS ENUM ('ADMIN', 'MEMBER');

CREATE TABLE conversation_participants (
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role member_role DEFAULT 'MEMBER',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_message_id UUID,
    PRIMARY KEY (conversation_id, user_id)
);

-- 4. MESSAGES TABLE
CREATE TYPE message_type AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT');

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    parent_message_id UUID REFERENCES messages(id), -- Reply quote
    content TEXT,
    media_url TEXT,
    message_type message_type DEFAULT 'TEXT',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_conv_created ON messages (conversation_id, created_at DESC);

-- 5. REACTIONS TABLE
CREATE TABLE message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction_code VARCHAR(16) NOT NULL, -- e.g. '❤️', '🔥', '😂'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (message_id, user_id, reaction_code)
);
```

---

### 2. REST API Endpoints Specification

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Autentikasi user & generate JWT Token |
| `GET` | `/api/v1/conversations` | Daftar riwayat obrolan user (dengan unread count & last message) |
| `POST` | `/api/v1/conversations` | Membuat obrolan baru (Direct atau Group) |
| `GET` | `/api/v1/conversations/:id/messages` | Mengambil pesan obrolan (Cursor-based pagination) |
| `POST` | `/api/v1/media/upload-url` | Generate S3 Pre-signed URL untuk upload file langsung dari browser |
| `POST` | `/api/v1/messages/:id/reactions` | Menambahkan/menghapus reaksi emoji pada pesan |

---

### 3. WebSocket Real-Time Event Contracts

#### 3.1 Client-to-Server Events
- `send_message`:
  ```json
  {
    "conversation_id": "uuid",
    "parent_message_id": "uuid | null",
    "message_type": "TEXT | IMAGE | VIDEO | AUDIO | DOCUMENT",
    "content": "Hello World",
    "media_url": "https://..."
  }
  ```
- `typing_start`:
  ```json
  { "conversation_id": "uuid" }
  ```
- `read_message`:
  ```json
  { "conversation_id": "uuid", "message_id": "uuid" }
  ```

#### 3.2 Server-to-Client Events
- `new_message`:
  ```json
  {
    "id": "uuid",
    "conversation_id": "uuid",
    "sender_id": "uuid",
    "content": "Hello World",
    "created_at": "2026-09-05T16:30:00Z"
  }
  ```
- `user_presence`:
  ```json
  { "user_id": "uuid", "is_online": true, "last_seen_at": "2026-09-05T16:30:00Z" }
  ```
- `message_ack`:
  ```json
  { "message_id": "uuid", "status": "SENT | DELIVERED | READ" }
  ```
