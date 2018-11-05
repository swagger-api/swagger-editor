import { fromJS } from "immutable"
import { tagObject, tagForm } from "./tag-object"

export const tagsForm = (updateForm, path) =>
  fromJS({
    tags: {
      value: [tagForm(updateForm, path.concat(["tags", "value", 0]))],
      name: "Tag Declarations",
      description: "A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the Operation Object must be declared. The tags that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.",
      updateForm: newForm => updateForm(newForm, path.concat(["tags"])),
      defaultItem: i => tagForm(updateForm, path.concat(["tags", "value", i]))
    }
  })

export const tagsObject = (formData) => {
  const tags = formData.getIn(["tags", "value"])
  const tagsObject = []

  tags.forEach((tag) => {
    const newTag = tagObject(tag)
    tagsObject.push(newTag)
  })

  return tagsObject
}