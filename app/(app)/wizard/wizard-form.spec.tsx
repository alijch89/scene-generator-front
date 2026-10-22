import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ChildDto, ChildRelationDto } from "@/lib/types";
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

const savedRelation: ChildRelationDto = {
  id: "8a8b0c0f-1e2d-4c3b-9a8f-123456789abc",
  childId: child.id,
  name: "سارا",
  relation: "مادر",
  hasPhoto: true,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(1_000).toISOString(),
};

/** Walks the wizard from the hero step to the customise step. */
async function toCustomise(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "ادامه" }));
  await user.click(screen.getByRole("button", { name: "ادامه" }));
}

describe("WizardForm supporting characters", () => {
  it("shows the public topic images on the theme-selection step", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <WizardForm childProfiles={[child]} prices={prices} />,
    );

    await user.click(screen.getByRole("button", { name: "ادامه" }));

    const topicSources = Array.from(
      container.querySelectorAll<HTMLImageElement>('img[alt=""]'),
      (image) => decodeURIComponent(image.getAttribute("src") ?? ""),
    );

    expect(topicSources).toHaveLength(8);
    expect(topicSources).toEqual(
      expect.arrayContaining([
        expect.stringContaining("/topics/honesty-v2.png"),
        expect.stringContaining("/topics/kindness-v2.png"),
        expect.stringContaining("/topics/courage-v2.png"),
        expect.stringContaining("/topics/sharing-v2.png"),
        expect.stringContaining("/topics/teamwork-v2.png"),
        expect.stringContaining("/topics/responsibility-v2.png"),
        expect.stringContaining("/topics/perseverance-v2.png"),
        expect.stringContaining("/topics/respect-v2.png"),
      ]),
    );
  });

  it("uses the selected topic image in the final preview", async () => {
    const user = userEvent.setup();
    render(<WizardForm childProfiles={[child]} prices={prices} />);

    await user.click(screen.getByRole("button", { name: "ادامه" }));
    await user.click(screen.getByRole("button", { name: /^شجاعت/ }));
    await user.click(screen.getByRole("button", { name: "ادامه" }));
    await user.click(screen.getByRole("button", { name: "ادامه" }));

    const preview = screen.getByRole("img", {
      name: "تصویر پیش‌نمایش موضوع شجاعت",
    });
    expect(decodeURIComponent(preview.getAttribute("src") ?? "")).toContain(
      "/topics/courage-v2.png",
    );
  });

  it("updates the payable preview when the selected video length changes", async () => {
    const user = userEvent.setup();
    render(<WizardForm childProfiles={[child]} prices={prices} />);

    await user.click(screen.getByRole("button", { name: "ادامه" }));
    await user.click(screen.getByRole("button", { name: "ادامه" }));

    const shortButton = screen
      .getByText("کوتاه", { exact: true })
      .closest("button")!;
    const mediumButton = screen
      .getByText("متوسط", { exact: true })
      .closest("button")!;
    const longButton = screen
      .getByText("بلند", { exact: true })
      .closest("button")!;

    expect(shortButton).toHaveTextContent("۴۹۹٬۰۰۰ تومان");
    expect(mediumButton).toHaveTextContent("۶۹۹٬۰۰۰ تومان");
    expect(longButton).toHaveTextContent("۹۹۹٬۰۰۰ تومان");

    await user.click(longButton);
    await user.click(screen.getByRole("button", { name: "ادامه" }));

    expect(screen.getByText("۹۹۹٬۰۰۰ تومان")).toBeInTheDocument();
  });

  it("never lets a character be started inside the wizard", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <WizardForm childProfiles={[child]} prices={prices} />,
    );
    await toCustomise(user);

    // Characters are made whole on the profile; the wizard only picks them.
    expect(
      screen.queryByRole("button", { name: "+ افزودن شخصیت" }),
    ).not.toBeInTheDocument();
    expect(container.querySelector('input[type="file"]')).toBeNull();
    expect(
      screen.getByRole("link", { name: /افزودن یا ویرایش شخصیت‌ها/ }),
    ).toHaveAttribute("href", `/children/${child.id}?tab=characters`);
  });

  it("lets the parent pick a complete saved character and shows it whole", async () => {
    const user = userEvent.setup();
    render(
      <WizardForm
        childProfiles={[child]}
        relationsByChild={{ [child.id]: [savedRelation] }}
        prices={prices}
      />,
    );
    await toCustomise(user);
    await user.click(screen.getByRole("button", { name: /سارا · مادر/ }));

    expect(screen.getByText("سارا", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByAltText("عکس سارا")).toHaveAttribute(
      "src",
      expect.stringContaining(
        `/children/${child.id}/relations/${savedRelation.id}/photo?v=`,
      ),
    );
    expect(screen.getByRole("button", { name: /سارا · مادر/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: "ادامه" })).toBeEnabled();
  });

  it.each([
    ["a photo", { hasPhoto: false }, "عکس"],
    ["a relation", { relation: "" }, "نسبت"],
  ])(
    "will not pick a saved character that is missing %s",
    async (_label, gap, missing) => {
      const user = userEvent.setup();
      render(
        <WizardForm
          childProfiles={[child]}
          relationsByChild={{ [child.id]: [{ ...savedRelation, ...gap }] }}
          prices={prices}
        />,
      );
      await toCustomise(user);

      const pick = screen.getByRole("button", { name: /سارا/ });
      expect(pick).toBeDisabled();
      expect(pick).toHaveAttribute("title", expect.stringContaining(missing));
      expect(pick).toHaveTextContent("ناقص");
    },
  );

  it("stops a child without a photo at the first step and says why", async () => {
    const user = userEvent.setup();
    render(
      <WizardForm
        childProfiles={[{ ...child, hasPhoto: false, photoStatus: "NONE" }]}
        prices={prices}
      />,
    );

    expect(screen.getByRole("button", { name: "ادامه" })).toBeDisabled();
    expect(screen.getAllByText(/عکس «آیناز» لازم است/).length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getByRole("link", { name: /رفتن به پروفایل آیناز/ }),
    ).toHaveAttribute("href", `/children/${child.id}`);

    await user.click(screen.getByRole("button", { name: "ادامه" }));
    expect(screen.getByText("گام ۱ از ۴")).toBeInTheDocument();
  });
});
