import { database } from "../../di/index.js";

export async function afterUpdateToCategory(doc, next) {
  console.log("after update to category");
  console.log("doc", doc);
  try {
    const { _id, subCategories } = doc;
    const subCategoryRecords = await database.getRecordsByQuery(
      {
        parentId: _id,
      },
      "categories"
    );
    const subCategoriesId = subCategoryRecords.map((record) => record._id);
    console.log("subCategoriesId", subCategoriesId);

    for (const subCategoryId of subCategoriesId) {
      if (!subCategories.includes(subCategoryId)) {
        console.log("this id is not in sub categories", subCategoryId);
        await database.updateRecordById(
          subCategoryId.toString(),
          {
            parentId: null,
          },
          "categories"
        );
      }
    }
  } catch (error) {}
  next();
}
