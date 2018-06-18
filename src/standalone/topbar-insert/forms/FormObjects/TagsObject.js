import { OrderedMap, List } from "immutable"
import { TagObject, TagForm } from "./TagObject"

export const TagsForm = (updateForm, path) =>
  new OrderedMap({
    tags: new OrderedMap({
      value: new List([
        TagForm(updateForm, path.concat(["tags", "value", 0]))
      ]),
      isRequired: false,
      name: "Tags",
      description: "A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the Operation Object must be declared. The tags that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.",
      hasErrors: false,
      updateForm: newForm => updateForm(newForm, path.concat(["tags"])),
      defaultItem: i => TagForm(updateForm, path.concat(["tags", "value", i]))
    })
  })

export const TagsObject = (formData) => {
  const tags = formData.getIn(["tags", "value"])
  const tagsObject = []

  tags.forEach((tag) => {
    const newTag = TagObject(tag)
    tagsObject.push(newTag)
  })

  return tagsObject
}