import "dotenv/config";
import { ProjectReference, FileWriter, Kind } from "@botmock/export";
import { JargonExporter } from "./exporter";

const projectReference: ProjectReference = {
  teamId: process.env.TEAM_ID as string,
  projectId: process.env.PROJECT_ID as string,
  boardId: process.env.BOARD_ID,
};

/**
 * Exports data from project in `projectReference` to Jargon manifest, and response files.
 * @example
 * ```
 * npm run start
 * ```
 */
async function main(): Promise<void> {
  const exporter = new JargonExporter({ token: process.env.TOKEN as string });
  const { data } = await exporter.exportProjectUnderDataTransformations({ projectReference });

  const writer = new FileWriter();
  const writeResult = await writer.writeAllResourcesToFiles({ data });

  if (writeResult.kind === Kind.OK) {
    console.log("done.");
  } else {
    throw writeResult.value.message;
  }
}

process.on("unhandledRejection", () => { });
process.on("uncaughtException", () => { });

main().catch((err: Error) => {
  console.error(err);
});
