import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ChildDto } from "@/lib/types";
import { uploadChildPhoto } from "@/lib/upload";
import { AddChildButton, EditChildButton } from "./child-form";

const router = { refresh: jest.fn(), push: jest.fn(), replace: jest.fn() };

jest.mock("next/navigation", () => ({ useRouter: () => router }));

// Only the network upload is replaced; the validation rules stay real.
jest.mock("@/lib/upload", () => ({
  ...jest.requireActual("@/lib/upload"),
  uploadChildPhoto: jest.fn(),
}));

const child: ChildDto = {
  id: "2f47d639-5810-4cb7-b65f-7596f88478f4",
  firstName: "آیناز",
  age: 7,
  interests: [],
  hasPhoto: true,
  photoVersion: "a1b2c3.jpg",
  photoStatus: "READY",
  prefLength: "MEDIUM",
  prefVoice: "MARYAM",
  prefStyle: "WATERCOLOR",
  prefAvoidScary: true,
  storyCount: 0,
  createdAt: new Date(0).toISOString(),
};

const upload = uploadChildPhoto as jest.Mock;

/** `applyAccept: false` so the browser-side filter does not hide a refused file from the component. */
const setup = () => userEvent.setup({ applyAccept: false });

async function openEditor(user: ReturnType<typeof setup>, profile = child) {
  render(<EditChildButton child={profile} />);
  await user.click(screen.getByRole("button", { name: "ویرایش پرونده" }));
}

beforeAll(() => {
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute("open");
  };
  URL.createObjectURL = jest.fn(() => "blob:preview");
  URL.revokeObjectURL = jest.fn();
});

beforeEach(() => {
  router.refresh.mockReset();
  upload.mockReset().mockResolvedValue(undefined);
  (global.fetch as jest.Mock).mockReset();
  (global.fetch as jest.Mock).mockResolvedValue(
    new Response(JSON.stringify(child), { status: 200 }),
  );
});

