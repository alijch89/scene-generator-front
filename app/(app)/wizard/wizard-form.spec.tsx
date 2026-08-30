import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ChildDto } from "@/lib/types";
import { WizardForm } from "./wizard-form";

const prices = {
  SHORT: 4_990_000,
  MEDIUM: 6_990_000,
  LONG: 9_990_000,
} as const;

const child: ChildDto = {
  id: "2f47d639-5810-4cb7-b65f-7596f88478f4",
  firstName: "آیناز",
  age: 7,
  interests: ["حیوانات"],
  hasPhoto: true,
  photoStatus: "READY",
  prefLength: "MEDIUM",
  prefVoice: "MARYAM",
  prefStyle: "WATERCOLOR",
  prefAvoidScary: true,
  storyCount: 0,
  createdAt: new Date(0).toISOString(),
};

describe("WizardForm supporting characters", () => {
  it("shows the character editor after age settings and supports relation choices, custom text, and photo preview", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <WizardForm childProfiles={[child]} prices={prices} />,
    );

    await user.click(screen.getByRole("button", { name: "ادامه" }));
    await user.click(screen.getByRole("button", { name: "ادامه" }));

    const ageSettings = screen.getByRole("group", {
      name: "بازهٔ سنی و نوع خروجی",
    });
    const characterSettings = screen.getByRole("group", {
      name: "شخصیت‌های جانبی و نزدیکان (اختیاری)",
    });
    expect(
      ageSettings.compareDocumentPosition(characterSettings) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "+ افزودن شخصیت" }));
    await user.selectOptions(
      screen.getByLabelText("نسبت پیشنهادی شخصیت 1"),
      "دایی",
    );
    expect(screen.getByLabelText("نسبت دلخواه شخصیت 1")).toHaveValue("دایی");

    await user.clear(screen.getByLabelText("نسبت دلخواه شخصیت 1"));
    await user.type(screen.getByLabelText("نسبت دلخواه شخصیت 1"), "مربی نقاشی");
    expect(screen.getByLabelText("نسبت دلخواه شخصیت 1")).toHaveValue(
      "مربی نقاشی",
    );

    const fileInput =
      container.querySelector<HTMLInputElement>('input[type="file"]');
    expect(fileInput).not.toBeNull();
    await user.upload(
      fileInput!,
      new File(["photo"], "relative.jpg", { type: "image/jpeg" }),
    );

    const preview = await screen.findByRole("img", {
      name: "پیش‌نمایش عکس شخصیت",
    });
    expect(preview).toBeInTheDocument();
    expect(preview.getAttribute("style")).toContain("data:image/jpeg;base64");
  });

  it("updates the payable preview when the selected video length changes", async () => {
    const user = userEvent.setup();
    render(<WizardForm childProfiles={[child]} prices={prices} />);

    await user.click(screen.getByRole("button", { name: "ادامه" }));
    await user.click(screen.getByRole("button", { name: "ادامه" }));

    const shortButton = screen.getByText("کوتاه", { exact: true }).closest("button")!;
    const mediumButton = screen
      .getByText("متوسط", { exact: true })
      .closest("button")!;
    const longButton = screen.getByText("بلند", { exact: true }).closest("button")!;

    expect(shortButton).toHaveTextContent("۴۹۹٬۰۰۰ تومان");
    expect(mediumButton).toHaveTextContent("۶۹۹٬۰۰۰ تومان");
    expect(longButton).toHaveTextContent("۹۹۹٬۰۰۰ تومان");

    await user.click(longButton);
    await user.click(screen.getByRole("button", { name: "ادامه" }));

    expect(screen.getByText("۹۹۹٬۰۰۰ تومان")).toBeInTheDocument();
  });
});
