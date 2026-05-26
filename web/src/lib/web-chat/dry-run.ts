import type { IntakeDecision } from "@/lib/intake/types";
import {
  type WebChatAdapterResult,
  type WebChatDryRunInput,
} from "@/lib/web-chat/intake-adapter";
import { runWebChatIntake } from "@/lib/web-chat/intake";

export type WebChatIntakeDryRunResult =
  | {
      ok: true;
      decision: IntakeDecision;
    }
  | {
      ok: false;
      persistence: "unavailable";
    }
  | {
      ok: false;
      adapter: WebChatAdapterResult;
    };

export async function runWebChatIntakeDryRun(
  input: WebChatDryRunInput,
): Promise<WebChatIntakeDryRunResult> {
  return runWebChatIntake(input);
}
