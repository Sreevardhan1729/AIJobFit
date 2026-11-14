export async function loadSampleResumeFile(): Promise<File> {
  const response = await fetch(`${process.env.PUBLIC_URL}/sample/sample-resume.pdf`);
  if (!response.ok) {
    throw new Error(`Could not load the sample resume (${response.status})`);
  }
  const blob = await response.blob();
  return new File([blob], "sample-resume.pdf", { type: "application/pdf" });
}
