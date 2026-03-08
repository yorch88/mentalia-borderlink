import { useEffect } from "react";
import { useNavigate } from "react-router";

import PageBreadcrumb from "@/components/PageBreadcrumb";
import PageMeta from "@/components/PageMeta";
import BranchListTable from "./components/BranchListTable";

const Index = () => {

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/basic-login");
    }

  }, [navigate]);

  return (

    <>

      <PageMeta title="Branches" />

      <main>

        <PageBreadcrumb
          subtitle="Branches"
          title="List view"
        />

        <BranchListTable />

      </main>

    </>

  );

};

export default Index;