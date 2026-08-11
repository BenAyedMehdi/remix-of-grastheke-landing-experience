import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/** Bringt Nutzer nach dem Google-Login zurück zur ursprünglich gewünschten Seite. */
export function AuthRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const target = sessionStorage.getItem("grastheke:after-auth");
    if (!target || !target.startsWith("/") || target.startsWith("//")) return;

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      sessionStorage.removeItem("grastheke:after-auth");
      void supabase.rpc("ensure_profile");
      if (target.includes("?")) window.location.replace(target);
      else navigate({ to: target, replace: true });
    });
  }, [navigate]);

  return null;
}