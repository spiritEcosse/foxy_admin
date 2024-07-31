import * as React from "react";
import {
  Create,
  DeleteButton,
  SaveButton,
  TabbedForm,
  Toolbar,
  useDataProvider,
  useNotify,
  useRecordContext,
  useUpdate,
  useRedirect,
} from "react-admin";
import { ItemEditDetails } from "./ItemEditDetails";
import ItemMediaList from "./ItemMediaList";
const RichTextInput = React.lazy(() =>
  import("ra-input-rich-text").then((module) => ({
    default: module.RichTextInput,
  })),
);
import { useState } from "react";
import { ItemType, MediaType } from "../types";
import { HandleSubmit } from "./HandleSubmit";

const CustomToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton alwaysEnable />
    <DeleteButton />
  </Toolbar>
);

const ItemCreate = () => {
  const initialRecord = useRecordContext<ItemType>();
  const [record, setRecord] = useState<ItemType>(initialRecord);
  const [recordsToDelete, setRecordsToDelete] = useState<MediaType[]>([]);
  const [updateItem] = useUpdate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const redirect = useRedirect();

  const onSubmit = async (data: any) => {
    await HandleSubmit(
      data,
      record,
      setRecord,
      recordsToDelete,
      setRecordsToDelete,
      updateItem,
      notify,
      dataProvider,
      redirect,
    );
  };

  return (
    <Create>
      <TabbedForm onSubmit={onSubmit} toolbar={<CustomToolbar />}>
        <TabbedForm.Tab label="image" sx={{ maxWidth: "40em" }}>
          <ItemMediaList
            setRecord={setRecord}
            setRecordsToDelete={setRecordsToDelete}
          />
        </TabbedForm.Tab>
        <TabbedForm.Tab
          label="details"
          path="details"
          sx={{ maxWidth: "40em" }}
        >
          <ItemEditDetails />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="description" path="description">
          <RichTextInput source="description" label="" />
        </TabbedForm.Tab>
      </TabbedForm>
    </Create>
  );
};

export default ItemCreate;
