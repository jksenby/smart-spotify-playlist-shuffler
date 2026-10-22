# Assignment 5 reports

The DOCX reports use Times New Roman, 12 pt, 1.5 line spacing, A4 paper.
Theoretical report: four planned pages. Practical report: two planned pages.
Markdown copies provide editable source text; the generator contains the page layout.

Before submission:

- Add your name and group if required by the instructor.
- Replace both orange screenshot placeholders in the practical DOCX with actual
  Jenkins screenshots. Adjust their size and verify the final page count in Word.
- Download and keep build #3's unit-tests.log and capture its Console Output.
- Commit and push the Buildx fix in infra/jenkins/Dockerfile after reviewing it.
- Observe a build triggered by that push and capture the build cause and revision.
  Update the practical report's automation paragraph to describe the actual result.
- Export the completed practical DOCX to PDF if desired. Its current text accurately
  states that the demonstrated build was manual; do not remove that distinction
  until automatic triggering has been verified.

The screenshot supplied in chat confirms successful build #3, 9.5 seconds,
revision 692b59a82ac2ed3da77fddd0217b02adb7b185b6, and the test-log artifact.
Screenshots have not been embedded because the chat image was not available as a
local attachment. Neither report claims Docker Hub publication, Kubernetes
deployment, statistical validation of randomness, or full application testing.
