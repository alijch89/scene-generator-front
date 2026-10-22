import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ChildDto, ChildRelationDto } from "@/lib/types";
import { MAX_RELATIONS_PER_CHILD } from "@/lib/relations";
import { ChildCharacters } from "./child-characters";

const router = { refresh: jest.fn(), push: jest.fn(), replace: jest.fn() };

jest.mock("next/navigation", () => ({ useRouter: () => router }));

const child: ChildDto = {
  id: "2f47d639-5810-4cb7-b65f-7596f88478f4",
  firstName: "آیناز",
  age: 7,
  interests: [],
  hasPhoto: true,
  photoStatus: "READY",
  prefLength: "MEDIUM",
  prefVoice: "MARYAM",
  prefStyle: "WATERCOLOR",
  prefAvoidScary: true,
  storyCount: 0,
  createdAt: new Date(0).toISOString(),
};

const complete: ChildRelationDto = {
  id: "8a8b0c0f-1e2d-4c3b-9a8f-123456789abc",
  childId: child.id,
  name: "سارا",
  relation: "مادر",
  hasPhoto: true,
  createdAt: new Date(0).toISOString(),
  updatedAt: "2026-10-22T10:00:00.000Z",
};

const withoutPhoto: ChildRelationDto = {
  ...complete,
  id: "11111111-1e2d-4c3b-9a8f-123456789abc",
  name: "علی",
  relation: "پدر",
  hasPhoto: false,
};

const png = () => new File(["x"], "sara.png", { type: "image/png" });

/** The one request the component made, with its decoded multipart body. */
function lastRequest() {
  const [url, init] = (global.fetch as jest.Mock).mock.calls.at(-1) ?? [];
  return { url: String(url), init: init as RequestInit };
}

beforeAll(() => {
  // jsdom ships <dialog> without showModal/close, and no object URLs.
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
  (global.fetch as jest.Mock).mockReset();
  (global.fetch as jest.Mock).mockResolvedValue(
    new Response(JSON.stringify({}), { status: 200 }),
  );
});

