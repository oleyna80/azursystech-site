import { createHash, randomUUID } from "node:crypto";

import type { ContactSubmitPayload } from "@/lib/contact-submit";
import {
  getIntakeDatabasePool,
  getIntakeStorageMode,
  isSqlStorageEnabled,
  type IntakeStorageMode,
} from "@/lib/intake/config";

export { getIntakeStorageMode, isSqlStorageEnabled, type IntakeStorageMode };

type PersistLeadSubmissionInput = {
  payload: ContactSubmitPayload;
  requestId: string;
  idempotencyKey: string;
  receivedAtUtc: Date;
};

type PersistLeadSubmissionResult = {
  leadId: string;
  inserted: boolean;
  dedupeKey: string;
};

function buildDedupeKey(payload: ContactSubmitPayload): string {
  const stableInput = [
    payload.source,
    payload.segment,
    payload.phone.toLowerCase(),
    payload.service_type,
    payload.problem_description.trim().toLowerCase(),
  ].join("|");

  return createHash("sha256").update(stableInput).digest("hex");
}

function toNullableStringArray(value?: string[]): string[] | null {
  if (!value || value.length === 0) {
    return null;
  }
  return value;
}

export async function persistLeadSubmission(
  input: PersistLeadSubmissionInput,
): Promise<PersistLeadSubmissionResult> {
  const dedupeKey = buildDedupeKey(input.payload);
  const leadId = randomUUID();
  const db = getIntakeDatabasePool();

  const insertResult = await db.query<{ id: string }>(
    `
      INSERT INTO intake_leads (
        id, received_at_utc, request_id, idempotency_key, dedupe_key,
        source, status, name, phone, email, city, segment, service_type,
        problem_description, device_count, onsite_required, urgency,
        company_name, business_type, workstation_count, business_needs,
        business_address, home_device_type, device_state, home_need_type,
        raw_payload, normalized_payload
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17,
        $18, $19, $20, $21,
        $22, $23, $24, $25,
        $26::jsonb, $27::jsonb
      )
      ON CONFLICT (idempotency_key) DO NOTHING
      RETURNING id
    `,
    [
      leadId,
      input.receivedAtUtc.toISOString(),
      input.requestId,
      input.idempotencyKey,
      dedupeKey,
      input.payload.source,
      input.payload.status,
      input.payload.name,
      input.payload.phone,
      input.payload.email ?? null,
      input.payload.city,
      input.payload.segment,
      input.payload.service_type,
      input.payload.problem_description,
      input.payload.device_count ?? null,
      input.payload.onsite_required ?? null,
      input.payload.urgency ?? null,
      input.payload.company_name ?? null,
      input.payload.business_type ?? null,
      input.payload.workstation_count ?? null,
      JSON.stringify(toNullableStringArray(input.payload.business_needs)),
      input.payload.business_address ?? null,
      JSON.stringify(toNullableStringArray(input.payload.home_device_type)),
      input.payload.device_state ?? null,
      JSON.stringify(toNullableStringArray(input.payload.home_need_type)),
      JSON.stringify(input.payload),
      JSON.stringify(input.payload),
    ],
  );

  if (insertResult.rows.length > 0) {
    await recordLeadEvent(insertResult.rows[0].id, "lead.submitted", {
      request_id: input.requestId,
      source: input.payload.source,
    });
    return { leadId: insertResult.rows[0].id, inserted: true, dedupeKey };
  }

  const existingResult = await db.query<{ id: string }>(
    `SELECT id FROM intake_leads WHERE idempotency_key = $1 LIMIT 1`,
    [input.idempotencyKey],
  );

  const existingLeadId = existingResult.rows[0]?.id ?? leadId;
  return { leadId: existingLeadId, inserted: false, dedupeKey };
}

export async function recordLeadEvent(
  leadId: string,
  eventType: string,
  eventPayload: Record<string, unknown>,
): Promise<void> {
  const db = getIntakeDatabasePool();
  await db.query(
    `
      INSERT INTO intake_lead_events (lead_id, event_type, event_payload)
      VALUES ($1, $2, $3::jsonb)
    `,
    [leadId, eventType, JSON.stringify(eventPayload)],
  );
}
