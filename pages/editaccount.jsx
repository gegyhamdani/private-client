import React from "react";
import EditUser from "../src/component/organism/User/EditUser";
import DashboardTemplate from "../src/component/templates/DashboardTemplate";

const EditAccount = () => {
  return (
    <>
      <h2>Edit Akun</h2>
      <EditUser />
    </>
  );
};

EditAccount.layout = DashboardTemplate;

export default EditAccount;
