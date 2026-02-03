import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, Info, Heart } from "lucide-react";

type ResultStatus = "unsubscribed" | "resubscribed" | "info" | "error";

type ViewState = {
  result: ResultStatus;
  title: string;
  message: string;
  token?: string;
};

function mapResultToCopy(result: ResultStatus, token?: string | null): ViewState {
  switch (result) {
    case "unsubscribed":
      return {
        result,
        title: "הוסרת בהצלחה",
        message: "הוסרת מרשימת התפוצה שלנו. נשמח לראותך שוב בעתיד!",
        token: token || undefined,
      };
    case "resubscribed":
      return {
        result,
        title: "נרשמת מחדש!",
        message: "ברוכים השבים! תודה שחזרת אלינו",
      };
    case "info":
      return {
        result,
        title: "כבר רשום/ה",
        message: "כתובת המייל שלך כבר רשומה לניוזלטר!",
      };
    default:
      return {
        result: "error",
        title: "שגיאה",
        message: "קישור לא תקין או שפג תוקפו. נא לנסות שוב.",
      };
  }
}

function StatusIcon({ result }: { result: ResultStatus }) {
  if (result === "unsubscribed") return <CheckCircle2 className="h-10 w-10 text-primary" />;
  if (result === "resubscribed") return <Heart className="h-10 w-10 text-primary" />;
  if (result === "info") return <Info className="h-10 w-10 text-primary" />;
  return <XCircle className="h-10 w-10 text-destructive" />;
}

export default function NewsletterUnsubscribe() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const token = searchParams.get("token");
  const action = searchParams.get("action") || "unsubscribe";
  const resultParam = searchParams.get("result") as ResultStatus | null;

  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<ViewState>(() => mapResultToCopy("error"));

  const canResubscribe = useMemo(() => state.result === "unsubscribed" && !!(state.token || token), [state, token]);

  const callBackend = async (nextAction: string) => {
    if (!token) {
      setState(mapResultToCopy("error"));
      return;
    }

    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!baseUrl) {
      setState({
        result: "error",
        title: "שגיאה",
        message: "המערכת לא מוגדרת כראוי כרגע. נסו שוב מאוחר יותר.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const url = new URL(`${baseUrl}/functions/v1/newsletter-unsubscribe`);
      url.searchParams.set("token", token);
      url.searchParams.set("action", nextAction);
      url.searchParams.set("format", "json");

      const res = await fetch(url.toString(), { headers: { accept: "application/json" } });
      const data = (await res.json()) as Partial<ViewState>;

      const result = (data.result as ResultStatus) || "error";
      const title = data.title || mapResultToCopy(result).title;
      const message = data.message || mapResultToCopy(result).message;
      const nextToken = data.token || (result === "unsubscribed" ? token : undefined);

      const nextState: ViewState = { result, title, message, token: nextToken };
      setState(nextState);

      // Make refreshes deterministic: add result to URL.
      const sp = new URLSearchParams(searchParams);
      sp.set("result", result);
      sp.set("action", nextAction);
      sp.set("token", token);
      setSearchParams(sp, { replace: true });

      // If backend returned a non-2xx, we still show the message, just keep UI consistent.
      void res;
    } catch {
      setState({
        result: "error",
        title: "שגיאה",
        message: "אירעה שגיאה. נא לנסות שוב מאוחר יותר.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If we got redirected here from the backend, it already performed the action.
    if (resultParam) {
      setState(mapResultToCopy(resultParam, token));
      return;
    }

    // Direct link to the site: perform the action now.
    if (token) {
      void callBackend(action);
      return;
    }

    setState(mapResultToCopy("error"));
  }, []); // intentionally run once

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3">
            <StatusIcon result={state.result} />
          </div>
          <CardTitle className="text-2xl font-display">{state.title}</CardTitle>
          <CardDescription className="text-base">{state.message}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>מעבד...</span>
            </div>
          ) : null}

          {canResubscribe ? (
            <Button
              type="button"
              onClick={() => void callBackend("resubscribe")}
              disabled={isLoading}
            >
              להירשם מחדש
            </Button>
          ) : null}

          <Button type="button" variant="secondary" onClick={() => navigate("/")}
            disabled={isLoading}
          >
            חזרה לאתר
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
