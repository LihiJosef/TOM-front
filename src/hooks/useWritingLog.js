// Context
import { useAuth } from "../context/authContext";

// Config
import { getAppInsights } from "../config/TelemetryService";

// logs
import { SeverityLevel } from "@microsoft/applicationinsights-web";

export function useWritingLog() {
  const { user } = useAuth();

  const customTrackException = (exception, props = null, severityLevel = SeverityLevel.Error) => {
    const properties = { ...props, user };
    const insights = getAppInsights();
    if (insights) {
        insights.trackException({
        exception,
        properties,
        severityLevel
      });
    }
  };

  const customTrackEvent = (name, props = null) => {
    const properties = { ...props, user };
    const insights = getAppInsights();
    if (insights) {
        insights.trackEvent({
        name,
        properties
      });
    }
  };

  return { customTrackException, customTrackEvent };
}
