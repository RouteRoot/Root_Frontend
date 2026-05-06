"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/app/api/service/user";

const EDITOR_NAMES = ["뿌리 에디터", "bburi 에디터"];

export function useWikiEditorAccess() {
  const [isChecking, setIsChecking] = useState(true);
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAccess() {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        if (mounted) {
          setIsEditor(false);
          setIsChecking(false);
        }
        return;
      }

      try {
        const me = await getMe();
        if (mounted) setIsEditor(EDITOR_NAMES.includes(me.name));
      } catch {
        if (mounted) setIsEditor(false);
      } finally {
        if (mounted) setIsChecking(false);
      }
    }

    checkAccess();

    return () => {
      mounted = false;
    };
  }, []);

  return { isChecking, isEditor };
}
