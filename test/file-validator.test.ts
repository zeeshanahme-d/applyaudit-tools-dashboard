import test from "node:test";
import assert from "node:assert/strict";
import { resumeFormData, validateResumeFile } from "../src/lib/validate-resume-file";
import { UPLOAD_LIMITS, positiveIntOr } from "../src/config/upload-limits";

test("File Validator: accepts valid PDF file", () => {
  const file = new File(["dummy content"], "resume.pdf", { type: "application/pdf" });
  // Override size for testing (File constructor sets size automatically)
  const result = validateResumeFile(file);
  assert.equal(result.valid, true);
});

test("File Validator: accepts valid DOCX file", () => {
  const file = new File(["dummy"], "resume.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const result = validateResumeFile(file);
  assert.equal(result.valid, true);
});

test("File Validator: accepts valid TXT file", () => {
  const file = new File(["dummy"], "resume.txt", { type: "text/plain" });
  const result = validateResumeFile(file);
  assert.equal(result.valid, true);
});

test("File Validator: rejects PNG file", () => {
  const file = new File(["dummy"], "photo.png", { type: "image/png" });
  const result = validateResumeFile(file);
  assert.equal(result.valid, false);
  assert.ok(result.error?.includes(".png"), "Error should mention the extension");
});

test("File Validator: rejects JPG file", () => {
  const file = new File(["dummy"], "screenshot.jpg", { type: "image/jpeg" });
  const result = validateResumeFile(file);
  assert.equal(result.valid, false);
  assert.ok(result.error?.includes(".jpg"));
});

test("File Validator: rejects EXE file", () => {
  const file = new File(["dummy"], "malware.exe", { type: "application/octet-stream" });
  const result = validateResumeFile(file);
  assert.equal(result.valid, false);
  assert.ok(result.error?.includes(".exe"));
});

test("File Validator: rejects null/undefined file", () => {
  assert.equal(validateResumeFile(null).valid, false);
  assert.equal(validateResumeFile(undefined).valid, false);
});

test("File Validator: rejects empty file (0 bytes)", () => {
  const file = new File([], "empty.pdf", { type: "application/pdf" });
  const result = validateResumeFile(file);
  assert.equal(result.valid, false);
  assert.ok(result.error?.includes("empty"));
});

test("File Validator: rejects oversized file (>2 MB)", () => {
  const largeContent = new Uint8Array(2 * 1024 * 1024 + 1);
  const file = new File([largeContent], "huge.pdf", { type: "application/pdf" });
  const result = validateResumeFile(file);
  assert.equal(result.valid, false);
  assert.match(result.error ?? "", /exceeds the 2 MB limit/);
});

// "Analyze Resume" with no file once sent the sample resume instead.
test("Request: no file and no sample asked for is an error, never the sample", () => {
  assert.throws(() => resumeFormData(null, false), /No file selected/);
  assert.throws(() => resumeFormData(undefined, false), /No file selected/);
  const png = new File(["x"], "photo.png", { type: "image/png" });
  assert.throws(() => resumeFormData(png, false), /Unsupported file type/);
});

test("Request: the sample is sent only when asked for; a chosen file is sent as the resume", () => {
  const sample = resumeFormData(null, true);
  assert.equal(sample.get("useSample"), "true");
  assert.equal(sample.get("resume"), null);

  const file = new File(["%PDF-1.4"], "resume.pdf", { type: "application/pdf" });
  const upload = resumeFormData(file, false);
  assert.equal(upload.get("useSample"), null);
  assert.ok(upload.get("resume") instanceof File);
});

// Outside Vite there is no .env, so these are the fallbacks: the API's own defaults
// (marketing/src/config/upload-limits.ts, which marketing's tests pin to the server).
test("Limits: without .env, the API's defaults (2 MB, 3 pages)", () => {
  assert.deepEqual(UPLOAD_LIMITS, { maxFileMb: 2, maxPages: 3 });
});

test("Limits: a .env value counts only as a whole number above zero, like the API's", () => {
  assert.equal(positiveIntOr("3", 2), 3);
  assert.equal(positiveIntOr(" 4 ", 2), 4);
  assert.equal(positiveIntOr("1_0", 2), 10);
  for (const bad of [undefined, "", "0", "-1", "2.5", "3mb", "abc"]) {
    assert.equal(positiveIntOr(bad, 2), 2, `"${bad}" falls back`);
  }
});
