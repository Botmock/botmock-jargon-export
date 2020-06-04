import { BaseExporter, Resources, DataTransformation, Botmock } from "@botmock/export";
import { v4 } from "uuid";
// import * as Jargon from "./types";

export class JargonExporter extends BaseExporter {
  /**
   * Organizes: locales -> messages under that locale.
   * @param blocks Array of Botmock blocks.
   */
  #collectResponsesByLocale = (blocks: Botmock.Message[]): Map<string, Botmock.Block[]> => {
    const collection = new Map();
    for (const block of blocks) {
      for (const [locale, responses] of Object.entries(block.payload)) {
        const existingResponsesForLocale = collection.get(locale) || [];
        collection.set(locale, [
          ...existingResponsesForLocale,
          Object.values(responses).flatMap(v => v.blocks),
        ]);
      }
    }
    return collection;
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
      ...Array.from(this.#collectResponsesByLocale(resources.board.board.messages)).map(entry => {
        const [locale, responses] = entry;
        return {
          filename: `${locale}.json`,
          data: {
            __jmd: {
              format: 1,
              locale,
            },
            responses: responses.reduce((mappedResponses, blocks) => {
              return {
                ...mappedResponses,
                [`${v4()} block`]: {
                  variants: (blocks as unknown as Botmock.Block[])
                    .reduce((contentBlocks: any[], block) => {
                      const content = block.alternate_replies || [];
                      if (block.text) {
                        content.unshift(block.text);
                      }
                      return [
                        ...contentBlocks,
                        ...content,
                      ];
                    }, [])
                    .reduce((variants, variant, i) => {
                      return {
                        ...variants,
                        [`variant ${i + 1}`]: {
                          speech: {
                            content: variant
                          }
                        }
                      };
                    }, {})
                }
              };
            }, {})
          },
        };
      })
    ];
  };
  /**
   *
   */
  dataTransformations = new Map([
    ["./output", this.#outputTransformation,]
  ]);
}
