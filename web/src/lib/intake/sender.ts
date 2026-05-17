import type { IntakeOutboxMessage } from "@/lib/intake/persistence";

export type IntakeOutboundSendResult =
  | {
      ok: true;
      providerMessageId: string;
    }
  | {
      ok: false;
      error: string;
      retryable: boolean;
    };

export type IntakeOutboundSender = {
  send(message: IntakeOutboxMessage): Promise<IntakeOutboundSendResult>;
};

export function createFakeIntakeOutboundSender(
  options: { fail?: boolean; providerMessagePrefix?: string } = {},
): IntakeOutboundSender {
  return {
    async send(message) {
      if (options.fail) {
        return {
          ok: false,
          error: "fake_sender_failure",
          retryable: true,
        };
      }

      return {
        ok: true,
        providerMessageId: `${options.providerMessagePrefix ?? "fake"}:${message.messageId}`,
      };
    },
  };
}
