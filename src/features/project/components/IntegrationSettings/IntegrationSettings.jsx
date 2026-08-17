import { useEffect, useState } from "react";

import styles from "./IntegrationSettings.module.css";

import slackIcon from "../../../../assets/icons/slackIcon.svg";
import microsoftIcon from "../../../../assets/icons/microsoftIcon.svg";
import googleDriveIcon from "../../../../assets/icons/googledriveIcon.svg";
import notionIcon from "../../../../assets/icons/notionIcon.svg";
import figmaIcon from "../../../../assets/icons/figmaIcon.svg";

import {
  getProjectDetail,
  manageProjectIntegrations,
} from "../../../../api/projectApi";

function IntegrationSettings() {
  /* =========================
     State
  ========================= */

  const [integrations, setIntegrations] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [processingId, setProcessingId] = useState(null);

  /* =========================
     지원 서비스
  ========================= */

  const serviceInfo = {
    SLACK: {
      name: "Slack",
      icon: slackIcon,
    },

    TEAMS: {
      name: "Microsoft Teams",
      icon: microsoftIcon,
    },

    GOOGLE_DRIVE: {
      name: "Google Drive",
      icon: googleDriveIcon,
    },

    NOTION: {
      name: "Notion",
      icon: notionIcon,
    },

    FIGMA: {
      name: "Figma",
      icon: figmaIcon,
    },
  };

  /* =========================
     프로젝트 연동 정보 조회
  ========================= */

  useEffect(() => {
    let isCancelled = false;

    const fetchIntegrations = async () => {
      const projectId = localStorage.getItem("projectId");

      if (!projectId) {
        if (!isCancelled) {
          setErrorMessage("프로젝트 정보가 없습니다.");

          setIsLoading(false);
        }

        return;
      }

      try {
        const result = await getProjectDetail(projectId);

        if (isCancelled) {
          return;
        }

        console.log("외부 연동 조회 성공:", result);

        setIntegrations(
          Array.isArray(result?.data?.integrations)
            ? result.data.integrations
            : [],
        );

        setErrorMessage("");
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("외부 연동 조회 실패:", error);

        if (error.code === "403PROJECT_ACCESS_DENIED") {
          setErrorMessage("프로젝트 접근 권한이 없습니다.");
        } else if (error.code === "404PROJECT_NOT_FOUND") {
          setErrorMessage("프로젝트를 찾을 수 없습니다.");
        } else {
          setErrorMessage(
            error.message || "외부 연동 정보를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchIntegrations();

    return () => {
      isCancelled = true;
    };
  }, []);

  /* =========================
     마지막 동기화 표시
  ========================= */

  const formatSyncedAt = (value) => {
    if (!value) {
      return "동기화 기록 없음";
    }

    const syncedAt = new Date(value);

    const now = new Date();

    const difference = now.getTime() - syncedAt.getTime();

    const minutes = Math.floor(difference / 1000 / 60);

    if (minutes < 1) {
      return "방금 전";
    }

    if (minutes < 60) {
      return `${minutes}분 전`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}시간 전`;
    }

    const days = Math.floor(hours / 24);

    return `${days}일 전`;
  };

  /* =========================
     상태 표시
  ========================= */

  const getStatusText = (status) => {
    switch (status) {
      case "CONNECTED":
        return "연결됨";

      case "ERROR":
        return "오류";

      case "DISCONNECTED":
        return "연결 해제";

      default:
        return status || "-";
    }
  };

  /* =========================
     API 에러
  ========================= */

  const handleApiError = (error) => {
    switch (error.code) {
      case "400INVALID_INTEGRATION_ACTION":
        alert("외부 연동 작업 정보가 올바르지 않습니다.");

        break;

      case "403PROJECT_ADMIN_REQUIRED":
        alert("프로젝트 관리 권한이 없습니다.");

        break;

      case "404INTEGRATION_NOT_FOUND":
        alert("외부 연동을 찾을 수 없습니다.");

        break;

      case "422OAUTH_SCOPE_INSUFFICIENT":
        alert("외부 서비스 접근 권한이 부족합니다. 다시 인증해주세요.");

        break;

      default:
        alert(error.message || "외부 서비스 작업에 실패했습니다.");
    }
  };

  /* =========================
     수동 동기화
  ========================= */

  const handleSync = async (integration) => {
    const projectId = localStorage.getItem("projectId");

    if (!projectId) {
      return;
    }

    try {
      setProcessingId(integration.integrationId);

      const result = await manageProjectIntegrations(projectId, [
        {
          type: "SYNC",

          integrationId: integration.integrationId,
        },
      ]);

      console.log("외부 서비스 동기화 성공:", result);

      /*
          성공 시 현재 시간을
          화면에 바로 반영
        */

      setIntegrations((prev) =>
        prev.map((item) =>
          item.integrationId === integration.integrationId
            ? {
                ...item,

                lastSyncedAt: new Date().toISOString(),
              }
            : item,
        ),
      );

      alert("동기화를 요청했습니다.");
    } catch (error) {
      console.error("동기화 실패:", error);

      handleApiError(error);
    } finally {
      setProcessingId(null);
    }
  };

  /* =========================
     연결 해제
  ========================= */

  const handleDisconnect = async (integration) => {
    const projectId = localStorage.getItem("projectId");

    if (!projectId) {
      return;
    }

    const confirmed = window.confirm(
      `${
        serviceInfo[integration.provider]?.name || integration.provider
      } 연동을 해제하시겠습니까?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(integration.integrationId);

      const result = await manageProjectIntegrations(projectId, [
        {
          type: "DISCONNECT",

          integrationId: integration.integrationId,
        },
      ]);

      console.log("외부 서비스 해제 성공:", result);

      /*
          해제된 서비스 목록에서 제거
        */

      setIntegrations((prev) =>
        prev.filter((item) => item.integrationId !== integration.integrationId),
      );
    } catch (error) {
      console.error("외부 서비스 해제 실패:", error);

      handleApiError(error);
    } finally {
      setProcessingId(null);
    }
  };

  /* =========================
     접근 범위 변경

     UPDATE를 사용할 수 있지만
     resourceIds를 선택하는 UI가
     아직 없으므로 현재는 안내
  ========================= */

  const handleScope = (integration) => {
    console.log("접근 범위 설정:", integration);

    alert(
      "접근 범위에서 사용할 채널·페이지·파일을 선택하는 UI를 연결해야 합니다.",
    );
  };

  /* =========================
     새 서비스 연결

     CONNECT에는 실제 OAuth
     authorizationCode가 필요함
  ========================= */

  const handleAddService = () => {
    alert(
      "새 서비스 연결은 OAuth 인증 후 받은 authorizationCode와 연결해야 합니다.",
    );
  };

  /* =========================
     연결된 서비스가 없는 경우
  ========================= */

  const connectedServices = integrations.filter(
    (integration) => serviceInfo[integration.provider],
  );

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>외부 서비스 연동</h1>

      <p className={styles.description}>
        프로젝트의 외부 서비스를 연결해 메시지·문서·업무 기록을 수집합니다.
        <br />
        수집된 기록은 인수인계 생성과 Q&A 검색에 활용됩니다.
      </p>

      {/* =========================
          Header
      ========================= */}

      <div className={styles.sectionHeader}>
        <h2>연동된 서비스</h2>

        <button
          type="button"
          className={styles.addServiceButton}
          onClick={handleAddService}
        >
          새 서비스 연결
        </button>
      </div>

      {/* =========================
          Loading
      ========================= */}

      {isLoading && <p>외부 연동 정보를 불러오는 중입니다.</p>}

      {/* =========================
          Error
      ========================= */}

      {!isLoading && errorMessage && <p>{errorMessage}</p>}

      {/* =========================
          Empty
      ========================= */}

      {!isLoading && !errorMessage && connectedServices.length === 0 && (
        <p>현재 연결된 외부 서비스가 없습니다.</p>
      )}

      {/* =========================
          Service List
      ========================= */}

      {!isLoading && !errorMessage && (
        <div className={styles.serviceList}>
          {connectedServices.map((integration) => {
            const service = serviceInfo[integration.provider];

            const isProcessing = processingId === integration.integrationId;

            const isError = integration.status === "ERROR";

            return (
              <div
                key={integration.integrationId}
                className={styles.serviceCard}
              >
                <img src={service.icon} className={styles.serviceIcon} alt="" />

                <div className={styles.serviceInfo}>
                  <strong>{service.name}</strong>

                  <p>
                    {integration.resourceIds?.length
                      ? `연결된 리소스 ${integration.resourceIds.length}개`
                      : "연결된 서비스"}
                  </p>
                </div>

                <div className={styles.syncInfo}>
                  <strong
                    className={
                      isError ? styles.errorStatus : styles.connectedStatus
                    }
                  >
                    {getStatusText(integration.status)}
                  </strong>

                  <span>
                    마지막 동기화: {formatSyncedAt(integration.lastSyncedAt)}
                  </span>
                </div>

                {/* =========================
                        접근 범위
                    ========================= */}

                <button
                  type="button"
                  className={styles.scopeButton}
                  onClick={() => handleScope(integration)}
                  disabled={isProcessing}
                >
                  {isError ? "재연결" : "접근 범위"}
                </button>

                {/* =========================
                        수동 동기화
                    ========================= */}

                <button
                  type="button"
                  className={styles.scopeButton}
                  onClick={() => handleSync(integration)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "처리 중" : "동기화"}
                </button>

                {/* =========================
                        해제
                    ========================= */}

                <button
                  type="button"
                  className={styles.disconnectButton}
                  onClick={() => handleDisconnect(integration)}
                  disabled={isProcessing}
                >
                  해제
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================
          수집 정보 안내
      ========================= */}

      <section className={styles.guideArea}>
        <h2>수집 정보 안내</h2>

        <p>연동 서비스에서 수집된 기록은 프로젝트 내부에서만 사용됩니다.</p>

        <p>
          각 서비스의 접근 범위는 연동 시 사용자가 승인한 권한 범위를 초과하지
          않습니다.
        </p>

        <p>
          서비스 해제 시 이후 콘텐츠 수집은 중단되며, 기존에 수집된 기록은
          프로젝트 데이터로 유지됩니다.
        </p>
      </section>
    </section>
  );
}

export default IntegrationSettings;
