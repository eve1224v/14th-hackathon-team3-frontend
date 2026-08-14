import MainLayout from "../../../../components/MainLayout/MainLayout";

import IssueForm from "../../components/IssueForm/IssueForm";

function EditIssuePage() {
  return (
    <MainLayout>
      <IssueForm mode="edit" />
    </MainLayout>
  );
}

export default EditIssuePage;