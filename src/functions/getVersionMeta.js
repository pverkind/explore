import { getVersionMetadataById } from "../services/CorpusMetaData";

/* get version metadata from the API for books for which you have version URI/ID:
 * Args:
 *     release_code (str): OpenITI release code (e.g., "2022.2.7")
 *     versionIds (array): an array of version URIs or version IDs
 */
export const getVersionMeta = async (release_code, versionIds) => {
//export const getBooks = async (release_code, versionIds) => {
  try {
    let meta = {};
    for (let i=0; i < versionIds.length; i++) {
      let versionId = versionIds[i];
      if (versionId !== "all") {
        if (versionId.includes("-")) {
          versionId = versionId.match(/(\w+)-[a-z]{3}\d/)[1];
        }
        const versionMeta = await getVersionMetadataById(release_code, versionId);
        meta[`book${i+1}`] = versionMeta;
      }
    }
    return meta;
  } catch (error) {
    return error;
  }
};
