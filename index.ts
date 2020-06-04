import "dotenv/config";
import { ProjectReference, FileWriter, Kind } from "@botmock/export";
import { JargonExporter } from "./exporter";

const projectReference: ProjectReference = {
  teamId: process.env.TEAM_ID as string,
  projectId: process.env.PROJECT_ID as string,
  boardId: process.env.BOARD_ID,
};

/**
 * Runs extended exporter on reference to Botmock project,
 * before writing exported data to "./output".
 * @example
 * ```
 * npm run start
 * ```
 */
async function main(args: string[]): Promise<void> {
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

main(process.argv.slice(2)).catch((err: Error) => {
  console.error(err);
});