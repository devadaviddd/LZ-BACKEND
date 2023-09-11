import { database } from "../../di/index.js";

export async function afterUpdateToCategory(doc, next) {
  try {
    const { _id, subCategories } = doc;
    const subCategoryRecords = await database.getRecordsByQuery(
      {
        parentId: _id,
      },
      "categories"
    );
    const subCategoriesId = subCategoryRecords.map((record) => record._id);

    for (const subCategoryId of subCategoriesId) {
      if (!subCategories.includes(subCategoryId)) {
        await database.updateRecordById(
          subCategoryId.toString(),
          {
            parentId: null,
          },
          "categories"
        );
      }
    }
  } catch (error) {
    next(error);
  }
  next();
}
