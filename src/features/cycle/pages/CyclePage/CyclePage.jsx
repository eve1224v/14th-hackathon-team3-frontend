import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import MainLayout from "../../../../components/MainLayout/MainLayout";

import CycleDashboard from "../../components/CycleDashboard/CycleDashboard";

import {
  getCycles,
} from "../../../../api/cycleApi";


function CyclePage() {
  const {
    cycleId,
  } = useParams();

  const navigate =
    useNavigate();


  const [
    loading,
    setLoading,
  ] = useState(
    !cycleId
  );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  /* =========================
     cycleId가 없는 경우
     현재 프로젝트 첫 사이클로 이동
  ========================= */

  useEffect(() => {
    if (cycleId) {
      return;
    }


    const fetchFirstCycle =
      async () => {
        const projectId =
          localStorage.getItem(
            "projectId"
          );


        if (!projectId) {
          setErrorMessage(
            "선택된 프로젝트가 없습니다."
          );

          setLoading(false);

          return;
        }


        try {
          const response =
            await getCycles(
              projectId
            );


          console.log(
            "사이클 초기 조회 성공:",
            response
          );


          const cycles =
            Array.isArray(
              response?.data
            )
              ? response.data
              : [];


          if (
            cycles.length === 0
          ) {
            setErrorMessage(
              "등록된 사이클이 없습니다."
            );

            return;
          }


          const firstCycle =
            cycles[0];


          navigate(
            `/cycle/${firstCycle.cycleId}`,
            {
              replace: true,
            }
          );
        } catch (error) {
          console.error(
            "사이클 초기 조회 실패:",
            error
          );

          console.error(
            "서버 응답:",
            error.response?.data
          );


          const responseData =
            error.response?.data;


          if (
            responseData?.code ===
            "404PROJECT"
          ) {
            setErrorMessage(
              "존재하지 않는 프로젝트입니다."
            );
          } else if (
            responseData?.code ===
            "403PROJECT"
          ) {
            setErrorMessage(
              "프로젝트에 대한 접근 권한이 없습니다."
            );
          } else {
            setErrorMessage(
              responseData?.message ||
                "사이클을 불러오지 못했습니다."
            );
          }
        } finally {
          setLoading(false);
        }
      };


    fetchFirstCycle();
  }, [
    cycleId,
    navigate,
  ]);


  /* =========================
     실제 cycleId 찾는 중
  ========================= */

  if (!cycleId) {
    return (
      <MainLayout>
        <div
          style={{
            padding:
              "80px 57px",
            color:
              "#ffffff",
          }}
        >
          {loading
            ? "사이클을 불러오는 중입니다."
            : errorMessage}
        </div>
      </MainLayout>
    );
  }


  return (
    <MainLayout>
      <CycleDashboard
        cycleId={
          Number(
            cycleId
          )
        }
      />
    </MainLayout>
  );
}


export default CyclePage;