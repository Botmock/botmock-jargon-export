import { BaseExporter, Resources, DataTransformation, Botmock } from "@botmock/export";
// import * as Jargon from "./types";

export class JargonExporter extends BaseExporter {
  /**
   * Organizes: locales -> messages under that locale.
   * @param blocks Array of Botmock blocks.
   */
  #collectResponsesByLocale = (blocks: Botmock.Message[]): Map<string, Botmock.Message[]> => {
    return new Map();
  };
  #outputTransformation = (resources: Resources): DataTransformation => {
    return [
      {
        filename: "manifest.json",
        data: {
          manifestFormat: 1,
          packageFormat: 1,
          locales: resources.project.locales,
        }
      },
    ];
  };
  dataTransformations = new Map([
    ["./output", this.#outputTransformation,]
  ]);
}