describe("ChildCharacters", () => {
  it("shows each character with its photo and whether it is complete", () => {
    render(
      <ChildCharacters child={child} relations={[complete, withoutPhoto]} />,
    );

    expect(screen.getByAltText("عکس سارا")).toHaveAttribute(
      "src",
      expect.stringContaining(
        `/children/${child.id}/relations/${complete.id}/photo?v=`,
      ),
    );
    expect(screen.getByText("کامل")).toBeInTheDocument();
    expect(screen.getByText("ناقص: عکس")).toBeInTheDocument();
  });

  it("will not send a character that is missing its photo", async () => {
    const user = userEvent.setup();
    render(<ChildCharacters child={child} relations={[]} />);

    await user.click(screen.getByRole("button", { name: "+ افزودن شخصیت" }));
    await user.type(screen.getByPlaceholderText("سارا"), "سارا");
    await user.type(screen.getByPlaceholderText("مادر"), "مادر");
    await user.click(screen.getByRole("button", { name: "ذخیرهٔ شخصیت" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "شخصیت باید کامل باشد؛ عکس را وارد کنید",
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("saves name, relation and photo together in one request", async () => {
    const user = userEvent.setup();
    render(<ChildCharacters child={child} relations={[]} />);

    await user.click(screen.getByRole("button", { name: "+ افزودن شخصیت" }));
    await user.upload(screen.getByLabelText("عکس شخصیت"), png());
    await user.type(screen.getByPlaceholderText("سارا"), "  سارا ");
    await user.click(screen.getByRole("button", { name: "مادر" }));
    await user.click(screen.getByRole("button", { name: "ذخیرهٔ شخصیت" }));

    await waitFor(() => expect(router.refresh).toHaveBeenCalled());
    const { url, init } = lastRequest();
    expect(url).toContain(`/children/${child.id}/relations`);
    expect(init.method).toBe("POST");
    const form = init.body as FormData;
    expect(form.get("name")).toBe("سارا");
    expect(form.get("relation")).toBe("مادر");
    expect(form.get("photo")).toBeInstanceOf(File);
  });

  it("edits the details of a character without asking for the photo again", async () => {
    const user = userEvent.setup();
    render(<ChildCharacters child={child} relations={[complete]} />);

    await user.click(screen.getByRole("button", { name: "ویرایش" }));
    const name = screen.getByDisplayValue("سارا");
    await user.clear(name);
    await user.type(name, "سارا خانم");
    await user.click(screen.getByRole("button", { name: "ذخیرهٔ شخصیت" }));

    await waitFor(() => expect(router.refresh).toHaveBeenCalled());
    const { url, init } = lastRequest();
    expect(url).toContain(
      `/children/${child.id}/relations/${complete.id}`,
    );
    expect(init.method).toBe("PATCH");
    const form = init.body as FormData;
    expect(form.get("name")).toBe("سارا خانم");
    expect(form.get("relation")).toBe("مادر");
    expect(form.has("photo")).toBe(false);
  });

  it("requires a photo to finish editing a character that has none", async () => {
    const user = userEvent.setup();
    render(<ChildCharacters child={child} relations={[withoutPhoto]} />);

    await user.click(screen.getByRole("button", { name: "ویرایش" }));
    await user.click(screen.getByRole("button", { name: "ذخیرهٔ شخصیت" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("عکس");
    expect(global.fetch).not.toHaveBeenCalled();

    await user.upload(screen.getByLabelText("عکس شخصیت"), png());
    await user.click(screen.getByRole("button", { name: "ذخیرهٔ شخصیت" }));

    await waitFor(() => expect(router.refresh).toHaveBeenCalled());
    expect((lastRequest().init.body as FormData).get("photo")).toBeInstanceOf(
      File,
    );
  });

  it("asks before deleting, then deletes the character", async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(null, { status: 204 }),
    );
    render(<ChildCharacters child={child} relations={[complete]} />);

    const card = screen.getByRole("heading", { name: "سارا" }).closest("article")!;
    await user.click(within(card).getByRole("button", { name: "حذف" }));
    expect(global.fetch).not.toHaveBeenCalled();

    await user.click(within(card).getByRole("button", { name: "بله، حذف کن" }));

    await waitFor(() => expect(router.refresh).toHaveBeenCalled());
    const { url, init } = lastRequest();
    expect(url).toContain(`/children/${child.id}/relations/${complete.id}`);
    expect(init.method).toBe("DELETE");
  });

  it("shows the API's reason when saving fails", async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(
        JSON.stringify({ message: "این شخصیت با همین نام و نسبت از قبل ذخیره شده است" }),
        { status: 409, statusText: "Conflict" },
      ),
    );
    render(<ChildCharacters child={child} relations={[]} />);

    await user.click(screen.getByRole("button", { name: "+ افزودن شخصیت" }));
    await user.upload(screen.getByLabelText("عکس شخصیت"), png());
    await user.type(screen.getByPlaceholderText("سارا"), "سارا");
    await user.click(screen.getByRole("button", { name: "مادر" }));
    await user.click(screen.getByRole("button", { name: "ذخیرهٔ شخصیت" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("از قبل ذخیره شده");
    expect(router.refresh).not.toHaveBeenCalled();
  });

  it("stops offering new characters at the per-child limit", () => {
    const many = Array.from({ length: MAX_RELATIONS_PER_CHILD }, (_, i) => ({
      ...complete,
      id: `0000000${i}-1e2d-4c3b-9a8f-123456789abc`,
      name: `شخصیت ${i}`,
    }));
    render(<ChildCharacters child={child} relations={many} />);

    expect(screen.getByRole("button", { name: "+ افزودن شخصیت" })).toBeDisabled();
    expect(screen.getByText(/حداکثر/)).toBeInTheDocument();
  });
});
