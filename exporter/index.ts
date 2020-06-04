import { BaseExporter, Resources, DataTransformation, Botmock } from "@botmock/export";
// import * as Jargon from "./types";

export class JargonExporter extends BaseExporter {
  #collectResponsesByLocale = (blocks: Botmock.Message[]) => { };
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
