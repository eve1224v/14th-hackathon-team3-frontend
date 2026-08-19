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
  startProjectIntegrationOAuth,
  completeProjectIntegrationOAuth,
} from "../../../../api/projectApi";

function IntegrationSettings() {
  /* =========================
     State
  ========================= */

  const [integrations, setIntegrations] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [processingId, setProcessingId] = useState(null);

  const [isOAuthProcessing, setIsOAuthProcessing] = useState(false);

  /* =========================
     새 서비스 연결 Modal
  ========================= */

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const [selectedProvider, setSelectedProvider] = useState("");

  /* =========================
     지원 서비스
  ========================= */

  const serviceInfo = {
    SLACK: {
      name: "Slack",
      icon: slackIcon,
      description: "Slack 채널의 메시지와 업무 기록을 연결합니다.",
    },

    TEAMS: {
      name: "Microsoft Teams",
      icon: microsoftIcon,
      description: "Teams 채널의 메시지와 업무 기록을 연결합니다.",
    },

    GOOGLE_DRIVE: {
      name: "Google Drive",
      icon: googleDriveIcon,
      description: "Google Drive의 파일과 문서를 연결합니다.",
    },

    NOTION: {
      name: "Notion",
      icon: notionIcon,
      description: "Notion 페이지와 워크스페이스를 연결합니다.",
    },

    FIGMA: {
      name: "Figma",
      icon: figmaIcon,
      description: "Figma 디자인 파일과 프로젝트를 연결합니다.",
    },
  };

  /* =========================
     OAuth Error
  ========================= */

  const handleOAuthError = (error) => {
    switch (error.code) {
      case "400INVALID_INTEGRATION_ACTION":
        alert("OAuth 인증 정보가 올바르지 않습니다.");

        break;

      case "400OAUTH_STATE_INVALID":
        alert(
          "OAuth 인증 정보가 만료되었거나 올바르지 않습니다. 다시 연결해주세요.",
        );

        break;

      case "403PROJECT_ADMIN_REQUIRED":
        alert("프로젝트 관리자만 외부 서비스를 연결할 수 있습니다.");

        break;

      case "404PROJECT_NOT_FOUND":
        alert("프로젝트를 찾을 수 없습니다.");

        break;

      case "409INVALID_INTEGRATION_ACTION":
        alert("이미 연결된 외부 서비스입니다.");

        break;

      case "502OAUTH_PROVIDER_ERROR":
        alert("외부 서비스 인증 처리에 실패했습니다.");

        break;

      case "503OAUTH_CONFIGURATION_MISSING":
        alert("OAuth 설정이 완료되지 않았습니다. 백엔드 설정을 확인해주세요.");

        break;

      default:
        if (error.status === 401) {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        } else {
          alert(error.message || "OAuth 인증에 실패했습니다.");
        }
    }
  };

  /* =========================
     기존 Integration Error
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
        if (error.status === 401) {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        } else {
          alert(error.message || "외부 서비스 작업에 실패했습니다.");
        }
    }
  };

  /* =========================
     연동 목록 다시 조회
  ========================= */

  const refreshIntegrations = async () => {
    const projectId = localStorage.getItem("projectId");

    if (!projectId) {
      return;
    }

    try {
      const result = await getProjectDetail(projectId);

      const integrationList = Array.isArray(result?.data?.integrations)
        ? result.data.integrations
        : [];

      setIntegrations(integrationList);
    } catch (error) {
      console.error("외부 연동 새로고침 실패:", error);
    }
  };

  /* =========================
     프로젝트 외부 연동 조회
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

        const integrationList = Array.isArray(result?.data?.integrations)
          ? result.data.integrations
          : [];

        setIntegrations(integrationList);

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
        } else if (error.status === 401) {
          setErrorMessage("로그인이 만료되었습니다. 다시 로그인해주세요.");
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
     OAuth Callback

     ?code=...
     &state=...
  ========================= */

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");

    const state = params.get("state");

    if (!code || !state) {
      return;
    }

    const projectId =
      sessionStorage.getItem("oauthProjectId") ||
      localStorage.getItem("projectId");

    const provider = sessionStorage.getItem("oauthProvider");

    if (!projectId || !provider) {
      console.error("OAuth 완료에 필요한 정보가 없습니다.");

      return;
    }

    let isCancelled = false;

    const completeOAuth = async () => {
      try {
        setIsOAuthProcessing(true);

        const result = await completeProjectIntegrationOAuth(
          projectId,
          provider,
          {
            code,
            state,

            resourceIds: [],

            syncIntervalMinutes: 10,
          },
        );

        if (isCancelled) {
          return;
        }

        console.log("OAuth Complete 성공:", result);

        sessionStorage.removeItem("oauthProjectId");

        sessionStorage.removeItem("oauthProvider");

        /*
          URL에서 OAuth parameter 제거
        */

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );

        /*
          서버의 integration 목록 재조회
        */

        const detailResult = await getProjectDetail(projectId);

        if (isCancelled) {
          return;
        }

        const integrationList = Array.isArray(detailResult?.data?.integrations)
          ? detailResult.data.integrations
          : [];

        setIntegrations(integrationList);

        alert("외부 서비스를 연결했습니다.");
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("OAuth Complete 실패:", error);

        handleOAuthError(error);
      } finally {
        if (!isCancelled) {
          setIsOAuthProcessing(false);
        }
      }
    };

    completeOAuth();

    return () => {
      isCancelled = true;
    };
  }, []);

  /* =========================
     시간 표시
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
     Modal 열기
  ========================= */

  const handleAddService = () => {
    setSelectedProvider("");

    setIsServiceModalOpen(true);
  };

  /* =========================
     Modal 닫기
  ========================= */

  const handleCloseServiceModal = () => {
    if (isOAuthProcessing) {
      return;
    }

    setSelectedProvider("");

    setIsServiceModalOpen(false);
  };

  /* =========================
     Provider 선택
  ========================= */

  const handleProviderSelect = (provider) => {
    if (isOAuthProcessing) {
      return;
    }

    const alreadyConnected = integrations.some(
      (integration) =>
        integration.provider === provider && integration.status === "CONNECTED",
    );

    if (alreadyConnected) {
      alert("이미 연결된 서비스입니다.");

      return;
    }

    setSelectedProvider(provider);
  };

  /* =========================
     OAuth Start
  ========================= */

  const handleOAuthStart = async () => {
    if (!selectedProvider) {
      alert("연결할 서비스를 선택해주세요.");

      return;
    }

    const projectId = localStorage.getItem("projectId");

    if (!projectId) {
      alert("프로젝트 정보가 없습니다.");

      return;
    }

    try {
      setIsOAuthProcessing(true);

      const result = await startProjectIntegrationOAuth(
        projectId,
        selectedProvider,
      );

      console.log("OAuth Start 성공:", result);

      const authorizationUrl = result?.data?.authorizationUrl;

      if (!authorizationUrl) {
        throw new Error("OAuth 인증 URL을 확인할 수 없습니다.");
      }

      /*
        외부 OAuth 페이지에서
        돌아온 뒤 provider를 알아야 하므로 저장
      */

      sessionStorage.setItem("oauthProjectId", String(projectId));

      sessionStorage.setItem("oauthProvider", selectedProvider);

      /*
        OAuth Provider 페이지 이동
      */

      window.location.href = authorizationUrl;
    } catch (error) {
      console.error("OAuth Start 실패:", error);

      handleOAuthError(error);

      setIsOAuthProcessing(false);
    }
  };

  /* =========================
     수동 동기화
  ========================= */

  const handleSync = async (integration) => {
    const projectId = localStorage.getItem("projectId");

    if (!projectId) {
      alert("프로젝트 정보가 없습니다.");

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

      await refreshIntegrations();

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
      alert("프로젝트 정보가 없습니다.");

      return;
    }

    const serviceName =
      serviceInfo[integration.provider]?.name || integration.provider;

    const confirmed = window.confirm(`${serviceName} 연동을 해제하시겠습니까?`);

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

      await refreshIntegrations();

      alert("외부 서비스 연동을 해제했습니다.");
    } catch (error) {
      console.error("외부 서비스 해제 실패:", error);

      handleApiError(error);
    } finally {
      setProcessingId(null);
    }
  };

  /* =========================
     접근 범위
  ========================= */

  const handleScope = (integration) => {
    console.log("접근 범위 설정:", integration);

    alert(
      "접근 범위에서 사용할 채널·페이지·파일을 선택하는 UI를 연결해야 합니다.",
    );
  };

  /* =========================
     연결 서비스
  ========================= */

  const connectedServices = integrations.filter(
    (integration) => serviceInfo[integration.provider],
  );

  /* =========================
     Modal에 표시할 서비스
  ========================= */

  const providers = Object.entries(serviceInfo);

  return (
    <>
      <section className={styles.container}>
        {/* =========================
            Title
        ========================= */}

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
            기존 피그마 Service List
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
                  <img
                    src={service.icon}
                    className={styles.serviceIcon}
                    alt=""
                  />

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

                  <button
                    type="button"
                    className={styles.scopeButton}
                    onClick={() => handleScope(integration)}
                    disabled={isProcessing}
                  >
                    {isError ? "재연결" : "접근 범위"}
                  </button>

                  <button
                    type="button"
                    className={styles.scopeButton}
                    onClick={() => handleSync(integration)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "처리 중" : "동기화"}
                  </button>

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
            Guide
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
          <div className={styles.saveArea}>
            <button
              type="button"
              className={styles.saveButton}
              onClick={() => {
                alert("외부 서비스 설정이 저장되었습니다.");
              }}
            >
              저장
            </button>
          </div>
        </section>
      </section>

      {/* =================================================
          새 서비스 연결 Modal
      ================================================= */}

      {isServiceModalOpen && (
        <div
          className={styles.serviceModalOverlay}
          onMouseDown={handleCloseServiceModal}
        >
          <section
            className={styles.serviceModal}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}

            <div className={styles.serviceModalHeader}>
              <div>
                <h2>새 서비스 연결</h2>

                <p>프로젝트에 연결할 외부 서비스를 선택하세요.</p>
              </div>

              <button
                type="button"
                className={styles.serviceModalClose}
                onClick={handleCloseServiceModal}
                disabled={isOAuthProcessing}
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            {/* Service */}

            <div className={styles.serviceSelectList}>
              {providers.map(([provider, service]) => {
                const alreadyConnected = integrations.some(
                  (integration) =>
                    integration.provider === provider &&
                    integration.status === "CONNECTED",
                );

                const isSelected = selectedProvider === provider;

                return (
                  <button
                    key={provider}
                    type="button"
                    className={`${styles.serviceSelectItem} ${
                      isSelected ? styles.serviceSelectItemActive : ""
                    }`}
                    onClick={() => handleProviderSelect(provider)}
                    disabled={alreadyConnected || isOAuthProcessing}
                  >
                    <img
                      src={service.icon}
                      alt=""
                      className={styles.serviceSelectIcon}
                    />

                    <div className={styles.serviceSelectText}>
                      <strong>{service.name}</strong>

                      <p>{service.description}</p>
                    </div>

                    {alreadyConnected ? (
                      <span className={styles.connectedBadge}>연결됨</span>
                    ) : (
                      <span
                        className={`${styles.serviceRadio} ${
                          isSelected ? styles.serviceRadioActive : ""
                        }`}
                      >
                        {isSelected && <span />}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}

            <div className={styles.serviceModalFooter}>
              <button
                type="button"
                className={styles.modalCancelButton}
                onClick={handleCloseServiceModal}
                disabled={isOAuthProcessing}
              >
                취소
              </button>

              <button
                type="button"
                className={styles.modalConnectButton}
                onClick={handleOAuthStart}
                disabled={!selectedProvider || isOAuthProcessing}
              >
                {isOAuthProcessing ? "연결 중..." : "연결하기"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default IntegrationSettings;
