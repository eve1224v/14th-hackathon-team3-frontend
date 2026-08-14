import MainLayout from "../../../../components/MainLayout/MainLayout";

import IssueForm from "../../components/IssueForm/IssueForm";

function CreateIssuePage() {
  return (
    <MainLayout>
      <IssueForm mode="create" />
    </MainLayout>
  );
}

export default CreateIssuePage;