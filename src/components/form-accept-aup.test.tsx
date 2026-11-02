import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as z from "zod";
import { useAppForm } from "@/hooks/form";
import { renderWithProviders } from "@/test/utils";
import FormAcceptAup from "@/components/form-accept-aup";

// The policy text is fetched from the API; it isn't what's under test.
vi.mock("@/components/terms-and-conditions-box", () => ({
  default: () => <p>Policy text</p>,
}));

// Mirrors how routes/register/aup.tsx wires the form.
function Harness({ onSubmit }: { onSubmit: () => Promise<void> }) {
  const form = useAppForm({
    defaultValues: { accepted: false },
    validators: { onSubmit: z.object({ accepted: z.literal(true) }) },
    onSubmit,
  });
  return <FormAcceptAup form={form} />;
}

const unloadIsBlocked = () => {
  const event = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(event);
  return event.defaultPrevented;
};

describe("FormAcceptAup", () => {
  it("asks the user to wait, and warns before unload, while the account is created", async () => {
    const user = userEvent.setup();
    let finish!: () => void;
    const onSubmit = () => new Promise<void>((resolve) => (finish = resolve));
    renderWithProviders(<Harness onSubmit={onSubmit} />);

    expect(screen.getByRole("status")).toHaveTextContent("");
    expect(unloadIsBlocked()).toBe(false);

    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /Continue/ }));

    expect(await screen.findByText(/Creating your account/)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Please don't close or refresh this page.",
    );
    expect(unloadIsBlocked()).toBe(true);

    finish();

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(""));
    expect(unloadIsBlocked()).toBe(false);
  });
});