describe("EditChildButton photo", () => {
  it("shows the photo that is already stored, not an empty avatar", async () => {
    await openEditor(setup());

    const photo = document.querySelector<HTMLImageElement>(
      'dialog img[src*="/photo"]',
    );
    expect(photo).not.toBeNull();
    expect(photo?.getAttribute("src")).toContain(
      `/children/${child.id}/photo?v=a1b2c3.jpg`,
    );
    expect(screen.getByRole("button", { name: "تغییر عکس" })).toBeInTheDocument();
  });

  it("names the chosen file and says that saving uploads it", async () => {
    const user = setup();
    await openEditor(user);

    await user.upload(
      screen.getByLabelText("عکس کودک"),
      new File(["x".repeat(2048)], "ainaz.jpg", { type: "image/jpeg" }),
    );

    expect(screen.getByRole("status")).toHaveTextContent("ainaz.jpg");
    expect(screen.getByRole("status")).toHaveTextContent("بارگذاری می‌شود");
  });

  it("uploads the chosen photo right after the profile is saved", async () => {
    const user = setup();
    await openEditor(user);
    const file = new File(["x"], "ainaz.png", { type: "image/png" });

    await user.upload(screen.getByLabelText("عکس کودک"), file);
    await user.click(screen.getByRole("button", { name: "ذخیرهٔ پرونده" }));

    await waitFor(() => expect(upload).toHaveBeenCalledTimes(1));
    expect(upload).toHaveBeenCalledWith(child.id, file, expect.any(Function));
    // The profile was saved first, then the photo went up.
    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(init.method).toBe("PATCH");
    await waitFor(() => expect(router.refresh).toHaveBeenCalled());
  });

  it.each([
    [
      "an iPhone HEIC photo",
      new File(["x"], "IMG_1.HEIC", { type: "image/heic" }),
      "HEIC",
    ],
    [
      "an unsupported type",
      new File(["x"], "photo.gif", { type: "image/gif" }),
      "image/gif",
    ],
  ])("says why %s was refused, and keeps saying it", async (_label, file, reason) => {
    const user = setup();
    await openEditor(user);

    await user.upload(screen.getByLabelText("عکس کودک"), file);
    expect(screen.getByRole("alert")).toHaveTextContent(reason);

    // Saving the rest of the profile must not wipe the explanation, and must
    // not pretend a photo was sent.
    await user.click(screen.getByRole("button", { name: "ذخیرهٔ پرونده" }));
    await waitFor(() => expect(router.refresh).toHaveBeenCalled());
    expect(upload).not.toHaveBeenCalled();
  });

  it("refuses a photo over 10 MB and states its size", async () => {
    const user = setup();
    await openEditor(user);
    const big = new File(["x"], "big.jpg", { type: "image/jpeg" });
    Object.defineProperty(big, "size", { value: 12 * 1024 * 1024 });

    await user.upload(screen.getByLabelText("عکس کودک"), big);

    expect(screen.getByRole("alert")).toHaveTextContent("۱۲٫۰ مگابایت");
    expect(screen.getByRole("alert")).toHaveTextContent("۱۰ مگابایت");
  });

  it("accepts a .jpg the browser left untyped and sends it as image/jpeg", async () => {
    const user = setup();
    await openEditor(user);

    await user.upload(
      screen.getByLabelText("عکس کودک"),
      new File(["x"], "holiday.jpg", { type: "" }),
    );
    await user.click(screen.getByRole("button", { name: "ذخیرهٔ پرونده" }));

    await waitFor(() => expect(upload).toHaveBeenCalled());
    expect((upload.mock.calls[0][1] as File).type).toBe("image/jpeg");
  });

  it("keeps the form open and explains a failed upload", async () => {
    const user = setup();
    upload.mockRejectedValue(new Error("اتصال قطع شد. دوباره تلاش کنید."));
    await openEditor(user);

    await user.upload(
      screen.getByLabelText("عکس کودک"),
      new File(["x"], "ainaz.png", { type: "image/png" }),
    );
    await user.click(screen.getByRole("button", { name: "ذخیرهٔ پرونده" }));

    expect(await screen.findAllByText("اتصال قطع شد. دوباره تلاش کنید.")).not.toHaveLength(0);
    expect(router.refresh).not.toHaveBeenCalled();
  });

  it("will not create a new profile without a photo, and says how to fix it", async () => {
    const user = setup();
    render(<AddChildButton>افزودن کودک</AddChildButton>);
    await user.click(screen.getByRole("button", { name: "افزودن کودک" }));

    await user.type(screen.getByPlaceholderText("آوا"), "نیلا");
    await user.click(screen.getByRole("button", { name: "ذخیرهٔ پرونده" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "عکس کودک را انتخاب کنید",
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(upload).not.toHaveBeenCalled();
  });

  it("creates the profile and uploads its photo when one is chosen", async () => {
    const user = setup();
    render(<AddChildButton>افزودن کودک</AddChildButton>);
    await user.click(screen.getByRole("button", { name: "افزودن کودک" }));
    const file = new File(["x"], "nila.png", { type: "image/png" });

    await user.type(screen.getByPlaceholderText("آوا"), "نیلا");
    await user.upload(screen.getByLabelText("عکس کودک"), file);
    await user.click(screen.getByRole("button", { name: "ذخیرهٔ پرونده" }));

    await waitFor(() => expect(upload).toHaveBeenCalledTimes(1));
    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(init.method).toBe("POST");
    expect(upload).toHaveBeenCalledWith(child.id, file, expect.any(Function));
  });

  it("flags an older profile that has no photo, but still lets its name be fixed", async () => {
    const user = setup();
    await openEditor(user, { ...child, hasPhoto: false, photoVersion: null });

    expect(screen.getByText("(برای ساخت ویدیو لازم است)")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "ذخیرهٔ پرونده" }));

    await waitFor(() => expect(router.refresh).toHaveBeenCalled());
    expect(upload).not.toHaveBeenCalled();
  });
});
